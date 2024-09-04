import output from "./core/io/output.js";
import { GameEvent } from "./core/types/event.js";
import debug from "./debug.js";

interface EventRegistryMap {
    [key: string]: GameEvent[];
}

interface EventRegistry {
    events: EventRegistryMap;
}

class EventRegistry {
    constructor() {
        this.events = {} as EventRegistryMap;
    }

    getOrInitEvents(roomId: string, builderFunction: () => GameEvent[]): GameEvent[] {
        if (this.events[roomId]) {
            return this.events[roomId];
        }

        if (debug.DEBUG_MODE) {
            output.debug(`Event registry: Initializing events found for room ${roomId}`);
        }

        const events = builderFunction();
        this.events[roomId] = events;

        if (debug.DEBUG_MODE) {
            output.debug(`Event registry: ${events.length} events initialized for room ${roomId}\n`);
        }

        return events;
    }

    getRegistry() {
        return this.events;
    }

    getEvents(roomId: string) {
        if (!this.events[roomId]) {
            output.warn(`Event registry: No events found for room ${roomId}`);
            return [];
        }
        return this.events[roomId];
    }
}

export const eventRegistry = new EventRegistry();
export const getOrInitEvents: (roomId: string, builderFunction: () => GameEvent[]) => GameEvent[] = eventRegistry.getOrInitEvents.bind(eventRegistry);