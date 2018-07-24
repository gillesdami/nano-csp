//saga tools
const call = (fn, ...args) => ({type: "call", fn, ...args});
const fork = (fn, ...args) => ({type: "fork", fn, ...args});
const join = (forkId) => ({type: "join", forkId});

async function* rootSaga() {
    
}

async function* ai() {
    yield "hi";
    return "done";
}

asyncIterable = ai();
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);