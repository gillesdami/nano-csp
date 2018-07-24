const emiter = (emit) => dom.addEventListener("event", emit);

async function* asyncChannel(emiter) {
    const buffer = [];
    let bufferContentPromiseResolver, 
        bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);

    emiter((emit) => {
        buffer.push(emit);

        if(buffer.length === 1) {
            let tmp;

            bufferContentPromise = new Promise(r => tmp = r);
            bufferContentPromiseResolver();
            bufferContentPromiseResolver = tmp;
        }
    });

    do {
        await bufferContentPromise;
    } while(false !== (yield buffer.unshift))
}

const eventIterator = asyncChannel((emit) => dom.addEventListener("event", emit));

do {
    e = await eventIterator.next();
} while(!e.done)