// seed.js
const sequelize = require('./models/db');
const User = require('./models/userModel');
const Recipe = require('./models/recipeModel');

// Sample fake data for users
const users = [
  { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456' },
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'password789' },
];

// Sample fake data for recipes
const recipes = [
  {
    title: 'Spaghetti Bolognese',
    description: 'A classic Italian pasta dish with a rich tomato-based meat sauce.',
    ingredients: ['Spaghetti', 'Ground beef', 'Tomato sauce', 'Garlic', 'Onion', 'Olive oil', 'Parmesan'],
    instructions: '1. Cook the spaghetti. 2. Prepare the Bolognese sauce with beef, garlic, onion, and tomato sauce. 3. Serve the spaghetti with sauce and grated Parmesan.',
  },
  {
    title: 'Chicken Caesar Salad',
    description: 'A fresh salad with grilled chicken, romaine lettuce, croutons, and Caesar dressing.',
    ingredients: ['Chicken breast', 'Romaine lettuce', 'Croutons', 'Caesar dressing', 'Parmesan cheese'],
    instructions: '1. Grill the chicken. 2. Toss lettuce with Caesar dressing. 3. Add grilled chicken, croutons, and parmesan cheese.',
  },
  {
    title: 'Vegetable Stir Fry',
    description: 'A healthy, colorful stir fry with assorted vegetables and a soy-based sauce.',
    ingredients: ['Broccoli', 'Carrots', 'Bell peppers', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil'],
    instructions: '1. Stir fry vegetables in sesame oil. 2. Add soy sauce, ginger, and garlic. 3. Serve over rice.',
  },
];

async function seedDatabase() {
  try {
    // Clear existing data
await Recipe.destroy({ where: {} }); // Delete recipes first
await User.destroy({ where: {} });   // Then delete users

// Create users
const createdUsers = await User.bulkCreate(users, { returning: true });

// Associate recipes with users
for (let i = 0; i < recipes.length; i++) {
  const recipe = recipes[i];
  const user = createdUsers[i % createdUsers.length]; // Assign recipes to users in a round-robin fashion
  await Recipe.create({
    ...recipe,
    ingredients: JSON.stringify(recipe.ingredients), // Convert ingredients to JSON
    UserId: user.id, // Associate with a user
  });
}

console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
}

seedDatabase();