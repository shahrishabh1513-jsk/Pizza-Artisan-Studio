// Billing Page JavaScript

// Load bill data
document.addEventListener('DOMContentLoaded', function() {
    // Get data from session storage
    const ingredients = JSON.parse(sessionStorage.getItem('pizzaIngredients')) || {};
    const totalPoints = parseInt(sessionStorage.getItem('pizzaPoints')) || 5;
    
    // Display ingredients
    displayIngredients(ingredients);
    
    // Set total points
    document.getElementById('totalPoints').textContent = totalPoints;
    
    // Display mini pizza preview
    displayMiniPizza(ingredients);
    
    // Set rating stars
    setRatingStars(ingredients, totalPoints);
    
    // Set fun fact
    setFunFact(ingredients);
});

// Display ingredients in bill
function displayIngredients(ingredients) {
    const listContainer = document.getElementById('bill-ingredients-list');
    listContainer.innerHTML = '';
    
    const ingredientNames = {
        sauce: 'Sauce',
        cheese: 'Cheese',
        pepperoni: 'Pepperoni',
        olives: 'Olives',
        mushroom: 'Mushroom',
        pepper: 'Bell Pepper',
        onion: 'Onion',
        basil: 'Basil',
        tomato: 'Tomato'
    };
    
    let count = 0;
    
    for (let [key, value] of Object.entries(ingredients)) {
        if (value) {
            count++;
            const item = document.createElement('div');
            item.className = 'bill-item';
            item.innerHTML = `
                <div class="item-name">
                    <span class="item-dot"></span>
                    ${ingredientNames[key]}
                </div>
                <div class="item-points">
                    <span class="points-badge">+2 pts</span>
                </div>
            `;
            listContainer.appendChild(item);
        }
    }
    
    // Store count for fun fact
    sessionStorage.setItem('ingredientCount', count);
}

// Display mini pizza preview
function displayMiniPizza(ingredients) {
    // Sauce
    if (ingredients.sauce) {
        document.getElementById('mini-sauce').classList.add('active');
    }
    
    // Cheese
    if (ingredients.cheese) {
        document.getElementById('mini-cheese').classList.add('active');
    }
    
    // Toppings mini representation
    const toppingsContainer = document.getElementById('mini-toppings');
    toppingsContainer.innerHTML = '';
    
    const toppings = [];
    if (ingredients.pepperoni) toppings.push('pepperoni');
    if (ingredients.olives) toppings.push('olives');
    if (ingredients.mushroom) toppings.push('mushroom');
    if (ingredients.pepper) toppings.push('pepper');
    if (ingredients.onion) toppings.push('onion');
    if (ingredients.basil) toppings.push('basil');
    if (ingredients.tomato) toppings.push('tomato');
    
    toppings.forEach((topping, index) => {
        const dot = document.createElement('div');
        dot.className = 'mini-topping';
        
        // Position randomly but nicely
        const angle = (index / toppings.length) * Math.PI * 2;
        const radius = 40 + Math.random() * 10;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.transform = 'translate(-50%, -50%)';
        
        // Color based on topping
        if (topping === 'pepperoni') dot.style.background = '#dc143c';
        else if (topping === 'olives') dot.style.background = '#2e8b57';
        else if (topping === 'mushroom') dot.style.background = '#d2b48c';
        else if (topping === 'pepper') dot.style.background = '#32cd32';
        else if (topping === 'onion') dot.style.background = '#dda0dd';
        else if (topping === 'basil') dot.style.background = '#228b22';
        else if (topping === 'tomato') dot.style.background = '#ff4500';
        
        toppingsContainer.appendChild(dot);
    });
}

// Set rating stars
function setRatingStars(ingredients, totalPoints) {
    const starsContainer = document.getElementById('ratingStars');
    starsContainer.innerHTML = '';
    
    // Calculate rating (1-5 based on number of ingredients)
    const ingredientCount = Object.values(ingredients).filter(v => v).length;
    let rating = 1; // Minimum
    
    if (ingredientCount === 0) rating = 2;
    else if (ingredientCount <= 2) rating = 3;
    else if (ingredientCount <= 4) rating = 4;
    else if (ingredientCount >= 5) rating = 5;
    
    // Create stars
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= rating) {
            star.className = 'fas fa-star active';
        } else {
            star.className = 'far fa-star';
        }
        starsContainer.appendChild(star);
    }
}

// Set fun fact
function setFunFact(ingredients) {
    const funFactElement = document.getElementById('funFact');
    const count = Object.values(ingredients).filter(v => v).length;
    
    const facts = [
        `Your pizza has ${count} delicious toppings!`,
        `Did you know? Pizza was invented in Naples, Italy!`,
        `Your pizza would make a real Italian chef proud!`,
        `This pizza has ${count * 2 + 5} points of deliciousness!`,
        `The perfect pizza for a perfect day!`,
        `Mamma mia! That's a spicy pizza!`,
        `This pizza is topped with love and care!`
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    funFactElement.innerHTML = `<i class="fas fa-lightbulb"></i> <span>${randomFact}</span>`;
}

// Print bill
function printBill() {
    // Play sound (optional)
    // new Audio('sounds/bill-print.mp3').play().catch(e => {});
    
    window.print();
}