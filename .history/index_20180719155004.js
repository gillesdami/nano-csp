import {call, fork, join, runSaga} from './nano-saga/nano-saga.js';
import channel from './nano-saga/nano-saga-channel.js';

async function* mainSaga() {
    yield fork(addChannelSaga);
}

async function* addChannelSaga() {
    for await (const event of channel((emit) => window.addChannel = emit)) {
        console.log("adding channel");
    }
}

runSaga(mainSaga);