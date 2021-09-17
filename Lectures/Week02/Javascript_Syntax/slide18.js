if (1) {
  console.log('Always prints');
}

if (null) {
  console.log('Never prints');
}

if (undefined) {
  console.log('Never prints');
}

if ({ x: 'test' }) {
  console.log('Always prints');
}
if (Symbol()) {
  console.log('Always prints');
}
if (function x() {}) {
  console.log('Always prints');
}
