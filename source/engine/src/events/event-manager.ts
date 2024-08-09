import C from '../core/constants.js';
import { buildActionForEvent } from './action-builder.js';

const eventManager = {
    getEnterRoomEventAction: (room: any) => {
        if (!room.events) {
            return null;
        }

        const event = room.events.find((event: any) => event.trigger === C.EVENT_TRIGGER_ENTER);

        // No event found - that is fine.
        if (!event) {
            return null;
        }

        return buildActionForEvent(event, undefined, undefined);
    },
    resolveTriggeredAction: (_trigger, _command) => { }
};

export default eventManager;
