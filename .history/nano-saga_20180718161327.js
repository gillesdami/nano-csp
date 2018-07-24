const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

const run = async (rootSaga, args) => {
    let it = rootSaga(...args), step = {done: false};
    while(!step.done) step = await it.next(step);
    return step;
};

async function* rootSaga(initSaga, args = []) {
    const logicIterator = initSaga(...args);
    const forks = {};
    let forkCounter = 0;
    let nextParam = undefined;

    do {
        const step = yield await logicIterator.next(await nextParam);

        switch(step.value ? step.value.type : "void") {
            case "call":
                nextParam = step.value.fn(...step.value.args);
                break;
            case "fork":
                forks[forkCounter] = rootSaga(step.value.fn, step.value.args, mocks);
                nextParam = forkCounter++;
                break;
            case "join":
                nextParam = forks[step.value.forkId];
                break;
            default:
                nextParam = step.value;
                break;
        }
    } while(!step.done)

    return step.value;
}

module.exports = {
    call,
    fork,
    join,
    rootSaga,
    run
};