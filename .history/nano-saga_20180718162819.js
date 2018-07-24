const call = (fn, ...args) => ({type: "call", fn, args});
const fork = (fn, ...args) => ({type: "fork", fn, args});
const join = (forkId) => ({type: "join", forkId});

async function* rootSaga(initSaga, args = []) {
    const logicIterator = initSaga(...args), forks = {};
    let forkCounter = 0, nextParam = undefined;

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

const run = async (saga, args, mocks) => {
    let it = rootSaga(saga, ...args, mocks), step = {done: false};

    while(1) {
        step = await it.next(step.value);

        if(step.done) return step.value;
    }
};

module.exports = {
    call,
    fork,
    join,
    run
};