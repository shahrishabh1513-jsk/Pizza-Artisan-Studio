/* ============================================================
   PIZZA HOUSE — Kitchen logic
   Stages: size -> dough -> sauce -> cheese -> toppings
   ============================================================ */

const save = loadSave();
AudioManager.init(save.soundOn);
document.getElementById('statMoney').textContent = '₹' + save.money;

const order = sGet('pzOrder', null);
if (!order) {
    window.location.href = 'index.html';
}

const STAGES = ['size', 'dough', 'sauce', 'cheese', 'toppings'];
let stageIndex = 0;

const pizzaState = {
    sizeKey: null,
    doughQuality: null,
    sauceKey: null,
    sauceCoverage: 0,
    cheeseKey: null,
    toppings: {}
};

let painting = false;

/* ---------- ticket recap ---------- */
function renderRecap() {
    const t = document.getElementById('orderRecap');
    const reqTop = order.requiredToppings.map(k => `${TOPPINGS[k].emoji} ${TOPPINGS[k].label}`).join(', ');
    t.innerHTML = `
        <div class="ticket-title">ORDER #${order.orderNumber}</div>
        <div class="ticket-row"><span>${order.personality.emoji} ${order.customerName}</span><span>${order.timeLimit}s</span></div>
        <div class="ticket-row"><span>${order.pizzaTypeLabel}</span><span>${SIZES[order.sizeKey].label}</span></div>
        <div class="ticket-row"><span>Sauce</span><span>${SAUCES[order.sauceKey].label}</span></div>
        <div class="ticket-row"><span>Cheese</span><span>${CHEESES[order.cheeseKey].label}</span></div>
        <div class="ticket-divider"></div>
        <div style="font-size:.78rem;">${reqTop}</div>
        ${order.extraCheese ? '<div class="ticket-divider"></div><div class="ticket-row"><span>+ Extra Cheese</span><span>✓</span></div>' : ''}
    `;
}

/* ---------- stage tabs ---------- */
function renderTabs() {
    const wrap = document.getElementById('stageTabs');
    wrap.innerHTML = STAGES.map((s, i) => {
        const cls = i === stageIndex ? 'active' : (i < stageIndex ? 'done' : '');
        const labels = { size: '1. Size', dough: '2. Dough', sauce: '3. Sauce', cheese: '4. Cheese', toppings: '5. Toppings' };
        return `<div class="stage-tab ${cls}">${labels[s]}</div>`;
    }).join('');
}

/* ---------- pizza visual ---------- */
function renderPizzaVisual() {
    const canvas = document.getElementById('pizzaCanvas');
    const scale = pizzaState.sizeKey ? SIZES[pizzaState.sizeKey].scale : 0.7;
    canvas.style.transform = `scale(${scale})`;

    const sauceEl = document.getElementById('sauceLayerEl');
    if (pizzaState.sauceKey) {
        sauceEl.style.background = `radial-gradient(circle at 35% 30%, ${SAUCES[pizzaState.sauceKey].color}, ${SAUCES[pizzaState.sauceKey].color})`;
        sauceEl.style.opacity = Math.min(1, pizzaState.sauceCoverage / 100) * 0.85;
    } else {
        sauceEl.style.opacity = 0;
    }

    const cheeseEl = document.getElementById('cheeseLayerEl');
    if (pizzaState.cheeseKey) {
        cheeseEl.style.background = `radial-gradient(circle at 40% 40%, ${CHEESES[pizzaState.cheeseKey].color}, ${CHEESES[pizzaState.cheeseKey].color})`;
        cheeseEl.style.opacity = 0.65;
    } else {
        cheeseEl.style.opacity = 0;
    }
}

function renderToppingDots() {
    const layer = document.getElementById('toppingsLayerEl');
    layer.innerHTML = '';
    Object.keys(pizzaState.toppings).forEach(key => {
        (pizzaState.toppings[key].positions || []).forEach(pos => {
            const dot = document.createElement('div');
            dot.className = 'topping-dot';
            dot.style.left = pos.x + '%';
            dot.style.top = pos.y + '%';
            dot.style.background = TOPPINGS[key].color + 'cc';
            dot.textContent = TOPPINGS[key].emoji;
            dot.title = 'Click to remove';
            dot.addEventListener('click', () => removeTopping(key, pos));
            layer.appendChild(dot);
        });
    });
}

