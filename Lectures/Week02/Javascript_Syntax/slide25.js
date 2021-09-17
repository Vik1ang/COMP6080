const fib = (n) => {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  let current = 0;
  let previous = 1;
  let prePrevious = 0;
  // Iterative calculation
  for (let i = 0; i < n; i++) {
    prePrevious = previous;
    previous = current;
    current = prePrevious + previous;
  }
  
  return current;
};

console.log(fib(5));
