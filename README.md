# jjk-swap

Foundry VTT Module implementing a targeted token swap macro that players can execute.
Inspired by Todo's swapping ability shown here: https://www.youtube.com/watch?v=v-CpYSTDbek

## Installation and Setup

Option 1: Install via the usual foundry package manager (TODO: insert link once approved).

Option 2: Install by pasting the latest released [module.json](https://github.com/jarrodlombardo/jjk-swap/releases/latest/download/module.json) in the module installer's `Manifest URL` box.

## Usage

When the player executes the macro, the module will attempt to swap the two tokens the player has targeted. If the tokens are player character tokens, they are assumed to be cooperative. NPC tokens are assumed to be uncooperative, so they get a Wisdom saving throw to resist the swap. If either target succeeds the save, the swap is canceled.

## TODOs

1. implement a feature item with a Use action so the player doesn't need to run a macro
2. add settings so the GM can update/change how the save DC works. Maybe do that in the item?
3. create a 2.0.0 that removes the socket code (and increases the minimum core version to v13).
4. Test/verify for v14
