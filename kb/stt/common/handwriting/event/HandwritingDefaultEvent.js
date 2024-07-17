import { HandwritingEvent } from "./HandwritingEvent.js";
export class HandwritingDefaultEvent extends HandwritingEvent {
    constructor(line) {
        super(line);
    }
    isInbound({ x, y }) {
        return true;
    }
    getNormalStrokeColor() {
        return "black";
    }
    getErrorStrokeColor() {
        return this.getNormalStrokeColor();
    }
    getDelayConnectPointsMilliseconds() {
        return 0;
    }
}
