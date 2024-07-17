import { cloneDeep } from "../util/lodash-clonedeep.js";
export class HandwritingEvent {
    line;
    constructor(line) {
        this.line = line;
    }
    addCoordinate(coordinate) {
        this.line.push(coordinate);
    }
    cloneLine() {
        return cloneDeep(this.line);
    }
    async execute(canvasManager) {
        let index = 0;
        for (const coordinate of this.line) {
            const x = coordinate.x;
            const y = coordinate.y;
            canvasManager.ctx.beginPath();
            if (index === 0) {
                canvasManager.ctx.moveTo(x, y);
            }
            else {
                if (this.getDelayConnectPointsMilliseconds() > 0) {
                    await this.delay();
                }
                const prevX = this.line[index - 1].x;
                const prevY = this.line[index - 1].y;
                if (this.isInbound({ x, y })) {
                    canvasManager.ctx.strokeStyle = this.getNormalStrokeColor();
                }
                else {
                    canvasManager.ctx.strokeStyle = this.getErrorStrokeColor();
                }
                canvasManager.ctx.moveTo(prevX, prevY);
                canvasManager.ctx.lineTo(x, y);
                canvasManager.ctx.stroke();
            }
            index++;
        }
    }
    delay() {
        return new Promise((resolve) => setTimeout(resolve, this.getDelayConnectPointsMilliseconds()));
    }
}
