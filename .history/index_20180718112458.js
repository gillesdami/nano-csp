const {call, fork, join, rootSaga} = require('./nano-saga');

async function* ai() {
    console.log(yield "hi");
    return "done";
}

rootSaga(ai).then(console.log);