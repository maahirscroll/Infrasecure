import React, { useState, useEffect } from 'react';
import { getManholeIds } from '../services/manholeService';
import { ManholeIcon } from './icons/ManholeIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface ManholeSelectorProps {
  onSelectManhole: (id: string, name: string) => void;
  onLogout: () => void;
}

const ManholeSelector: React.FC<ManholeSelectorProps> = ({ onSelectManhole, onLogout }) => {
  const [manholeIds, setManholeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIds = async () => {
      setLoading(true);
      const ids = await getManholeIds();
      setManholeIds(ids);
      setLoading(false);
    };
    fetchIds();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Select a Manhole</h1>
            <p className="text-gray-400 mb-8">Choose a unit to view its live sensor dashboard.</p>
            
            {loading ? (
                <div className="text-cyan-400">Loading available units...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {manholeIds.map((id, index) => {
                        const displayName = index === 0 ? 'MH-370' : id;
                        return (
                            <button
                                key={id}
                                onClick={() => onSelectManhole(id, displayName)}
                                className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg hover:bg-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <ManholeIcon className="w-16 h-16 mx-auto text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
                                <p className="mt-4 font-semibold text-lg text-white">{displayName}</p>
                            </button>
                        );
                    })}
                </div>
            )}

            <button
                onClick={onLogout}
                className="mt-12 inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                <LogoutIcon className="w-5 h-5" />
                <span>Log Out</span>
            </button>
        </div>
    </div>
  );
};

export default ManholeSelector;
