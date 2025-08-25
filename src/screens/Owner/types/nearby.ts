//nearby.ts
// ---- Native module typing ----
export interface NearbyModuleType {
  startAdvertising(deviceName: string): Promise<any>;
  startDiscovery(): Promise<void>;
  stopDiscovery(): Promise<void>;
  connectToEndpoint(endpointId: string, deviceName: string): Promise<void>;
  acceptConnection(endpointId: string): Promise<void>;
  rejectConnection(endpointId: string): Promise<void>;
  sendPayload(endpointId: string, message: string): Promise<void>;
  sendFile(
    endpointId: string,
    fileUri: string
  ): Promise<{ payloadId: number; filename: string }>;
  stopAllEndpoints(): Promise<void>;
  disconnectFromEndpoint(endpointId: string): Promise<void>;
}

// ---- Endpoint types ----
export interface Endpoint {
  id: string;
  name: string;
}

export interface EndpointFoundEvent {
  endpointId: string;
  endpointName: string;
}

// ---- File transfer types ----
export type FileTransferStatusNative =
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILURE"
  | "CANCELED";

export interface FileTransferUpdateEvent {
  payloadId: number;
  status: FileTransferStatusNative;
  progress: number;
  bytesTransferred?: number;
  totalBytes?: number;
  filename?: string;
}
