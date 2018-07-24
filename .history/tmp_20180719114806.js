async function* asyncChannel(emiter) {
    const buffer = [];
    let bufferContentPromiseResolver, bufferContentPromiseRejecter;

    const promiseHandler = (resolve, reject) => {
        bufferContentPromiseResolver = resolve;
        bufferContentPromiseRejecter = reject;
    };

    let bufferContentPromise = new Promise(promiseHandler);

    emiter((emit, cancel) => {
        buffer.push(emit);
        bufferContentPromiseResolver();
    });

    do {
        if(!buffer.length) {
            bufferContentPromise = new Promise(promiseHandler);
        }

        await bufferContentPromise;
        
    } while(false !== (yield buffer.unshift))
}

const eventIterator = asyncChannel((emit) => dom.addEventListener("event", emit));

do {
    e = await eventIterator.next();
} while(!e.done)