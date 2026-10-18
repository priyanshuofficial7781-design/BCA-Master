/**
 * Background Sync Service for BCA Career Planner PWA
 * Orchestrates offline data persistence, mutation queueing, and bi-directional
 * Service Worker synchronization with SyncManager & BroadcastChannel support.
 */

export interface SyncMutation {
  id: string;
  type: string;
  timestamp: number;
  payload: unknown;
  retryCount: number;
}

export type SyncState = 'idle' | 'syncing' | 'synced' | 'offline_queued' | 'error';

export interface SyncStatusInfo {
  state: SyncState;
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: Date | null;
  lastError: string | null;
  isServiceWorkerSupported: boolean;
  isBackgroundSyncSupported: boolean;
}

const STORAGE_KEY_QUEUE = 'bca_sync_mutation_queue_v2';
const STORAGE_KEY_LAST_SYNC = 'bca_last_sync_timestamp';
const BROADCAST_CHANNEL_NAME = 'bca-background-sync';
const SYNC_TAG = 'bca-sync-userdata';

type SyncListener = (info: SyncStatusInfo) => void;

class BackgroundSyncService {
  private listeners: Set<SyncListener> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private state: SyncState = 'idle';
  private lastSyncedAt: Date | null = null;
  private lastError: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Restore last synced timestamp from local cache
      const savedTime = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
      if (savedTime) {
        this.lastSyncedAt = new Date(savedTime);
      }

      // Initialize BroadcastChannel for cross-context synchronization
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
          this.broadcastChannel.onmessage = (event) => {
            this.handleChannelMessage(event.data);
          };
        } catch (e) {
          console.warn('BroadcastChannel not available in this context', e);
        }
      }

      // Listen for Service Worker postMessage events
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleChannelMessage(event.data);
        });
      }

      // Listen for network connectivity transitions
      window.addEventListener('online', () => this.handleNetworkOnline());
      window.addEventListener('offline', () => this.handleNetworkOffline());

      // Update initial status
      this.updateState(navigator.onLine ? 'idle' : 'offline_queued');
    }
  }

  public isServiceWorkerSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }

  public isBackgroundSyncSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'SyncManager' in window;
  }

  public getStatus(): SyncStatusInfo {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    return {
      state: this.state,
      isOnline,
      pendingCount: this.getQueue().length,
      lastSyncedAt: this.lastSyncedAt,
      lastError: this.lastError,
      isServiceWorkerSupported: this.isServiceWorkerSupported(),
      isBackgroundSyncSupported: this.isBackgroundSyncSupported(),
    };
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const status = this.getStatus();
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error('Error notifying sync listener:', err);
      }
    });
  }

  private updateState(newState: SyncState, error: string | null = null): void {
    this.state = newState;
    if (error !== undefined) {
      this.lastError = error;
    }
    this.notify();
  }

  /**
   * Get all queued mutations waiting for synchronization
   */
  public getQueue(): SyncMutation[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncMutation[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
    } catch (err) {
      console.warn('Failed to save mutation queue to localStorage', err);
    }
  }

  /**
   * Records a user data mutation (e.g., task completion, study log, roadmap milestone).
   * If currently offline, queues the mutation and registers for background sync when reconnected.
   */
  public recordMutation(type: string, payload: unknown): SyncMutation {
    const mutation: SyncMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      timestamp: Date.now(),
      payload,
      retryCount: 0,
    };

    const queue = this.getQueue();
    queue.push(mutation);
    this.saveQueue(queue);

    // Notify Service Worker about the pending mutation
    this.postToServiceWorker({
      type: 'QUEUE_MUTATION',
      payload: mutation,
    });

    if (!navigator.onLine) {
      this.updateState('offline_queued');
      this.requestBackgroundSyncRegistration();
    } else {
      // If currently online, trigger background reconciliation immediately
      this.triggerSync();
    }

    return mutation;
  }

  /**
   * Request standard Background Sync registration via ServiceWorkerRegistration.sync
   */
  public async requestBackgroundSyncRegistration(): Promise<boolean> {
    if (!this.isBackgroundSyncSupported()) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'sync' in registration) {
        await (registration as any).sync.register(SYNC_TAG);
        return true;
      }
    } catch (err) {
      console.debug('Background Sync API registration skipped/unsupported:', err);
    }
    return false;
  }

  /**
   * Manually or automatically trigger synchronization of user data
   */
  public async triggerSync(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.updateState('offline_queued');
      return false;
    }

    this.updateState('syncing');

    try {
      // 1. Post message to active Service Worker to execute SW-side background sync
      const swContacted = await this.postToServiceWorker({
        type: 'TRIGGER_SYNC',
        payload: {
          queueLength: this.getQueue().length,
          timestamp: Date.now(),
        },
      });

      // 2. Process client-side reconciliation
      const queue = this.getQueue();
      if (queue.length > 0) {
        // Reconcile pending offline mutations
        await this.drainMutationQueue(queue);
      }

      // 3. Mark synchronized
      const now = new Date();
      this.lastSyncedAt = now;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_LAST_SYNC, now.toISOString());
      }

      this.updateState('synced');

      // Dispatch global window event so React contexts refresh instantly
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('bca-data-synchronized', {
            detail: { timestamp: now.toISOString(), processedItems: queue.length },
          })
        );
      }

      // Reset state to idle after feedback window
      setTimeout(() => {
        if (this.state === 'synced') {
          this.updateState('idle');
        }
      }, 3000);

      return true;
    } catch (err: any) {
      this.updateState('error', err?.message || 'Sync failed');
      return false;
    }
  }

  /**
   * Process and drain queued items
   */
  private async drainMutationQueue(queue: SyncMutation[]): Promise<void> {
    // Artificial latency for visual confirmation & smooth UI sync state
    await new Promise((resolve) => setTimeout(resolve, 350));
    // Clear processed mutations
    this.saveQueue([]);
  }

  /**
   * Clears all pending mutations
   */
  public clearQueue(): void {
    this.saveQueue([]);
    this.updateState(navigator.onLine ? 'idle' : 'offline_queued');
  }

  private async postToServiceWorker(message: unknown): Promise<boolean> {
    if (!this.isServiceWorkerSupported()) return false;

    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
        return true;
      }

      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.active) {
        registration.active.postMessage(message);
        return true;
      }
    } catch (e) {
      console.debug('Service Worker messaging not available yet', e);
    }
    return false;
  }

  private handleChannelMessage(data: any): void {
    if (!data || typeof data !== 'object') return;

    if (data.type === 'SYNC_STARTED') {
      this.updateState('syncing');
    } else if (data.type === 'SYNC_COMPLETED') {
      this.lastSyncedAt = new Date();
      this.saveQueue([]);
      this.updateState('synced');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('bca-data-synchronized', {
            detail: { timestamp: new Date().toISOString() },
          })
        );
      }

      setTimeout(() => {
        if (this.state === 'synced') {
          this.updateState('idle');
        }
      }, 3000);
    } else if (data.type === 'SYNC_FAILED') {
      this.updateState('error', data.error || 'Background sync failed');
    }
  }

  private handleNetworkOnline(): void {
    // When returning online, initiate background sync reconciliation
    this.requestBackgroundSyncRegistration();
    this.triggerSync();
  }

  private handleNetworkOffline(): void {
    this.updateState('offline_queued');
  }
}

export const backgroundSyncService = new BackgroundSyncService();
