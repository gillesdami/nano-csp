const {call, fork, join, rootSaga} = require('./nano-saga');

async function* messengerSaga() {
    console.log(yield "hi");
    yield call(console.log, "ho", "hu");
    console.log(yield call((a, b) => a + b, 1, 2));
    console.log(yield call(() => Promise.resolve(4)));

    return "done";
}

rootSaga(messengerSaga).then(console.log);