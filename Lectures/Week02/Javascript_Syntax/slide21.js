// Defining a new class
class Snack {
  // A consuctor that will be auto-called
  constructor(calories, name) {
    this.caloriesRemaining = calories;
    this.name = name;
  }
  
  // One of attached functions, usually called 'methods'
  chew() {
    this.caloriesRemaining -= 100;
  }
}
