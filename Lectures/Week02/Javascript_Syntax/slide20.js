// Good old for loop
for (let i = 0; i < 100; i++) {
  console.log(i);
}

// An equivalent while loop
let i = 0;
while (i < 100) {
  console.log(i);
  i++;
}

// Or equivalent do...while loop
let i = 0;
do {  
  ++i;
  if (i >= 100) {
    break;
  }
  
  console.log(i);
} while (true);
