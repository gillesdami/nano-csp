export default async function runner(saga, args = [], executorsCreator = () => [], mocks = []) {
    const logicIterator = saga(...args),
        executors = executorsCreator((saga, args) => runner(saga, args, executorsCreator, mocks));
    let response = undefined;

    while(1) {
        let {done, value} = await logicIterator.next(await response);

        const mock = mocks.find(m => m.matcher(value));
        if(mock) value = mock.value;
        
        response = value && executors.find(e => e.name === value.name).fn(value);

        if(done) return value;
    }
};