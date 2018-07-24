const delay = (d) => new Promise(r => setTimeout(r, d));

let p = delay(500);

async function a() {
    await p;
    console.log("p");
}

a();
console.log("a");
p = delay(5000);
console.log("0");