async function* ai() {
    yield "hi";
}

asyncIterable = ai();
asyncIterable.next().then(console.log);