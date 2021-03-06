# nano-csp

CSP library for learning under 100 lines (runner 15 lines) in ES8. This repository isn't made for production but can help understanding a bit of the black magic behind libs such as js-csp or redux-saga.

## example

```js
import runSaga from './nano-csp';
import channel from './nano-csp/channel.js';
import {effectCreators, executors} from './nano-csp/effects.js';
const {call, fork, join, take, put, select, takeEvery} = effectCreators;

async function* mainSaga() {
    yield takeEvery('INCREMENT', console.log, "INC");
    yield fork(addChannelSaga);
    yield take('INCREMENT');
    yield call(console.log, yield select((state) => state));
}

async function* addChannelSaga() {
    for await (const event of yield channel((emit) => window.button = emit)) {
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

runSaga(mainSaga, undefined, executors(store));

setInterval(window.button, 100)();
```

mocking:

```js
const mocks = [{
    matcher: (value) => value && value.type === 'put' && value.action.type === 'INCREMENT',
    value: put({type: 'DECREMENT'})
}, {
    matcher: (value) => value && value.type === 'take' && value.matcher === 'INCREMENT',
    value: take('DECREMENT')
}];

runSaga(mainSaga, undefined, executors(store), mocks);
```

## build

```bash
yarn
yarn build
```