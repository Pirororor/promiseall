'use strict';

class PromiseAll {

    constructor() {
        this.promises = [];
    }

    add(tasks) {
        if (Array.isArray(tasks)) {
            tasks.forEach((t) => {
                this.add(t);
            });
        } else if (typeof tasks === 'function') {
            this.add(tasks());
        } else if (tasks instanceof Promise) {
            this.promises.push(tasks.catch((err) => err));
        } else {
            this.promises.push(tasks);
        }
        return this;
    }

    async await() {
        const retList = await Promise.all(this.promises).catch((err) => err);
        const errors = [];
        retList.forEach((ret) => {
            if (ret instanceof Error) {
                errors.push(ret);
            }
        });

        if (errors.length > 0) {
            const e = new Error('Promise All Error');
            e.errors = errors;
            throw e;
        }
        return retList;
    }
}

module.exports = () => new PromiseAll();
