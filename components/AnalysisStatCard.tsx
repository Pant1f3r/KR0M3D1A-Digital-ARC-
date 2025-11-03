import React from 'react';

interface AnalysisStatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    colorClass?: string;
}

export const AnalysisStatCard: React.FC<AnalysisStatCardProps> = ({ icon, label, value, unit, colorClass = 'text-cyan-400' }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
        <div className={`flex-shrink-0 w-8 h-8 ${colorClass}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-100 font-mono">
                {value}
                {unit && <span className="text-base text-gray-500 ml-1">{unit}</span>}
            </p>
        </div>
    </div>
);