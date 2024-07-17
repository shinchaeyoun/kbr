import { HandwritingEvent } from "./HandwritingEvent.js";
import { isOutOfRange } from "../util/util.js";
export class HandwritingBoundEvent extends HandwritingEvent {
    pathLayer;
    pathEventIndex;
    constructor(line, pathLayer, pathEventIndex) {
        super(line);
        this.pathLayer = pathLayer;
        this.pathEventIndex = pathEventIndex;
    }
    isInbound(coordinate) {
        return !isOutOfRange(this.pathEventIndex, this.pathLayer.eventSize - 1)
            && this.pathLayer.isPointInPath(this.pathEventIndex, coordinate);
    }
    getNormalStrokeColor() {
        return "blue";
    }
    getErrorStrokeColor() {
        return "red";
    }
    getDelayConnectPointsMilliseconds() {
        return 0;
    }
}
