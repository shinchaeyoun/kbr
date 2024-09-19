import { CanvasLayer } from "./CanvasLayer.js";
export class HandwritingDefaultLayer extends CanvasLayer {
    _lineOptions;
    set lineOptions(lineOptions) {
        this._lineOptions = lineOptions;
        this.canvasManager.ctx.lineWidth = lineOptions.lineWidth;
        this.canvasManager.ctx.lineCap = lineOptions.lineCap || "round";
        this.canvasManager.ctx.lineJoin = lineOptions.lineJoin || "round";
    }
    addEvent(handWritingEvent) {
        super.addEvent(handWritingEvent);
    }
    async draw() {
        for (const handwritingEvent of this.events) {
            await handwritingEvent.execute(this.canvasManager);
        }
    }
    undo() {
        super.undo();
    }
    clear() {
        super.clear();
        this.lineOptions = {
            lineWidth: this._lineOptions?.lineWidth || 3,
            lineCap: "round",
            lineJoin: "round",
        };
    }
    initFunctionsWhenCanvasManagerInitialized() {
        this.clear();
    }
}
