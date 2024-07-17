import { EventManager } from "/kb/ocr/common/handwriting/service/EventManager.js";
import { assertHandwritingLinePointsLengthValid, CanvasPointsNotEnoughError, HandwritingTypoValidLinePointsLength, toggleViewElementInParent, toggleShowElementInWrapper, toggleHideElementInWrapper } from "/kb/ocr/common/common.js";
import { CanvasLayerId, createHTMLElement, initDictationBoard, Message } from "/kb/ocr/common/ui.js";
import { CanvasWorkspace } from "/kb/ocr/common/handwriting/workspace/CanvasWorkspace.js";
import { ScanService } from "/kb/ocr/common/handwriting/service/ScanService.js";
import { OCRImageType, ocr } from "/kb/ocr/service/ocr.js";
import { getCanvasWorkspacesLineAdded } from "/kb/ocr/common/common.js";
import { PathEvent } from "/kb/ocr/common/handwriting/event/PathEvent.js";
import { TextPathFactory } from "/kb/ocr/lib/canvas-path-helper.mjs.js";




//실패 횟수
var failCnt = 0;
var answerCanvasWorkspaceGroups;
var quiz_data = null;
var main_class = null;

document.addEventListener("DOMContentLoaded", async () => {  
    main_class = window.parent.kbc_main.Main_class;
    //console.log(main_class.cur_quiz_num, main_class.quizs)

    const parnet_wrap = window.frameElement;
    quiz_data = JSON.parse(parnet_wrap.dataset.option);
    console.log("data : ", quiz_data)

    
	// 사용자가 작성해야 할 단어/문장 : 정답
    const script = quiz_data.dap;
    // 지문 
    const questionScript = quiz_data.dap;
    
    //최초호출시 실행
    init(false,script,questionScript);
    
    //다시시도(retry) 클릭 시 화면 리셋
    EventManager.addEventHandler("click", document.querySelector("#retryBtn"), async () => {
        retry_click_fn();
    });
    
});
const workspace_wraps_reset = () => {
    const wrap_cons = document.body.querySelectorAll(".canvas-wrapper");
    wrap_cons.forEach( (canvas_con, i) => {
        canvas_con.querySelector(".workspace").classList.remove("false");
    });
}
const retry_click_fn = () =>{
    failCnt = failCnt+1;
    document.querySelector("#example-image-wrapper").innerHTML = '';
    document.querySelector("#answer-wrapper").innerHTML = '';
    workspace_wraps_reset();
    viewDoneButton();
    hideRetryButton();
    hideErrorResultWrapper();
    hideScoreWrapper();
    hideOcrResultText();
    init(true,quiz_data.dap,quiz_data.dap);
}

//최초 호출 시 파라메타 true
const init = async (flag,script,questionScript) => {

	//결과보기 버튼 기존 이벤트 등록된것 삭제를 위해 추가
	const doneButton = document.querySelector("#done");
	const newDoneButton = doneButton.cloneNode(true);
	doneButton.parentNode.replaceChild(newDoneButton, doneButton);
    
    // 사용자가 작성해야 할 영역 생성 ( script의 글자수만큼 생성 )
    answerCanvasWorkspaceGroups = await initAnswer(script, quiz_data);
	
    // 단어 상단에 제시 (필요 없을 시 제거)
    //await initQuestion(script);
    
    // 이벤트 등록
    initEventListeners(answerCanvasWorkspaceGroups, questionScript, script, quiz_data);
    
}
const getSpacedString = (count) => [...Array(count)].map(() => " ").join().replaceAll(",", "");
const createAnswerCanvasWrapper = () => createHTMLElement(`
    <div class="canvas-wrapper">
      <div class="flex-end">
        <button class="clear-canvas" title="글자 지우개"></button>
      </div>
      <div class="workspace"></div>
    </div>
  `);

  //작성 보기 만들기
