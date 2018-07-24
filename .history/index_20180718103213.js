//saga tools
const call = (fn, ...args) => ({type: "call", fn, ...args});
const fork = (fn, ...args) => ({type: "fork", fn, ...args});
const join = (forkId) => ({type: "join", forkId});

async function* rootSaga(initSaga) {
    const logicIterator = initSaga;

    do {
        let step;

        switch(step.value.type) {
            case "call":
            break;
            case "fork":
            break;
            case "join":
            break;
            default:
                step = await logicIterator.next()
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