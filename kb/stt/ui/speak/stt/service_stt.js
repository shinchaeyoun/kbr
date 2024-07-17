import { EventManager } from "/kb/common/handwriting/service/EventManager.js";
import { hasEvaluationError, setInnerTextIfElementExists, toggleViewElementInParent } from "/kb/common/common.js";
import { AudioRecorder } from "/kb/service/AudioRecorder.js";
import { evaluateSpeech } from "/kb/service/evaluate-speech.js";
import { TimerViewer } from "/kb/service/Timer.js";
import { setEvaluateSpeechChart } from "/kb/service/chart.js";
import { AudioPlayer } from "/kb/service/AudioPlayer.js";
import { Message } from "/kb/common/ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    //let script = "안녕하세요";
    //let questionScript = "안녕하세요 를 말해보세요.";
    
    const script = document.getElementById("questionTxt").value;
    const questionScript = document.getElementById("questionScript").value;
    
    initCommonEventListeners();
    const audioRecorder = AudioRecorder.getInstance();
    await audioRecorder.init();
    initEventListeners(audioRecorder, questionScript, script);
});
const initCommonEventListeners = () => {
    EventManager.addEventHandler("click", document.querySelector("#close-window"), () => {
        alert(Message.CANNOT_CLOSE_WINDOW);
    });
    EventManager.addEventHandler("click", document.querySelectorAll(".retry"), () => location.reload());
};
const initEventListeners = (audioRecorder, questionScript, script) => {
    const timerViewer = new TimerViewer(document.querySelector("#recording-seconds"));
    EventManager.addEventHandler("click", document.querySelector("#record-start"), async () => {
        await audioRecorder.start();
        viewRecording();
        timerViewer.start();
    });
    EventManager.addEventHandler("click", document.querySelector("#record-stop"), async () => {
        try {
            timerViewer.stop();
            await audioRecorder.stop();
            viewLoading();
            const audio = {
                audio: audioRecorder.result,
                name: "anyname.pcm",
            };
            const result = await evaluateSpeech(audio, questionScript, script);
            if (hasEvaluationError(result)) {
                throw new Error();
            }
            setSttResultText(result);
            setScore(result);
            
            
            
            const stt_answer = document.getElementById("questionTxt").value;	
            document.getElementById("sttApiResponse").value = result.sentenceLevel.text;
            document.getElementById("answerSttDiv").style.display = "";
            document.getElementById("recording-wrapper").style.display = "none";
            
            if(result.sentenceLevel.text==stt_answer) {
            	document.getElementById("sttApiResponse").style.color = 'blue';	
            }else{
            	document.getElementById("sttApiResponse").style.color = 'red';
            }
            
           
            //setEvaluateSpeechChart(result, document.querySelector("#evaluate-speech-chart-wrapper"));
            //viewResult();
            viewRetryDoneWrapper();
        }
        catch (e) {
            const errorMessage = document.querySelector("#error-message");
            if (errorMessage !== null) {
                errorMessage.classList.add("red");
                errorMessage.innerText = "주의: 다시 말해주세요.";
            }
            console.error(e);
            viewErrorResultWrapper();
            viewRetryErrorWrapper();
        }
    });
    EventManager.addEventHandler("click", document.querySelector("#play-my-record"), async () => {
        const audioPlayer = AudioPlayer.getInstance();
        audioPlayer.stop();
        await audioPlayer.playRecorder(audioRecorder);
    });
};
const setSttResultText = (evaluateSpeech) => {
    setInnerTextIfElementExists(evaluateSpeech.sentenceLevel.text, document.querySelector("#stt-result-text"));
};
const viewRecording = () => toggleViewElementInParent(document.querySelector("#recording-wrapper"));
const viewResult = () => toggleViewElementInParent(document.querySelector("#result-wrapper"));
const viewErrorResultWrapper = () => toggleViewElementInParent(document.querySelector("#result-error-wrapper"));
const viewRetryDoneWrapper = () => toggleViewElementInParent(document.querySelector("#retry-done-wrapper"));
const viewRetryErrorWrapper = () => toggleViewElementInParent(document.querySelector("#retry-error-wrapper"));
const viewLoading = () => toggleViewElementInParent(document.querySelector("#loading-info"));
const setScore = (evaluateSpeech) => {
    setInnerTextIfElementExists(evaluateSpeech.sentenceLevel.proficiencyScore.score.toFixed(0) || 0, document.querySelector("#score"));
};