const initQuestion = async (question) => {
    const exampleImageWrapper = document.querySelector("#example-image-wrapper");
    if (exampleImageWrapper === null) {
        throw new Error("Need essentials!");
    }
    const characters = question.split("");
    for (const character of characters) {
        // initialize workspace
        const workspaceWrapperElement = document.createElement("div");
        exampleImageWrapper.append(workspaceWrapperElement);
        const canvasWorkspace = new CanvasWorkspace(workspaceWrapperElement, 120, 120);
        // add layers
        // add grid layer
        const gridLayer = await canvasWorkspace.addGridLayer();
        gridLayer.draw("grey");
        if (character !== " ") {
            // add font layer
            const pathLayer = await canvasWorkspace.addPathWithMonoColorLayer("black");
            pathLayer.addEvent(new PathEvent(await TextPathFactory.create({
                text: character,
                fontSize: 120,
                fontUrl: "/kb/ocr/assets/NanumBarunGothicBold.ttf",
            }), { x: 10, y: -2 }));
            pathLayer.draw();
        }
    }
};

const initAnswer = async (script) => {
    const boardWrapperElement = document.querySelector("#answer-wrapper");
    if (boardWrapperElement === null) {
        throw new Error("Need essentials!");
    }
    //설명 : 마지막 파라메타값이 2이상인 경우 글자 가이드라인 제공
    return await initDictationBoard(script, 1, boardWrapperElement, createAnswerCanvasWrapper, quiz_data.width, quiz_data.height, true, failCnt, quiz_data);
};
const initEventListeners = (answerCanvasWorkspaceGroups, questionScript, script, quiz_data) => {
    let isPass = true;
    EventManager.addEventHandler("click", document.querySelector("#done"), async () => {
        try {
        
        	//결과보기 클릭 시 canvas 여러개를 하나의 이미지로 합쳐서 서버로 전달
            answerCanvasWorkspaceGroups.forEach((canvasWorkspaces) => assertHandwritingLinePointsLengthValid(canvasWorkspaces, HandwritingTypoValidLinePointsLength.CHARACTER));
            const ocrResults = [];
            for (const answerCanvasWorkspaceGroup of answerCanvasWorkspaceGroups) {
                const answerCharacterWordImages = await createCharacterWordOcrImages(answerCanvasWorkspaceGroup);

                const canvas_system = document.createElement('canvas');
                const canvas_user 	= document.createElement('canvas');
                
		        const ctx = canvas_system.getContext('2d');
		        const ctx_user = canvas_user.getContext('2d');
		        
		    	// var fontSize = 180;
		    	// var textCnt = script.length;
		    	// var templateSize = 15;
		    	// var startX = 45;
		    	// var startY = 184;

                var fontSize = quiz_data.fontSize;
		    	var textCnt = script.length;
		    	var templateSize = 15;
		    	var startX = 45;
		    	var startY = 184;
                
                //Template OCR에서 확인 할 CANVAS 이미지
		        canvas_system.width = (fontSize)*templateSize+templateSize*10+startX*2;
		        canvas_system.height = startY+400;
		        
		        //사용자 이력에서 확인 할 CANVAS 이미지
		        canvas_user.width = (fontSize)*textCnt;
		        canvas_user.height = fontSize;
		        
                var image = new Image();
				image.src = "/kb/ocr/ui/write/ocr-word/template.png";
		
				image.onload = async () => {
				    ctx.drawImage(image, 0, 0);
				    
				    for (const [imageIndex, answerCharacterWordImagesItem] of answerCharacterWordImages[0].entries()) {
				        const blobUrl = URL.createObjectURL(answerCharacterWordImagesItem);
				        
				        const img = new Image();
				        img.src = blobUrl;
				
				        // 비동기 처리를 위해 await를 사용할 수 있습니다.
				        await new Promise((resolve, reject) => {
				            img.onload = () => {
				                // 테두리에 선을 그립니다.
				                ctx.strokeStyle = 'red'; // 선의 색상 설정
				                ctx.lineWidth = 5; // 선의 두께 설정
				                ctx.strokeRect(startX + img.width * imageIndex + imageIndex * 5, startY, img.width + 10, img.height + 10); // 사각형의 경계를 그립니다
				                ctx.drawImage(img, startX + img.width * imageIndex + (img.width - (img.width / 1.1)) + imageIndex * 5, startY + (img.height - (img.height / 1.1)), img.width / 1.1, img.height / 1.1);
				                
				                ctx_user.drawImage(img,img.width*imageIndex,0);
				                
				                if (imageIndex == answerCanvasWorkspaceGroup.length - 1) {
				                    // 가상의 링크를 생성하여 다운로드합니다.(템플릿 생성시 필요하므로 삭제X)
				                    //const dataUrl1 = canvas_system.toDataURL("image/png");
				                    //const dataUrl2 = canvas_user.toDataURL("image/png");
				                    //const link = document.createElement('a');
				                    //link.download = 'canvas_image.png';
				                    //link.href = dataUrl1;
				                    //document.body.appendChild(link);
				                    //link.click();
				                    //document.body.removeChild(link);
				                    
				                    //link.href = dataUrl2;
				                    //document.body.appendChild(link);
				                    //link.click();
				                    //document.body.removeChild(link);
				                    
				                    var units;
				                    var units_user;
				                    
				                    canvas_system.toBlob(async (blob) => {
				                        units = {
				                            blob,
				                            type: OCRImageType.CHARACTER,
				                            name: `char.png`,
				                        };
				                        
				                        canvas_user.toBlob(async (blob) => {
					                        units_user = {
					                            blob,
					                            type: OCRImageType.CHARACTER,
					                            name: `char.png`,
					                        };
					                        let res = await ocr(units, units_user, questionScript, script);
					                        ocrResults.push(res.ocrApiResponse);
					                        console.log("ocr-res : ", res);
            								// 점수 계산
								            initScore(quiz_data.dap, res.ocrApiResponse);
								            
								            // 점수 표시
								            viewScoreWrapper();
								            
								            // ocr 결과 셋팅(임시로 점수 밑에 작성)
								            setOcrResultText(ocrResults);
								            
								            // ocr 결과 보여주기
								            viewOcrResultText();
				                        });
				                    });
				                }
					            
				                resolve(); // Promise를 해결하여 다음 이미지로 넘어갈 수 있도록 합니다.
				            };
				            
				            img.onerror = reject; // 이미지 로딩 중 에러가 발생할 경우 reject합니다.
				        });
				    }
				};

                
            }
            
            // 점수 계산
            const initScore = (dap_text, res_text) => {
                const dap_arr = dap_text.split("");
                const res_arr = res_text.split("");
                //console.log(answerCanvasWorkspaceGroups)
                const wrap_cons = document.body.querySelectorAll(".canvas-wrapper");
                wrap_cons.forEach( (canvas_con, i) => {
                    if(dap_arr[i] != res_arr[i]) {
                        canvas_con.querySelector(".workspace").classList.add("false");
                        isPass = false;
                    };
                });
                if(isPass){
                    finished_fn(true);
                }else{
                    console.log(failCnt, failCnt < 3)
                    if(failCnt < 3){
                        main_class.quizs[main_class.cur_quiz_num-1].retry_fn(failCnt+1);
                        viewRetryButton();
                    }else{
                        finished_fn(false);
                    }
                }


                const getScore = () => {
                    let score = 0;
                    answerCanvasWorkspaceGroups.forEach((canvasWorkspaces) => {
                        const canvasWorkspacesLineAdded = getCanvasWorkspacesLineAdded(canvasWorkspaces);
                        const canvasWorkspacesHasPathAndLineAdded = canvasWorkspacesLineAdded.filter((canvasWorkspace) => canvasWorkspace.getLayerById(CanvasLayerId.PATH_LAYER_ID) !== undefined);
                        let workspacesScoreSum = 0;
                        canvasWorkspacesHasPathAndLineAdded.map((canvasWorkspace) => {
                            const handwritingLayer = canvasWorkspace.getLayerById(CanvasLayerId.HANDWRITING_LAYER_ID);
                            const pathLayer = canvasWorkspace.getLayerById(CanvasLayerId.PATH_LAYER_ID);
                            workspacesScoreSum += getLayerInboundRatios(handwritingLayer, pathLayer) * 100;
                        });
                        const canvasWorkspacesHasPathAdded = canvasWorkspaces.filter((canvasWorkspace) => canvasWorkspace.getLayerById(CanvasLayerId.PATH_LAYER_ID) !== undefined);
                        score += workspacesScoreSum / (canvasWorkspacesHasPathAdded.length || 1);
                    });
                    return Math.floor(score / (answerCanvasWorkspaceGroups.length || 1));
                };
                document.querySelector("#score").innerText = getScore().toString();
            }
            
        }catch (e) {
            const errorMessage = document.querySelector("#error-message");
            
            if (errorMessage !== null) {
                if (e instanceof CanvasPointsNotEnoughError) {
                    errorMessage.innerText = "다시 바르게 써보세요.";
                }
                else {
                    errorMessage.innerText = "오류가 발생했습니다.";
                }
            };
            main_class.quizs[main_class.cur_quiz_num-1].error_message();
            
            console.error(e);
            viewErrorResultWrapper();
        }
        finally {//promise 오기전에 여기가 먼저 돌아버림
            //viewRetryButton();
        }
    });
};
const finished_fn = (isBool) => {
    document.querySelector("#done").classList.add("disp-none1");
    document.querySelector("#retryBtn").classList.add("disp-none1");
    document.querySelector("#score-wrapper").classList.add("disp-none1");
    document.querySelector("#ocr-wrapper").classList.add("disp-none1");
    
    console.log(main_class.cur_quiz_num, main_class.quizs)
    main_class.quizs[main_class.cur_quiz_num-1].end_check_fn(isBool, failCnt+1);
};

