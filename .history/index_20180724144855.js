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
    matcher: (step) => {
        console.log("a", step.value && step.value.type === 'put' && step.value.action.type === 'INCREMENT');
        console.log(step);
        return step.value && step.value.type === 'put' && step.value.action.type === 'INCREMENT'
    },
    value: {done: false, value: {action : put('DECREMENT')}}
}, {
    matcher: (step) => {
        console.log("b", step.value && step.value.type === 'take' && step.value.matcher === 'INCREMENT');
        console.log(step);
        return step.value && step.value.type === 'take' && step.value.matcher === 'INCREMENT'},
    value: {done: false, value: take('DECREMENT')}
}];

runSaga(mainSaga, undefined, mocks, customEffects(store));