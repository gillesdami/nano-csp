export const effectCreators = {
    take: (stringOrMatcher) => ({type: "take", stringOrMatcher}),
    put: (action) => ({type: "put", action}),
    select: (selector) => ({type: "select", selector})
};

const stringOrMatchers = [];

export const customEffects = (store) => ({
    take: ({value}) => {
        const p = new Promise();
        stringOrMatchers.push([value.stringOrMatcher, p]);

        return p;
    },
    put: ({value}) => {
        store.dispatch(value.action);
        stringOrMatchers.forEach(async (stringOrMatcher) => {
            if(typeof stringOrMatcher === "function" && stringOrMatcher(value.action.type)) {
                
            } else {

            }
        });
    },
    select: ({value}) => value.selector(store.getState())
});