async function* asyncChannel(emiter) {
    const buffer = [];

    let bufferContentPromiseResolver, 
        bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);

    emiter((emit, close) => {
        buffer.push(emit);
        bufferContentPromiseResolver(close);
    });

    do {
        if(!buffer.length) {
            bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);
        }
        
    } while(true !== await bufferContentPromise && false !== (yield buffer.unshift))
}

/*
const eventIterator = asyncChannel((emit, close) => dom.addEventListener("event", emit));

do {
    e = await eventIterator.next();
} while(!e.done)
*/