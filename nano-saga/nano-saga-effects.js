export const effectCreators = {
    call: (fn, ...args) => ({name: "call", fn, args}),
    fork: (fn, ...args) => ({name: "fork", fn, args}),
    join: (forkId) => ({name: "join", forkId}),
    take: (matcher) => ({name: "take", matcher}),
    takeEvery: (matcher, fn, ...args) => ({name: "takeEvery", matcher, fn, args}),
    put: (action) => ({name: "put", action}),
    select: (selector) => ({name: "select", selector})
};

const takeEverySaga = async function*(matcher, fn, args) {
    while(1) {
        yield effectCreators.take(matcher);
        yield effectCreators.call(fn, ...args);
    }
};

const takes = [], forks = {};
let forkCounter = 0;

export const executors = store => runner => [
    {
        name: undefined,
        fn: (value) => value
    },
    {
        name: "call",
        fn: ({fn, args}) => fn(...args)
    },
    {
        name: "fork",
        fn: ({fn, args}) => {
            forks[forkCounter] = runner(fn, args);

            return forkCounter++;
        }
    },
    {
        name: "join",
        fn: ({forkId}) => {
            const tmp = forks[forkId];
            delete forks[forkId];

            return tmp;
        }
    },
    {
        name: "take",
        fn: ({matcher}) => {
            let resolve;
            const p = new Promise(r => resolve = r);
            takes.push({matcher, resolve});
    
            return p;
        }
    },
    {
        name: "takeEvery",
        fn: ({matcher, fn, args}) => {
            forks[forkCounter] = runner(takeEverySaga, [matcher, fn, args]);

            return forkCounter++;
        }
    },
    {
        name: "put",
        fn: ({action}) => {
            store.dispatch(action);
            for(let i = takes.length - 1; i >= 0; i--) {
                if(takes[i].matcher === action.type || typeof takes[i].matcher === "function" 
                    && takes[i].matcher(action.type)) 
                {
                    takes[i].resolve();
                    takes.splice(i, 1);
                }
            }
        }
    },
    {
        name: "select",
        fn: ({selector}) => selector(store.getState())
    }
];