let value;

value = { key: 'hey', anotherKey: 10 };
console.log(typeof value); // Prints 'object'

value = function() { /* ... */ };
console.log(typeof value); // Prints 'function'

value = BigInt(9007199254740991);
console.log(typeof value); // Prints 'bigint'
