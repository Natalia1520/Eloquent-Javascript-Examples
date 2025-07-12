//exercises program structure

//looping a triangle
for (let a = "#"; a.length < 8; a = a + "#") {
  console.log(a);
}

//fizzbuzz
for (let n = 1; n <= 100; n = n + 1) {
  let b = "";
  if (n % 3 == 0) b += "Fizz";
  if (n % 5 == 0) b += "Buzz";
  console.log(b || n);
}

//chessboard
function c(d, e = 0) {
  let fila = "";
  for (let i = 0; i < d; i++) {
    fila += (i + e) % 2 === 0 ? " " : "#";
  }
  return fila + "\n";
}

let f = "";
for (let i = 0; i < 8; i++) {
  f += c(8, i);
}

console.log(f);
