const {call, fork, join, rootSaga} = require('./nano-saga');

async function* messengerSaga() {
    console.log(yield "hi");
    yield call(console.log, "ho", "hu");
    return "done";
}

rootSaga(messengerSaga).then(console.log);