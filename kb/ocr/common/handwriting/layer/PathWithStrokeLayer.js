import { PathLayer } from "./PathLayer.js";
export class PathWithStrokeLayer extends PathLayer {
    get pathStyle() {
        return {
            strokeColor: "black",
        };
    }
}
