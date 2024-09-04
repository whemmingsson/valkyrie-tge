import { TRIGGER_ENTER } from '../core/constants/events/triggerTypes.js';
import { buildActionForEvent } from './actionBuilder.js';

const eventManager = {
    getEnterRoomEventAction: (room: any) => {
        if (!room.events) {
            return null;
        }

        const event = room.events.find((event: any) => event.trigger === TRIGGER_ENTER);

        // No event found - that is fine.
        if (!event) {
            return null;
        }

        return buildActionForEvent(event, undefined, undefined);
    },
    resolveTriggeredAction: (_trigger, _command) => { }
};

export default eventManager;
