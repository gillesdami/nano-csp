export const effectCreators = {
    take: (matcher) => ({type: "take", matcher}),
    put: (action) => ({type: "put", action}),
    select: (selector) => ({type: "select", selector})
};

const takes = [];

export const customEffects = (store) => ({
    take: ({value}) => {
        let resolve;
        const p = new Promise(r => resolve = r);
        takes.push({matcher: value.matcher, resolve});

        return p;
    },
    put: ({value}) => {
        store.dispatch(value.action);
        takes.forEach(async (o) => {
            if(o.matcher === value.action.type || typeof o.matcher === "function" && o.matcher(value.action.type)) {
                o.resolve();
            } 
        });
    },
    select: ({value}) => value.selector(store.getState())
});