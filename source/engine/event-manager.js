const C = require('../core/constants');
const actionBuilder = require('./action-builder');

const eventManager = {};

eventManager.getEnterRoomEventAction = (room) => {
    if (!room.events) {
        return null;
    }

    const event = room.events.find((event) => event.trigger === C.EVENT_TRIGGER_ENTER);

    // No event found - that is fine.
    if (!event) {
        return null;
    }

    return actionBuilder.buildActionForEvent(event);
}

eventManager.resolveTriggeredAction = (trigger, command) => { }

module.exports = eventManager;
