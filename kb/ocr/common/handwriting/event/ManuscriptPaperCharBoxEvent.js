export class ManuscriptPaperCharBoxEvent {
    left;
    top;
    charBoxWidth;
    charBoxHeight;
    constructor(left, top, charBoxWidth, charBoxHeight) {
        this.left = left;
        this.top = top;
        this.charBoxWidth = charBoxWidth;
        this.charBoxHeight = charBoxHeight;
    }
    execute(canvas) {
        canvas.ctx.strokeStyle = "pink";
        canvas.ctx.lineWidth = 2;
        canvas.ctx.lineCap = "round";
        canvas.ctx.lineJoin = "round";
        canvas.ctx.strokeRect(this.left, this.top, this.charBoxWidth, this.charBoxHeight);
    }
}