const setOcrResultText = (answers) => {
    document.querySelector("#ocrResult").innerText = answers;
};
const createCharacterWordOcrImages = async (rawCanvasWorkspaces) => {
    const getWordCanvasWorkspaces = (canvasWorkspaces) => {
        const isStroked = (handwritingLayer) => handwritingLayer !== undefined && handwritingLayer.eventSize > 0;
        const wordCanvasWorkspaces = [];
        let wordCanvasWorkspace = [];
        canvasWorkspaces.forEach((canvasWorkspace, index) => {
            const handwritingLayer = canvasWorkspace.getLayerById(CanvasLayerId.HANDWRITING_LAYER_ID);
			wordCanvasWorkspace.push(canvasWorkspace);
			if (index === canvasWorkspaces.length - 1) {
				wordCanvasWorkspaces.push(wordCanvasWorkspace);
			}
            
        });
        return wordCanvasWorkspaces;
    };
    const ocrImages = [];
    const wordCanvasWorkspaces = getWordCanvasWorkspaces(rawCanvasWorkspaces);
    for (const charCanvasWorkspaces of wordCanvasWorkspaces) {
        const ocrCharImages = [];
        for (const charCanvasWorkspace of charCanvasWorkspaces) {
            ocrCharImages.push(await createHandwritingImage(charCanvasWorkspace));
        }
        ocrImages.push(ocrCharImages);
    }
    return ocrImages;
};

