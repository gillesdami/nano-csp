import {call, fork, join, runSaga} from './nano-saga/nano-saga.js';
import channel from './nano-saga/nano-saga-channel.js';
import {effectCreators, customEffects} from './nano-saga/nano-saga-redux.js';
const {take, put, select} = effectCreators;

async function* mainSaga() {
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
    //matcher: (step) => step.value && step.value.type === 'put' && step.value.action === 'INCREMENT',
    matcher: console.warn,
    step: {done: false, value: put('DECREMENT')}
}, {
    matcher: (step) => step.value && step.value.type === 'take' && step.value.matcher('INCREMENT'),
    step: {done: false, value: take('DECREMENT')}
}];

runSaga(mainSaga, undefined, mocks, customEffects(store));