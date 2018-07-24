export const effectCreators = {
    take: (matcher) => ({type: "TAKE", matcher}),
    put: (action) => ({type: "PUT", action}),
    select: (selector) => ({type: "SELECT", selector})
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