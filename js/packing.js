/* ============================================================
   PIZZA HOUSE — Packing logic
   ============================================================ */

const save = loadSave();
AudioManager.init(save.soundOn);

const order = sGet('pzOrder', null);
const pizza = sGet('pzPizza', null);
const oven = sGet('pzOven', null);
if (!order || !pizza || !oven) window.location.href = 'index.html';

const packing = { napkins: false, sauce: false, sticker: false, name: false, sliceCount: null, boxName: '' };

/* ---------- slices ---------- */
function renderSliceRow() {
    const row = document.getElementById('sliceRow');
    row.innerHTML = SLICE_OPTIONS.map(n => `
        <div class="slice-btn ${packing.sliceCount === n ? 'selected' : ''}" data-n="${n}">${n} slices</div>
    `).join('');
    row.querySelectorAll('.slice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            packing.sliceCount = Number(btn.dataset.n);
            AudioManager.play('click');
            renderSliceRow();
            renderCutLines();
        });
    });
}

function renderCutLines() {
    const wrap = document.getElementById('cutLines');
    wrap.innerHTML = '';
    if (!packing.sliceCount) return;
    const diameters = packing.sliceCount / 2;
    for (let i = 0; i < diameters; i++) {
        const line = document.createElement('div');
        line.className = 'cut-line';
        line.style.transform = `rotate(${(180 / diameters) * i}deg)`;
        wrap.appendChild(line);
    }
}

/* ---------- packing steps ---------- */
document.querySelectorAll('.pack-step').forEach(btn => {
    btn.addEventListener('click', () => {
        const step = btn.dataset.step;
        packing[step] = !packing[step];
        btn.classList.toggle('done', packing[step]);
        AudioManager.play('packing');
        checkCloseEnabled();
    });
});

/* ---------- name printing ---------- */
document.getElementById('nameInput').value = order ? order.customerName : '';

document.getElementById('btnPrintName').addEventListener('click', () => {
    const nameVal = document.getElementById('nameInput').value.trim() || (order ? order.customerName : 'Guest');
    const wrap = document.getElementById('printProgressWrap');
    const fill = document.getElementById('printFill');
    wrap.style.display = 'block';
    let pct = 0;
    const timer = setInterval(() => {
        pct += 10;
        fill.style.width = pct + '%';
        if (pct >= 100) {
            clearInterval(timer);
            packing.boxName = nameVal;
            packing.name = true;
            const nameEl = document.getElementById('boxName');
            nameEl.textContent = nameVal + ' ❤️';
            nameEl.classList.add('printed');
            document.getElementById('boxSub').textContent =
                `${order.pizzaTypeLabel} · ${SIZES[pizza.sizeKey].label} · Order #${order.orderNumber}`;
            showToast('✨ Name printed!');
            checkCloseEnabled();
        }
    }, 80);
});

function checkCloseEnabled() {
    const ready = packing.napkins && packing.sauce && packing.sticker && packing.name && packing.sliceCount;
    document.getElementById('btnCloseBox').disabled = !ready;
}

document.getElementById('btnCloseBox').addEventListener('click', () => {
    if (document.getElementById('btnCloseBox').disabled) return;
    sSet('pzPacking', packing);
    AudioManager.play('delivery');
    window.location.href = 'billing.html';
});

renderSliceRow();
renderCutLines();
