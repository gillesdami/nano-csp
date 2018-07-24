const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

const run = async (rootSaga, args) => {
    let it = rootSaga(...args), step = {done: false};
    while(!step.done) step = await it.next(step.value);
    return step;
};

async function* rootSaga(initSaga, args = []) {
    const logicIterator = initSaga(...args);
    const forks = {};
    let forkCounter = 0;
    let nextParam = undefined;

    while(1) {
        const step = yield await logicIterator.next(await nextParam);

        switch(step.value ? step.value.type : "void") {
            case "call":
                nextParam = step.value.fn(...step.value.args);
                break;
            case "fork":
                forks[forkCounter] = run(rootSaga, [step.value.fn, step.value.args]);
                nextParam = forkCounter++;
                break;
            case "join":
                nextParam = forks[step.value.forkId];
                break;
            default:
                nextParam = step.value;
                break;
        }

        if(step.done) return step.value;
    }
}

module.exports = {
    call,
    fork,
    join,
    rootSaga,
    run
};