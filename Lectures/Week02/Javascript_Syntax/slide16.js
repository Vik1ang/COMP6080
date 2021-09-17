// Inline if (aka the ternary operator)
condition ? ifTrue() : ifFalse();

// It is an operator, meaning that it returns a value 
const result = condition ? valIfTrue() : valIfFalse();

// Additionally, you can use lazy || and && operators
condition && ifTrue() || ifFalse();

// The above also returns a value
// (this is also known as rvalue in some languages)
const result = condition && valIfTrue() || valIfFalse();
// Thanks to the && operator, it's possible to write
// a short version of a one-liner if:
condition && runSomething();
// which is a single line equivalent to
if (condition) {
  runSomething();
}
