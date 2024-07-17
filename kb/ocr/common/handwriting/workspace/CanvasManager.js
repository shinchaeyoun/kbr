import { EventManager } from "/kb/ocr/common/handwriting/service/EventManager.js";
import { CanvasPathHelper } from "/kb/ocr/lib/canvas-path-helper.mjs.js";
export class CanvasManager {
    scaleWeight;
    width;
    height;
    _ctx;
    canvasElement;
    eventExecutors;
    constructor(canvasElement, width, height) {
        this.canvasElement = canvasElement;
        this._ctx = this.getCanvasContext2D();
        this.width = width;
        this.height = height;
        this.eventExecutors = {};
        this.scaleWeight = window.devicePixelRatio || 1;
        this.initScale();
    }
    get ctx() {
        return this._ctx;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.ctx.beginPath();
    }
    getCanvasContext2D() {
        const ctx = this.canvasElement.getContext("2d");
        if (ctx === null) {
            throw new Error("Cannot get canvas context 2d!");
        }
        return ctx;
    }
    getX(e) {
        const offsetParent = (this.canvasElement.offsetParent || document.body);
        return Math.floor(((window.TouchEvent !== undefined && e instanceof TouchEvent) ? e.touches[0] : e).pageX - offsetParent.offsetLeft);
    }
    getY(e) {
        const offsetParent = (this.canvasElement.offsetParent || document.body);
        return Math.floor(((window.TouchEvent !== undefined && e instanceof TouchEvent) ? e.touches[0] : e).pageY - offsetParent.offsetTop);
    }
    remove() {
        this.canvasElement.remove();
    }
    addEventHandlerAfter(eventName, eventExecutor) {
        const oldEventHandler = this.eventExecutors[eventName];
        EventManager.removeEventHandler(eventName, this.canvasElement, oldEventHandler);
        const newEventHandler = (e, element) => {
            if (oldEventHandler) {
                oldEventHandler(e, element);
            }
            eventExecutor(e, element);
        };
        this.addEventHandler(eventName, newEventHandler);
    }
    addEventHandlerBefore(eventName, eventExecutor) {
        const oldEventHandler = this.eventExecutors[eventName];
        EventManager.removeEventHandler(eventName, this.canvasElement, oldEventHandler);
        const newEventHandler = (e, element) => {
            eventExecutor(e, element);
            if (oldEventHandler) {
                oldEventHandler(e, element);
            }
        };
        this.addEventHandler(eventName, newEventHandler);
    }
    initEventHandler(eventName, eventExecutor) {
        this.removeExistedEventHandler(eventName);
        this.addEventHandler(eventName, eventExecutor);
    }
    removeEventHandler(eventName, eventExecutor) {
        EventManager.removeEventHandler(eventName, this.canvasElement, eventExecutor);
        delete this.eventExecutors[eventName];
    }
    addEventHandler(eventName, eventExecutor) {
        const addedEventHandlers = EventManager.addEventHandler(eventName, this.canvasElement, eventExecutor);
        this.eventExecutors[eventName] = addedEventHandlers[0];
    }
    removeExistedEventHandler(eventName) {
        this.removeEventHandler(eventName, this.eventExecutors[eventName]);
    }
    initScale() {
        this.canvasElement.style.width = `${this.width}px`;
        this.canvasElement.style.height = `${this.height}px`;
        CanvasPathHelper.initScale(this.ctx, this.scaleWeight, this.scaleWeight);
    }
}
