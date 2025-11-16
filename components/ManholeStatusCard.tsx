import React from 'react';
import { ManholeIcon } from './icons/ManholeIcon';

interface ManholeStatusCardProps {
    status: 'Open' | 'Closed' | 'Unknown';
}

const ManholeStatusCard: React.FC<ManholeStatusCardProps> = ({ status }) => {
    const statusStyles = {
        Open: {
            bg: 'bg-red-500/10',
            text: 'text-red-400',
        },
        Closed: {
            bg: 'bg-green-500/10',
            text: 'text-green-400',
        },
        Unknown: {
            bg: 'bg-gray-500/10',
            text: 'text-gray-400',
        }
    };
    
    const styles = statusStyles[status] || statusStyles['Unknown'];

    return (
        <div className={`p-6 rounded-2xl border border-gray-700 bg-gray-800 shadow-lg ${styles.bg}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 font-medium">Manhole Cover Status</p>
                    <p className={`text-4xl font-bold mt-2 ${styles.text}`}>{status}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-900/50 ${styles.text}`}>
                    <ManholeIcon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
};

export default ManholeStatusCard;
