/* ============================================================
   PIZZA HOUSE — Storage Manager
   localStorage  -> permanent restaurant progress
   sessionStorage -> the pizza currently being cooked
   ============================================================ */

const SAVE_KEY = 'pizzaHouse_save_v1';

const DEFAULT_SAVE = {
    money: 1000,
    xp: 0,
    ordersCompleted: 0,
    totalPizzas: 0,
    ratingSum: 0,
    ratingCount: 0,
    highScore: 0,
    orderCounter: 1000,
    achievements: [],
    soundOn: true,
    musicOn: true
};

const ACHIEVEMENTS = {
    first_pizza:   { label: 'First Pizza',        icon: '🍕', check: s => s.totalPizzas >= 1 },
    five_orders:   { label: 'Getting the Hang',   icon: '🏅', check: s => s.ordersCompleted >= 5 },
    ten_orders:    { label: '10 Orders',          icon: '🏆', check: s => s.ordersCompleted >= 10 },
    fifty_orders:  { label: '50 Orders',          icon: '🏆', check: s => s.ordersCompleted >= 50 },
    hundred_orders:{ label: '100 Orders',         icon: '🏆', check: s => s.ordersCompleted >= 100 },
    millionaire:   { label: 'Pizza Millionaire',  icon: '💰', check: s => s.money >= 10000 },
    five_star_x10: { label: '10 Five-Star Reviews', icon: '⭐', check: s => (s.fiveStarCount || 0) >= 10 }
};

function safeParse(raw, fallback) {
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
        return fallback;
    }
}

function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return { ...DEFAULT_SAVE };
        return { ...DEFAULT_SAVE, ...safeParse(raw, {}) };
    } catch (e) {
        return { ...DEFAULT_SAVE };
    }
}

function writeSave(save) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
        console.warn('Could not save progress (localStorage unavailable).');
    }
}

function levelFromXP(xp) {
    const level = Math.floor(xp / 500) + 1;
    const titles = ['Beginner Chef', 'Pizza Maker', 'Kitchen Pro', 'Master Chef', 'Pizza Legend'];
    const title = titles[Math.min(level - 1, titles.length - 1)];
    const xpIntoLevel = xp % 500;
    return { level, title, xpIntoLevel, xpForNext: 500 };
}

function checkAchievements(save) {
    const unlocked = [];
    ACHIEVEMENTS_KEYS().forEach(key => {
        if (!save.achievements.includes(key) && ACHIEVEMENTS[key].check(save)) {
            save.achievements.push(key);
            unlocked.push({ key, ...ACHIEVEMENTS[key] });
        }
    });
    return unlocked;
}
function ACHIEVEMENTS_KEYS() { return Object.keys(ACHIEVEMENTS); }

// ---------- session (per-order) helpers ----------
function sGet(key, fallback) {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? safeParse(raw, fallback) : fallback;
    } catch (e) { return fallback; }
}
function sSet(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}
function sClearOrder() {
    ['pzOrder', 'pzPizza', 'pzTimings', 'pzPacking', 'pzOven'].forEach(k => {
        try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ }
    });
}

function resetAllProgress() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    sClearOrder();
}
