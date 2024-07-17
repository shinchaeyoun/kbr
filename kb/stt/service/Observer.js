export class Observable {
    observers;
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        this.observers = this.observers.filter((existed) => existed !== observer);
    }
    notify() {
        this.observers.forEach((observer) => observer.update());
    }
}
