const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

const run = async (saga, args, mocks = []) => {
    let it = rootSaga(saga, args, mocks), step = {done: false};

    while(1) {
        step = await it.next(step.value);
        mock = mocks.find(m => m.matcher(step));
        step = mock || step;

        if(step.done) return step.value;
    }
};

async function* rootSaga(initSaga, args = [], mocks, customEffects = {}) {
    const logicIterator = initSaga(...args), forks = {};
    let forkCounter = 0, nextParam = undefined;

    while(1) {
        const step = yield await logicIterator.next(await nextParam);

        switch(step.value ? step.value.type : "void") {
            case "call":
                nextParam = step.value.fn(...step.value.args);
                break;
            case "fork":
                forks[forkCounter] = run(step.value.fn, step.value.args, mocks);
                nextParam = forkCounter++;
                break;
            case "join":
                nextParam = forks[step.value.forkId];
                break;
            case "void":
                nextParam = step.value;
                break;
            default:
                nextParam = customEffects[step.type](step);
                break;
        }

        if(step.done) return step.value;
    }
}

module.exports = {
    call,
    fork,
    join,
    run
};