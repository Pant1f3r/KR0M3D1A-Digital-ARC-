import React from 'react';
import { Anomaly, LegalCase, AnomalySeverity, SystemHealthState } from '../services/types';
import { ScaleIcon } from './icons/ScaleIcon';
import { GavelIcon } from './icons/GavelIcon';
import { InteractiveBiasMap } from './InteractiveBiasMap';
import { GlobeIcon } from './icons/GlobeIcon';
import { ServerStackIcon } from './icons/ServerStackIcon';
import { CourtMandate } from './CourtMandate';
import { CourtIcon } from './icons/CourtIcon';
import { AnalysisStatCard } from './AnalysisStatCard';
import { LiveAnalysisLog } from './LiveAnalysisLog';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { FolderOpenIcon } from './icons/FolderOpenIcon';


interface ArconomicsProps {
    onAnalyzeAnomaly: (anomaly: Anomaly) => void;
    onGenerateBrief: (anomaly: Anomaly) => void;
    onFileBrief: (anomaly: Anomaly) => void;
    isLoading: boolean;
    anomalies: Anomaly[];
    legalCases: LegalCase[];
    selectedAnomaly: Anomaly | null;
    setSelectedAnomaly: (anomaly: Anomaly | null) => void;
    error: string;
    globalAwareness: number;
    generatedBrief: string | null;
    courtTreasury: number;
}

const AwarenessGauge: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <circle
                    className="text-cyan-400 drop-shadow-[0_0_5px_theme(colors.cyan.400)]"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-white">{percentage.toFixed(1)}%</span>
                <span className="text-xs text-gray-400 max-w-[80px]">Global Populace Awareness</span>
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: LegalCase['status'] }> = ({ status }) => {
    const styles: { [key in LegalCase['status']]: string } = {
        'Brief Filed with IDRC': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Injunction Pending': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        'Injunction Granted': 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${styles[status]}`}>
            {status}
        </span>
    );
};

