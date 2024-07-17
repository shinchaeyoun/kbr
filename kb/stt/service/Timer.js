import { Observable } from "./Observer.js";
class Timer {
    timer;
    observable;
    _seconds;
    constructor(observable) {
        this.observable = observable;
        this._seconds = 0;
    }
    start() {
        if (this.timer !== undefined) {
            throw new Error("Stop timer first!");
        }
        this.timer = setInterval(() => {
            this._seconds++;
            this.observable.notify();
        }, 1000);
    }
    stop() {
        if (this.timer === undefined) {
            throw new Error("Need starting timer first!");
        }
        clearInterval(this.timer);
        this.timer = undefined;
    }
    get seconds() {
        return this._seconds;
    }
}
export class TimerViewer {
    timer;
    element;
    constructor(element) {
        if (element === null) {
            throw new Error("Need existing HTMLElement!");
        }
        const observable = new Observable();
        observable.subscribe(this);
        this.timer = new Timer(observable);
        this.element = element;
    }
    start() {
        this.timer.start();
    }
    stop() {
        this.timer.stop();
    }
    update() {
        this.element.innerText = this.getMinuteSeconds(this.timer.seconds);
    }
    getMinuteSeconds(rawSeconds) {
        const minutes = Math.floor(rawSeconds / 60);
        const seconds = rawSeconds - (minutes * 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
}
