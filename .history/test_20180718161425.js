const {call, fork, join, rootSaga, run} = require('./nano-saga');
const delay = (d) => new Promise(r => setTimeout(r, d));

async function* messengerSaga() {
    console.log(yield "hi");
    yield call(console.log, "ho", "hu");
    console.log(yield call((a, b) => a + b, 1, 2));
    console.log(yield call(() => Promise.resolve(4)));
/*
    async function* hoy() {
        for(i = 5; i < 15; i++) {
            yield call(console.log, i);
            await delay(100);
        }
    }

    const forkId = yield fork(hoy);
    await delay(500);
    yield call(console.log, "before join");
    yield join(forkId);
    console.log("join")
*/
    return "done";
}

run(rootSaga, [messengerSaga]).then(console.log);