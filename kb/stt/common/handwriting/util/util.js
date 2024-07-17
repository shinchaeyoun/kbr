export const getUUID = () => {
    const s4 = () => ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
export const download = (blob, extension = "png") => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getUUID()}.${extension}`;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
export const getElementZIndex = (element) => {
    if (element === null) {
        return 0;
    }
    const z = Number(window.getComputedStyle(element).getPropertyValue("z-index"));
    return isNaN(z) ? getElementZIndex(element.parentElement) : z;
};
export const urlToBase64 = (url) => {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
};
export const base64ToArrayBuffer = (base64) => {
    const decoded = window.atob(base64);
    const bytes = new Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
    }
    return new Uint8Array(bytes);
};
export const isOutOfRange = (n, max, min = 0) => n < min || n > max;
