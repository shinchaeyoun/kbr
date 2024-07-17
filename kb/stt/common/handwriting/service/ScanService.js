import { download } from "../util/util.js";
export class ScanService {
    canvas;
    constructor(canvas) {
        this.canvas = canvas;
    }
    async download() {
        download(await this.read());
    }
    async read(type, quality) {
        const blob = await new Promise((resolve) => this.canvas.ctx.canvas.toBlob((blob) => resolve(blob), type, (quality || 1.0)));
        if (blob === null) {
            throw new Error("An error occurred while getting blob!");
        }
        return blob;
    }
    write(blob) {
        const image = new Image();
        image.onload = () => {
            this.canvas.ctx.drawImage(image, 0, 0);
        };
        image.src = URL.createObjectURL(blob);
    }
}
