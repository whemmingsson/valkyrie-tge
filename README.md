![valkyrie_logo](https://github.com/whemmingsson/valkyrie-tge/assets/37114315/5b4b3eaf-69f7-468f-b8da-b6b0ff60c3e1)

# Valkyrie TGE

## Overview
Valkyrie TGE (Text Game Engine) is a game engine for running text adventure games in the likes of Zork (https://en.wikipedia.org/wiki/Zork). 

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

## Techstack
Node.

## Core principles (TBD)
Rooms. Doors. Keys. Triggers. Conditions. Actions. Mappings. Linking. 
