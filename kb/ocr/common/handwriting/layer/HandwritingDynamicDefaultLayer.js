import { HandwritingDynamicLayer } from "./HandwritingDynamicLayer.js";
import { HandwritingDefaultEvent } from "../event/HandwritingDefaultEvent.js";
export class HandwritingDynamicDefaultLayer extends HandwritingDynamicLayer {
    createHandwritingEvent(line) {
        return new HandwritingDefaultEvent(line);
    }
}
