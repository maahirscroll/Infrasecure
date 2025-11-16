export interface SensorReading {
  timestamp: number;
  value: number;
}

export interface ManholeData {
  id: string;
  gasLevel: number;
  blockageDistance: number; // in cm, from ultrasonic sensor
  isLocked: boolean;
  ldrValue: number;
  manholeStatus: 'Open' | 'Closed' | 'Unknown';
  history: {
    gas: SensorReading[];
    blockage: SensorReading[];
  };
}
