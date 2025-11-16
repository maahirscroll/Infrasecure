import React from 'react';

interface RawDataCardProps {
  data: {
    gasLevel: number;
    blockageDistance: number;
    ldrValue: number;
    manholeStatus: string;
  };
}

const RawDataCard: React.FC<RawDataCardProps> = ({ data }) => {
  const jsonData = {
    sensors: {
      gas: data.gasLevel,
      distance: data.blockageDistance,
      ldr: data.ldrValue,
      manholeStatus: data.manholeStatus,
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">Live Sensor JSON</h3>
      <pre className="text-sm bg-gray-900 p-4 rounded-lg text-cyan-300 overflow-x-auto">
        <code>{JSON.stringify(jsonData, null, 2)}</code>
      </pre>
    </div>
  );
};

export default RawDataCard;
