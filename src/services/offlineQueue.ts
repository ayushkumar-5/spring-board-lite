export interface QueuedAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineQueueService {
  private queue: QueuedAction[] = [];
  private isOnline: boolean = navigator.onLine;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    this.loadQueue();
    this.setupOnlineOfflineListeners();
  }

  private setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  private loadQueue() {
    try {
      const saved = localStorage.getItem('offlineQueue');
      this.queue = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  public addListener(listener: (online: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public isOnlineStatus(): boolean {
    return this.isOnline;
  }

  public addToQueue(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>): string {
    const queuedAction: QueuedAction = {
      ...action,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      retryCount: 0
    };

    this.queue.push(queuedAction);
    this.saveQueue();
    return queuedAction.id;
  }

  public removeFromQueue(actionId: string) {
    this.queue = this.queue.filter(action => action.id !== actionId);
    this.saveQueue();
  }

  public getQueue(): QueuedAction[] {
    return [...this.queue];
  }

  public getQueuedAction(actionId: string): QueuedAction | undefined {
    return this.queue.find(action => action.id === actionId);
  }

  public async processQueue() {
    if (!this.isOnline || this.queue.length === 0) return;

    const actionsToProcess = [...this.queue];
    
    for (const action of actionsToProcess) {
      try {
        await this.processAction(action);
        this.removeFromQueue(action.id);
      } catch (error) {
        console.error(`Failed to process queued action ${action.id}:`, error);
        action.retryCount++;
        
        // Remove action if it has been retried too many times
        if (action.retryCount >= 3) {
          this.removeFromQueue(action.id);
        }
      }
    }
  }

  private async processAction(action: QueuedAction): Promise<void> {
    const { api } = await import('./api');
    
    switch (action.type) {
      case 'CREATE':
        await api.createTask(action.data);
        break;
      case 'UPDATE':
        await api.updateTask(action.data.id, action.data.updates);
        break;
      case 'DELETE':
        await api.deleteTask(action.data.id);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  public clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineQueue = new OfflineQueueService();
