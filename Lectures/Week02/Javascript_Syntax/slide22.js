class Snack {
  constructor(calories, name) {
    this.caloriesRemaining = calories;
    this.name = name;
  }
  chew() {
    this.caloriesRemaining -= 100;
  }
}
class Pizza extends Snack {
  static caloriesPerGram = 2.66;

  constructor(weightInGrams) {
    super(Pizza.caloriesPerGram * weightInGrams, 'XL');
  }
}
class Crisps extends Snack {
  static caloriesPerGram = 5.36;
  constructor(weightInGrams) {
    super(Crisps.caloriesPerGram * weightInGrams, 'Thins');
  }
}