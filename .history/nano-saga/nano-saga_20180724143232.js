export const call = (fn, ...args) => ({type: "call", fn, args});
export const fork = (fn, ...args) => ({type: "fork", fn, args});
export const join = (forkId) => ({type: "join", forkId});

export const runSaga = async (saga, args, mocks = [], customEffects) => {
    let it = rootSaga(saga, args, mocks, customEffects), step = {done: false};

    while(1) {
        step = await it.next(step.value);
        const mock = mocks.find(m => console.log(m.matcher(step)));
console.log(mock);
        step = (mock && mock.step) || step;

        if(step.done) return step.value;
    }
};

export async function* rootSaga(initSaga, args = [], mocks, customEffects = {}) {
    const logicIterator = initSaga(...args), forks = {};
    let forkCounter = 0, nextParam = undefined;

    while(1) {
        const step = yield await logicIterator.next(await nextParam);

        switch(step.value && step.value.type ? step.value.type : "void") {
            case "call":
                nextParam = step.value.fn(...step.value.args);
                break;
            case "fork":
                forks[forkCounter] = runSaga(step.value.fn, step.value.args, mocks, customEffects);
                nextParam = forkCounter++;
                break;
            case "join":
                nextParam = forks[step.value.forkId];
                break;
            case "void":
                nextParam = step.value;
                break;
            default:
                nextParam = customEffects[step.value.type](step);
                break;
        }

        if(step.done) return step.value;
    }
}