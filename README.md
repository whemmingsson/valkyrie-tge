![valkyrie_pride](https://github.com/user-attachments/assets/1261ec94-af5e-4534-902c-fdf43345fd33)

# Valkyrie Text Game Engine

## Overview
Valkyrie TGE is a game engine for running text adventure games in the likes of Zork (https://en.wikipedia.org/wiki/Zork). 

The main ambition of this project is to provide game developers, without extensive programming knowledge, with the kits and tools to create epic interative stories. Without writing a single line of code.  

Instead of using MDL for building the games, Valkyrie relies heaivly on the use of JSON files. Toghether with a rich set of schemas. 

Valkyrie is both a compiler (validator) for Valkyrie game files and an interpretor (engine) for running such files.

Are you a game developer, or inspiring to become one? Docs [here](https://github.com/whemmingsson/valkyrie-tge/tree/master/docs/game-developers)!

## Sub projects

### Valkyrie Engine
Main component. Reads Valkyrie Game Files and runs the game, handles logic, state etc.

### Valkyrie Compiler
The compiler is responsible for collecting game developer JSON files and validating them, both in terms of format but also logic. 

### Valkyrie Core
Shared functionality, including json schemas.

### Valkyrie Shell
Wrapper around the Engine to provide IO functionality to let game run in a terminal.

### Valkyrie Builder (future)
Graphical Interface on top of the compiler, making games even simpler!

## Techstack
Node. TypeScript.

## Libs used
* ajv (for json schema validiation)
* chalk (for color formatting)
* prompt-sync (for user input)
* minimist (for parsing console args)
* node-html-parser (to enable basic color formatting of raw text)

## Core principles (TBD)
Rooms. Doors. Keys. Triggers. Conditions. Actions. Mappings. Linking. 
