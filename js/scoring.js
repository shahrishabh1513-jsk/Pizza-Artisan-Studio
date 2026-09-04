/* ============================================================
   PIZZA HOUSE — Scoring Manager
   Turns a finished pizza + order into an accuracy %, a bake
   quality label, a star rating, money and XP.
   ============================================================ */

function computeAccuracy(order, pizza) {
    const required = order.requiredToppings;
    let matched = 0;
    required.forEach(t => { if ((pizza.toppings[t] || 0) > 0) matched++; });
    const requiredScore = required.length ? (matched / required.length) : 1;

    // extra, unordered toppings cost a little accuracy (customer got something they didn't ask for)
    const extraKeys = Object.keys(pizza.toppings).filter(k => pizza.toppings[k] > 0 && !required.includes(k));
    const extraPenalty = Math.min(0.3, extraKeys.length * 0.06);

    const sauceMatch = pizza.sauceKey === order.sauceKey ? 1 : 0.5;
    const cheeseMatch = pizza.cheeseKey === order.cheeseKey ? 1 : 0.6;
    const sizeMatch = pizza.sizeKey === order.sizeKey ? 1 : 0.4;
    const extraCheeseMatch = (!!order.extraCheese === !!pizza.toppings.extracheese) ? 1 : 0.7;

    const composite =
        requiredScore * 0.40 +
        sauceMatch * 0.15 +
        cheeseMatch * 0.15 +
        sizeMatch * 0.20 +
        extraCheeseMatch * 0.10;

    const accuracyPct = Math.max(0, Math.round((composite - extraPenalty) * 100));
    return Math.min(100, accuracyPct);
}

function computeSauceLabel(coverage) {
    if (coverage >= 80) return { label: 'Excellent', score: 100 };
    if (coverage >= 60) return { label: 'Good', score: 80 };
    if (coverage >= 40) return { label: 'Poor', score: 50 };
    return { label: 'Bad', score: 20 };
}

function computeBakeResult(progress) {
    // progress: 0-100 normal bake, >100 means left in too long
    if (progress < 40) return { label: 'Underbaked', score: Math.round(progress * 1.5), css: 'pale' };
    if (progress < 80) return { label: 'Good', score: Math.round(60 + (progress - 40) * 0.5), css: 'good' };
    if (progress <= 100) return { label: 'Perfect', score: Math.round(90 + (progress - 80) * 0.5), css: 'perfect' };
    if (progress <= 130) return { label: 'Crispy', score: Math.max(30, Math.round(100 - (progress - 100) * 2)), css: 'crispy' };
    return { label: 'Burnt', score: Math.max(0, Math.round(40 - (progress - 130))), css: 'burnt' };
}

function computeSpeedScore(elapsedSec, timeLimit) {
    if (elapsedSec <= timeLimit * 0.7) return 100;
    if (elapsedSec <= timeLimit) return 80;
    if (elapsedSec <= timeLimit * 1.3) return 50;
    return 20;
}

function computePackScore(packing) {
    const steps = ['napkins', 'sauce', 'sticker', 'name'];
    const done = steps.filter(s => packing[s]).length;
    return Math.round((done / steps.length) * 100);
}

function starsFromPercent(pct) {
    return Math.max(1, Math.min(5, Math.round(pct / 20)));
}

function computeFinalBill(order, pizza, oven, packing, elapsedSec) {
    const accuracy = computeAccuracy(order, pizza);
    const bake = computeBakeResult(oven.progress);
    const packScore = computePackScore(packing);
    const speedScore = computeSpeedScore(elapsedSec, order.timeLimit);

    const finalPct = Math.round(
        accuracy * 0.35 +
        bake.score * 0.30 +
        packScore * 0.15 +
        speedScore * 0.20
    );

    const stars = starsFromPercent(finalPct);

    const size = SIZES[pizza.sizeKey];
    const toppingLines = Object.keys(pizza.toppings)
        .filter(k => pizza.toppings[k] > 0)
        .map(k => ({
            name: TOPPINGS[k].label,
            qty: pizza.toppings[k],
            price: TOPPINGS[k].price * pizza.toppings[k]
        }));

    const toppingsTotal = toppingLines.reduce((sum, l) => sum + l.price, 0);
    const subtotal = size.price + toppingsTotal;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const payoutFactor = Math.max(0.2, finalPct / 100);
    const moneyEarned = Math.round(total * payoutFactor);
    const xpEarned = Math.round(finalPct * 1.2) + (stars === 5 ? 20 : 0);
    const score = Math.round(finalPct * 10);

    return {
        accuracy, bake, packScore, speedScore, finalPct, stars,
        size, toppingLines, subtotal, tax, total,
        moneyEarned, xpEarned, score
    };
}
