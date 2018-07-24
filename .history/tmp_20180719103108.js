
dom.addEventListener(e, f);

take(l)

async function* asyncChannel(emiter) {
    const buffer = [];
    let bufferContentPromiseResolver, 
        bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);

    emiter((emit) => {
        buffer.push(emit);
        if(buffer.length === 1) {
            bufferContentPromiseResolver();
            bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);
        }
    });

    do {
        await bufferContentPromise;
    } while(yield buffer.unshift)
}