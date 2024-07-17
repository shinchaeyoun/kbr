import { HandwritingBoundEvent } from "./HandwritingBoundEvent.js";
export class HandwritingBoundReplayEvent extends HandwritingBoundEvent {
    getDelayConnectPointsMilliseconds() {
        return 15;
    }
}
