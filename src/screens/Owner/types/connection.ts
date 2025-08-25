//connection.ts
// ---- Connection states ----
export type ConnectionStatus =
  | "IDLE"
  | "ADVERTISING"
  | "DISCOVERING"
  | "CONNECTED"
  | "FAILED";

// ---- File transfer states ----
export type FileTransferStatus =
  | "IDLE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

// ---- UI-friendly labels ----
export const connectionStatusLabels: Record<ConnectionStatus, string> = {
  IDLE: "Idle",
  ADVERTISING: "Advertising...",
  DISCOVERING: "Discovering...",
  CONNECTED: "Connected",
  FAILED: "Connection failed",
};

export const fileTransferStatusLabels: Record<FileTransferStatus, string> = {
  IDLE: "Idle",
  IN_PROGRESS: "Transferring file...",
  COMPLETED: "File transfer completed",
  FAILED: "File transfer failed",
};