/* ============================================================
   PIZZA HOUSE — Billing logic
   ============================================================ */

let save = loadSave();
AudioManager.init(save.soundOn);

const order = sGet('pzOrder', null);
const pizza = sGet('pzPizza', null);
const oven = sGet('pzOven', null);
const packing = sGet('pzPacking', null);
const timings = sGet('pzTimings', null);

if (!order || !pizza || !oven || !packing) {
    window.location.href = 'index.html';
}

const elapsedSec = timings && timings.start ? (Date.now() - timings.start) / 1000 : 60;
const bill = computeFinalBill(order, pizza, oven, packing, elapsedSec);

/* ---------- render bill ---------- */
document.getElementById('billSubtitle').textContent = `${order.personality.emoji} ${order.customerName} — Order #${order.orderNumber}`;
document.getElementById('billOrderTitle').textContent = `🍕 ${bill.size.label} ${order.pizzaTypeLabel}`;

const linesHtml = [
    `<div class="ticket-list-item"><span>Pizza Base (${bill.size.label})</span><span>₹${bill.size.price}</span></div>`,
    ...bill.toppingLines.map(l => `<div class="ticket-list-item"><span>${l.name} ×${l.qty}</span><span>₹${l.price}</span></div>`)
].join('');
document.getElementById('billLines').innerHTML = linesHtml;
document.getElementById('billSubtotal').textContent = '₹' + bill.subtotal;
document.getElementById('billTax').textContent = '₹' + bill.tax;
document.getElementById('billTotal').textContent = '₹' + bill.total;

function setBar(fillId, valId, pct) {
    document.getElementById(fillId).style.width = pct + '%';
    document.getElementById(valId).textContent = pct + '%';
}
setBar('rbAccuracy', 'rbAccuracyVal', bill.accuracy);
setBar('rbBake', 'rbBakeVal', bill.bake.score);
setBar('rbPack', 'rbPackVal', bill.packScore);
setBar('rbSpeed', 'rbSpeedVal', bill.speedScore);

document.getElementById('starsOut').textContent = '⭐'.repeat(bill.stars) + '☆'.repeat(5 - bill.stars);
document.getElementById('rewardScore').textContent = bill.score;
document.getElementById('rewardMoney').textContent = '₹' + bill.moneyEarned;
document.getElementById('rewardXP').textContent = '+' + bill.xpEarned;

/* ---------- update permanent save (once per load) ---------- */
save.money += bill.moneyEarned;
save.xp += bill.xpEarned;
save.ordersCompleted += 1;
save.totalPizzas += 1;
save.ratingSum += bill.stars;
save.ratingCount += 1;
save.highScore = Math.max(save.highScore, bill.score);
if (bill.stars === 5) save.fiveStarCount = (save.fiveStarCount || 0) + 1;

const unlocked = checkAchievements(save);
writeSave(save);

if (bill.stars >= 4) spawnConfetti(70);
AudioManager.play(bill.stars >= 4 ? 'success' : 'delivery');
announceAchievements(unlocked);

document.getElementById('btnPrintBill').addEventListener('click', () => window.print());
document.getElementById('btnNextOrder').addEventListener('click', () => {
    sClearOrder();
    window.location.href = 'index.html';
});
