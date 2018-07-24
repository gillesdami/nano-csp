async function* ai() {
    yield "hi";
    return "done";
}

asyncIterable = ai();
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);
asyncIterable.next().then(console.log);