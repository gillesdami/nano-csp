
function* g() {
    yield 1;
    yield 2;
}

const i = g();
console.log(i.next());
console.log(i.next());
console.log(i.next());
