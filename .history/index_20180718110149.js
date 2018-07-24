const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

async function rootSaga(initSaga, args = [], mocks = []) {
    const logicIterator = initSaga(...args);
    const forkCounter = 0;
    const forks = {};

    do {
        let step = {value: undefined, done: false};

        const mock = mocks.find(m => m.match === step);
        if(mock) {
            step = mock.mock;
        }

        switch(step.value.type) {
            case "call":
                step = await logicIterator.next(await step.value.fn(...step.value.args));
            break;
            case "fork":
                step = await logicIterator.next(forks);
                forks[forkCounter++] = rootSaga(step.value.fn, step.value.args, mocks);
            break;
            case "join":
                step = await logicIterator.next(await forks[step.value.forkId]);
            break;
            default:
                step = await logicIterator.next(await step.value);
                break;
        }
    } while(!step.done)
}

async function* ai() {
    yield "hi";
    return "done";
}

asyncIterable = ai();
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);