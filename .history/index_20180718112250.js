const {call, fork, join, rootSaga} = require('./nano-saga');

async function* ai() {
    console.log(yield "hi");
    return "done";
}

asyncIterable = ai();
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);