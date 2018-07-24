export const effectCreators = {
    take: (matcher) => ({type: "take", matcher}),
    put: (action) => ({type: "put", action}),
    select: (selector) => ({type: "select", selector})
};

const takes = [];

export const customEffects = (store) => ({
    take: ({value}) => {
        const p = new Promise();
        takes.push({matcher: value.matcher, p});

        return p;
    },
    put: ({value}) => {
        store.dispatch(value.action);
        takes.forEach(async (o) => {
            if(typeof o.matcher === "function" && o.matcher(value.action.type)) {
                o.p.resolve();
            } else if(o.matcher === ) {

            }
        });
    },
    select: ({value}) => value.selector(store.getState())
});