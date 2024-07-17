import { PathLayer } from "./PathLayer.js";
export class PathWithSequentialColorsLayer extends PathLayer {
    fillColors;
    constructor(id) {
        super(id);
        this.fillColors = [
            "gold",
            "yellowgreen",
            "lightseagreen",
            "darkgray",
            "lightsalmon",
            "thistle",
            "lightskyblue",
            "tan",
        ];
    }
    get pathStyle() {
        return {
            fillColor: this.fillColors[this.eventSize % this.fillColors.length],
        };
    }
}
