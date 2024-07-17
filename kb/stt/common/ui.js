import { CanvasWorkspace } from "./handwriting/workspace/CanvasWorkspace.js";
import { PathEvent } from "./handwriting/event/PathEvent.js";
import { TextPathFactory } from "/kb/stt/lib/canvas-path-helper.mjs.js";
import { EventManager } from "./handwriting/service/EventManager.js";
export const initDictationBoard = async (question, answerCount, boardWrapperElement, createAnswerCanvasWrapper, canvasWidth, canvasHeight, doesViewTextPath, failCnt) => {
    const canvasWorkspaces = [];
    const characters = question.split("");
    let i = 0;
    for (const dummy of [...Array(answerCount)]) {
        const canvasWorkspaceGroups = [];
        const answerGroupElement = document.createElement("div");
        answerGroupElement.classList.add("answer-group-wrapper");
        answerGroupElement.classList.add("flex-center");
        boardWrapperElement.append(answerGroupElement);
        for (const character of characters) {
            // initialize workspace
            const canvasWrapperElement = createAnswerCanvasWrapper();
            answerGroupElement.append(canvasWrapperElement);
            const workspaceWrapperElement = canvasWrapperElement.querySelector(".workspace");
            if (workspaceWrapperElement === null) {
                throw new Error("Need essentials!");
            }
            const canvasWorkspace = new CanvasWorkspace(workspaceWrapperElement, canvasWidth, canvasHeight);
            // add layers
            // add grid layer
            const gridLayer = await canvasWorkspace.addGridLayer();
            gridLayer.draw("pink");
            if (doesViewTextPath && character !== " ") {
                // add font layer
                const pathLayer = await canvasWorkspace.addPathWithMonoColorLayer(i === 0 ? "#eee" : "", CanvasLayerId.PATH_LAYER_ID);
                pathLayer.addEvent(new PathEvent(await TextPathFactory.create({
                    text: character,
                    fontSize: 120,
                    fontUrl: "/kb/stt/assets/NanumBarunGothicBold.ttf",
                }), { x: 10, y: -2 }));
                if(failCnt >= 2){
                	//설명 : 글자 가이드라인 표시
	                pathLayer.draw();
                }
            }
            // add handwriting layer
            const handwritingLayer = await canvasWorkspace.addHandwritingFluencyLayer(CanvasLayerId.HANDWRITING_LAYER_ID);
            handwritingLayer.lineOptions = { lineWidth: 5 };
            // add event to clear canvas
            EventManager.addEventHandler("click", canvasWrapperElement.querySelector(".clear-canvas"), () => handwritingLayer.clear());
            canvasWorkspaceGroups.push(canvasWorkspace);
        }
        canvasWorkspaces.push(canvasWorkspaceGroups);
        i++;
    }
    return canvasWorkspaces;
};
export const createHTMLElement = (elementString) => {
    const dummyElement = document.createElement("div");
    dummyElement.innerHTML = elementString.trim();
    return dummyElement.firstElementChild;
};
export var CanvasLayerId;
(function (CanvasLayerId) {
    CanvasLayerId["HANDWRITING_LAYER_ID"] = "handwritingLayer";
    CanvasLayerId["HANDWRITING_VIEW_LAYER_ID"] = "handwritingViewLayer";
    CanvasLayerId["PATH_LAYER_ID"] = "pathLayer";
})(CanvasLayerId || (CanvasLayerId = {}));
export var Message;
(function (Message) {
    Message["CANNOT_CLOSE_WINDOW"] = "\uB2EB\uAE30 \uAE30\uB2A5\uC740 \uBE0C\uB77C\uC6B0\uC800 \uC815\uCC45\uC73C\uB85C \uC778\uD558\uC5EC Javascript\uB85C Open\uD55C \uD398\uC774\uC9C0\uC5D0\uB9CC \uC801\uC6A9 \uAC00\uB2A5\uD569\uB2C8\uB2E4.\n\uBCF8 \uD654\uBA74\uC5D0\uC11C \uB2EB\uAE30 \uAE30\uB2A5\uC740 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.";
})(Message || (Message = {}));