const createHandwritingImage = async (canvasWorkspace) => {
    const createDestCanvasWorkspace = (handwritingLayer) => {
        const destCanvasWrapper = document.querySelector("#copy-canvas-wrapper");
        return new CanvasWorkspace(destCanvasWrapper, handwritingLayer.canvasManager.width, handwritingLayer.canvasManager.height);
    };
    const createCharacterHandwritingImage = async (handwritingLayer, destCanvasLayer) => {
        const drawImages = async (handwritingLayer) => await drawClone(destCanvasLayer, handwritingLayer);
        const read = async (canvasLayer) => {
            const destScanService = new ScanService(canvasLayer.canvasManager);
            return await destScanService.read();
        };
        await drawImages(handwritingLayer);
        return await read(destCanvasLayer);
    };
    const handwritingLayer = canvasWorkspace.getLayerById(CanvasLayerId.HANDWRITING_LAYER_ID);
    const destCanvasWorkspace = createDestCanvasWorkspace(handwritingLayer);
    const destCanvasLayer = await destCanvasWorkspace.addFilledLayer();
    destCanvasLayer.fill("white");
    const blob = await createCharacterHandwritingImage(handwritingLayer, destCanvasLayer);
    destCanvasWorkspace.clear();
    return blob;
};

const drawClone = async (destCanvasLayer, handwritingLayer, dx = 0) => {
    const srcCanvasManager = handwritingLayer.canvasManager;
    const scanService = new ScanService(srcCanvasManager);
    const blob = await scanService.read();
    const srcImage = new Image();
    srcImage.src = URL.createObjectURL(blob);
    return await new Promise((resolve) => {
        srcImage.onload = () => {
            destCanvasLayer.canvasManager.ctx.drawImage(srcImage, 0, 0, srcCanvasManager.width * srcCanvasManager.scaleWeight, srcCanvasManager.height * srcCanvasManager.scaleWeight, dx, 0, srcCanvasManager.width, srcCanvasManager.height);
            srcImage.remove();
            resolve();
        };
    });
};
const viewErrorResultWrapper = () => {
    //toggleViewElementInParent(document.querySelector("#result-error-wrapper"))
};
const viewRetryButton = () => {
    //toggleViewElementInParent(document.querySelector("#retryBtn"));
    console.log("viewRetry");
    setTimeout( () => {
        retry_click_fn();
    }, 3000);
};
const viewDoneButton = () => toggleShowElementInWrapper(document.querySelector("#done"));

