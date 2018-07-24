export const effectCreators = {
    take: (stringOrMatcher) => ({type: "take", stringOrMatcher}),
    put: (action) => ({type: "put", action}),
    select: (selector) => ({type: "select", selector})
};

export const customEffects = (store) => ({
    take: ({value}) => {
    },
    put: ({value}) => store.dispatch(value.action),
    select: ({value}) => value.selector(store.getState())
});