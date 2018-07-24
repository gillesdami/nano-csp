async function* ai() {
    yield "hi";
}

asyncIterable = ai();
ai.next().then(console.log);