package com.myprinter

import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.*
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.io.OutputStream
import java.nio.charset.StandardCharsets
import android.content.ContentValues
import android.os.Environment
import android.provider.MediaStore
import android.os.Build
import android.provider.OpenableColumns

class NearbyModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val connectionsClient: ConnectionsClient by lazy {
        Nearby.getConnectionsClient(reactContext)
    }
    private val discoveredEndpoints = mutableMapOf<String, String>()
    private val filePayloadFilenames = mutableMapOf<Long, String>()
    companion object {
        private const val SERVICE_ID = "com.myprinter.nearby"
        private const val TAG = "NearbyModule"
    }

    override fun getName() = "NearbyModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private val endpointDiscoveryCallback = object : EndpointDiscoveryCallback() {
        override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
            Log.d(TAG, "Endpoint Found: ${info.endpointName}")
            discoveredEndpoints[endpointId] = info.endpointName
            val params = Arguments.createMap().apply {
                putString("endpointId", endpointId)
                putString("endpointName", info.endpointName)
            }
            sendEvent("onEndpointFound", params)
        }

        override fun onEndpointLost(endpointId: String) {
            Log.d(TAG, "Endpoint Lost: $endpointId")
            discoveredEndpoints.remove(endpointId)
            val params = Arguments.createMap().apply {
                putString("endpointId", endpointId)
            }
            sendEvent("onEndpointLost", params)
        }
    }

    private val connectionLifecycleCallback = object : ConnectionLifecycleCallback() {
        override fun onConnectionInitiated(endpointId: String, connectionInfo: ConnectionInfo) {
            Log.d(TAG, "Connection Initiated from ${connectionInfo.endpointName} ($endpointId)")
            val params = Arguments.createMap().apply {
                putString("endpointId", endpointId)
                putString("endpointName", connectionInfo.endpointName)
            }
            sendEvent("onConnectionInitiated", params)
        }

        override fun onConnectionResult(endpointId: String, result: ConnectionResolution) {
            val params = Arguments.createMap().apply { putString("endpointId", endpointId) }
            if (result.status.isSuccess) {
                Log.d(TAG, "Connection Successful")
                params.putBoolean("success", true)
            } else {
                Log.d(TAG, "Connection Failed")
                params.putBoolean("success", false)
            }
            sendEvent("onConnectionResult", params)
        }

        override fun onDisconnected(endpointId: String) {
            Log.d(TAG, "Disconnected from: $endpointId")
            val params = Arguments.createMap().apply {
                putString("endpointId", endpointId)
            }
            sendEvent("onDisconnected", params)
        }
    }

    private val payloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(endpointId: String, payload: Payload) {
            when (payload.type) {
                Payload.Type.BYTES -> {
                    val data = String(payload.asBytes()!!, StandardCharsets.UTF_8)
                    try {
                        if (data.startsWith("METADATA:")) {
                            val metadata = data.substringAfter("METADATA:").split(",")
                            val payloadId = metadata[0].toLong()
                            val filename = metadata[1]
                            
                            filePayloadFilenames[payloadId] = filename
                            
                            val params = Arguments.createMap().apply {
                                putDouble("payloadId", payloadId.toDouble())
                                putString("status", "IN_PROGRESS")
                                putInt("progress", 0)
                                putString("filename", filename)
                            }
                            sendEvent("onFileTransferUpdate", params)
                        } else {
                            val params = Arguments.createMap().apply { 
                                putString("message", data) 
                            }
                            sendEvent("onPayloadReceived", params)
                        }
                    } catch (e: Exception) { 
                        Log.e(TAG, "Error processing BYTES payload", e) 
                    }
                }
                
                Payload.Type.STREAM -> {
                    Thread {
                        val filename = filePayloadFilenames[payload.id]
                        if (filename == null) {
                            Log.e(TAG, "Filename not found for stream payload ID: ${payload.id}")
                            return@Thread
                        }
                        
                        var inputStream: InputStream? = null
                        var outputStream: OutputStream? = null

                        // --- FIX 1: The 'try' block was missing here ---
                        try {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                val resolver = reactContext.contentResolver
                                val contentValues = ContentValues().apply {
                                    put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                                    put(MediaStore.MediaColumns.MIME_TYPE, "application/octet-stream")
                                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/myprinter")
                                }
                                val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                                if (uri != null) {
                                    outputStream = resolver.openOutputStream(uri)
                                }
                            } else {
                                val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                                val myprinterDir = File(downloadsDir, "myprinter")
                                if (!myprinterDir.exists()) {
                                    myprinterDir.mkdirs()
                                }
                                val file = File(myprinterDir, filename)
                                outputStream = FileOutputStream(file)
                            }

                            if (outputStream == null) {
                                Log.e(TAG, "Failed to create output stream.")
                                return@Thread
                            }

                            inputStream = payload.asStream()?.asInputStream()
                            val buffer = ByteArray(4096)
                            var bytesRead: Int
                            while (inputStream?.read(buffer).also { bytesRead = it ?: -1 } != -1) {
                                outputStream.write(buffer, 0, bytesRead)
                            }
                            outputStream.flush()
                            Log.d(TAG, "Successfully wrote stream data to Downloads/myprinter folder: $filename")
                        } catch (e: Exception) {
                            Log.e(TAG, "Error reading from stream and writing to file", e)
                        } finally {
                            try {
                                outputStream?.close()
                                inputStream?.close()
                            } catch (e: Exception) {
                                Log.e(TAG, "Error closing streams", e)
                            }
                        }
                    }.start()
                }
                
                else -> Log.d(TAG, "Received unknown payload type")
            }
        }

        // --- FIX 2: onPayloadTransferUpdate must be INSIDE the payloadCallback object ---
        override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {
            val payloadId = update.payloadId
            
            val progress = if (update.totalBytes > 0) {
                (100.0 * update.bytesTransferred / update.totalBytes).toInt().coerceIn(0, 100)
            } else {
                0
            }
            
            val statusString = when (update.status) {
                PayloadTransferUpdate.Status.IN_PROGRESS -> "IN_PROGRESS"
                PayloadTransferUpdate.Status.SUCCESS -> "SUCCESS"
                PayloadTransferUpdate.Status.FAILURE -> "FAILURE"
                PayloadTransferUpdate.Status.CANCELED -> "CANCELED"
                else -> "UNKNOWN"
            }
            
            Log.d(TAG, "Transfer Update - PayloadID: $payloadId, Status: $statusString, Progress: $progress%, Bytes: ${update.bytesTransferred}/${update.totalBytes}")
            
            val params = Arguments.createMap().apply {
                putDouble("payloadId", payloadId.toDouble())
                putString("status", statusString)
                putInt("progress", progress)
                putDouble("bytesTransferred", update.bytesTransferred.toDouble())
                putDouble("totalBytes", update.totalBytes.toDouble())
            }
            sendEvent("onFileTransferUpdate", params)

            when (update.status) {
                PayloadTransferUpdate.Status.SUCCESS -> {
                    val file = filePayloadFilenames.remove(payloadId)
                    if (file != null) {
                        val successParams = Arguments.createMap().apply {
                            putString("message", "File received: $file")
                        }
                        sendEvent("onPayloadReceived", successParams)
                    }
                }
                PayloadTransferUpdate.Status.FAILURE, PayloadTransferUpdate.Status.CANCELED -> {
                    filePayloadFilenames.remove(payloadId)
                    Log.e(TAG, "File transfer failed/canceled for payloadId: $payloadId")
                }
                else -> {}
            }
        }
    } // <-- End of payloadCallback object

    @ReactMethod
    fun startAdvertising(deviceName: String, promise: Promise) {
        val advertisingOptions = AdvertisingOptions.Builder().setStrategy(Strategy.P2P_STAR).build()
        connectionsClient.startAdvertising(deviceName, SERVICE_ID, connectionLifecycleCallback, advertisingOptions)
            .addOnSuccessListener {
                Log.d(TAG, "Advertising started successfully.")
                val result = Arguments.createMap().apply {
                    putString("deviceName", deviceName)
                }
                promise.resolve(result)
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Advertising failed", e)
                promise.reject("ADVERTISING_FAILED", e)
            }
    }

    @ReactMethod
    fun startDiscovery(promise: Promise) {
        val discoveryOptions = DiscoveryOptions.Builder().setStrategy(Strategy.P2P_STAR).build()
        connectionsClient.startDiscovery(SERVICE_ID, endpointDiscoveryCallback, discoveryOptions)
            .addOnSuccessListener { 
                Log.d(TAG, "Discovery started")
                promise.resolve(true)
            }
            .addOnFailureListener { e -> 
                Log.d(TAG, "Discovery failed", e)
                promise.reject("DISCOVERY_FAILED", e)
            }
    }

    @ReactMethod
    fun connectToEndpoint(endpointId: String, localDeviceName: String, promise: Promise) {
        Log.d(TAG, "Requesting connection to $endpointId as '$localDeviceName'")
        connectionsClient.requestConnection(localDeviceName, endpointId, connectionLifecycleCallback)
            .addOnSuccessListener { 
                Log.d(TAG, "Connection request to $endpointId sent successfully.")
                promise.resolve(true)
            }
            .addOnFailureListener { e -> 
                Log.e(TAG, "Connection request to $endpointId failed.", e)
                promise.reject("CONNECTION_FAILED", e)
            }
    }

    @ReactMethod
    fun acceptConnection(endpointId: String, promise: Promise) {
        connectionsClient.acceptConnection(endpointId, payloadCallback)
            .addOnSuccessListener {
                Log.d(TAG, "Accepted connection to $endpointId")
                promise.resolve(true)
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Failed to accept connection", e)
                promise.reject("ACCEPT_FAILED", e)
            }
    }

    @ReactMethod
    fun rejectConnection(endpointId: String, promise: Promise) {
        connectionsClient.rejectConnection(endpointId)
            .addOnSuccessListener {
                Log.d(TAG, "Rejected connection to $endpointId")
                promise.resolve(true)
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Failed to reject connection", e)
                promise.reject("REJECT_FAILED", e)
            }
    }

    @ReactMethod
    fun sendPayload(endpointId: String, message: String, promise: Promise) {
        val bytesPayload = Payload.fromBytes(message.toByteArray(StandardCharsets.UTF_8))
        connectionsClient.sendPayload(endpointId, bytesPayload)
            .addOnSuccessListener {
                promise.resolve(true)
            }
            .addOnFailureListener { e ->
                promise.reject("PAYLOAD_FAILED", e)
            }
    }
    
    @ReactMethod
