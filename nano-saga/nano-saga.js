export const call = (fn, ...args) => ({type: "call", fn, args});
export const fork = (fn, ...args) => ({type: "fork", fn, args});
export const join = (forkId) => ({type: "join", forkId});

export const runSaga = async (saga, args, mocks = [], customEffects) => {
    const logicIterator = saga(...args), forks = {};
    let forkCounter = 0, nextParam = undefined;

    while(1) {
        const step = await logicIterator.next(await nextParam);

        const mock = mocks.find(m => m.matcher(step.value));
        if(mock) step.value = mock.value;
        
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
};