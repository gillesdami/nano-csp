async function* asyncChannel(emiter) {
    const buffer = [];
    let bufferContentPromiseResolver, 
        bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);

    emiter((emit) => {
        buffer.push(emit);
        bufferContentPromiseResolver();
    });

    do {
        if(!buffer.length) {
            bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);
        }

        await bufferContentPromise;
    } while(false !== (yield buffer.unshift))
}

const eventIterator = asyncChannel((emit) => dom.addEventListener("event", emit));

do {
    e = await eventIterator.next();
} while(!e.done)