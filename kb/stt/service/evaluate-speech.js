import { GATEWAY_ADDRESS } from "/kb/stt/url.js";
import { getUserInfo } from "./data.js";

export const evaluateSpeech = async (audio, questionScript, script) => {
    const formData = new FormData();
    formData.append("audio", audio.audio, audio.name);
    script && formData.append("script", script);
    formData.append("userInfo", getUserInfo());
    questionScript && formData.append("questionScript", questionScript);
    const response = await fetch(`${GATEWAY_ADDRESS}/api/stt.do`, {
    //    const response = await fetch(`http://localhost/api/stt.do`, {
        headers: {
            Accept: "application/json",
        },
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`status code ${response.status.toString()}.\n${await response.text()}`);
    }
	
    return response.json();
};
