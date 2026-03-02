// Pizza Game Main JavaScript

// Global variables
let selectedIngredients = {
    sauce: false,
    cheese: false,
    pepperoni: false,
    olives: false,
    mushroom: false,
    pepper: false,
    onion: false,
    basil: false,
    tomato: false
};

let pizzaPoints = 5; // Base points

// Initialize loader
function initLoader() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hide');
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('main').style.display = 'block';
        }, 500);
    }, 3000);
}

// Toggle ingredient
function toggleIngredient(ingredient) {
    // Play sound (optional - would need actual sound file)
    // new Audio('sounds/ingredient-add.mp3').play().catch(e => {});
    
    // Toggle state
    selectedIngredients[ingredient] = !selectedIngredients[ingredient];
    
    // Update UI
    updateIngredientUI(ingredient);
    updatePizzaDisplay(ingredient);
    calculatePoints();
    
    // Add visual feedback
    addIngredientFeedback(ingredient);
}

// Update ingredient button UI
function updateIngredientUI(ingredient) {
    const element = document.getElementById(`ing-${ingredient}`);
    const layer = document.getElementById(`${ingredient}-layer`);
    
    if (selectedIngredients[ingredient]) {
        element.classList.add('active');
        if (layer) {
            layer.classList.add('active');
            
            // Activate all topping items in this layer
            const toppingItems = layer.querySelectorAll('.topping-item');
            toppingItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 50);
            });
        }
    } else {
        element.classList.remove('active');
        if (layer) {
            layer.classList.remove('active');
            
            // Deactivate all topping items
            const toppingItems = layer.querySelectorAll('.topping-item');
            toppingItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
}

// Update pizza display (for sauce/cheese which are div layers)
function updatePizzaDisplay(ingredient) {
    if (ingredient === 'sauce') {
        const sauceLayer = document.getElementById('sauce-layer');
        if (selectedIngredients.sauce) {
            sauceLayer.classList.add('active');
        } else {
            sauceLayer.classList.remove('active');
        }
    }
    
    if (ingredient === 'cheese') {
        const cheeseLayer = document.getElementById('cheese-layer');
        if (selectedIngredients.cheese) {
            cheeseLayer.classList.add('active');
        } else {
            cheeseLayer.classList.remove('active');
        }
    }
}

// Add visual feedback
function addIngredientFeedback(ingredient) {
    const element = document.getElementById(`ing-${ingredient}`);
    
    // Create particle effect
    for (let i = 0; i < 5; i++) {
        createParticle(element);
    }
    
    // Update score with pop animation
    const scoreElement = document.getElementById('pizzaPoints');
    scoreElement.classList.add('score-pop');
    setTimeout(() => {
        scoreElement.classList.remove('score-pop');
    }, 300);
}

// Create floating particle
function createParticle(element) {
    const rect = element.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + rect.height / 2 + 'px';
    particle.style.background = `hsl(${Math.random() * 60 + 40}, 80%, 60%)`;
    particle.style.animation = `floatParticle ${Math.random() * 1 + 0.5}s ease forwards`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1500);
}

// Calculate total points
function calculatePoints() {
    let total = 5; // Base
    
    for (let ingredient in selectedIngredients) {
        if (selectedIngredients[ingredient]) {
            total += 2;
        }
    }
    
    pizzaPoints = total;
    document.getElementById('pizzaPoints').textContent = pizzaPoints;
    
    return total;
}

// Reset pizza
function resetPizza() {
    // Reset all ingredients to false
    for (let ingredient in selectedIngredients) {
        selectedIngredients[ingredient] = false;
    }
    
    // Update UI for all ingredients
    document.querySelectorAll('[id^="ing-"]').forEach(element => {
        element.classList.remove('active');
    });
    
    // Hide all layers
    document.querySelectorAll('.topping-layer').forEach(layer => {
        layer.classList.remove('active');
        layer.querySelectorAll('.topping-item').forEach(item => {
            item.classList.remove('active');
        });
    });
    
    // Reset points
    calculatePoints();
}

// Go to billing page
function goToBilling() {
    // Save selected ingredients to session storage
    sessionStorage.setItem('pizzaIngredients', JSON.stringify(selectedIngredients));
    sessionStorage.setItem('pizzaPoints', pizzaPoints);
    
    // Redirect to billing page
    window.location.href = 'billing.html';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Check if returning from billing
    if (performance.navigation.type === 2) {
        resetPizza();
    }
});