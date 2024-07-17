import { RecordRTC, RecordRTCPromisesHandler } from "/kb/stt/common/util/recordrtc-es.js";
import { isInit } from "/kb/stt/common/common.js";
export class AudioRecorder {
    static instance;
    mediaRecorder;
    _result;
    constructor() {
        this._result = new Blob();
    }
    static getInstance() {
        if (AudioRecorder.instance === undefined) {
            AudioRecorder.instance = new this();
        }
        return AudioRecorder.instance;
    }
    async init() {
        if (!isInit(this.mediaRecorder)) {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false, });
            this.mediaRecorder = new RecordRTCPromisesHandler(mediaStream, {
                type: "audio",
                mimeType: "audio/webm;codecs=pcm",
                // mimeType: "audio/wav",
                recorderType: RecordRTC.StereoAudioRecorder,
                numberOfAudioChannels: 1,
                desiredSampRate: 16000,
                disableLogs: true,
            });
        }
    }
    async start() {
        if (!isInit(this.mediaRecorder)) {
            throw new Error("Init first!");
        }
        await this.mediaRecorder.startRecording();
    }
    async stop() {
        const mediaRecorder = this.mediaRecorder;
        if (!isInit(mediaRecorder)) {
            throw new Error("Init first!");
        }
        await mediaRecorder.stopRecording();
        this._result = await mediaRecorder.getBlob();
    }
    get result() {
        return this._result;
    }
}
