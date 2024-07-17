import { CanvasLayer } from "./CanvasLayer.js";
import { isOutOfRange } from "../util/util.js";
export class PathLayer extends CanvasLayer {
    addEvent(pathEvent) {
        super.addEvent(pathEvent);
    }
    draw() {
        this.events.forEach((pathEvent) => {
            pathEvent.pathStyle = this.pathStyle;
            pathEvent.execute(this.canvasManager);
        });
    }
    isPointInPathFromMouseEvent(pathEventIndex, e) {
        return this.isPointInPath(pathEventIndex, {
            x: this.canvasManager.getX(e),
            y: this.canvasManager.getY(e),
        });
    }
    isPointInPath(pathEventIndex, { x, y }) {
        if (isOutOfRange(pathEventIndex, this.eventSize - 1)) {
            throw new Error("Index out of range error!");
        }
        return this.events[pathEventIndex].isPointIn({ x, y }, this.canvasManager);
    }
    getLineBoundsInPath(pathEventIndex, line) {
        if (isOutOfRange(pathEventIndex, this.eventSize - 1)) {
            throw new Error("Index out of range error!");
        }
        return line.map((coordinate) => this.isPointInPath(pathEventIndex, coordinate));
    }
}
