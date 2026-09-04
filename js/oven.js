/* ============================================================
   PIZZA HOUSE — Oven logic
   ============================================================ */

const save = loadSave();
AudioManager.init(save.soundOn);

const order = sGet('pzOrder', null);
const pizza = sGet('pzPizza', null);
if (!order || !pizza) window.location.href = 'index.html';

document.getElementById('idealTemp').textContent = order ? order.idealTemp : '--';

let selectedTemp = null;
let baking = false;
let startTime = null;
let rafId = null;
let finalProgress = null;

function renderTempRow() {
    const row = document.getElementById('tempRow');
    row.innerHTML = OVEN_TEMPS.map(t => `
        <div class="temp-btn ${selectedTemp === t ? 'selected' : ''}" data-temp="${t}">${t}°C</div>
    `).join('');
    row.querySelectorAll('.temp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (baking) return;
            selectedTemp = Number(btn.dataset.temp);
            document.getElementById('tempReadout').textContent = selectedTemp;
            AudioManager.play('click');
            renderTempRow();
        });
    });
}
renderTempRow();

function bakeDuration() {
    const size = SIZES[pizza.sizeKey];
    return BASE_BAKE_SECONDS + size.timeBonus * 0.5;
}

function bakeRate() {
    const diff = selectedTemp - order.idealTemp;
    return Math.min(1.6, Math.max(0.6, 1 + diff / 100));
}

function fmtTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function applyVisual(progress) {
    const pizzaEl = document.getElementById('ovenPizza');
    const ovenBox = document.getElementById('ovenBox');
    let filter = 'none';
    let word = 'Baking…';
    if (progress < 40) { filter = 'brightness(1.2) saturate(.7)'; word = 'Underbaked'; }
    else if (progress < 80) { filter = 'saturate(1.05)'; word = 'Good'; }
    else if (progress <= 100) { filter = 'sepia(.18) saturate(1.3) brightness(1.03)'; word = 'Perfect'; }
    else if (progress <= 130) { filter = 'sepia(.4) brightness(.88)'; word = 'Crispy'; }
    else { filter = 'brightness(.55) grayscale(.35)'; word = 'BURNING!'; }

    pizzaEl.style.filter = filter;
    document.getElementById('bakeWord').textContent = word;
    ovenBox.classList.toggle('burn-warning', progress > 115);
    document.getElementById('ovenRoom').classList.toggle('burn-warning', progress > 130);
}

function loop() {
    const elapsed = (performance.now() - startTime) / 1000;
    const duration = bakeDuration();
    const progress = (elapsed / duration) * 100 * bakeRate();

    document.getElementById('progressLabel').textContent = Math.round(progress) + '%';
    document.getElementById('bakeFill').style.width = Math.min(100, progress) + '%';
    document.getElementById('bakeFill').style.background = progress > 100
        ? 'linear-gradient(90deg, #e5484d, #ff7a3d)'
        : 'linear-gradient(90deg, var(--ember), var(--ember-2))';
    document.getElementById('timerText').textContent = '⏱ ' + fmtTime(elapsed);
    applyVisual(progress);

    if (progress >= 160) {
        finishBake(progress);
        return;
    }
    rafId = requestAnimationFrame(loop);
}

document.getElementById('btnStartBake').addEventListener('click', () => {
    if (!selectedTemp) { showToast('⚠️ Pick a temperature first'); return; }
    baking = true;
    startTime = performance.now();
    document.getElementById('btnStartBake').disabled = true;
    document.getElementById('btnTakeOut').disabled = false;
    AudioManager.play('ovenClose');
    loop();
});

document.getElementById('btnTakeOut').addEventListener('click', () => {
    const elapsed = (performance.now() - startTime) / 1000;
    const progress = (elapsed / bakeDuration()) * 100 * bakeRate();
    finishBake(progress);
});

function finishBake(progress) {
    if (finalProgress !== null) return; // guard against double-fire
    finalProgress = progress;
    cancelAnimationFrame(rafId);
    document.getElementById('btnTakeOut').disabled = true;
    document.getElementById('ovenRoom').classList.remove('burn-warning');

    const result = computeBakeResult(progress);
    sSet('pzOven', { progress });

    const box = document.getElementById('resultBox');
    box.style.display = 'block';
    document.getElementById('resultTitle').textContent =
        result.label === 'Perfect' ? '🎉 Perfectly baked!' :
        result.label === 'Burnt' ? '💀 Oh no, it burnt!' : `Pizza came out: ${result.label}`;
    document.getElementById('resultSub').textContent = `Bake score: ${result.score}/100`;

    AudioManager.play(result.label === 'Burnt' ? 'gameOver' : 'success');
    if (result.label === 'Perfect') spawnConfetti(50);
}

document.getElementById('btnToCutting').addEventListener('click', () => {
    window.location.href = 'packing.html';
});
