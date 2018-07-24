export const effectCreators = {
    take: (stringOrMatcher) => ({type: "take", stringOrMatcher}),
    put: (action) => ({type: "put", action}),
    select: (selector) => ({type: "select", selector})
};

const stringOrMatchers = [];

export const customEffects = (store) => ({
    take: ({value}) => {
        stringOrMatchers.push(value.stringOrMatcher);
    },
    put: ({value}) => store.dispatch(value.action),
    select: ({value}) => value.selector(store.getState())
});