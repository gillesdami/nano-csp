import {call, fork, join, runSaga} from './nano-saga/nano-saga.js';
import channel from './nano-saga/nano-saga-channel.js';
import {effectCreators, customEffects} from './nano-saga/nano-saga-redux.js';
const {take, put, select} = effectCreators;


async function* mainSaga() {
    yield* initRedux();
    yield fork(addChannelSaga);
}

async function* initRedux() {
    return Redux.createStore()
}

async function* addChannelSaga() {
    for await (const event of yield channel((emit) => window.addChannel = emit)) {
        yield effectCreators.put()
    }
}

Redux.createStore((state = 0, action) => {
    switch (action.type) {
    case 'INCREMENT':
        return state + 1
    case 'DECREMENT':
        return state - 1
    default:
        return state
    }
});

runSaga(mainSaga, undefined, undefined, customEffects);