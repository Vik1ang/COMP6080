const value = 5;

// For mulitple branches, it's often more
// convenient to use a switch-case block
switch (value) {
  case 0:
    // If value equals to 0, the below code runs
    console.log('No items in the bag!')
    break;
  case 1:
    // If value equals to 1, the below code runs
    console.log('One item is in the bag!');
    break;
  case 2:
    // If value equals to 2, the below code runs
    console.log('A couple of items is in the bag!');
    break;
  default:
    // If value isn't 0, 1, or 2, the below code runs
    console.log('Lots of items are in the bag');
}
