import { HandwritingDefaultEvent } from "./HandwritingDefaultEvent.js";
export class HandwritingTimestampEvent extends HandwritingDefaultEvent {
    constructor(line) {
        super(line);
    }
    addCoordinate(coordinate) {
        this.line.push({
            ...coordinate,
            timestamp: new Date().getTime(),
        });
    }
}
