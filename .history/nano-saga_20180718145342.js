const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

async function rootSaga(initSaga, args = [], mocks = []) {
    const logicIterator = initSaga(...args);
    let forkCounter = 0;
    const forks = {};
    let step = {value: undefined, done: false};

    for await(const step of logicIterator) {
        /*
        const mock = mocks.find(m => m.match === step);
        if(mock) {
            step = mock.mock;
        }*/

        switch(step.value ? step.value.type : "void") {
            case "call":
                step = await logicIterator.next(await step.value.fn(...step.value.args));
                break;
            case "fork":
                forks[forkCounter] = rootSaga(step.value.fn, step.value.args, mocks);
                step = await logicIterator.next(forkCounter++);
                break;
            case "join":
                step = await logicIterator.next(await forks[step.value.forkId]);
                break;
            default:
                step = await logicIterator.next(await step.value);
                break;
        }
    }

    return step.value;
}

module.exports = {
    call,
    fork,
    join,
    rootSaga
};