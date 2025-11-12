import { IEventBus, IEventListener } from './types';

/**
 * Event Bus Implementation
 * Simple in-memory pub/sub for now
 * TODO: Integrate with Redis for distributed events
 */
export class EventBus implements IEventBus {
    private listeners: Map<string, IEventListener[]> = new Map();

    /**
     * Subscribe to event
     */
    on<T>(eventName: string, listener: IEventListener<T>): void {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName)!.push(listener as any);
        console.log(`📡 Listener registered for event: ${eventName}`);
    }

    /**
     * Unsubscribe from event
     */
    off<T>(eventName: string, listener: IEventListener<T>): void {
        const eventListeners = this.listeners.get(eventName);
        if (!eventListeners) return;

        const index = eventListeners.indexOf(listener as any);
        if (index !== -1) {
            eventListeners.splice(index, 1);
            console.log(`📡 Listener removed for event: ${eventName}`);
        }
    }

    /**
     * Emit event to all listeners
     */
    async emit<T>(eventName: string, event: T): Promise<void> {
        const eventListeners = this.listeners.get(eventName) || [];

        if (eventListeners.length === 0) {
            console.warn(`⚠️  No listeners for event: ${eventName}`);
            return;
        }

        console.log(`📡 Emitting event: ${eventName} to ${eventListeners.length} listeners`);

        const promises = eventListeners.map(listener => {
            try {
                return Promise.resolve(listener.handle(event));
            } catch (error) {
                console.error(`❌ Error in event listener for ${eventName}:`, error);
                return Promise.reject(error);
            }
        });

        await Promise.allSettled(promises);
    }

    /**
     * Get all listeners for an event
     */
    getListeners(eventName: string): IEventListener[] {
        return this.listeners.get(eventName) || [];
    }

    /**
     * Clear all listeners
     */
    clear(): void {
        this.listeners.clear();
        console.log('📡 Event Bus cleared');
    }
}

// Export singleton instance
export const eventBus = new EventBus();
