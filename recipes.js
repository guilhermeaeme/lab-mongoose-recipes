const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const data = require('./data.js');

mongoose.connect('mongodb://localhost/recipeApp')
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });


// Iteration 1
const recipeSchema = new Schema({
  title: { type: String },
  level: { type: String, enum: ['Easy Peasy', 'Amateur Chef', 'UltraPro Chef'] },
  ingredients: { type: Array },
  cuisine: { type: String },
  dishType: { type: String, enum: ['Breakfast', 'Dish', 'Snack', 'Drink', 'Dessert', 'Other'] },
  image: { type: String, default: 'https://images.media-allrecipes.com/images/75131.jpg' },
  duration: { type: Number, min: 0 },
  creator: { type: String },
  created: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Iteration 2
var MyRecipe = new Recipe({ 
  title: 'Miojo alho e óleo',
  level: 'Easy Peasy',
  ingredients: ['Miojo', 'Água', 'Alho', 'Óleo'],
  cuisine: 'Larica',
  dishType: 'Dish',
  image: 'https://tanamesapessoal.files.wordpress.com/2011/04/alho-e-c3b3leo.jpg?w=470&h=705',
  duration: 3,
  creator: 'Banjolino'
});

let iteration2 = MyRecipe.save() // Create a new recipe and return a promise
  .then(recipe => { console.log(recipe.title) })
  .catch(err => { console.log('An error occured', err) });

// Iteration 3
let iteration3 = Recipe.insertMany(data)
  .then(recipes => { recipes.forEach(recipe => console.log(recipe.title)) })
  .catch(err => { console.log('An error occured', err) });

Promise.all([iteration2, iteration3])
  .then(() => {
    // Iteration 4
    let iteration4 = Recipe.findOne({ title: 'Rigatoni alla Genovese' })
      .then(recipe => {
        recipe.duration = 100;
        return recipe.save();
      })
      .then(recipe => { console.log('The recipe was updated!')})
      .catch(err => { console.log('An error occured:', err) });

    // Iteration 5
    let iteration5 = Recipe.findOne({ title: 'Carrot Cake' })
      .then(recipe => {
        return recipe.remove();
      })
      .then(recipe => { console.log('The recipe was removed!')})
      .catch(err => { console.log('An error occured:', err) });

    // Iteration 6
    Promise.all([iteration4, iteration5])
      .then(values => { 
        mongoose.connection.close();
        console.log('Connection to Mongo closed!')
      })
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