/* ---------- toppings ---------- */
function toppingCount(key) { return (pizzaState.toppings[key] && pizzaState.toppings[key].positions.length) || 0; }

function addToppingAt(key, xPct, yPct) {
    const max = TOPPINGS[key].max;
    if (toppingCount(key) >= max) { showToast('⚠️ Max ' + TOPPINGS[key].label + ' reached'); return; }
    if (!pizzaState.toppings[key]) pizzaState.toppings[key] = { positions: [] };
    pizzaState.toppings[key].positions.push({ x: xPct, y: yPct });
    AudioManager.play('topping');
    renderToppingDots();
    renderIngredientTray();
}

function addToppingRandom(key) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 32; // stays inside crust
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    addToppingAt(key, x, y);
}

function removeTopping(key, pos) {
    const arr = pizzaState.toppings[key].positions;
    const idx = arr.indexOf(pos);
    if (idx > -1) arr.splice(idx, 1);
    renderToppingDots();
    renderIngredientTray();
}

function clampToCircle(clientX, clientY, rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx, dy = clientY - cy;
    const maxR = rect.width * 0.42;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxR) { const ratio = maxR / dist; dx *= ratio; dy *= ratio; }
    const xPct = 50 + (dx / rect.width) * 100;
    const yPct = 50 + (dy / rect.height) * 100;
    return { xPct, yPct };
}

function renderIngredientTray() {
    const container = document.getElementById('stageContent');
    const tray = container.querySelector('.ingredient-tray');
    if (!tray) return;
    tray.querySelectorAll('.ing-card').forEach(card => {
        const key = card.dataset.key;
        const count = toppingCount(key);
        const max = TOPPINGS[key].max;
        card.classList.toggle('maxed', count >= max);
        const countEl = card.querySelector('.count');
        if (countEl) countEl.textContent = count > 0 ? `${count}/${max}` : `0/${max}`;
    });
}

