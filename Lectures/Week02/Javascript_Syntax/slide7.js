let value;

// An anonymous function
value = (param1, param2) => {
   console.log(param1, param2);
};

// A normal function
value = function(param) {
   console.log('param =', param);
};

// Function can be defined without assigning it
// to a variable, in that case, it hoists
function foo(bar) {
  // If number, adds 1 to it, otherwise concatenates it
  return bar + 1;
}

// Calling a function
const result = foo(10);
 value(result); // Prints 'param = 11'

// A big integer number
value = BigInt(9007199254740991);