const snacks = [
  new Pizza(800),
  new Crisps(150),
];
   
const meal = new Meal(snacks);
meal.logCalories();
meal.eatSome();
meal.logCalories();

console.log(typeof Meal); // Prints 'function'
console.log(typeof meal); // Prints 'object'
