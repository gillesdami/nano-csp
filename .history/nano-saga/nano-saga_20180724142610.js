export const call = (fn, ...args) => ({type: "CALL", fn, args});
export const fork = (fn, ...args) => ({type: "FORK", fn, args});
export const join = (forkId) => ({type: "JOIN", forkId});

export const runSaga = async (saga, args, mocks = [], customEffects) => {
    let it = rootSaga(saga, args, mocks, customEffects), step = {done: false};

    while(1) {
        step = await it.next(step.value);
        const mock = mocks.find(m => m.matcher(step));
console.log(step);
        step = (mock && mock.step) || step;

        if(step.done) return step.value;
    }
};

export async function* rootSaga(initSaga, args = [], mocks, customEffects = {}) {
    const logicIterator = initSaga(...args), forks = {};
    let forkCounter = 0, nextParam = undefined;

    while(1) {
        const step = yield await logicIterator.next(await nextParam);

        switch(step.value && step.value.type ? step.value.type : "VOID") {
            case "CALL":
                nextParam = step.value.fn(...step.value.args);
                break;
            case "FORK":
                forks[forkCounter] = runSaga(step.value.fn, step.value.args, mocks, customEffects);
                nextParam = forkCounter++;
                break;
            case "JOIN":
                nextParam = forks[step.value.forkId];
                break;
            case "VOID":
                nextParam = step.value;
                break;
            default:
                nextParam = customEffects[step.value.type](step);
                break;
        }

        if(step.done) return step.value;
    }
}