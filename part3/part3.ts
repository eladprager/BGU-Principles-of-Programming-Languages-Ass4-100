import { range } from "ramda";

let checkGenrator : Generator;
type Gen = Generator | (() => Generator);

const isGenerator = (x: Gen): x is Generator => typeof(checkGenrator) === typeof(x);
const isGeneratorFunc = (x: Gen): x is () => Generator => "function" === typeof(x);

export function* braid(generator1: Gen, generator2: Gen): Generator {
    let a: Generator;
    let b: Generator;
    if (isGeneratorFunc(generator1)) a = generator1();
    else a = generator1;
    if (isGeneratorFunc(generator2)) b = generator2();
    else b = generator2;
    let c = a.next();
    let d = b.next();
    while (!c.done && !d.done) {
        yield c.value;
        yield d.value;
        c = a.next();
        d = b.next();
    }
    while (!c.done){
        yield c.value;
        c = a.next();
    }
    while (!d.done){
        yield d.value;
        d = b.next();
    }
}

export function* biased(generator1 : Gen, generator2: Gen): Generator {
    let a: Generator;
    let b: Generator;
    if (isGeneratorFunc(generator1)) a = generator1();
    else a = generator1;
    if (isGeneratorFunc(generator2)) b = generator2();
    else b = generator2;
    let c = a.next();
    let d = b.next();
    while (!c.done && !d.done) {
        yield c.value;
        c = a.next();
        if (c.done) break;
        yield c.value;
        yield d.value;
        c = a.next();
        d = b.next();
    }
    while (!c.done){
        yield c.value;
        c = a.next();
    }
    while (!d.done){
        yield d.value;
        d = b.next();
    }
}

