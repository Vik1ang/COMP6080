// An object is a dictionary of dynamically typed values
const obj = { key: 'some-value', anotherKey: 10.2 };
 console.log(obj.key); // Prints 'some-value'
console.log(obj['key']); // Prints 'some-value'

// An array is an indexed list of dynamically typed
// values. Every Array is also an object.
const arr = ['first value', 2, obj];
console.log(arr[0]); // Prints 'first value'
console.log(arr.length); // Prints '3'
console.log(typeof arr); // Prints 'object'

// A Map is an object that can use any value as a key
// (not only strings) and preserves the original
// element order.
const map = new Map();
map.set('one', 1);
console.log(map.get('one')); // Prints '1'

// A Set is an object that contains unique values
const set = new Set();
set.add('one');
set.add('one'); // 'one' isn't added the second time
console.log(set.has('one')); // Prints 'true'
