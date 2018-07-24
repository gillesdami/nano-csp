export default async function* channel(emiter) {
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
        console.log(buffer, bufferContentPromise);
        
    } while(true !== await bufferContentPromise && false !== (yield buffer.unshift))
}