import { CanvasManager } from "./CanvasManager.js";
import { getElementZIndex } from "../util/util.js";
import { PathWithStrokeLayer } from "../layer/PathWithStrokeLayer.js";
import { PathWithSequentialColorsLayer } from "../layer/PathWithSequentialColorsLayer.js";
import { PathWithMonoColorLayer } from "../layer/PathWithMonoColorLayer.js";
import { ManuscriptPaperLayer } from "../layer/ManuscriptPaperLayer.js";
import { DefaultLayer } from "../layer/DefaultLayer.js";
import { GridLayer } from "../layer/GridLayer.js";
import { ImageLayer } from "../layer/ImageLayer.js";
import { HandwritingDynamicDefaultLayer } from "../layer/HandwritingDynamicDefaultLayer.js";
import { HandwritingDefaultLayer } from "../layer/HandwritingDefaultLayer.js";
import { HandwritingDynamicFluencyLayer } from "../layer/HandwritingDynamicFluencyLayer.js";
import { FilledLayer } from "../layer/FilledLayer.js";
export class CanvasWorkspace {
    width;
    height;
    layers;
    workspaceElement;
    workspaceWrapperElement;
    constructor(workspaceWrapperElement, width, height) {
        this.workspaceWrapperElement = workspaceWrapperElement;
        this.initWorkspaceElement();
        this.width = width;
        this.height = height;
        this.layers = [];
    }
    getLayerIndexById(layerId) {
        const foundLayerIndex = this.layers.findIndex((layer) => layer.id === layerId);
        return foundLayerIndex < 0 ? undefined : foundLayerIndex;
    }
    getLayerIndex(layer) {
        const foundLayerIndex = this.layers.findIndex((storedLayer) => storedLayer === layer);
        return foundLayerIndex < 0 ? undefined : foundLayerIndex;
    }
    getLayerById(layerId) {
        return this.layers.find((layer) => layer.id === layerId);
    }
    getLayerByIndex(index) {
        return this.layers[index];
    }
    removeLayer(layer) {
        this.removeLayerById(layer.id);
    }
    removeLayerById(layerId) {
        const layerIndex = this.getLayerIndexById(layerId);
        if (layerIndex === undefined) {
            throw new Error(`The layer has id "${layerId}" is not exists!`);
        }
        const shouldRemoveLayer = this.layers.splice(layerIndex, 1)[0];
        shouldRemoveLayer.remove();
    }
    clear() {
        this.layers.forEach((layer) => layer.clear());
        this.layers = [];
        this.workspaceElement?.remove();
    }
    async addLayer(layer) {
        await layer.setCanvasManager(this.createCanvasManager(this.appendNewCanvasElement()));
        this.layers.push(layer);
        return layer;
    }
    createCanvasManager(canvasElement) {
        return new CanvasManager(canvasElement, this.width, this.height);
    }
    appendNewCanvasElement() {
        const createCanvasElement = () => {
            let newCanvasElement;
            if (this.layers.length === 0) {
                newCanvasElement = document.createElement("canvas");
            }
            else {
                const srcCanvasElement = this.layers[this.layers.length - 1].canvasManager.ctx.canvas;
                newCanvasElement = srcCanvasElement.cloneNode(true);
                newCanvasElement.style.position = "absolute";
                const newCanvasElementZIndex = getElementZIndex(srcCanvasElement) + 1;
                newCanvasElement.style.zIndex = newCanvasElementZIndex.toString();
            }
            return newCanvasElement;
        };
        const appendCanvasElement = (canvasElement) => {
            this.workspaceElement?.insertAdjacentElement("afterbegin", canvasElement);
        };
        const newCanvasElement = createCanvasElement();
        appendCanvasElement(newCanvasElement);
        return newCanvasElement;
    }
    initWorkspaceElement() {
        this.workspaceElement = document.createElement("div");
        this.workspaceElement.style.position = "relative";
        this.workspaceWrapperElement.append(this.workspaceElement);
    }
    async addDefaultLayer(id) {
        return await this.addLayer(new DefaultLayer(id));
    }
    async addFilledLayer(id) {
        return await this.addLayer(new FilledLayer(id));
    }
    async addPathWithStrokeLayer(id) {
        return await this.addLayer(new PathWithStrokeLayer(id));
    }
    async addPathWithMonoColorLayer(fillColor, id) {
        return await this.addLayer(new PathWithMonoColorLayer(fillColor, id));
    }
    async addPathWithSequentialColorsLayer(id) {
        return await this.addLayer(new PathWithSequentialColorsLayer(id));
    }
    async addHandwritingDynamicLayer(id) {
        return await this.addLayer(new HandwritingDynamicDefaultLayer(id));
    }
    async addHandwritingFluencyLayer(id) {
        return await this.addLayer(new HandwritingDynamicFluencyLayer(id));
    }
    async addHandwritingStaticLayer(id) {
        return await this.addLayer(new HandwritingDefaultLayer(id));
    }
    async addManuscriptPaperLayer(id) {
        return await this.addLayer(new ManuscriptPaperLayer(id));
    }
    async addGridLayer(id) {
        return await this.addLayer(new GridLayer(id));
    }
    async addImageLayer(id) {
        return await this.addLayer(new ImageLayer(id));
    }
}
