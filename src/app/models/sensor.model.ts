export interface TelemetryParameterDTO {
  parameterId: string;
  code: string;
  name: string;
  unitOfMeasure: string;
  symbol: string;
}

export interface SupportedSensorResponse {
  deviceId: string;
  deviceName: string;
  serialNumber: string;
  modelNumber: string;
  manufacturer: string;
  compatibilityRole: string; // e.g. "SMART_COLLAR", "RUMEN_BOLUS", "EAR_TAG", "GPS_TRANSPONDER", "GATEWAY_HUB"
  isRecommended: boolean;
  defaultFrequencyOrProtocol: string; // e.g. "BLE 5.2", "868 MHz LoRa"
  supportedParameters: TelemetryParameterDTO[];
}

export interface PairedSensorEntry extends SupportedSensorResponse {
  tagOrIdentifier: string; // The identification / tag number assigned to this sensor
  isPaired: boolean;
  batteryPct?: number;
  rssi?: string;
}
