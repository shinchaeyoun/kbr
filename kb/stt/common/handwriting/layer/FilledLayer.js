import { CanvasLayer } from "./CanvasLayer.js";
export class FilledLayer extends CanvasLayer {
    fill(fillColor) {
        this.canvasManager.ctx.fillStyle = fillColor;
        this.canvasManager.ctx.fillRect(0, 0, this.canvasManager.width, this.canvasManager.height);
    }
}
