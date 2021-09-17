let value = 10;
let anotherValue = '10';
 
// With a loose equality check (aka '=='), two variables
// are considered as holding identical values
console.log(value == anotherValue); // Prints 'true'

// With a strict equality check (aka '==='), the result
// will indicate that the stored values are different
console.log(value === anotherValue); // Prints 'false'

// Comparing with an implicit type case can result
// in a pretty weird outcome and should be avoided
// when possible
const str = '[object Object]';
const obj = { catsSay: 'meow', dogsSay: 'woof' };
console.log(str == obj); // Prints 'true' ¯\_(ツ)_/¯
console.log(str === obj); // Prints 'false'

// For more information, please check out these pages:
// https://mdn.io/Equality_comparisons_and_sameness
// http://ecma-international.org/ecma-262/5.1/#sec-11.9.3
