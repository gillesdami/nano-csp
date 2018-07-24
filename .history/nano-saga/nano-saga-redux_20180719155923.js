export const effectCreators = {
    take: (stringOrMatcher) => ({type: "take", stringOrMatcher}),
    put: (action) => ({type: "put", action}),
    select: (selector) => ({type: "select", selector})
};

export const customEffects = (store) => ({
    take: (step) => {
    },
    put: (step) => {

    },
    select: (step) => step.value.selector(store.getState())
});