const threatStyles: { [key in SystemHealthState['threatLevel']]: { text: string; bg: string; border: string } } = {
    'Nominal': { text: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-500/50' },
    'Elevated': { text: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/50' },
    'High': { text: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-500/50' },
    'Critical': { text: 'text-red-500', bg: 'bg-red-900/30', border: 'border-red-500/50' },
};


export const Arconomics: React.FC<ArconomicsProps> = ({ 
    onAnalyzeAnomaly, 
    onGenerateBrief,
    onFileBrief,
    isLoading, 
    anomalies, 
    legalCases,
    selectedAnomaly,
    setSelectedAnomaly,
    error,
    globalAwareness,
    generatedBrief,
    courtTreasury
}) => {
    
    const [dataScanned, setDataScanned] = React.useState(1337.42); // in TB
    const [analysisLog, setAnalysisLog] = React.useState<string[]>(['[INFO] Detector online. Awaiting network transmissions.']);
    const [threatLevel, setThreatLevel] = React.useState<SystemHealthState['threatLevel']>('Nominal');

    const signaturesFound = anomalies.length;
    const activeInvestigations = anomalies.filter(a => a.status === 'Analyzed' || a.status === 'Detected').length;

    // Simulation for dashboard data
    React.useEffect(() => {
        const logMessages = [
            '[INFO] Scanning IP range 192.168.0.0/16...',
            '[INFO] Analyzing data packet 0x... from Stockholm, SE.',
            '[INFO] No bias signature detected.',
            '[INFO] Scanning Azure cloud services for known vulnerabilities...',
            '[INFO] Packet analysis complete.',
            '[ALERT] High-entropy data stream detected from Shenzhen, CN. Flagged for deeper inspection.',
            '[INFO] Cross-referencing signature with KR0M3D1A vault...',
            '[CRITICAL] BIAS SIGNATURE MATCH: "Predictive Policing Racial Bias". Initiating prosecution protocols.',
        ];

        const simInterval = setInterval(() => {
            setDataScanned(prev => prev + (Math.random() * 5));

            if (Math.random() > 0.5) {
                const newLog = logMessages[Math.floor(Math.random() * logMessages.length)];
                if (newLog.startsWith('[CRITICAL]') && !anomalies.some(a => a.signature === 'Predictive Policing Racial Bias')) {
                    // Avoid inconsistent logs if the anomaly isn't present yet
                } else {
                     setAnalysisLog(prev => [newLog, ...prev.slice(0, 10)]);
                }
            }

        }, 2500);

        return () => clearInterval(simInterval);
    }, [anomalies]);

    // Derive threat level from anomalies
    React.useEffect(() => {
        const criticalCount = anomalies.filter(a => a.severity === 'Critical').length;
        const highCount = anomalies.filter(a => a.severity === 'High').length;

        if (criticalCount > 0) {
            setThreatLevel('Critical');
        } else if (highCount > 1) {
            setThreatLevel('High');
        } else if (highCount > 0 || anomalies.length > 3) {
            setThreatLevel('Elevated');
        } else {
            setThreatLevel('Nominal');
        }
    }, [anomalies]);

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <CourtIcon className="w-8 h-8 text-lime-400" />
                    Arconomics: The Algo-Bias Detector
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    The autonomous judicial and executive arm of the DEJA' VU directive. This real-time dashboard perpetually scans for, prosecutes, and penalizes acts of digital bigotry and algorithmic disenfranchisement on a global scale.
                </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-[600px] flex flex-col">
                <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center gap-2">
                    <GlobeIcon className="w-6 h-6"/>
                    The Algo-Bias Hotspot Maptrix
                </h3>
                <div className="flex-grow relative">
                     <InteractiveBiasMap 
                        globalAwareness={globalAwareness}
                        anomalies={anomalies}
                        onAnalyzeAnomaly={onAnalyzeAnomaly}
                        selectedAnomaly={selectedAnomaly}
                        setSelectedAnomaly={setSelectedAnomaly}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-fade-in-right">
                <h3 className="text-xl font-bold text-gray-100 mb-4">Real-time Detector Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <AnalysisStatCard
                            icon={<ServerStackIcon className="w-full h-full" />}
                            label="Data Scanned"
                            value={dataScanned.toFixed(2)}
                            unit="TB"
                        />
                        <AnalysisStatCard
                            icon={<ExclamationTriangleIcon className="w-full h-full" />}
                            label="Bias Signatures"
                            value={signaturesFound}
                            colorClass="text-yellow-400"
                        />
                        <AnalysisStatCard
                            icon={<FolderOpenIcon className="w-full h-full" />}
                            label="Active Investigations"
                            value={activeInvestigations}
                            colorClass="text-purple-400"
                        />
                         <div className={`sm:col-span-3 w-full text-center p-4 rounded-lg border ${threatStyles[threatLevel].bg} ${threatStyles[threatLevel].border}`}>
                            <div className="text-sm uppercase text-gray-400 tracking-wider">System Threat Level</div>
                            <div className={`text-3xl font-bold ${threatStyles[threatLevel].text}`}>{threatLevel}</div>
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-2 h-64 md:h-auto">
                        <LiveAnalysisLog logs={analysisLog} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Anomaly Feed */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                            <ServerStackIcon className="w-5 h-5 text-cyan-400"/>
                            Anomaly Feed
                        </h3>
                        <div className="font-mono text-sm space-y-2 overflow-y-auto pr-2 h-64">
                            {anomalies.map(anomaly => (
                                <button
                                    key={anomaly.id}
                                    onClick={() => setSelectedAnomaly(anomaly)}
                                    disabled={anomaly.status === 'Actioned'}
                                    className={`w-full text-left p-2 rounded-md transition-colors ${selectedAnomaly?.id === anomaly.id ? 'bg-purple-600/30' : 'bg-gray-900/50 hover:bg-gray-700/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <p className="font-bold text-cyan-400 truncate">{anomaly.signature}</p>
                                    <p className="text-xs text-gray-400">System: {anomaly.targetSystem} | Status: {anomaly.status}</p>
                                </button>
                            ))}
                            {anomalies.length === 0 && <p className="text-gray-500 text-center pt-10">Scanning for bias signatures...</p>}
                        </div>
                    </div>
                    {/* IDRC Docket */}
                     <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                         <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                            <GavelIcon className="w-5 h-5 text-yellow-400"/>
                            IDRC Docket
                        </h3>
                        <div className="space-y-2 overflow-y-auto pr-2 h-64">
                            {legalCases.length > 0 ? legalCases.map(c => (
                                <div key={c.id} className="bg-gray-900/50 p-3 rounded-md">
                                    <p className="font-semibold text-gray-300 truncate">{c.biasSignature}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500 font-mono">{c.docketId}</p>
                                        <StatusBadge status={c.status} />
                                    </div>
                                </div>
                            )) : (
                                <div className="flex items-center justify-center h-full text-gray-500 text-center">
                                    <p>No active legal cases.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {selectedAnomaly ? (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 animate-fade-in-right">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4">Case File: {selectedAnomaly.signature}</h3>
                        <div className="space-y-4">
                            {/* Actions */}
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col justify-center space-y-4">
                                <button
                                    onClick={() => onAnalyzeAnomaly(selectedAnomaly)}
                                    disabled={isLoading || selectedAnomaly.status !== 'Detected'}
                                    className="w-full flex justify-center items-center py-2 text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    <ScaleIcon className="w-5 h-5 mr-2" />
                                    [ STEP 1 ] ANALYZE & EXPOSE
                                </button>
                                 <button
                                    onClick={() => onGenerateBrief(selectedAnomaly)}
                                    disabled={isLoading || selectedAnomaly.status !== 'Analyzed'}
                                    className="w-full flex justify-center items-center py-2 text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    <GavelIcon className="w-5 h-5 mr-2" />
                                    [ STEP 2 ] DRAFT PROSECUTION
                                </button>
                                 <button
                                    onClick={() => onFileBrief(selectedAnomaly)}
                                    disabled={isLoading || selectedAnomaly.status !== 'Brief Generated'}
                                    className="w-full flex justify-center items-center py-2 text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    <CourtIcon className="w-5 h-5 mr-2" />
                                    [ STEP 3 ] ISSUE VERDICT & EXPIRE
                                </button>
                            </div>
                             {/* Analysis & Brief */}
                            <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                                <h5 className="text-xs uppercase text-gray-400 font-semibold">Impact Analysis</h5>
                                {isLoading && !selectedAnomaly.analysis ? (
                                    <p className="text-gray-400 animate-pulse mt-2">Generating impact analysis...</p>
                                ) : (
                                    <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{selectedAnomaly.analysis || 'Analysis pending...'}</p>
                                )}
                            </div>
                             {generatedBrief && selectedAnomaly.status === 'Brief Generated' && (
                                <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                                    <h4 className="font-semibold text-yellow-400">Generated Legal Brief:</h4>
                                    <div className="bg-black/30 p-3 rounded-md max-h-48 overflow-y-auto text-sm text-gray-300 font-mono whitespace-pre-wrap">
                                        {generatedBrief}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                         <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">Arconomics Treasury</h3>
                             <div className="my-2 bg-gray-900/50 inline-block p-3 rounded-lg border border-gray-600">
                                <p className="text-xs uppercase text-cyan-400">Total Sanctions Collected</p>
                                <p className="text-2xl font-bold text-yellow-400 text-glow-btc">{courtTreasury.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                <p className="text-xs text-gray-500">TRIBUNALS</p>
                                <p className="text-sm font-semibold text-gray-300">= ${courtTreasury.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD</p>
                                <p className="text-xs text-gray-500 font-mono mt-1 border-t border-gray-700 pt-1">Exchange Rate: 1:1</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <AwarenessGauge percentage={globalAwareness} />
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-200 mb-2 text-center">Arconomics Mandate</h3>
                            <div className="overflow-y-auto pr-2 h-64">
                                <CourtMandate />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};
