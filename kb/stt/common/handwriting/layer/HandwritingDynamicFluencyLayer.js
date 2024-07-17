import { HandwritingDynamicLayer } from "./HandwritingDynamicLayer.js";
import { HandwritingTimestampEvent } from "../event/HandwritingTimestampEvent.js";
export class HandwritingDynamicFluencyLayer extends HandwritingDynamicLayer {
    createHandwritingEvent(line) {
        return new HandwritingTimestampEvent(line);
    }
}
