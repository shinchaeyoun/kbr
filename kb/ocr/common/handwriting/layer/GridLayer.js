import { CanvasLayer } from "./CanvasLayer.js";
export class GridLayer extends CanvasLayer {
    draw(pathColor, lineDash) {
        this.drawOuterBorder(pathColor);
        this.drawGrid(pathColor, lineDash);
    }
    drawOuterBorder(pathColor = "black") {
        this.canvasManager.ctx.canvas.style.border = `1px solid ${pathColor}`;
    }
    drawGrid(pathColor = "black", lineDash = [2, 2]) {
        this.canvasManager.ctx.beginPath();
        this.canvasManager.ctx.lineWidth = 1;
        this.canvasManager.ctx.strokeStyle = pathColor;
        this.canvasManager.ctx.setLineDash(lineDash);
        this.drawVertical();
        this.drawHorizontal();
    }
    drawVertical() {
        const x = this.canvasManager.width / 2;
        const minY = 0;
        const maxY = this.canvasManager.height;
        this.canvasManager.ctx.moveTo(x, minY);
        this.canvasManager.ctx.lineTo(x, maxY);
        this.canvasManager.ctx.stroke();
    }
    drawHorizontal() {
        const y = this.canvasManager.height / 2;
        const minX = 0;
        const maxX = this.canvasManager.width;
        this.canvasManager.ctx.moveTo(minX, y);
        this.canvasManager.ctx.lineTo(maxX, y);
        this.canvasManager.ctx.stroke();
    }
}
