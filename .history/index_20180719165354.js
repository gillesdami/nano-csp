import {call, fork, join, runSaga} from './nano-saga/nano-saga.js';
import channel from './nano-saga/nano-saga-channel.js';

async function* mainSaga() {
    yield* initRedux();
    yield fork(addChannelSaga);
}

async function* initRedux() {

}

async function* addChannelSaga() {
    for await (const event of yield channel((emit) => window.addChannel = emit)) {
        
    }
}

runSaga(mainSaga);