/* ---------- stage renderers ---------- */
function renderStage() {
    renderTabs();
    const stage = STAGES[stageIndex];
    const content = document.getElementById('stageContent');
    const caption = document.getElementById('canvasCaption');

    if (stage === 'size') {
        caption.textContent = 'Choose the size the customer ordered';
        content.innerHTML = `
            <h2>📏 Pizza Size</h2>
            <p class="hint">Order calls for: <b>${SIZES[order.sizeKey].label}</b></p>
            <div class="size-grid">
                ${Object.values(SIZES).map(s => `
                    <div class="choice-card ${pizzaState.sizeKey === s.key ? 'selected' : ''}" data-size="${s.key}">
                        <div class="big">🍕</div>
                        <div class="lbl">${s.label}</div>
                        <div class="sub">${s.inches}" · ₹${s.price}</div>
                    </div>
                `).join('')}
            </div>
        `;
        content.querySelectorAll('[data-size]').forEach(card => {
            card.addEventListener('click', () => {
                pizzaState.sizeKey = card.dataset.size;
                AudioManager.play('click');
                renderStage();
                renderPizzaVisual();
            });
        });
    }

    if (stage === 'dough') {
        caption.textContent = 'Stretch the dough into the target zone, then confirm';
        const target = { min: 55, max: 85 };
        content.innerHTML = `
            <h2>🥣 Prepare the Dough</h2>
            <p class="hint">Drag the slider so the marker lands in the green zone.</p>
            <div class="stretch-zone">
                <div class="target-band" style="left:${target.min}%; width:${target.max - target.min}%;"></div>
                <input type="range" min="0" max="100" value="50" id="doughRange">
            </div>
            <p class="helper-text" id="doughFeedback">${pizzaState.doughQuality !== null ? `Dough quality: <b>${pizzaState.doughQuality}%</b>` : 'Not stretched yet'}</p>
            <div class="order-actions">
                <button class="btn btn-primary" id="confirmDough">✅ Confirm Stretch</button>
            </div>
        `;
        document.getElementById('confirmDough').addEventListener('click', () => {
            const val = Number(document.getElementById('doughRange').value);
            const center = (target.min + target.max) / 2;
            const distance = Math.abs(val - center);
            const quality = Math.max(20, Math.round(100 - distance * 2));
            pizzaState.doughQuality = quality;
            AudioManager.play('click');
            const msg = quality >= 85 ? '🎉 Perfect dough!' : quality >= 60 ? '👍 Decent dough' : '⚠️ Uneven Dough!';
            document.getElementById('doughFeedback').innerHTML = `${msg} — quality <b>${quality}%</b>`;
            showToast(msg);
        });
    }

    if (stage === 'sauce') {
        caption.textContent = 'Choose a sauce, then click & drag across the pizza to spread it';
        content.innerHTML = `
            <h2>🍅 Sauce</h2>
            <p class="hint">Order calls for: <b>${SAUCES[order.sauceKey].label}</b></p>
            <div class="choice-grid">
                ${Object.values(SAUCES).map(s => `
                    <div class="choice-card ${pizzaState.sauceKey === s.key ? 'selected' : ''}" data-sauce="${s.key}" style="border-color:${pizzaState.sauceKey === s.key ? s.color : 'transparent'}">
                        <div class="big">🍅</div>
                        <div class="lbl">${s.label}</div>
                    </div>
                `).join('')}
            </div>
            <div class="coverage-meter">
                <div class="helper-text">Coverage: <b id="coverageLabel">${Math.round(pizzaState.sauceCoverage)}%</b> — <span id="coverageWord"></span></div>
                <div class="meter-track"><div class="meter-fill" id="coverageFill" style="width:${pizzaState.sauceCoverage}%"></div></div>
            </div>
            <p class="helper-text">👆 Click and drag on the pizza itself to paint the sauce on.</p>
        `;
        content.querySelectorAll('[data-sauce]').forEach(card => {
            card.addEventListener('click', () => {
                pizzaState.sauceKey = card.dataset.sauce;
                AudioManager.play('sauce');
                renderStage();
                renderPizzaVisual();
            });
        });
        updateCoverageUI();
    }

    if (stage === 'cheese') {
        caption.textContent = 'Pick the cheese to melt over the sauce';
        content.innerHTML = `
            <h2>🧀 Cheese</h2>
            <p class="hint">Order calls for: <b>${CHEESES[order.cheeseKey].label}</b></p>
            <div class="choice-grid">
                ${Object.values(CHEESES).map(c => `
                    <div class="choice-card ${pizzaState.cheeseKey === c.key ? 'selected' : ''}" data-cheese="${c.key}">
                        <div class="big">🧀</div>
                        <div class="lbl">${c.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
        content.querySelectorAll('[data-cheese]').forEach(card => {
            card.addEventListener('click', () => {
                pizzaState.cheeseKey = card.dataset.cheese;
                AudioManager.play('cheese');
                renderStage();
                renderPizzaVisual();
            });
        });
    }

    if (stage === 'toppings') {
        caption.textContent = 'Drag a topping onto the pizza, or tap it to sprinkle one on';
        content.innerHTML = `
            <h2>🌶️ Toppings</h2>
            <p class="hint">Order needs: ${order.requiredToppings.map(k => TOPPINGS[k].label).join(', ')}${order.extraCheese ? ' + Extra Cheese' : ''}</p>
            <div class="ingredient-tray">
                ${Object.values(TOPPINGS).map(t => `
                    <div class="ing-card ${order.requiredToppings.includes(t.key) || (t.key === 'extracheese' && order.extraCheese) ? 'required' : ''}" draggable="true" data-key="${t.key}">
                        <span class="emoji">${t.emoji}</span>
                        <span>${t.label}</span><br>
                        <span class="count">0/${t.max}</span>
                    </div>
                `).join('')}
            </div>
            <p class="helper-text">Ingredients outlined in orange are on the order ticket.</p>
        `;
        content.querySelectorAll('.ing-card').forEach(card => {
            card.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', card.dataset.key);
            });
            card.addEventListener('click', () => {
                if (toppingCount(card.dataset.key) >= TOPPINGS[card.dataset.key].max) {
                    showToast('⚠️ Max ' + TOPPINGS[card.dataset.key].label + ' reached');
                    return;
                }
                addToppingRandom(card.dataset.key);
            });
        });
        renderIngredientTray();
    }

    document.getElementById('btnBack').disabled = stageIndex === 0;
    document.getElementById('btnNext').textContent = stageIndex === STAGES.length - 1 ? '🔥 Send to Oven' : 'Next →';
}

