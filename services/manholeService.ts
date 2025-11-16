import { db } from './firebase';
import { ref, get, set, onValue, off } from 'firebase/database';
import type { ManholeData, SensorReading } from '../types';

const MAX_HISTORY = 30;

// In-memory cache to hold history for active subscriptions
const historyCache: Map<string, { gas: SensorReading[]; blockage: SensorReading[] }> = new Map();

export const getManholeIds = async (): Promise<string[]> => {
  const manholesRef = ref(db, 'Manholes');
  try {
    const snapshot = await get(manholesRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).sort();
    }
  } catch(error) {
    console.error("Could not fetch manhole IDs from Firebase:", error);
  }
  return [];
};

export const setLockState = async (id: string, isLocked: boolean): Promise<boolean> => {
  const commandRef = ref(db, `Manholes/${id}/command`);
  const isLockedRef = ref(db, `Manholes/${id}/isLocked`);
  const command = isLocked ? 'LOCK' : 'UNLOCK';
  try {
    // Update both the command for the device and the lock state for the UI
    await Promise.all([
        set(commandRef, command),
        set(isLockedRef, isLocked)
    ]);
    return true;
  } catch (error) {
    console.error("Failed to send lock/unlock command:", error);
    return false;
  }
};

export const subscribeToManholeUpdates = (id: string, callback: (data: ManholeData) => void): (() => void) => {
  const manholeRef = ref(db, `Manholes/${id}`);
  
  // Initialize history for this subscription
  historyCache.set(id, { gas: [], blockage: [] });

  const listener = onValue(manholeRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.warn(`No data for manhole ${id}`);
      return;
    }

    const val = snapshot.val();
    const sensorData = val.Sensors || { gas: 0, distance: 200, ldr: 0, manholeStatus: 'Unknown' };
    const isLocked = val.isLocked ?? true; // Default to locked if not set

    const history = historyCache.get(id);
    if (!history) return; // Should not happen

    const now = Date.now();
    
    // The Arduino sends raw ADC value for gas, and distance in cm.
    const gasLevel = Number(sensorData.gas) || 0;
    const blockageDistance = Number(sensorData.distance) || 200;

    history.gas.push({ timestamp: now, value: gasLevel });
    if (history.gas.length > MAX_HISTORY) {
      history.gas.shift();
    }

    history.blockage.push({ timestamp: now, value: blockageDistance });
    if (history.blockage.length > MAX_HISTORY) {
      history.blockage.shift();
    }

    const dataForCallback: ManholeData = {
      id,
      gasLevel,
      blockageDistance,
      isLocked,
      ldrValue: Number(sensorData.ldr) || 0,
      manholeStatus: sensorData.manholeStatus || 'Unknown',
      history: {
        gas: [...history.gas], // Create copies to prevent mutation
        blockage: [...history.blockage],
      },
    };
    
    callback(dataForCallback);
  }, (error) => {
    console.error(`Firebase subscription error for ${id}:`, error);
  });

  // Return unsubscribe function
  return () => {
    off(manholeRef, 'value', listener);
    historyCache.delete(id); // Clean up cache
  };
};