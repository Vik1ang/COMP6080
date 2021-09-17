if (BigInt(1020202)) {
  console.log('Always prints');
}

if (BigInt(0)) {
  console.log('Never prints');
}

if ('1' - 1) {
  console.log('Never prints');
}

if (+'0') {
  console.log('Never prints');
}
if (new String('')) {
  console.log('Always prints');
}
if (new Number(0)) {
  console.log('Always prints');
}
