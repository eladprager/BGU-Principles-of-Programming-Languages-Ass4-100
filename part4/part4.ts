import { KeyValuePair } from "ramda";

export function f(x: number): Promise<number> {
    return new Promise<number>((resolve,reject) => {
        try {
            if(x===0)
                reject(divisionByZero)
            else
                resolve(1 / x)
        } catch (err) {
            reject(err)
        }
    })
}

export const divisionByZero = new Error("error: division by zero")

export function g(x: number): Promise<number> {
    return new Promise<number>((resolve,reject) => {
        try {
            resolve(x * x)
        } catch (err) {
            reject(err)
        }
    })
}

export function h(x: number): Promise<number> {
    return new Promise<number>((resolve,reject)=> {
    g(x)
        .then((x) => f(x) )
        .then((x) => resolve(x) )
        .catch((err) => reject(err));
    })
}

export type slowerResult<T> = KeyValuePair<number, T>;

const indexForPromises = <T>(p: Promise<T>, i: number): Promise<slowerResult<T>> =>
    new Promise<slowerResult<T>>((resolve, reject) =>
        p.then((x) => resolve([i, x]))
            .catch((err) => reject(err)));

export const slower = <T>(p: Promise<T>[]): Promise<slowerResult<T>> => {
    const p1 = indexForPromises(p[0], 0);
    const p2 = indexForPromises(p[1], 1);

    return new Promise<slowerResult<T>>((resolve, reject) =>
        Promise.race([p1, p2])
            .then((fasterResult) => {
                Promise.all([p1, p2])
                    .then((x) => resolve(x.find(element => element[0] != fasterResult[0])))
                    .catch((err) => reject(err))
            })
            .catch((err) => reject(err))
    );
};