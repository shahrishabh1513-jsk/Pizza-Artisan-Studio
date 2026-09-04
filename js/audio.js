/* ============================================================
   PIZZA HOUSE — Audio Manager
   Every sound is optional. If a file listed below doesn't
   exist in /audio, the game keeps working silently — no
   console errors, no broken flow. Drop matching filenames
   into /audio to bring the game to life.
   ============================================================ */

const SOUND_FILES = {
    click: 'audio/click.mp3',
    topping: 'audio/topping.mp3',
    sauce: 'audio/sauce.mp3',
    cheese: 'audio/cheese.mp3',
    ovenOpen: 'audio/oven-open.mp3',
    ovenClose: 'audio/oven-close.mp3',
    baking: 'audio/baking.mp3',
    success: 'audio/success.mp3',
    packing: 'audio/packing.mp3',
    delivery: 'audio/delivery.mp3',
    gameOver: 'audio/game-over.mp3'
};

const AudioManager = {
    cache: {},
    enabled: true,
    init(enabled) { this.enabled = enabled !== false; },
    play(name) {
        if (!this.enabled) return;
        try {
            const src = SOUND_FILES[name];
            if (!src) return;
            let audio = this.cache[name];
            if (!audio) {
                audio = new Audio(src);
                audio.volume = 0.5;
                this.cache[name] = audio;
            }
            const playPromise = audio.cloneNode().play();
            if (playPromise && playPromise.catch) playPromise.catch(() => { /* file missing/blocked — ignore */ });
        } catch (e) { /* never let sound break the game */ }
    }
};
