class Meal {
  constructor(snacks) {
    this.snacks = snacks;
  }
   
  eatSome() {
    for (let i = 0; i < this.snacks.length; i++) {
      const snack = this.snacks[i];
      console.log('Chewing', snack.name); 
      snack.chew();
    }
  }
   logCalories() {
     for (let i = 0; i < this.snacks.length; i++) {
       const snack = this.snacks[i];
       console.log(snack.name, ': ', snack.caloriesRemaining);
     }
   }
}
console.log(typeof Meal); // Prints 'function'
