import {call, fork, join, runSaga} from './nano/nano-saga';
import channel from './nano/nano-saga-channel';

async function* mainSaga() {
    yield fork(addChannelSaga);
}

async function* addChannelSaga() {
    const c = channel((emit) => window.addChannel = emit);
}

runSaga(mainSaga);