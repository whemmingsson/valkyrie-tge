# Valkyrie Game Engine
### This is the official documentation for game developers
Here you will find most resources needed to develop amazing text adventures. The docs will be updated when new features is added.

### Who is this for?
Valkyrie Engine is for storytellers who wants to become game developers - today - without the need of extensive programming knowledge. Really? Yes, really! However, Valkyrie is used to build and run a very particular type of game - text adventure games. A classic example of such game is Zork that was released way back in 1977. Maybe you have a story to be told, but want to try a more interactive approach than writing a book.

## The basics
Valyrie Games run in a terminal/console. Games are typically played by interacting with the game by typing commands. The game engine will figure out what will happen when certain commands are entered. It's up to you as a game developer to help the game engine with this task. 

But, building games without programming? Is it really possible? Yes, we firmly believe so. 

### The JSON file format
All Valkyrie games are defined using a popular type of file - JSON. So to get started, learn JSON. You can read more about it here https://www.json.org/json-en.html. 

### The JSON Schemas
The game engine requires you to create your JSON in a particular way. To ensure that you create them in a way that the game engine can understand, we have created a set of so called schemas. The schemas dictate HOW to construct your game files - the rest is up to you. 
The schemas in themself provide a good documentation, because they state whats possible and not possible. 

links to schemas here

# Concepts 

## Events

### Commands
At the heart of Valkyrie is the concept of commands. Commands are entered by players, and the engine parses the input and resolves the command into.. yes what? 

### Actions
Actions! Actions for everyone! Actions are essentially small snippets of code that runs when a command has been resolved. One of the most common and useful action is to display some text to the player. Wait, did that say code? Yup. But you don't have to write that code yourself. The engine will create this code for you.

### Triggers
Lets takes some steps back - to commands. Another way to look at commands is that they _trigger_ something (and that something being an action). So all commands are also triggers. As a matter of fact, in a sense, the only triggers are when the user types something else. But. There is always a but, isn't there? Actions can in of themself be triggers for other actions. This enables for some fancy action-chaining. 

### Input maps
Input maps are the connections between user commands and actions. They are basically rules that specifies a set of words, and how they should be interpreted. 

### Conditions
Sometimes you might not want to trigger actions unless certain conditions are met. Valkyrie engine provides a rich set of conditions to utilize. Conditions naturally makes the game more dynamic, since they can depend on a lot of things: how many times the user have entered a room, if the player have talked with a particular character, if the user have picked up the correct combination for a safe, etc. Conditions are what makes the games feel truly alive! 

### Events
Wrapping it up - one last essential concept - events. Events is what ties triggers, conditions and actions together. All events needs a trigger and an action. Conditions are optional. It's up you to define when to trigger certain actions, but there is also a list of built-in events that can be customized by you. 

## Objects
Objects are game entities that the player can interactive with. Valkyrie is unoppnionated what shape the objects take in the game. Its totally up to you what the objects are, and how the players will be able interactive with them. 

### Rooms
A Valkyrie game resolves around the player navigating a set of rooms. It's of course entierly possible to create an entire game taking place within one room (like the older games from Rusty Lake: https://www.rustylake.com/).

### Containers
In rooms you can place containers - they can basically be anything: a treasure chest, a hollowed out book, a locked safe, or a even a dead person..? (Saw Game anyone?). The crucial thing is that they can contain other objects, and that they can be locked.  

### Inventory
The player always have access to an inventory where all picked up objects are stored. The inventory is built into the game engine - so need for you to set it up. The only thing you need to do is to defined the input maps. 







