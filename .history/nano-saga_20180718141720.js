const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

async function rootSaga(initSaga, args = [], mocks = []) {
    const logicIterator = initSaga(...args);
    let forkCounter = 0;
    const forks = {};
    let step = {value: undefined, done: false};

    console.log(initSaga, logicIterator, step);
    
    do {
        const mock = mocks.find(m => m.match === step);
        if(mock) {
            step = mock.mock;
        }

        switch(step.value ? step.value.type : "void") {
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

    return step.value;
}

module.exports = {
    call,
    fork,
    join,
    rootSaga
};