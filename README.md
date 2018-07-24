# async generator

Generators that return promises, when a promise resolve it returns an object {value, done}

ES2018

Already in:
node harmony
Firefox 57
Chrome 63
Safari 11.1

//SHEMA async gen

## basic usage

async function* agen() {
    yield 1;
    yield 2;
    yield fetch("something");
}

asyncIterator = agen();
asyncIterator.next().then(({ value, done }) => /* ... */);

for await (const line of readLines(filePath)) {
  console.log(line);
}

## observable vs async generator

//a bit like observable in reactive programming (RxJs) but not eager on data, push stream

//iterator are pull stream, lazy, powerfull for concurency, may be use to pull logic and not only data!

## saga pattern

asyncIterator can return other asyncIterator.
They can be used to create a fully testable, mockable and easealy splitable js code with eavily asynchronious content.