fun sendFile(endpointId: String, fileUriString: String, promise: Promise) {
    try {
        val fileUri = Uri.parse(fileUriString)
        
        // --- START OF FILENAME FIX ---
        var filename = "unknown_file"
        // Use ContentResolver to get the real file name
        reactContext.contentResolver.query(fileUri, null, null, null, null)?.use { cursor ->
            if (cursor.moveToFirst()) {
                val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (nameIndex != -1) {
                    filename = cursor.getString(nameIndex)
                }
            }
        }
        // --- END OF FILENAME FIX ---
        
        val pfd = reactContext.contentResolver.openFileDescriptor(fileUri, "r")
        pfd?.let {
            val filePayload = Payload.fromStream(it)
            // Now we use the reliably-found filename
            val metadata = "METADATA:${filePayload.id},$filename"
            val metadataPayload = Payload.fromBytes(metadata.toByteArray(StandardCharsets.UTF_8))
            
            connectionsClient.sendPayload(endpointId, metadataPayload).continueWith {
                connectionsClient.sendPayload(endpointId, filePayload)
            }
            
            val result = Arguments.createMap().apply {
                putDouble("payloadId", filePayload.id.toDouble())
                putString("filename", filename)
            }
            promise.resolve(result)
            
            Log.d(TAG, "Started sending file: $filename with payloadId: ${filePayload.id}")
        } ?: promise.reject("FILE_ERROR", "Could not open file descriptor.")
    } catch (e: Exception) {
        promise.reject("SEND_FILE_ERROR", "Failed to send file.", e)
        Log.e(TAG, "Failed to send file", e)
    }
}

    @ReactMethod
    fun stopAllEndpoints(promise: Promise) {
        connectionsClient.stopAllEndpoints()
        connectionsClient.stopAdvertising()
        connectionsClient.stopDiscovery()
        discoveredEndpoints.clear()
        filePayloadFilenames.clear()
        Log.d(TAG, "Stopped all endpoints, advertising, and discovery.")
        promise.resolve(true)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for React Native's Event Emitter.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for React Native's Event Emitter.
    }
}