/* ============================================================
   PIZZA HOUSE — Customer Manager
   Generates a random customer + a matching order ticket.
   ============================================================ */

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateOrder(save) {
    const typeKeys = Object.keys(PIZZA_TYPES);
    const typeKey = pick(typeKeys);
    const type = PIZZA_TYPES[typeKey];
    const sizeKey = pick(Object.keys(SIZES));
    const size = SIZES[sizeKey];
    const extraCheese = Math.random() < 0.35;
    const personality = pick(CUSTOMER_PERSONALITIES);
    const name = pick(CUSTOMER_NAMES);

    // bigger pizzas + more toppings => more time
    const baseTime = 60;
    const timeLimit = baseTime + size.timeBonus + type.toppings.length * 4;

    save.orderCounter = (save.orderCounter || 1000) + 1;

    return {
        orderNumber: save.orderCounter,
        customerName: name,
        personality,
        pizzaTypeKey: typeKey,
        pizzaTypeLabel: type.label,
        sizeKey,
        sauceKey: type.sauce,
        cheeseKey: type.cheese,
        requiredToppings: [...type.toppings],
        extraCheese,
        idealTemp: type.idealTemp,
        timeLimit
    };
}
