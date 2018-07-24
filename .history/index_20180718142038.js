const {call, fork, join, rootSaga} = require('./nano-saga');

async function* messengerSaga() {
    console.log(yield "hi");
    yield call(console.log, "ho", "hu");
    console.log(yield call((a, b) => a + b, 1, 2));
    console.log(yield call(() => Promise.resolve(4)));

    async function* hoy() {
        for(i = 5; i < 15; i++) {
            yield call(console.log, i);
        }
    }

    const forkId = yield fork(hoy);
    yield call(console.log, "before join");
    yield join(forkId);
    console.log("join")

    return "done";
}

rootSaga(messengerSaga).then(console.log);