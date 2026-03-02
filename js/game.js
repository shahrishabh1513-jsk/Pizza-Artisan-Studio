// Game State
let selectedIngredients = [];
let totalScore = 0;
let ingredientPositions = {};

// Ingredient configuration
const ingredientConfig = {
    sauce: { name: 'Sauce', points: 5, icon: 'fa-tint', layer: 'sauce-layer' },
    cheese: { name: 'Cheese', points: 5, icon: 'fa-cheese', layer: 'cheese-layer' },
    pepperoni: { name: 'Pepperoni', points: 10, icon: 'fa-circle' },
    olives: { name: 'Olives', points: 8, icon: 'fa-circle' },
    mushroom: { name: 'Mushroom', points: 8, icon: 'fa-mushroom' },
    onions: { name: 'Onions', points: 6, icon: 'fa-circle' },
    bellpepper: { name: 'Bell Pepper', points: 7, icon: 'fa-circle' },
    basil: { name: 'Basil', points: 5, icon: 'fa-leaf' }
};

// Predefined positions for toppings (circular arrangement)
const toppingPositions = {
    pepperoni: [
        { x: 50, y: 20 }, { x: 80, y: 30 }, { x: 65, y: 55 }, { x: 35, y: 60 }, { x: 20, y: 35 },
        { x: 45, y: 40 }, { x: 70, y: 45 }, { x: 55, y: 70 }, { x: 25, y: 75 }, { x: 40, y: 80 }
    ],
    olives: [
        { x: 30, y: 25 }, { x: 70, y: 25 }, { x: 50, y: 45 }, { x: 25, y: 60 }, { x: 75, y: 60 },
        { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 45, y: 85 }, { x: 55, y: 85 }
    ],
    mushroom: [
        { x: 35, y: 30 }, { x: 65, y: 30 }, { x: 45, y: 50 }, { x: 55, y: 50 }, { x: 25, y: 45 },
        { x: 75, y: 45 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 50, y: 75 }
    ],
    onions: [
        { x: 40, y: 25 }, { x: 60, y: 25 }, { x: 30, y: 45 }, { x: 70, y: 45 }, { x: 45, y: 60 },
        { x: 55, y: 60 }, { x: 35, y: 75 }, { x: 65, y: 75 }
    ],
    bellpepper: [
        { x: 45, y: 25 }, { x: 55, y: 25 }, { x: 35, y: 45 }, { x: 65, y: 45 }, { x: 25, y: 55 },
        { x: 75, y: 55 }, { x: 45, y: 70 }, { x: 55, y: 70 }
    ],
    basil: [
        { x: 30, y: 35 }, { x: 70, y: 35 }, { x: 40, y: 55 }, { x: 60, y: 55 }, { x: 50, y: 65 }
    ]
};

// Initialize game
function initGame() {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('main').style.display = 'block';
        loadSavedState();
        updateUI();
        addIngredientListeners();
    }, 3000);
}

// Load saved state from sessionStorage
function loadSavedState() {
    const saved = sessionStorage.getItem('pizzaGame');
    if (saved) {
        const state = JSON.parse(saved);
        selectedIngredients = state.ingredients || [];
        totalScore = state.score || 0;
        updateScore();
        selectedIngredients.forEach(ing => {
            toggleIngredient(ing, false);
        });
    }
}

// Add click listeners to ingredient cards
function addIngredientListeners() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
}

// Toggle ingredient
function toggleIngredient(ingredient, playSound = true) {
    const card = document.querySelector(`[data-ingredient="${ingredient}"]`);
    
    if (selectedIngredients.includes(ingredient)) {
        // Remove ingredient
        selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
        card.classList.remove('selected');
        removeIngredientFromPizza(ingredient);
        totalScore -= ingredientConfig[ingredient].points;
    } else {
        // Add ingredient
        if (selectedIngredients.length < 8) {
            selectedIngredients.push(ingredient);
            card.classList.add('selected');
            addIngredientToPizza(ingredient);
            totalScore += ingredientConfig[ingredient].points;
            
            // Play sound effect (if available)
            if (playSound) {
                playAddSound();
            }
            
            // Show animation
            showAddAnimation(card);
        } else {
            showToast('Maximum 8 ingredients allowed!', 'warning');
        }
    }
    
    updateScore();
    updateBillCount();
    saveState();
}

