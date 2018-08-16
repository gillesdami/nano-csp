import runSaga from './nano-saga/nano-saga.js';
import channel from './nano-saga/nano-saga-channel.js';
import {effectCreators, executors} from './nano-saga/nano-saga-effects.js';
const {call, fork, join, take, put, select, takeEvery} = effectCreators;

async function* mainSaga() {
    yield takeEvery('INCREMENT', console.log, "+");
    yield takeEvery('INCREMENT', console.log, "p");
    yield fork(addChannelSaga);
    yield take('INCREMENT');
    console.log("take1");
    yield take((type) => type === 'INCREMENT');
    console.log("take2");
    yield call(console.log, yield select((state) => state));
}

async function* addChannelSaga() {
    for await (const event of yield channel((emit) => window.addChannel = emit)) {
        yield put({type: 'INCREMENT'});
    }
}

const store = Redux.createStore((state = 0, action) => {
    switch (action.type) {
    case 'INCREMENT':
        return state + 1
    case 'DECREMENT':
        return state - 1
    default:
        return state
    }
});

const mocks = [{
    matcher: (value) => value && value.type === 'put' && value.action.type === 'INCREMENT',
    value: put({type: 'DECREMENT'})
}, {
    matcher: (value) => value && value.type === 'take' && value.matcher === 'INCREMENT',
    value: take('DECREMENT')
}];

runSaga(mainSaga, undefined, executors(store));