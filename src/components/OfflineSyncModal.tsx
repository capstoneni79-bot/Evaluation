import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  X, 
  Database,
  HardDrive
} from 'lucide-react';

export const OfflineSyncModal: React.FC = () => {
  const { 
    offlineQueue, 
    syncOfflineQueue, 
    showSyncModal, 
    setShowSyncModal, 
    isOfflineMode, 
    setIsOfflineMode,
    activities,
    addToast
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  if (!showSyncModal) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const result = await syncOfflineQueue();
    setIsSyncing(false);

    if (result.success) {
      setSyncResult(`Successfully synchronized ${result.count} evaluation record(s) to central cloud.`);
    } else {
      setSyncResult(`Sync issue: ${result.error || 'Server connection error'}`);
    }
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(offlineQueue, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `slsu_offline_evaluations_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast({
      type: 'info',
      title: 'Local Backup Exported',
      description: 'JSON file saved to your device.'
    });
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900 rounded-lg text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 id="sync-modal-title" className="font-bold text-sm text-white">Offline Data Collection & Synchronization</h3>
              <p className="text-xs text-emerald-300">Local Device Queue & Cloud Database Synchronization</p>
            </div>
          </div>
          <button
            onClick={() => setShowSyncModal(false)}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOfflineMode ? (
                <div className="p-2 rounded-lg bg-amber-100 text-amber-900">
                  <WifiOff className="w-5 h-5 text-amber-700" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900">
                  <Wifi className="w-5 h-5 text-emerald-700" />
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900">
                  Current Operating Mode: {isOfflineMode ? 'Field Offline Mode' : 'Online Connected Mode'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isOfflineMode
                    ? 'Evaluations are buffered locally on this device for areas with unreliable internet.'
                    : 'Device has direct real-time connectivity to the SLSU central database.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
            >
              Switch Mode
            </button>
          </div>

          {/* Queue List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-800" />
                <span>Pending Offline Records: <span className="tabular-nums font-mono">{offlineQueue.length}</span></span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Stored in Local Cache
              </span>
            </div>

            {offlineQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-7 h-7 mx-auto mb-1 text-emerald-600" />
                <p className="font-semibold text-slate-700">All evaluations are synchronized.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No records pending transmission.</p>
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 p-2">
                {offlineQueue.map((item, idx) => {
                  const act = activities.find(a => a.id === item.activityId);
                  return (
                    <div key={idx} className="p-2.5 hover:bg-slate-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{item.participantName} <span className="text-slate-400 font-normal tabular-nums">({item.controlNumber})</span></p>
                        <p className="text-[11px] text-slate-500">{act?.title || item.activityId}</p>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {item.meanRating.toFixed(2)} ★
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {syncResult && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{syncResult}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleExportBackup}
              disabled={offlineQueue.length === 0}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={handleSync}
              disabled={isSyncing || offlineQueue.length === 0}
              className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold flex items-center gap-2 shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Synchronize Now'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
