/* ============================================================
   PIZZA HOUSE — tiny shared UI helpers (toasts, confetti)
   ============================================================ */

function showToast(html, ms) {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    stack.appendChild(el);
    setTimeout(() => el.remove(), ms || 3200);
}

function announceAchievements(unlocked) {
    unlocked.forEach((a, i) => {
        setTimeout(() => showToast(`${a.icon} Achievement unlocked — <b>${a.label}</b>`, 4000), i * 500);
    });
}

function spawnConfetti(count) {
    const colors = ['#ffb347', '#ff7a3d', '#ffd166', '#59c97b', '#f6ece0'];
    for (let i = 0; i < (count || 60); i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
    }
}

function scorePopupAt(container, text, positive) {
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'score-popup ' + (positive ? 'positive' : 'negative');
    el.textContent = text;
    el.style.top = '40%';
    container.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}
