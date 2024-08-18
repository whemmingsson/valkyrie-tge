# Actions

An action is esentially a code snippet that runs when an event has been resolved and passed any potential condition checks. An action generally updates the game state (context) and renders a text to the player as a confirmation that the event was completed.

The Valkyrie Game Engine specifies a wide range of such snippets for you as a developer to use.

### Action: TEXT
The simplest form of an action - display a text to the player. Most actions are based on displaying text to the player, but they often does something more. The TEXT action does not anything else.

Example event:

```JSON

 {
    "scope": "ROOM",
    "trigger": "COMMAND",
    "action": "TEXT",
    "meta": {
        "text": [
            "<lightblue>❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤</lightblue>",
            "<pink>❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤</pink>",
            "<white>❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤</white>",
            "<pink>❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤</pink>",
            "<lightblue>❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤ ❤</lightblue>"
        ]
    },
    "mappings": [
        {
            "inputs": [
                "pride"
            ],
            "rule": "EXACT"
        }
    ]
}

```

This event uses the TEXT Action to display the [transgender pride flag](https://en.wikipedia.org/wiki/Transgender_flag) 

The text to be rendered is specified in the `meta.text` property, which can either be a single text string, or a list of strings (as in this case).


### Action: DESCRIBE
The DESCRIBE action wraps the TEXT action, and instead of using the meta.text property, displays the text from the target objects `description` property. 

Since it will be a lot of work for you as a game developer to specify this action for all game objects, the action can be specified once (Scope = GLOBAL) or on a per-room basis (Scope = ROOM), a long with the approperiate mappings. 

Example:
```JSON
{
    "scope": "GLOBAL",
    "trigger": "COMMAND",
    "action": "DESCRIBE",
    "mappings": [
        {
            "inputs": [
                "describe", "inspect"
            ],
            "rule": "ANY"
        }
    ]
}
```
