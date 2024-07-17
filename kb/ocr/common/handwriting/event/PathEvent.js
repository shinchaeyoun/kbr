import { CanvasPathHelper } from "/kb/ocr/lib/canvas-path-helper.mjs.js";
export class PathEvent {
    _pathStyle;
    _path;
    _drawTranslate;
    constructor(pathValue, drawTranslate) {
        this._pathStyle = PathEvent.defaultPathStyle;
        this._path = new Path2D(pathValue);
        this._drawTranslate = drawTranslate || { x: 0, y: 0 };
    }
    execute(canvasManager) {
        const setFillColor = () => {
            if (this.pathStyle.fillColor) {
                canvasManager.ctx.fillStyle = this.pathStyle.fillColor;
                canvasManager.ctx.fill(this._path);
            }
        };
        const setStrokeColor = () => {
            if (this.pathStyle.strokeColor) {
                canvasManager.ctx.strokeStyle = this.pathStyle.strokeColor;
                canvasManager.ctx.stroke(this._path);
            }
        };
        const draw = (fncs) => {
            canvasManager.ctx.translate(this.drawTranslate.x, this.drawTranslate.y);
            fncs.forEach((fnc) => fnc());
            canvasManager.ctx.setTransform(canvasManager.scaleWeight, 0, 0, canvasManager.scaleWeight, 0, 0);
        };
        draw([setFillColor, setStrokeColor]);
    }
    get drawTranslate() {
        return this._drawTranslate;
    }
    isPointIn({ x, y }, canvasManager) {
        return CanvasPathHelper.isPointInPath({
            x: x - this.drawTranslate.x,
            y: y - this.drawTranslate.y,
        }, this.path, canvasManager.ctx, canvasManager.scaleWeight, canvasManager.scaleWeight);
    }
    get path() {
        return this._path;
    }
    set pathStyle(pathStyle) {
        this._pathStyle = pathStyle;
    }
    get pathStyle() {
        return this._pathStyle;
    }
    static get defaultPathStyle() {
        return {
            fillColor: "#ccc",
        };
    }
}
