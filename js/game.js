/* ============================================================
   PIZZA HOUSE — Main Menu / Dashboard logic
   ============================================================ */

let save = loadSave();
AudioManager.init(save.soundOn);

function renderDashboard() {
    document.getElementById('statMoney').textContent = '₹' + save.money;
    document.getElementById('statOrders').textContent = save.ordersCompleted;

    const { level, title, xpIntoLevel, xpForNext } = levelFromXP(save.xp);
    document.getElementById('statLevel').textContent = level;
    document.getElementById('statTitle').textContent = title;

    document.getElementById('dashMoney').textContent = '₹' + save.money;
    document.getElementById('dashOrders').textContent = save.ordersCompleted;
    document.getElementById('dashPizzas').textContent = save.totalPizzas;
    document.getElementById('dashHigh').textContent = save.highScore;
    document.getElementById('dashXP').textContent = save.xp;
    const avgRating = save.ratingCount ? (save.ratingSum / save.ratingCount).toFixed(1) : '–';
    document.getElementById('dashRating').textContent = avgRating;

    document.getElementById('levelLabel').textContent = `Level ${level} — ${title}`;
    document.getElementById('xpLabel').textContent = `${xpIntoLevel} / ${xpForNext} XP`;
    document.getElementById('xpFill').style.width = Math.round((xpIntoLevel / xpForNext) * 100) + '%';

    const strip = document.getElementById('achvStrip');
    strip.innerHTML = '';
    save.achievements.slice(-4).forEach(key => {
        const a = ACHIEVEMENTS[key];
        if (!a) return;
        const badge = document.createElement('div');
        badge.className = 'achv-badge';
        badge.innerHTML = `${a.icon} ${a.label}`;
        strip.appendChild(badge);
    });
}

function renderTicket(order) {
    const wrap = document.getElementById('orderTicketWrap');
    const toppingsHtml = order.requiredToppings.map(t => {
        const info = TOPPINGS[t];
        return `<div class="ticket-list-item"><span>${info.emoji} ${info.label}</span></div>`;
    }).join('');

    wrap.innerHTML = `
        <div class="ticket">
            <div class="ticket-title">🍕 ORDER #${order.orderNumber}</div>
            <div class="ticket-row"><span>Customer</span><span>${order.personality.emoji} ${order.customerName}</span></div>
            <div class="ticket-row"><span>Pizza</span><span>${order.pizzaTypeLabel}</span></div>
            <div class="ticket-row"><span>Size</span><span>${SIZES[order.sizeKey].label} (${SIZES[order.sizeKey].inches}")</span></div>
            <div class="ticket-row"><span>Sauce</span><span>${SAUCES[order.sauceKey].label}</span></div>
            <div class="ticket-row"><span>Cheese</span><span>${CHEESES[order.cheeseKey].label}</span></div>
            <div class="ticket-divider"></div>
            ${toppingsHtml}
            <div class="ticket-divider"></div>
            <div class="ticket-row"><span>Extra Cheese</span><span>${order.extraCheese ? 'YES' : 'no'}</span></div>
            <div class="ticket-row"><span>Time Limit</span><span>${order.timeLimit}s</span></div>
        </div>
    `;
    wrap.style.display = 'block';
}

document.getElementById('btnNewOrder').addEventListener('click', () => {
    AudioManager.play('click');
    const order = generateOrder(save);
    writeSave(save);
    sSet('pzOrder', order);
    renderTicket(order);
    document.getElementById('btnNewOrder').textContent = '🎫 New Order (replace)';
    document.getElementById('btnStartCooking').style.display = 'inline-flex';
    renderDashboard();
});

document.getElementById('btnStartCooking').addEventListener('click', () => {
    const order = sGet('pzOrder', null);
    if (!order) return;
    sSet('pzTimings', { start: Date.now() });
    sSet('pzPizza', null);
    sSet('pzPacking', null);
    window.location.href = 'kitchen.html';
});

document.getElementById('btnHowTo').addEventListener('click', () => document.getElementById('howToModal').classList.add('open'));
document.getElementById('closeHowTo').addEventListener('click', () => document.getElementById('howToModal').classList.remove('open'));

document.getElementById('btnAchievements').addEventListener('click', () => {
    const list = document.getElementById('achvList');
    list.innerHTML = Object.keys(ACHIEVEMENTS).map(key => {
        const a = ACHIEVEMENTS[key];
        const unlocked = save.achievements.includes(key);
        return `<li style="opacity:${unlocked ? 1 : .4}">${a.icon} ${a.label} ${unlocked ? '✅' : ''}</li>`;
    }).join('');
    document.getElementById('achvModal').classList.add('open');
});
document.getElementById('closeAchv').addEventListener('click', () => document.getElementById('achvModal').classList.remove('open'));

document.getElementById('btnResetAll').addEventListener('click', () => {
    if (confirm('This will permanently erase ALL restaurant progress (money, XP, achievements). Continue?')) {
        resetAllProgress();
        save = loadSave();
        renderDashboard();
        document.getElementById('orderTicketWrap').style.display = 'none';
        document.getElementById('btnStartCooking').style.display = 'none';
        document.getElementById('btnNewOrder').textContent = '🎫 New Order';
        showToast('🗑 Progress reset');
    }
});

// If an order is already pending (came back from menu mid-flow), show it again
(function restorePendingOrder() {
    const order = sGet('pzOrder', null);
    if (order) {
        renderTicket(order);
        document.getElementById('btnNewOrder').textContent = '🎫 New Order (replace)';
        document.getElementById('btnStartCooking').style.display = 'inline-flex';
    }
})();

renderDashboard();
