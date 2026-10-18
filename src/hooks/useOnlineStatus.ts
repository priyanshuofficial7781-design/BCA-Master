import { useEffect, useState, useCallback } from 'react';
import {
  backgroundSyncService,
  SyncStatusInfo,
  SyncState,
} from '../services/backgroundSyncService';

export function useOnlineStatus() {
  const [syncInfo, setSyncInfo] = useState<SyncStatusInfo>(() =>
    backgroundSyncService.getStatus()
  );

  useEffect(() => {
    // Subscribe to live background sync updates
    const unsubscribe = backgroundSyncService.subscribe((updatedInfo) => {
      setSyncInfo(updatedInfo);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const triggerManualSync = useCallback(async () => {
    return await backgroundSyncService.triggerSync();
  }, []);

  const recordMutation = useCallback((type: string, payload: unknown) => {
    return backgroundSyncService.recordMutation(type, payload);
  }, []);

  return {
    isOnline: syncInfo.isOnline,
    syncState: syncInfo.state,
    isSyncing: syncInfo.state === 'syncing',
    hasPendingOfflineData: syncInfo.pendingCount > 0 || syncInfo.state === 'offline_queued',
    pendingCount: syncInfo.pendingCount,
    lastSyncTime: syncInfo.lastSyncedAt || new Date(),
    lastError: syncInfo.lastError,
    isServiceWorkerSupported: syncInfo.isServiceWorkerSupported,
    isBackgroundSyncSupported: syncInfo.isBackgroundSyncSupported,
    triggerManualSync,
    recordMutation,
  };
}
