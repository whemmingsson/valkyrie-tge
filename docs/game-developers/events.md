# Events

One of the most central concepts in a Valkyrie Game is the Event.

An event consists of several parts (click each for more detailed info)

1. Trigger
2. Mappings
3. Condition
4. [Action](https://github.com/whemmingsson/valkyrie-tge/blob/master/docs/game-developers/actions.md)

## Scopes

All events are scoped. It means they are valid only in certain situations:

### Scope: Global
The Global scope is an event that can happen at any point in time, in any room. They are useful for certain very common commands that the player will likely use often.

#### Examples:

1. Describe - Describe any object with a description specified. It can be rooms, objects, the player itself, other characters. 
2. Inventory - Display the players inventory.

### Scope: Room
At one step below Global is the Room context - these events are only valid in a specific rooms. 

#### Examples:

1. Help - Display help about the room. If the help event is scoped to a room, the help text can naturally only be in this room. This makes it possible to provide special help for each room in the game.

### Scope: Item
This scope is a bit special, since it's not related to a geograhpical situation, but rather that the event is tied to a specific item. All item scoped events needs to be connected to an item to function properly. Typically, this is accomplished by assigning the target property.

## The Meta property
It's common to provide the `meta` property to an event, to give the engine more instructions. In most scenarios, it can be used to provide text string that will be displayed to the player. The default property is called `text`, and is typically displayed when the event resolves and the action is executed. 

Sometimes an event cannot complete due to conditions not being met - we can then expand the meta object with more texts to display in such situations.

An example is the meta key `on_locked_text` - which will be displayed if the player tries to open a locked container. As with many of these additional texts, the game engine have built-in fallback texts. 

## Example event

```json
{
    "scope": "ITEM", // Scope it to a specific item
    "trigger": "COMMAND", // Explicitly specify the trigger
    "target": "c_1", // Specify a target object
    "action": "OPEN", // Specify the action
    "meta": {
        "text": "You have opened the chest. Inside you find a key. It is a small brass <y>key</y>. It looks like it might fit a small lock. Maybe a lock of brass? It also contains a glass <c>orb</c>. It is very delicate and fragile. It looks like it might break if you drop it.\n",
        "on_locked_text": "Yeah it's locked dude. If you see this text anywhere, there is a bug in the logic.",
        "on_open_text": "It's already open. No need to try to open it again."
    },
    "mappings": [
        {
            "inputs": [
                "open" // Can only resolved if ANY of the words in the command is "open"
            ],
            "rule": "ANY"
        }
    ]
},

```
