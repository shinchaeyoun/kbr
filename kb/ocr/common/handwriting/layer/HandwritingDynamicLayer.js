import { HandwritingDefaultLayer } from "./HandwritingDefaultLayer.js";
export class HandwritingDynamicLayer extends HandwritingDefaultLayer {
    _isEditable;
    isWriting;
    currentTouch;
    clear() {
        super.clear();
        this.setEditable();
        this.isWriting = false;
        this.currentTouch = undefined;
    }
    get isEditable() {
        return this._isEditable;
    }
    setEditable() {
        this._isEditable = true;
    }
    setUnEditable() {
        this._isEditable = false;
    }
    async initFunctionsWhenCanvasManagerInitialized() {
        super.initFunctionsWhenCanvasManagerInitialized();
        await this.initEventHandlers();
    }
    async initEventHandlers() {
        const initMultiPlatformUsable = () => {
            this.canvasManager.initEventHandler("touchcancel", (e) => e.preventDefault());
            this.canvasManager.initEventHandler("touchend", (e) => e.preventDefault());
        };
        initMultiPlatformUsable();
        for (const [eventName, callback] of Object.entries(this.getEventNamesWithCallbacks())) {
            this.canvasManager.initEventHandler(eventName, await callback);
        }
    }
    getEventNamesWithCallbacks() {
        return {
            pointerdown: this.eventCallbackAsInitDraw,
            pointerup: this.eventCallbackAsDrawDone,
            pointerout: this.eventCallbackAsDrawDone,
            pointermove: this.eventCallbackAsDraw,
        };
    }
    eventCallbackAsInitDraw = (e) => {
        if (this._isEditable) {
            if (window.TouchEvent !== undefined && e instanceof TouchEvent && this.currentTouch === undefined) {
                this.currentTouch = e.touches[0];
            }
            this.isWriting = true;
            this.addEvent(this.createHandwritingEvent([]));
        }
    };
    eventCallbackAsDrawDone = async () => {
        if (this._isEditable) {
            this.currentTouch = undefined;
            this.isWriting = false;
        }
    };
    eventCallbackAsDraw = async (e) => {
        if (this._isEditable && this.isWriting) {
            if (!(window.TouchEvent !== undefined && e instanceof TouchEvent) || e.changedTouches[0].identifier === this.currentTouch?.identifier) {
                const currentHandwritingEvent = this.events[this.events.length - 1];
                currentHandwritingEvent.addCoordinate({
                    x: this.canvasManager.getX(e),
                    y: this.canvasManager.getY(e),
                });
                await currentHandwritingEvent.execute(this.canvasManager);
            }
        }
    };
}
