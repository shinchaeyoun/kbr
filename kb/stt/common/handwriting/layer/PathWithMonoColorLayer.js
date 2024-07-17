import { PathLayer } from "./PathLayer.js";
export class PathWithMonoColorLayer extends PathLayer {
    fillColor;
    constructor(fillColor = "#ccc", id) {
        super(id);
        this.fillColor = fillColor;
    }
    get pathStyle() {
        return {
            fillColor: this.fillColor,
        };
    }
}
