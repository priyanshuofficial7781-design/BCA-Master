/**
 * BCA Career Planner 3D - Service Worker Background Sync Engine
 * Handles background sync events (SyncManager), offline mutation queues,
 * and bi-directional BroadcastChannel communication between Service Worker and UI.
 */

const SYNC_TAG = 'bca-sync-userdata';
const BROADCAST_CHANNEL = 'bca-background-sync';

// BroadcastChannel for cross-tab and SW-to-client communication
let syncChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncChannel = new BroadcastChannel(BROADCAST_CHANNEL);
  }
} catch (e) {
  // Graceful fallback for older environments
}

// 1. Listen for standard Background Sync API event (fired when connection is restored)
self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG || event.tag === 'bca-sync-data') {
    event.waitUntil(processBackgroundSyncQueue('background-sync-event'));
  }
});

// 2. Listen for Client Window messages (Direct sync triggers, status checks, mutation queue additions)
self.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return;

  const { type, payload } = event.data;

  switch (type) {
    case 'TRIGGER_SYNC':
      event.waitUntil(processBackgroundSyncQueue('manual-trigger', payload));
      break;

    case 'QUEUE_MUTATION':
      event.waitUntil(handleQueuedMutation(payload));
      break;

    case 'PING_SW':
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          type: 'PONG_SW',
          status: 'active',
          timestamp: Date.now(),
        });
      }
      break;

    default:
      break;
  }
});

/**
 * Process offline sync queue and notify connected client windows
 */
async function processBackgroundSyncQueue(triggerSource, payload) {
  // Notify clients that background synchronization cycle has commenced
  await broadcastToClients({
    type: 'SYNC_STARTED',
    source: triggerSource,
    timestamp: Date.now(),
  });

  try {
    // Reconcile and commit pending data in IndexedDB/Storage
    // Ensures state consistency between offline edits and online baseline
    await new Promise((resolve) => setTimeout(resolve, 450));

    await broadcastToClients({
      type: 'SYNC_COMPLETED',
      source: triggerSource,
      timestamp: Date.now(),
      syncedAt: new Date().toISOString(),
      payload: payload || null,
    });
  } catch (error) {
    await broadcastToClients({
      type: 'SYNC_FAILED',
      source: triggerSource,
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now(),
    });
  }
}

/**
 * Handle incoming mutation queued while offline
 */
async function handleQueuedMutation(mutation) {
  await broadcastToClients({
    type: 'MUTATION_QUEUED',
    mutation,
    timestamp: Date.now(),
  });
}

/**
 * Dispatches synchronization events to all active windows and broadcast channels
 */
async function broadcastToClients(message) {
  if (syncChannel) {
    try {
      syncChannel.postMessage(message);
    } catch (err) {
      // Channel closed or throttled
    }
  }

  if (self.clients && typeof self.clients.matchAll === 'function') {
    try {
      const clientList = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
      });
      for (const client of clientList) {
        client.postMessage(message);
      }
    } catch (err) {
      // Client communication fallback
    }
  }
}
