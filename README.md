# jjk-swap

Foundry VTT Module implementing a targeted token swap macro that players can execute.
Inspired by Todo's swapping ability shown here: https://www.youtube.com/watch?v=v-CpYSTDbek

## Installation and Setup

TODO

## Usage

When the player executes the macro, the module will attempt to swap the two tokens the player has targeted. If the tokens are player character tokens, they are assumed to be cooperative. NPC tokens are assumed to be uncooperative, so they get a Wisdom saving throw to resist the swap. If either target succeeds the save, the swap is canceled.

## TODOs

1. test/update to work on v13 and v14 while maintaining v12 support.
2. implement a feature item with a Use action so the player doesn't need to run a macro
3. add settings so the GM can update/change how the save DC works. Maybe do that in the item?
4. create a 2.0.0 that removes the socket code (and increases the minimum core version to v13).
