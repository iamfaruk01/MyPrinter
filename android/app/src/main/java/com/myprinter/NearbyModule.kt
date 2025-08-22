package com.myprinter

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
import java.nio.charset.StandardCharsets

class NearbyModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val connectionsClient: ConnectionsClient by lazy {
        Nearby.getConnectionsClient(reactContext)
    }
    private val discoveredEndpoints = mutableMapOf<String, String>()
    
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
        // NOTE: The incorrect 'onAdvertisingStarted' function has been removed.

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
            if (payload.type == Payload.Type.BYTES) {
                val receivedMessage = String(payload.asBytes()!!, StandardCharsets.UTF_8)
                Log.d(TAG, "Payload Received: $receivedMessage")
                val params = Arguments.createMap().apply {
                    putString("endpointId", endpointId)
                    putString("message", receivedMessage)
                }
                sendEvent("onPayloadReceived", params)
            }
        }

        override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {
            // Can be used for file transfer progress updates
        }
    }

    @ReactMethod
    fun startAdvertising(deviceName: String, promise: Promise) {
        val advertisingOptions = AdvertisingOptions.Builder().setStrategy(Strategy.P2P_STAR).build()
        connectionsClient.startAdvertising(deviceName, SERVICE_ID, connectionLifecycleCallback, advertisingOptions)
            .addOnSuccessListener {
                Log.d(TAG, "Advertising started successfully.")
                // The QR code only needs the device name for the other device to find it.
                // The unique endpointId will be handled when the connection is initiated.
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
    fun startDiscovery() {
        val discoveryOptions = DiscoveryOptions.Builder().setStrategy(Strategy.P2P_STAR).build()
        connectionsClient.startDiscovery(SERVICE_ID, endpointDiscoveryCallback, discoveryOptions)
            .addOnSuccessListener { Log.d(TAG, "Discovery started") }
            .addOnFailureListener { e -> Log.e(TAG, "Discovery failed", e) }
    }

    @ReactMethod
    fun connectToEndpoint(endpointId: String, localDeviceName: String) {
        Log.d(TAG, "Requesting connection to $endpointId as '$localDeviceName'")
        connectionsClient.requestConnection(localDeviceName, endpointId, connectionLifecycleCallback)
            .addOnSuccessListener { Log.d(TAG, "Connection request to $endpointId sent successfully.") }
            .addOnFailureListener { e -> Log.e(TAG, "Connection request to $endpointId failed.", e) }
    }

    @ReactMethod
    fun acceptConnection(endpointId: String) {
        connectionsClient.acceptConnection(endpointId, payloadCallback)
    }

    @ReactMethod
    fun sendPayload(endpointId: String, message: String) {
        val bytesPayload = Payload.fromBytes(message.toByteArray(StandardCharsets.UTF_8))
        connectionsClient.sendPayload(endpointId, bytesPayload)
    }

    @ReactMethod
    fun stopAllEndpoints() {
        connectionsClient.stopAllEndpoints()
        connectionsClient.stopAdvertising()
        connectionsClient.stopDiscovery()
        discoveredEndpoints.clear()
        Log.d(TAG, "Stopped all endpoints, advertising, and discovery.")
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