import { CanvasLayerId } from "./ui.js";
export const toggleViewElementInParent = (viewElement) => toggleViewElementInWrapper(viewElement, viewElement?.parentElement);
export const toggleViewElementInWrapper = (viewElement, wrapperElement) => {
    if (viewElement !== null && wrapperElement !== null) {
        Array.from(wrapperElement.children).forEach((child) => hide(child));
        show(viewElement);
    }
};

export const toggleHideElementInWrapper = (viewElement, wrapperElement) => {
    if (viewElement !== null && wrapperElement !== null) {
        hide(viewElement);
    }
};

export const toggleShowElementInWrapper = (viewElement, wrapperElement) => {
    if (viewElement !== null && wrapperElement !== null) {
        show(viewElement);
    }
};

export const show = (element) => element?.classList.remove("disp-none");
export const hide = (element) => element?.classList.add("disp-none");
export const setInnerTextIfElementExists = (text, element) => {
    if (element !== null) {
        element.innerText = text;
    }
};
export var EvaluateSpeechSubject;
(function (EvaluateSpeechSubject) {
    EvaluateSpeechSubject["KO_HOLISTIC"] = "\uC720\uCC3D\uC131";
    EvaluateSpeechSubject["KO_PITCH"] = "\uC5B5\uC591";
    EvaluateSpeechSubject["KO_SEGMENT"] = "\uBA85\uB8CC\uC131";
    EvaluateSpeechSubject["KO_RATE"] = "\uC18D\uB3C4";
    EvaluateSpeechSubject["KO_PHONOLOGY"] = "\uC815\uD655\uC131";
})(EvaluateSpeechSubject || (EvaluateSpeechSubject = {}));
export const isInit = (object) => object !== undefined && object !== null;
export const hasEvaluationError = (evaluateResult) => (evaluateResult.sentenceLevel.proficiencyScore.score < 1).length > 0;
export const assertHandwritingLinePointsLengthValid = (canvasWorkspaces, validLength) => {
    const canvasWorkspacesLineAdded = getCanvasWorkspacesLineAdded(canvasWorkspaces);
    const canvasPointCounts = canvasWorkspacesLineAdded.map((canvasWorkspace) => {
        const handwritingLayer = canvasWorkspace.getLayerById(CanvasLayerId.HANDWRITING_LAYER_ID);
        const linePoints = handwritingLayer.cloneEvents().flatMap((handwritingEvent) => handwritingEvent.cloneLine());
        return linePoints.length;
    });
    if (canvasPointCounts.some((count) => count < validLength)) {
        throw new CanvasPointsNotEnoughError(validLength);
    }
};
export var HandwritingTypoValidLinePointsLength;
(function (HandwritingTypoValidLinePointsLength) {
    HandwritingTypoValidLinePointsLength[HandwritingTypoValidLinePointsLength["JAMO"] = 5] = "JAMO";
    HandwritingTypoValidLinePointsLength[HandwritingTypoValidLinePointsLength["CHARACTER"] = 15] = "CHARACTER";
    HandwritingTypoValidLinePointsLength[HandwritingTypoValidLinePointsLength["NUMBER"] = 5] = "NUMBER";
})(HandwritingTypoValidLinePointsLength || (HandwritingTypoValidLinePointsLength = {}));
export const getCanvasWorkspacesLineAdded = (canvasWorkspaces) => canvasWorkspaces.filter((canvasWorkspace) => {
    const handwritingLayer = canvasWorkspace.getLayerById(CanvasLayerId.HANDWRITING_LAYER_ID);
    return handwritingLayer !== undefined && handwritingLayer.eventSize > 0;
});
export class CanvasPointsNotEnoughError extends Error {
    validLength;
    constructor(validLength) {
        super(`Some canvas' points' length is under ${validLength}.`);
        this.validLength = validLength;
    }
}
