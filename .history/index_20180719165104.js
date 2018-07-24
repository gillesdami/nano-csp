import {call, fork, join, runSaga} from './nano-saga/nano-saga.js';
import channel from './nano-saga/nano-saga-channel.js';
import { createStore } from 'redux';

async function* mainSaga() {
    yield fork(addChannelSaga);
    yield call(console.log, createStore);
}

async function* addChannelSaga() {
    for await (const event of yield channel((emit) => window.addChannel = emit)) {
        console.log("adding channel");
    }
}

runSaga(mainSaga);