// Add ingredient to pizza visualization
function addIngredientToPizza(ingredient) {
    if (ingredient === 'sauce') {
        document.getElementById('sauce-layer').style.opacity = '1';
    } else if (ingredient === 'cheese') {
        document.getElementById('cheese-layer').style.opacity = '1';
    } else {
        const container = document.getElementById(`${ingredient}-container`);
        const positions = toppingPositions[ingredient];
        const count = container.children.length;
        
        if (count < positions.length) {
            const position = positions[count];
            createToppingElement(ingredient, position, container);
        }
    }
}

// Remove ingredient from pizza visualization
function removeIngredientFromPizza(ingredient) {
    if (ingredient === 'sauce') {
        document.getElementById('sauce-layer').style.opacity = '0';
    } else if (ingredient === 'cheese') {
        document.getElementById('cheese-layer').style.opacity = '0';
    } else {
        const container = document.getElementById(`${ingredient}-container`);
        if (container.lastChild) {
            container.lastChild.remove();
        }
    }
}

// Create topping element
function createToppingElement(ingredient, position, container) {
    const topping = document.createElement('div');
    topping.className = `ingredient ${ingredient}-topping`;
    topping.style.left = position.x + '%';
    topping.style.top = position.y + '%';
    topping.style.background = getIngredientColor(ingredient);
    topping.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    
    // Add animation
    topping.style.animation = 'drop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    container.appendChild(topping);
}

// Get ingredient color
function getIngredientColor(ingredient) {
    const colors = {
        pepperoni: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        olives: 'linear-gradient(135deg, #2d3436, #636e72)',
        mushroom: 'linear-gradient(135deg, #a569bd, #8e44ad)',
        onions: 'linear-gradient(135deg, #f39c12, #e67e22)',
        bellpepper: 'linear-gradient(135deg, #2ecc71, #27ae60)',
        basil: 'linear-gradient(135deg, #27ae60, #229954)'
    };
    return colors[ingredient] || '#95a5a6';
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = totalScore;
    document.getElementById('selected-count').textContent = selectedIngredients.length;
    
    // Add animation to score
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('success-animation');
    setTimeout(() => {
        scoreElement.classList.remove('success-animation');
    }, 500);
}

// Update bill count
function updateBillCount() {
    document.getElementById('bill-count').textContent = selectedIngredients.length;
}

// Reset pizza
function resetPizza() {
    // Clear all ingredients
    selectedIngredients = [];
    totalScore = 0;
    
    // Remove all visual elements
    document.getElementById('sauce-layer').style.opacity = '0';
    document.getElementById('cheese-layer').style.opacity = '0';
    
    document.querySelectorAll('.ingredient-container').forEach(container => {
        container.innerHTML = '';
    });
    
    // Remove selected class from cards
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    updateScore();
    updateBillCount();
    saveState();
    
    // Show shake animation
    document.querySelector('.pizza-wrapper').style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        document.querySelector('.pizza-wrapper').style.animation = 'float 3s ease-in-out infinite';
    }, 500);
}

// Create pizza and go to billing
function createPizza() {
    if (selectedIngredients.length === 0) {
        showToast('Add at least one ingredient!', 'warning');
        return;
    }
    
    saveState();
    
    // Play success sound
    playSuccessSound();
    
    // Show success animation
    document.querySelector('.create-btn').classList.add('success-animation');
    
    setTimeout(() => {
        window.location.href = 'billing.html';
    }, 500);
}

// Go to billing
function goToBilling() {
    if (selectedIngredients.length === 0) {
        showToast('Create a pizza first!', 'warning');
        return;
    }
    window.location.href = 'billing.html';
}

// Save state to sessionStorage
function saveState() {
    const state = {
        ingredients: selectedIngredients,
        score: totalScore
    };
    sessionStorage.setItem('pizzaGame', JSON.stringify(state));
}

// Show toast message
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'warning' ? '#ff4757' : '#4CAF50'};
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Show add animation
function showAddAnimation(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 200);
}

// Play sound effects (placeholder - requires actual audio files)
function playAddSound() {
    // Implementation would require actual audio files
    // new Audio('assets/sounds/ingredient-add.mp3').play();
}

function playSuccessSound() {
    // Implementation would require actual audio files
    // new Audio('assets/sounds/success.mp3').play();
}

// Update UI
function updateUI() {
    updateScore();
    updateBillCount();
}