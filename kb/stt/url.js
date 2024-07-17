// export const GATEWAY_ADDRESS = 'https://dopenai.edunet.net';
let addr = "http://localhost";
if(location.href.indexOf('localhost') > -1) {
	addr = "http://localhost";
} else if(location.href.indexOf('dksl2.edunet.net') > -1) {
	addr = "https://dksl2.edunet.net/";
} else if(location.href.indexOf('dksl.edunet.net') > -1 ) {
	addr = 'https://dksl.eduent.net'
} else if(location.href.indexOf('korean.edunet.net') > -1) {
	addr = 'https://korean.eduent.net';
}
export const GATEWAY_ADDRESS = addr;
