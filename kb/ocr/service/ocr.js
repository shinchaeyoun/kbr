import { GATEWAY_ADDRESS } from "/kb/ocr/url.js";
import { getUserInfo } from "./data.js";

export const ocr = async (units, units_user, questionScript, script) => {
    const formData = await createOcrFormData(units, units_user);
    formData.append("userInfo", getUserInfo());
    questionScript && formData.append("questionScript", questionScript);
    script && formData.append("script", script);

    //units_user -> 합쳐진 판서 이미지
    
    const response = await fetch(`${GATEWAY_ADDRESS}/api/ocr.do`, {
        //const response = await fetch(`http://localhost/api/ocr.do`, {
        headers: {
            Accept: "application/json",
        },
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`status code ${response.status.toString()}.\n${await response.text()}`);
    }
    return await response.json();
};
export const createOcrFormData = (units, units_user) => {
	    return new Promise((resolve, reject) => {
		   const formData = new FormData();
           formData.append('fileSystem', units.blob, 'image.png');
           formData.append('fileUser', units_user.blob, 'image.png');
           resolve(formData);
        });
};

export var OCRImageType;
(function (OCRImageType) {
    OCRImageType["WORD"] = "word";
    OCRImageType["CHARACTER"] = "character";
    OCRImageType["NUMBER"] = "number";
})(OCRImageType || (OCRImageType = {}));
