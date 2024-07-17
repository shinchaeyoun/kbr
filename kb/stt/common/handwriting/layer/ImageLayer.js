import { CanvasLayer } from "./CanvasLayer.js";
export class ImageLayer extends CanvasLayer {
    constructor(id) {
        super(id);
    }
    draw(filePath, moveTo = { x: 0, y: 0 }) {
        const image = new Image();
        image.onload = () => {
            this.canvasManager.ctx.drawImage(image, moveTo.x, moveTo.y, this.canvasManager.width, this.canvasManager.height);
        };
        image.src = filePath;
    }
}
