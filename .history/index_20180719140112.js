import {call, fork, join, runSaga} from './nano/nano-saga';
import channel from './nano/nano-saga-channel';

async function* mainSaga() {
    
}

runSaga(mainSaga);