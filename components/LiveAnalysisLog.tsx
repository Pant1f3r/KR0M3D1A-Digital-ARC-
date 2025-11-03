import React from 'react';

interface LiveAnalysisLogProps {
    logs: string[];
}

export const LiveAnalysisLog: React.FC<LiveAnalysisLogProps> = ({ logs }) => {
    
    const getLogColor = (log: string): string => {
        if (log.startsWith('[CRITICAL]')) return 'text-red-400 animate-pulse';
        if (log.startsWith('[ALERT]')) return 'text-yellow-400';
        if (log.startsWith('[INFO]')) return 'text-cyan-400';
        return 'text-gray-400';
    };

    return (
        <div className="bg-black/50 p-4 rounded-lg border border-gray-700 h-full flex flex-col">
            <h4 className="text-sm font-semibold text-gray-300 mb-2 flex-shrink-0">[//] ALGO-BIAS DETECTOR LOG</h4>
            <div className="overflow-y-auto flex-grow font-mono text-xs space-y-1 pr-2">
                {logs.map((log, index) => (
                    <p key={index} className={`whitespace-pre-wrap animate-fade-in-right ${getLogColor(log)}`}>
                        <span className="text-gray-600 mr-2">&gt;</span>{log}
                    </p>
                ))}
            </div>
        </div>
    );
};