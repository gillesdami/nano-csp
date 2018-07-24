
dom.addEventListener(e, f);

const 

async function* asyncChannelB(emiter) {
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
    } while(yield buffer.unshift)
}