function updateCoverageUI() {
    const label = document.getElementById('coverageLabel');
    const fill = document.getElementById('coverageFill');
    const word = document.getElementById('coverageWord');
    if (!label) return;
    label.textContent = Math.round(pizzaState.sauceCoverage) + '%';
    fill.style.width = pizzaState.sauceCoverage + '%';
    word.textContent = computeSauceLabel(pizzaState.sauceCoverage).label;
}

/* ---------- drag & drop + sauce painting on the canvas ---------- */
const canvas = document.getElementById('pizzaCanvas');

canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
    e.preventDefault();
    if (STAGES[stageIndex] !== 'toppings') return;
    const key = e.dataTransfer.getData('text/plain');
    if (!key || !TOPPINGS[key]) return;
    const rect = canvas.getBoundingClientRect();
    const { xPct, yPct } = clampToCircle(e.clientX, e.clientY, rect);
    addToppingAt(key, xPct, yPct);
});

function paintSauce(clientX, clientY) {
    if (STAGES[stageIndex] !== 'sauce' || !pizzaState.sauceKey) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((clientX - cx) ** 2 + (clientY - cy) ** 2);
    if (dist > rect.width * 0.5) return;
    pizzaState.sauceCoverage = Math.min(100, pizzaState.sauceCoverage + 2.2);
    updateCoverageUI();
    renderPizzaVisual();
}

canvas.addEventListener('pointerdown', e => { painting = true; paintSauce(e.clientX, e.clientY); });
window.addEventListener('pointerup', () => { painting = false; });
canvas.addEventListener('pointermove', e => { if (painting) paintSauce(e.clientX, e.clientY); });

/* ---------- navigation ---------- */
document.getElementById('btnBack').addEventListener('click', () => {
    if (stageIndex > 0) { stageIndex--; renderStage(); }
});

document.getElementById('btnNext').addEventListener('click', () => {
    const stage = STAGES[stageIndex];
    if (stage === 'size' && !pizzaState.sizeKey) { showToast('⚠️ Pick a size first'); return; }
    if (stage === 'dough' && pizzaState.doughQuality === null) { showToast('⚠️ Confirm the dough stretch first'); return; }
    if (stage === 'sauce' && !pizzaState.sauceKey) { showToast('⚠️ Pick a sauce first'); return; }
    if (stage === 'cheese' && !pizzaState.cheeseKey) { showToast('⚠️ Pick a cheese first'); return; }

    if (stageIndex === STAGES.length - 1) {
        // finalize and send to oven
        const toppingCounts = {};
        Object.keys(pizzaState.toppings).forEach(k => { toppingCounts[k] = pizzaState.toppings[k].positions.length; });
        const finalPizza = {
            sizeKey: pizzaState.sizeKey,
            doughQuality: pizzaState.doughQuality,
            sauceKey: pizzaState.sauceKey,
            sauceCoverage: pizzaState.sauceCoverage,
            cheeseKey: pizzaState.cheeseKey,
            toppings: toppingCounts
        };
        sSet('pzPizza', finalPizza);
        AudioManager.play('ovenOpen');
        window.location.href = 'oven.html';
        return;
    }

    stageIndex++;
    renderStage();
});

/* ---------- init ---------- */
renderRecap();
renderStage();
renderPizzaVisual();
