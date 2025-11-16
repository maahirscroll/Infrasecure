import React, { useState, useEffect, useCallback } from 'react';
import { subscribeToManholeUpdates, setLockState } from '../services/manholeService';
import type { ManholeData } from '../types';
import SensorCard from './SensorCard';
import LockControl from './LockControl';
import HistoryChart from './HistoryChart';
import ManholeStatusCard from './ManholeStatusCard';
import RawDataCard from './RawDataCard';
import { GasIcon } from './icons/GasIcon';
import { WaterIcon } from './icons/WaterIcon';
import { BackIcon } from './icons/BackIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface DashboardProps {
  manholeId: string;
  manholeName: string;
  onBack: () => void;
  onLogout: () => void;
}

const getGasStatus = (value: number): 'normal' | 'warning' | 'danger' => {
  if (value > 400) return 'danger';
  if (value > 250) return 'warning';
  return 'normal';
};

// Assuming 200cm is empty, a smaller number is more full/blocked
const getBlockageStatus = (value: number): 'normal' | 'warning' | 'danger' => {
  if (value <= 40) return 'danger';
  if (value <= 70) return 'warning';
  return 'normal';
};

const Dashboard: React.FC<DashboardProps> = ({ manholeId, manholeName, onBack, onLogout }) => {
  const [data, setData] = useState<ManholeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToManholeUpdates(manholeId, (newData) => {
      setData(newData);
      if (isLoading) setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manholeId]);

  const handleToggleLock = useCallback(async (newLockState: boolean) => {
    await setLockState(manholeId, newLockState);
    // The state will update automatically via the subscription,
    // but we could force an optimistic update here if needed.
  }, [manholeId]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-cyan-400">Connecting to Manhole {manholeName}...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-900">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <BackIcon className="w-6 h-6"/>
          </button>
          <h1 className="text-3xl font-bold text-white">Dashboard: <span className="text-cyan-400">{manholeName}</span></h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium">
          <LogoutIcon className="w-5 h-5"/>
          <span>Logout</span>
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Cards */}
        <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          <SensorCard
            title="Methane Gas Level"
            value={data.gasLevel}
            unit="PPM"
            icon={<GasIcon className="w-8 h-8"/>}
            status={getGasStatus(data.gasLevel)}
          />
          <SensorCard
            title="Blockage Distance"
            value={data.blockageDistance}
            unit="cm from top"
            icon={<WaterIcon className="w-8 h-8"/>}
            status={getBlockageStatus(data.blockageDistance)}
          />
          <ManholeStatusCard status={data.manholeStatus} />
          <LockControl
            isLocked={data.isLocked}
            onToggle={handleToggleLock}
          />
           <RawDataCard data={data} />
        </div>

        {/* History Chart */}
        <div className="lg:col-span-2">
            <HistoryChart data={data.history} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;