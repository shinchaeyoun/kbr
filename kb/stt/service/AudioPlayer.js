export class AudioPlayer {
    audio;
    static instance;
    constructor() {
    }
    static getInstance() {
        if (AudioPlayer.instance === undefined) {
            AudioPlayer.instance = new this();
        }
        return AudioPlayer.instance;
    }
    async playRecorder(audioRecorder) {
        await this.playAudio(audioRecorder.result);
    }
    async playAudio(data) {
        this.audio = new Audio();
        const source = document.createElement("source");
        source.src = URL.createObjectURL(data);
        this.audio.append(source);
        await this.audio.play();
    }
    stop() {
        if (this.audio !== undefined) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}
