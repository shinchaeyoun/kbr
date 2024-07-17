import { CanvasLayer } from "./CanvasLayer.js";
import { ManuscriptPaperCharBoxEvent } from "../event/ManuscriptPaperCharBoxEvent.js";
export class ManuscriptPaperLayer extends CanvasLayer {
    charBoxWidth = 50;
    charBoxHeight = 50;
    constructor(id) {
        super(id);
        this.init();
    }
    init() {
        const execute = (charBoxWidth, charBoxHeight, canvas) => {
            const canvasElement = canvas.ctx.canvas;
            const widthBoxMaxCount = Math.floor((canvasElement.width / canvas.scaleWeight) / charBoxWidth);
            const heightBoxMaxCount = Math.floor((canvasElement.height / canvas.scaleWeight) / charBoxHeight);
            for (let i = 0; i < heightBoxMaxCount; i++) {
                const top = i * charBoxHeight;
                for (let j = 0; j < widthBoxMaxCount; j++) {
                    const left = j * charBoxWidth;
                    const manuscriptPaperCharBoxEvent = new ManuscriptPaperCharBoxEvent(left, top, charBoxWidth, charBoxHeight);
                    manuscriptPaperCharBoxEvent.execute(canvas);
                    this.addEvent(manuscriptPaperCharBoxEvent);
                }
            }
        };
        execute(this.charBoxWidth, this.charBoxHeight, this.canvasManager);
    }
}
