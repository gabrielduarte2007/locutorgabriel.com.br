/* tslint:disable */
function compose(...fns) {
    return function (...args) {
        return fns.reduceRight((acc, i) => i.apply(this, args), args);
    };
}

export function Unsubscriber() {
    return function (target: any, key: string) {
        const subsMap = new Map();

        function unsubscribe() {
            this[key].forEach(sub => sub.unsubscribe());
            subsMap.delete(this);
        }

        Object.defineProperty(target, key, {
            configurable: false,
            get: function () {
                const subs = subsMap.get(this);
                if (!subs) {
                    subsMap.set(this, []);
                }
                return subsMap.get(this);
            },
            set: function (newSub) {
                this[key].push(newSub);
            },
        });

        const old = target['ngOnDestroy'] || (() => null);
        Object.defineProperty(target, 'ngOnDestroy', {
            configurable: false,
            get: function () {
                return compose(unsubscribe, old).bind(this);
            },
        });
    };
}
