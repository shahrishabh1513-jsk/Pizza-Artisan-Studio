/* ============================================================
   PIZZA HOUSE — Master Ingredient & Recipe Configuration
   Every price, point value and recipe lives here so nothing
   is hard-coded across the game.
   ============================================================ */

const SIZES = {
    small:  { key: 'small',  label: 'Small',  inches: 8,  scale: 0.65, price: 149, timeBonus: 0   },
    medium: { key: 'medium', label: 'Medium', inches: 10, scale: 0.80, price: 199, timeBonus: 10  },
    large:  { key: 'large',  label: 'Large',  inches: 12, scale: 1.00, price: 299, timeBonus: 20  },
    xl:     { key: 'xl',     label: 'XL',     inches: 14, scale: 1.15, price: 399, timeBonus: 30  }
};

const SAUCES = {
    tomato: { key: 'tomato', label: 'Tomato',  color: '#c1440e', glow: 'rgba(193,68,14,.55)' },
    bbq:    { key: 'bbq',    label: 'BBQ',     color: '#5c3410', glow: 'rgba(92,52,16,.55)'  },
    pesto:  { key: 'pesto',  label: 'Pesto',   color: '#4c7a3d', glow: 'rgba(76,122,61,.55)' },
    spicy:  { key: 'spicy',  label: 'Spicy',   color: '#8f130d', glow: 'rgba(143,19,13,.55)' }
};

const CHEESES = {
    mozzarella: { key: 'mozzarella', label: 'Mozzarella',  color: '#ffe9a8' },
    cheddar:    { key: 'cheddar',    label: 'Cheddar',     color: '#f4b942' },
    burst:      { key: 'burst',      label: 'Cheese Burst', color: '#fff3c4' }
};

// emoji is used as a lightweight, dependency-free visual stand-in for topping art.
const TOPPINGS = {
    pepperoni:   { key: 'pepperoni',   label: 'Pepperoni',    emoji: '🍕', color: '#c0392b', price: 20, points: 20, max: 8 },
    olives:      { key: 'olives',      label: 'Olives',       emoji: '🫒', color: '#2d3436', price: 15, points: 15, max: 8 },
    mushroom:    { key: 'mushroom',    label: 'Mushroom',     emoji: '🍄', color: '#c9a876', price: 20, points: 15, max: 6 },
    pepper:      { key: 'pepper',      label: 'Bell Pepper',  emoji: '🫑', color: '#27ae60', price: 20, points: 15, max: 6 },
    onion:       { key: 'onion',       label: 'Onion',        emoji: '🧅', color: '#c9a4d9', price: 15, points: 10, max: 6 },
    basil:       { key: 'basil',       label: 'Basil',        emoji: '🌿', color: '#1e7a34', price: 15, points: 10, max: 6 },
    tomato:      { key: 'tomato',      label: 'Tomato',       emoji: '🍅', color: '#e74c3c', price: 15, points: 10, max: 6 },
    corn:        { key: 'corn',        label: 'Corn',         emoji: '🌽', color: '#f4d35e', price: 15, points: 10, max: 8 },
    pineapple:   { key: 'pineapple',   label: 'Pineapple',    emoji: '🍍', color: '#f2c14e', price: 20, points: 15, max: 6 },
    jalapeno:    { key: 'jalapeno',    label: 'Jalapeño',     emoji: '🌶️', color: '#4c8c3f', price: 20, points: 15, max: 8 },
    chili:       { key: 'chili',       label: 'Chili',        emoji: '🌶️', color: '#c0392b', price: 15, points: 10, max: 6 },
    spinach:     { key: 'spinach',     label: 'Spinach',      emoji: '🥬', color: '#2f6b2f', price: 15, points: 10, max: 6 },
    paneer:      { key: 'paneer',      label: 'Paneer',       emoji: '🧀', color: '#fdf6e3', price: 25, points: 20, max: 6 },
    extracheese: { key: 'extracheese', label: 'Extra Cheese', emoji: '🧀', color: '#ffd700', price: 30, points: 15, max: 1 }
};

// idealTemp is the oven temperature (°C) that bakes this recipe best.
const PIZZA_TYPES = {
    margherita:  { key: 'margherita',  label: 'Margherita',     sauce: 'tomato', cheese: 'mozzarella', toppings: ['basil'],                              idealTemp: 220 },
    pepperoni:   { key: 'pepperoni',   label: 'Pepperoni',      sauce: 'tomato', cheese: 'mozzarella', toppings: ['pepperoni'],                          idealTemp: 220 },
    farmhouse:   { key: 'farmhouse',   label: 'Farmhouse',      sauce: 'tomato', cheese: 'mozzarella', toppings: ['mushroom', 'pepper', 'onion', 'tomato'], idealTemp: 220 },
    veggie:      { key: 'veggie',      label: 'Veggie Supreme', sauce: 'tomato', cheese: 'cheddar',    toppings: ['pepper', 'corn', 'onion', 'mushroom', 'olives'], idealTemp: 210 },
    mexican:     { key: 'mexican',     label: 'Mexican Wave',   sauce: 'spicy',  cheese: 'cheddar',    toppings: ['jalapeno', 'corn', 'pepper', 'chili'], idealTemp: 230 },
    cheeseburst: { key: 'cheeseburst', label: 'Cheese Burst',   sauce: 'tomato', cheese: 'burst',      toppings: ['extracheese'],                        idealTemp: 200 },
    paneer:      { key: 'paneer',      label: 'Paneer Tikka',   sauce: 'tomato', cheese: 'mozzarella', toppings: ['paneer', 'pepper', 'onion', 'chili'], idealTemp: 220 }
};

const CUSTOMER_NAMES = ['Riya', 'Aarav', 'Diya', 'Kabir', 'Ananya', 'Vivaan', 'Meera', 'Arjun', 'Ishita', 'Rohan'];

const CUSTOMER_PERSONALITIES = [
    { key: 'happy',  emoji: '😊', label: 'Happy Customer' },
    { key: 'lover',  emoji: '😋', label: 'Food Lover' },
    { key: 'cool',   emoji: '😎', label: 'Cool Customer' },
    { key: 'spicy',  emoji: '🔥', label: 'Spicy Lover' },
    { key: 'expert', emoji: '⭐', label: 'Pizza Expert' }
];

const OVEN_TEMPS = [180, 200, 220, 240, 260];
const SLICE_OPTIONS = [4, 6, 8, 10];
const BASE_BAKE_SECONDS = 30; // Oven Level 1
