
function* g() {
    console.log(yield 1);
    console.log(yield 2);
}

const i = g();
console.log(i.next("a"));
console.log(i.next("b"));
console.log(i.next("c"));
