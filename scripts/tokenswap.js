async function targetSwapForUser(
    { userid = "" } = {}
) {
    if (!game.user.isActiveGM && !game.user.isGM) return;
    if (!userid) return;

    const actingUser = game.users.get(userid);
    const targets = [...actingUser.targets];
    if (targets.length !== 2)
        return void ui.notifications.error(
            `You need to target 2 tokens on the map. Right now you have ${targets.length} targeted.`,
        );
    await tokenSwap({ tokens: targets, actingUser: actingUser });
}

async function tokenSwap(
    { tokens = [], actingUser = {} } = {}
) {
    async function _swapTokens() {
        const { x: xA, y: yA, elevation: elA, disposition: dispositionA } = tokenA.document.toObject();
        const { x: xB, y: yB, elevation: elB, disposition: dispositionB } = tokenB.document.toObject();

        // change tokenB's disposition so moving A doesn't bump B
        await tokenB.document.update({ disposition: dispositionA });

        // move both tokens
        await tokenA.document.move({ x: xB, y: yB, elevation: elB, action: "displace" });
        await tokenB.document.move({ x: xA, y: yA, elevation: elA, action: "displace" });

        // restore tokenB's disposition
        await tokenB.document.update({ disposition: dispositionB });
    }

    async function _swapTokens12() {
        // v12 compatible version of swapTokens
        const { x: xA, y: yA, elevation: elA } = tokenA.document.toObject();
        const { x: xB, y: yB, elevation: elB } = tokenB.document.toObject();
        await tokenB.document.update({ x: xA, y: yA, elevation: elA }, { animate: false });
        await tokenA.document.update({ x: xB, y: yB, elevation: elB }, { animate: false });
    }

    if (!game.user.isActiveGM && !game.user.isGM) return;

    const [tokenA, tokenB] = tokens;

    const prof = actingUser.character ? actingUser.character.system.attributes.prof : 0;
    const wismod = actingUser.character ? actingUser.character.system.abilities.wis.mod : 0;
    const saveDC = 8 + prof + wismod;
    for (const token of tokens) {
        if (token.actor.type === "npc") {
            const rolls = await token.actor.rollSavingThrow({ ability: "wis", target: saveDC }, { fastForward: true });
            if (rolls[0].isSuccess)
            {
                ChatMessage.create({
                    content: `${tokenA.name} <> ${tokenB.name} swap failed`
                });
                return;
            }
        }
    }

    if (tokenA.document.move) {
        await _swapTokens();
    }
    else {
        await _swapTokens12();
    }

    ChatMessage.create({
        content: `${tokenA.name} <> ${tokenB.name} swapped`
    });
}

Hooks.on("init", () => {
    if (CONFIG.queries) {
        console.log("Registering jjk-swap-tokenswap query");
        CONFIG.queries["jjk-swap-tokenswap"] = targetSwapForUser;
    }
});

Hooks.on("ready", () => {
    // only create a socket listener if we can't use queries.
    if (!CONFIG.queries && game.user.isGM) {
        game.socket.on("module.jjk-swap", async (request) => {
            if (request.action === "tokenSwap") {
                await targetSwapForUser(request.data);
            }
        });
    }
});

async function macroTokenSwap() {
    if (!game.user.character) {
        return void ui.notifications.error(
            `You must have a character to use this macro.`,
        );
    }

    const targets = [...game.user.targets];

    if (targets.length !== 2) {
        return void ui.notifications.error(
            `You need to target 2 tokens on the map. Right now you have ${targets.length} targeted.`,
        );
    }

    if (game.users.activeGM.query) {
        await game.users.activeGM.query(
            "jjk-swap-tokenswap",
            { userid: game.user.id }
        );
    }
    else {
        game.socket.emit(
            "module.jjk-swap",
            { action: "tokenSwap", data: { userid: game.user.id } }
        );
    }
}
