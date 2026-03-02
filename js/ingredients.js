// Ingredient configurations

const ingredientConfig = {
    sauce: {
        name: 'Sauce',
        icon: 'fa-tint',
        color: '#ff6347',
        layerType: 'div',
        points: 2
    },
    cheese: {
        name: 'Cheese',
        icon: 'fa-cheese',
        color: '#ffd700',
        layerType: 'div',
        points: 2
    },
    pepperoni: {
        name: 'Pepperoni',
        icon: 'fa-bacon',
        color: '#dc143c',
        layerType: 'image',
        count: 8,
        points: 2
    },
    olives: {
        name: 'Olives',
        icon: 'fa-circle',
        color: '#2e8b57',
        layerType: 'image',
        count: 8,
        points: 2
    },
    mushroom: {
        name: 'Mushroom',
        icon: 'fa-mushroom',
        color: '#d2b48c',
        layerType: 'image',
        count: 6,
        points: 2
    },
    pepper: {
        name: 'Bell Pepper',
        icon: 'fa-pepper',
        color: '#32cd32',
        layerType: 'image',
        count: 4,
        points: 2
    },
    onion: {
        name: 'Onion',
        icon: 'fa-onion',
        color: '#dda0dd',
        layerType: 'image',
        count: 4,
        points: 2
    },
    basil: {
        name: 'Basil',
        icon: 'fa-leaf',
        color: '#228b22',
        layerType: 'image',
        count: 4,
        points: 2
    },
    tomato: {
        name: 'Tomato',
        icon: 'fa-apple-alt',
        color: '#ff4500',
        layerType: 'image',
        count: 4,
        points: 2
    }
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ingredientConfig;
}