const hideErrorResultWrapper = () => toggleHideElementInWrapper(document.querySelector("#result-error-wrapper"));
const hideRetryButton = () => toggleHideElementInWrapper(document.querySelector("#retryBtn"));


const viewScoreWrapper = () => {
    //document.querySelector("#score-wrapper")?.classList.remove("disp-none");
    document.querySelector("#score-wrapper").classList.add("disp-none");
};

const hideScoreWrapper = () => {
    //document.querySelector("#score-wrapper")?.classList.add("disp-none");
    document.querySelector("#score-wrapper").classList.add("disp-none");
};

const viewOcrResultText = () => {
	//document.querySelector("#ocr-wrapper")?.classList.remove("disp-none");
    document.querySelector("#ocr-wrapper").classList.add("disp-none");
};

const hideOcrResultText = () => {
	//document.querySelector("#ocr-wrapper")?.classList.add("disp-none");
    document.querySelector("#ocr-wrapper").classList.add("disp-none");
};

const getLayerInboundRatios = (handwritingLayer, pathLayer) => {
    const pathEvents = pathLayer.cloneEvents();
    const handwritingEvents = handwritingLayer.cloneEvents();
    const inOutLineBounds = handwritingEvents.map((handwritingEvent) => handwritingEvent.cloneLine().map((coordinate) => {
        let isBound = false;
        pathEvents.some((pathEvent, index) => {
            isBound = pathLayer.isPointInPath(index, coordinate);
            return isBound;
        });
        return isBound;
    }));
    const linesInboundRatios = inOutLineBounds.map((lineInOutBounds) => {
        const lineInbounds = lineInOutBounds.filter((isPointBound) => isPointBound);
        return lineInbounds.length / (lineInOutBounds.length || 1);
    });
    return linesInboundRatios.reduce((acc, currentValue) => acc + currentValue, 0)
        / (linesInboundRatios.length || 1);
};