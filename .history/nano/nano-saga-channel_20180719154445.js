export default async function* channel(emiter) {
    const buffer = [];

    let bufferContentPromiseResolver, bufferContentPromise;

    emiter((emit, close) => {
        buffer.push(emit);
        bufferContentPromiseResolver(close);
    });

    do {
        if(!buffer.length) {
            bufferContentPromise = new Promise(r => bufferContentPromiseResolver = r);
        }
        
    } while(true !== await bufferContentPromise && false !== (yield buffer.shift()))
}