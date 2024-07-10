/**
 * copyright 2024, (c)케이브레인컴퍼니 All rights reserved
 */
(function (win, $, datas) {
    win.kbc_main = {
        _name: "kbc_main",
        root_path: '/kb/_COMMON_2024/',
        sound_path: 'mp3/',
        eff_name: "kbc_player",
        bgm_name: "kbc_bgm",
        cdn_path: '',
        zoom: 1,
        isMobile: false,
        basic_volume: 0.5,
        cuttom_cls_name: "",
        quiz_list: [
            'choice',
            'choice_move',
            'step_check_move',
            'ox',
            'input',
            'linetoline',
            "drag_drop",
            "step_drag_drop",
            "drag_drop_area",
            "drag_drop_phaser",
            "vod",
            "card_flip",
            "card_flip_game",
            "recorde",
            "game_dice_ox",
            "scroll_check",
            'check',
            'check_pop',
            "ocr",
            "star_check",
            "opinion",
            "timer"
        ],//ok



        async page_init(predata) {
            const p = kbc_main;
            const flie_name = location.href.split("/").reverse()[0];
            const preloader = document.body.querySelector('.pre_con');
            const main_wrap = p.main_wrap = document.querySelector('.main');
            const total_quiz_num = document.querySelectorAll(".quiz").length;

            p.resizer = new p.Resize_obs_class();
            p.resizer.add_dom(document.body, main_wrap);
            p.resizer.resize();
            p.local_storage = new p.LOCAL_STORAGE();
            p.file_loader = new p.FILE_LOADER();

            const sound = p.SND = new p.Sound_control(p.root_path + p.sound_path, p.local_storage, p.eff_name, p.bgm_name);
            const warning_message = p.warning_message = new p.warning_message(p.root_path, p.SND, main_wrap);
            const alert_message = p.alert_message = new p.alert_message(p.SND, main_wrap);

            

            p.page_info = await p.file_loader.json("./page.json");
            p.player_dom = await p.file_loader.txt("/kb/_COMMON_2024/player/kbc.player.html");
            //p.vod_player = new win.KBC_PLAYER(this);



            p.isMobile = (p.mobile()) ? true : false;
            if (p.isMobile) main_wrap.classList.add("mob");
            p.isLocal = p.IS_LOCAL();
            p.btn_lock = p.BUTTON_LOCK();
            p.set_time = new p.SET_TIME();//
            p.guide = new p.GUIDE(p.btn_lock, p.SND);
            //console.log(window.location)
            //포커싱 이동 표현
            main_wrap.addEventListener("keydown", (e) => {
                main_wrap.classList.remove("tab");
                if(p.isMobile) return false;
                if(e.key == "Tab") main_wrap.classList.add("tab");
            });
            main_wrap.addEventListener("mousedown", (e) => {
                main_wrap.classList.remove("tab");
            });

            p.LMS = new p.LMS_CONNECT(p, p.isLocal, p.local_storage, datas, alert_message);

            const aa = await p.LMS.init();
            if (aa != "success" && !p.isLocal) alert(`통신장애로 인하여 학습활동이 \n정상적이지 않을 수 있습니다.`);
            // p.settings = new p.SETTINGS(main_wrap, p.LMS);
            // p.coins = new p.COINS(main_wrap, p.LMS);
            // p.passport = new p.PASSPORT(main_wrap, p.LMS);
            // p.landmarks = new p.LANDMARKS(main_wrap, p.LMS);

            //keris predata는 개별 문항이 아닌 단계에 대한 학습 이력을 받음.
            const _predata = predata || [];

            //JSON 로드 추가 해야함
            interval = setInterval(e => {
                if (sound.loaded) {//JSON 로드 상태 확인해야 함
                    clearInterval(interval);
                    p.settings = new p.SETTINGS(p, main_wrap, p.LMS, sound, p.isMobile, p.isLocal, p.local_storage, p.basic_volume, alert_message);
                    p.coins = new p.COINS(main_wrap, p.LMS, sound, p.set_time, alert_message);
                    p.passport = new p.PASSPORT(main_wrap, p.LMS, sound, alert_message);
                    p.landmarks = new p.LANDMARKS(main_wrap, p.LMS, sound, p.itostr, alert_message);
                    p.fullscreen = new p.FULLSCREEN(main_wrap, p.isLocal, sound, p.local_storage, alert_message);
                    p.LMS.add_sound(sound);

                    p.Main_class = new p.Main_class({
                        main_wrap: main_wrap,
                        history_data: _predata,
                        total_quiz_num: total_quiz_num,
                        sound_class: sound,
                        warning_message: warning_message,
                        isLocal: p.isLocal,
                        page_info: p.page_info,
                        player_dom: p.player_dom,
                        cdn_path: this.cdn_path,
                        basic_volume: this.basic_volume,
                        lms: p.LMS,
                        btn_lock: p.btn_lock,
                        set_time: p.set_time,
                        local_storage: p.local_storage,
                        guide: p.guide,
                        alert_message: alert_message,
                        root_path : p.root_path,
                        file_loader : p.file_loader
                    });

                    main_wrap.classList.add('active');
                    preloader.classList.add("display_scale")
                    //p.resizer.resize();
                    console.log(this);
                };                
            }, 100);

            //console.dir($)

        },//ok
        Sound_control: class Sound_control {
            
            constructor(sound_path, local_storage, eff_name, bgm_name) {
                this.local_storage = local_storage;
                this.eff_name = eff_name;
                this.bgm_name = bgm_name;
                this.isAllLoaded = false;
                this.isAudioPalying = false;
                this.sounds = {};
                const snds = [
                    { id: 'click', path: sound_path + "click.mp3" },
                    { id: 'ting', path: sound_path + "ting.mp3" },
                    { id: 'retry', path: sound_path + "retry.mp3" },
                    { id: 'true', path: sound_path + "true.mp3" },
                    { id: 'false', path: sound_path + "false.mp3" },
                    { id: 'end', path: sound_path + "end.mp3" },
                    { id: 'next', path: sound_path + "next.mp3" },
                    { id: 'star', path: sound_path + "star.mp3" },
                    { id: 'jax', path: sound_path + "jax.mp3" },
                    { id: 'ttang', path: sound_path + "ttang.mp3" },
                    { id: 'bgm', path: sound_path + "indie_loop.mp3" },
                ];

                const promsAll = [];
                snds.forEach(s => {
                    (s.id != "bgm") 
                    ? promsAll.push(this.sound_load(s.id, s.path, false, "eff"))
                    : promsAll.push(this.sound_load(s.id, s.path, false, ""))
                });
                Promise.all(promsAll).then(() => {
                    this.isAllLoaded = true;
                })
            };

            sound_load(id, path, is_auto_play = false, type = "") {
                return new Promise((resolve, reject) => {

                    if (this.sounds[id]) {
                        resolve();
                        return false;
                    };


                    let sound = null;
                    sound = new Audio();
                    sound.src = path;
                    sound.isId = id;
                    sound.is_auto_play = is_auto_play;
                    sound.isPlayed = sound.isPalying = false;
                    sound.type = type;
                    let init_vol = this.basic_volume || 1;
                    if (id == "bgm") {
                        (this.local_storage.load(this.bgm_name, "volume")) ?
                            init_vol = this.local_storage.load(this.bgm_name, "volume") : init_vol = init_vol;
                    } else {
                        (this.local_storage.load(this.eff_name, "volume")) ?
                            init_vol = this.local_storage.load(this.eff_name, "volume") : init_vol = init_vol;
                    }
                    sound.volume = init_vol;
                    sound.event = {}
                    sound.event.loadedmetadata = (e) => resolve();
                    sound.addEventListener("loadedmetadata", sound.event.loadedmetadata);
                    sound.load();

                    this.sounds[id] = sound;
                });
            };
            stop(id){
                let sound = this.sounds[id] || null;
                if (sound == null) throw new Error(id + " not sound.");
                sound.isPalying = false;
                this.isAudioPalying = false;
                //kbc_main.btn_lock.release();
                sound.pause();
                sound.removeEventListener("ended", sound.event.ended);
            }
            stop_all_sound() {
                //console.log(this.sounds)
                Object.keys(this.sounds).forEach(name => {
                    //if(this.sounds[name]) this.sounds[name] = null;//이게 왜 있는 거지?
                    let sound = this.sounds[name];
                    if (name != "bgm") {
                        try {
                            sound.isPalying = false;
                            this.isAudioPalying = false;
                            //kbc_main.btn_lock.release();
                            sound.pause();
                            sound.removeEventListener("ended", sound.event.ended);
                        } catch (e) { }
                    }
                });
            };
            sound_volume_change(num) {
                Object.keys(this.sounds).forEach(name => {
                    let sound = this.sounds[name];
                    if (name != "bgm") {
                        try {
                            sound.volume = num;
                        } catch (e) { }
                    }
                });
            }
            bgm_sound_volume_change(num) {
                let sound = this.sounds["bgm"];
                try {
                    sound.volume = num;
                } catch (e) { }
            }

            sound_playing_check(id){                
                const type = this.sounds[id].type;
                if (type == "eff" || id == "bgm") {
                    return false;
                }
                
                return true;
            }

            play(id, callback, isSinglePlaying = false) {
                let sound = this.sounds[id] || null;
                if (sound == null) throw new Error(id + " not sound.");
                
                const is_check = this.sound_playing_check(id);
                //console.log(id, "is_check : ", is_check)
                if(is_check) {
                    this.isAudioPalying = true;
                    //kbc_main.btn_lock.lock();
                };
                

                if (isSinglePlaying) this.stop_all_sound();
                if (sound.currentTime > 0) sound.currentTime = 0;
                sound.event.ended = (e) => {
                    sound.isPalying = sound.isPlayed = false;
                    if(is_check) {
                        this.isAudioPalying = false;
                        //kbc_main.btn_lock.release();
                    };
                    if (callback) callback(e);
                    sound.removeEventListener("ended", sound.event.ended);
                };
                sound.addEventListener("ended", sound.event.ended);

                sound.isPalying = true;
                return sound.play();
            }
            get isPalying (){
                return this.isAudioPalying;
            }
            get loaded() {
                return this.isAllLoaded;
            }
        },//ok
        warning_message: class warning_message {
            constructor(path, sound, main_wrap) {
                this.img_path = path + "img/common/alert/";
                this.sound_class = sound;
                this.main_wrap = main_wrap;
                this.message_wraps = {};
                this.option = {
                    target: null,
                    duration: "0.2s",
                    hidegab: 200,
                    phaser: {
                        width: 1280,
                        height: 720,
                        posx: 0,
                        posy: 0,
                        isDom: false,
                        isPixel: false,
                        gravity: 1
                    }
                };
                this.warning_type = {
                    true: {
                        img: {
                            path: `${this.img_path}alert_true.png`,
                            width: 387, height: 240, posx: 400, posy: 480
                        }
                    },
                    /* false: {
                        img: {
                            path: `${this.img_path}alert_false.png`,
                            width: 387, height: 240, posx: 400, posy: 480
                        }
                    }, */
                    retry_1: {
                        img: {
                            path: `${this.img_path}alert_retry_1.png`,
                            width: 387, height: 240, posx: 400, posy: 480
                        }
                    },
                    retry_2: {
                        img: {
                            path: `${this.img_path}alert_retry_2.png`,
                            width: 387, height: 240, posx: 400, posy: 480
                        }
                    },
                    retry_3: {
                        img: {
                            path: `${this.img_path}alert_retry_3.png`,
                            width: 387, height: 240, posx: 400, posy: 480
                        }
                    },
                    blank: {
                        img: {
                            path: `${this.img_path}alert_blank.png`,
                            width: 300, height: 200, posx: 230, posy: 150
                        }
                    },
                }







                this.datas = [
                    { id: 'blank', text: '문제 풀어야 함' },
                    { id: 'check', text: '모두 체크 완료' },
                    { id: 'true', text: '정답!!!' },
                    { id: 'false', text: '오답!!!' },
                    { id: 'retry', text: '다시다시다시' }
                ];
                this.warning_message = document.createElement('div');
                this.warning_message.classList.add('warning_message');

                this.warning_message_wrap = document.createElement('div');
                this.warning_message_wrap.classList.add('warning_message_wrap');
                this.datas.forEach(v => {
                    const text_wrap = document.createElement("div");
                    text_wrap.innerHTML = v.text;
                    text_wrap.classList.add('warning_message_text');
                    text_wrap.classList.add('warning_message_' + v.id);
                    this.message_wraps[v.id] = text_wrap;
                    this.warning_message_wrap.appendChild(text_wrap);
                });


                this.phaser_wrap = document.createElement('div');
                this.phaser_wrap.classList.add('warning_phaser');
                this.warning_message.appendChild(this.phaser_wrap);


                //document.body.appendChild(this.warning_message);
                this.main_wrap.appendChild(this.warning_message);

                this.init();
            }
            init() {
                this.phaser_init_width = this.option.phaser.width || 1280;
                this.phaser_init_height = this.option.phaser.height || 720;
                //this.phaser_wrap = this.warning_message.querySelector("[phaser]");

                // 개별 페이지 수정 필요!
                const config = {
                    type: Phaser.AUTO,

                    physics: {
                        default: 'arcade',
                        arcade: {
                            gravity: { x: 0, y: 0 },
                            fps: 12
                        }
                    },
                    scale: {
                        autoCenter: Phaser.Scale.NO_CENTER,
                        mode: Phaser.Scale.NONE,
                        width: this.phaser_init_width,
                        height: this.phaser_init_height,
                        parent: this.phaser_wrap
                    },
                    render: {
                        antialias: true,
                        transparent: true,
                        pixelArt: false,
                        preserveDrawingBuffer: false,
                    },
                    scene: {
                        async: true,
                        preload: this.phaser_preload.bind(this),
                        create: this.phaser_create.bind(this),
                        update: this.phaser_update.bind(this)
                    },
                    dom: {
                        createContainer: true,
                        behindCanvas: false
                    }
                };

                this.phaser = new Phaser.Game(config);
                this.scale_set();
            }


            phaser_preload() {
                const p = this;
                //console.log("phaser_preload()-this : ", this)
                this.scene = p.phaser.scene.scenes[0];
                //p.scene.load.spritesheet("aaa", `${this.img_path}alert_true.png`, {frameWidth: 300,  frameHeight: 200})
                Object.keys(p.warning_type).forEach(function (k) {
                    p.scene.load.spritesheet(k, p.warning_type[k].img.path, { frameWidth: p.warning_type[k].img.width, frameHeight: p.warning_type[k].img.height })
                });

            }

            phaser_create() {
                //console.log("phaser_create()-this : ", this)
                const p = this;
                Object.keys(p.warning_type).forEach(function (k) {
                    p.warning_type[k].image = p.scene.add.sprite(p.warning_type[k].img.posx, p.warning_type[k].img.posy, k).setFrame(0).setOrigin(0, 0);
                    //console.log(p.warning_type[k].image, k)
                    p.scene.anims.create({
                        key: k,
                        frames: p.scene.anims.generateFrameNumbers(k, { start: 0, end: 2 }),
                        frameRate: 6,
                        repeat: 0
                    });
                    //console.log("p.scene.anims : ", this.scene.anims)
                    p.warning_type[k].image.visible = false;
                });



                window.addEventListener("resize", () => {
                    /* //100% 반응형일 때 사용
                    const mw = this.phaser_wrap.clientWidth || parseInt(this.phaser_init_width , 10);
                    const limitX = Math.min(1, mw/this.phaser_init_width);
                    this.phaser.scale.setZoom(limitX) */

                    //적응형일 때 사용
                    this.phaser.scale.setZoom(1);
                });
                window.dispatchEvent(new Event("resize"));
                if (this.phaser.input.touch) {
                    this.phaser.input.touch.capture = false;
                }
            }

            phaser_update() { };



            scale_set() {
                /* var mw = this.warning_message.clientWidth;
                var limitX = Math.min(1, mw / 983);
                limitX = Math.max(0.7, limitX);
                this.warning_message_wrap.style.transform = 'scale(' + limitX + ')';
                const divs = this.warning_message_wrap.querySelectorAll("div");
                divs.forEach(wrap => {
                    wrap.style.transform = 'scale(' + limitX + ')';
                }); */
            }
            warning_message_show(type) {
                //this.scale_set();
                this.warning_message.setAttribute("data-type", type);
                console.log(type)
                this._nowAni = this.warning_type[type].image;
                this._nowAni.visible = true;
                this._nowAni.anims.play(type, true);
                this._nowAni.once('animationcomplete', (anim, frame) => {
                    setTimeout(() => this.warning_message_hide(type), 2000);
                });
            }
            warning_message_hide() {
                this.warning_message.removeAttribute('data-type');
                this._nowAni.visible = false;
                //this.scale_set()
            }
        },//ok
        alert_message: class alert_message {
            constructor(sound_class , main_wrap) {
                const move_con = `<div class="viewer_top_btn">
                                    <div>
                                        <button class="prev_btn" id="prev_btn" type="button" onclick="clickBtn()" title="이전 차시 이동"></button>
                                        <p>목차이동</p>
                                        <button class="next_btn" id="next_btn" type="button" onclick="clickBtn()" title="다음 차시 이동"></button>
                                    </div>
                                </div>`


                this.main_wrap = main_wrap;
                this.message_wraps = {};
                this.datas = [
                    { id: 'network', text: `서버 통신 오류` },
                    { id: 'browser', text: `녹음기능을 지원하지 않는 <br>브라우저입니다.` },
                    { id: 'audio', text: `음성 재생 중에는 <br> 사용할 수 없습니다.` },
                    { id: 'land_mark', text: `통신 장애로 인하여 <br> 랜드마크 구매를 실패하였습니다.` },
                    { id: 'coin', text: `통신 장애로 인하여 <br> 코인 변경에 실패하였습니다.` },
                    { id: 'word', text: `단어장에 저장되었습니다.` },
                    { id: 'word_error', text: `통신 장애로 인하여 <br> 단어 저장에 실패하였습니다.` },
                    { id: 'point_update', text: `통신 장애로 인하여 <br> 포인트 변경에 실패하였습니다.` },
                    { id: 'point_empty', text: `포인트가 부족하여 <br> 코인 변경에 실패하였습니다.` },
                    { id: 'loading', text: `파일을 불러오는 중입니다.` },
                    { id: 'pdf_target_error', text: `PDF로 출력할 대상이 없습니다.` },
                    { id: 'local', text: `로컬 테스트 버전에서는 <br> 사용이 제한 됩니다.` },
                    { id: 'line_break', text: `선이 그려진 곳에는 <br> 추가로 선을 그릴 수 없습니다.` },
                    { id: 'author', text: `권한이 없습니다.` },
                    { id: 'recorde_post', text: `녹음 파일이 제출 되었습니다.` },
                    { id: 'recordeing', text: `녹음을 완료 후 <br> 닫기가 가능합니다.` },
                    { id: 'recorde_blank', text: `녹음을 완료 후 <br> 다음 학습이 가능합니다.` },
                    { id: 'recorde_author', text: `마이크 설치가 필요한 페이지입니다.` },
                    { id: 'top_move', text: `마이크 연결이 어려울 경우 ${move_con} 버튼을 클릭하여 다음 목차로 이동할 수 있습니다.`},
                    { id: 'control_lock', text: `학습완료 후 사용이 가능합니다.` },
                    { id: 'ocr_error', text: `글씨를 인식할 수 없습니다.<br> 다시 작성해 주세요.` },
                    { id: 'error', text: `알수 없는 오류가 발생되었습니다.` },
                    { id: 'blank', text: `질문에 답해보세요.` }
                ];
                this.alert_message = document.createElement('div');
                this.alert_message.classList.add('alert_message');

                this.alert_message_wrap = document.createElement('div');
                this.alert_message_wrap.classList.add('alert_message_wrap');
                this.datas.forEach(v => {
                    const text_wrap = document.createElement("div");
                    text_wrap.innerHTML = v.text;
                    text_wrap.classList.add('alert_message_text');
                    text_wrap.classList.add('alert_message_' + v.id);
                    this.message_wraps[v.id] = text_wrap;
                    this.alert_message_wrap.appendChild(text_wrap);
                });
                this.alert_message.appendChild(this.alert_message_wrap);


                //document.body.appendChild(this.alert_message);
                this.main_wrap.appendChild(this.alert_message);
                //this.scale_set();
            }
            scale_set() {
                var mw = this.alert_message.clientWidth;
                var limitX = Math.min(1, mw / 983);
                limitX = Math.max(0.7, limitX);
                this.alert_message_wrap.style.transform = 'scale(' + limitX + ')';
                const divs = this.alert_message_wrap.querySelectorAll("div");
                divs.forEach(wrap => {
                    wrap.style.transform = 'scale(' + limitX + ')';
                });
            }
            show(type) {
                //console.log("alert-show-type : ", type)
                this.alert_message.setAttribute("data-type", type);
                setTimeout(() => this.hide(), 2000);
            }
            hide() {
                this.alert_message.removeAttribute('data-type');
                //this.scale_set()
            }
        },//ok
        mobile: function mobile() {
            const mobile = {}
            mobile.Andiroid = () => navigator.userAgent.match(/Android/i);
            mobile.BlackBerry = () => navigator.userAgent.match(/BlackBerry/i);
            mobile.Opera = () => navigator.userAgent.match(/Opera Mini/i);
            mobile.Windows = () => navigator.userAgent.match(/IEMobile/i);
            mobile.iOS = () => navigator.userAgent.match(/iPhone|iPad|iPod/i);
            return mobile.Andiroid() || mobile.BlackBerry() || mobile.Opera() || mobile.Windows() || mobile.iOS();
        },//ok
        itostr(np) {
            return (np >= 10) ? String(np) : "0" + np;
        },
        IS_LOCAL() {
            if (!(typeof (window) !== 'undefined')) return;

            const rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
                rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;
            let ajaxLocation = null;
            try {
                ajaxLocation = location.href;
            } catch (e) {
                ajaxLocation = document.createElement("a");
                ajaxLocation.href = "";
                ajaxLocation = ajaxLocation.href;
            };

            const ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
            const _test = rlocalProtocol.test(ajaxLocParts[1]);
            const porting_checker = ["content.kbrainc.com", "118.130.202.154","localhost", "172.0", "192.168"];//,"175.114.40.8"];

            const isPorting = !_test && porting_checker.indexOf(location.hostname) == -1 && location.hostname.indexOf("127.0") == -1 && location.hostname.indexOf("192.168") == -1;
            return !isPorting;
        },
        BUTTON_LOCK() {
            var btn_lock = false;
            return {
                isLock: function () {
                    return btn_lock === true;
                },
                lock: function () {
                    btn_lock = true;
                    console.log("버튼 잠김 변수 처리")
                },
                release: function () {
                    btn_lock = false;
                    console.log("버튼 풀림 변수 처리")
                }
            }
        },

        //get_center_position
        GUIDE: class GUIDE {
            constructor(btn_lock, sound) {
                this.btn_lock = btn_lock;
                this.sound_class = sound;
                this.guides = [];
                this.cfg = {
                    img: kbc_main.root_path + "img/clickImg.png",
                    transform: 'translate(-15px, 0px)',
                    repeat: 1,
                    repeatDelay: 500,
                    delay: 300,
                    zIndex: 101,
                    duration: 400,
                    callback: null,
                    firstDelay: 300
                }
            }

            click(_wrap, target = null) {
                //console.log("guide-click-quiz :", _wrap)
                const target_tag = (target) ? target : _wrap.querySelector(".guide_1");
                if (!target_tag) return false;//타겟 설정이 안되어 있으면 가이드 재생 안돼게~

                const fingerPos = this.getAbsoluteCenterPosition(target_tag);
                //fingerPos[0] = fingerPos[0] - 15;
                //fingerPos[1] = fingerPos[1] + 5;

                this.fingerGuide("guide_click", [fingerPos, {
                    type: 'click'
                }], {
                    callback: () => { }
                });
            }
            click_points(_wrap, target_position = [0, 0]) {
                this.fingerGuide("guide_click_points", [target_position, {
                    type: 'click'
                }], {
                    callback: () => { }
                });
            }
            db_click(_wrap, target_1 = null, target_2 = null) {
                let target_1_tag = null;
                let target_2_tag = null;
                if (!target_1 || !target_1) {
                    target_1_tag = _wrap.querySelector(".guide_1");
                    target_2_tag = _wrap.querySelector(".guide_2");
                } else {
                    target_1_tag = target_1;
                    target_2_tag = target_2;
                }
                if (!target_1_tag || !target_2_tag) return false;//타겟 설정이 안되어 있으면 가이드 재생 안돼게~

                const startObj = this.getAbsoluteCenterPosition(target_1_tag);
                const endObj = this.getAbsoluteCenterPosition(target_2_tag);

                this.fingerGuide("guide_db_click_1", [startObj, {
                    type: 'click'
                }], {
                    callback: () => { }
                },0);
                this.fingerGuide("guide_db_click_2", [endObj, {
                    type: 'click'
                }], {
                    callback: () => { }
                },1);
            }
            drag(_wrap, target_1 = null, target_2 = null) {
                let target_1_tag = null;
                let target_2_tag = null;
                if (!target_1 || !target_1) {
                    target_1_tag = _wrap.querySelector(".guide_1");
                    target_2_tag = _wrap.querySelector(".guide_2");
                } else {
                    target_1_tag = target_1;
                    target_2_tag = target_2;
                }
                if (!target_1_tag || !target_2_tag) return false;//타겟 설정이 안되어 있으면 가이드 재생 안돼게~

                const startObj = this.getAbsoluteCenterPosition(target_1_tag);
                const endObj = this.getAbsoluteCenterPosition(target_2_tag);

                this.fingerGuide(
                    "guide_drag", 
                    [
                        startObj,
                        {
                            type: "mouseDown", callback: () => { }
                        },
                        endObj,
                        {
                            type: "mouseUp", callback: () => { }
                        },
                    ],
                    {
                        duration: 400,
                        callback: () => { },
                    }
                );
            }
            drag_points(_wrap, target_1_position = [[0,0],[1280,500]]) {
                //console.log(target_1_position)
                const startObj = target_1_position[0];
                const endObj = target_1_position[1];
                //console.log("startObj :", startObj, "endObj :", endObj)
                this.fingerGuide(
                    "guide_drag_points", 
                    [
                        startObj,
                        {
                            type: "mouseDown", callback: () => { }
                        },
                        endObj,
                        {
                            type: "mouseUp", callback: () => { }
                        },
                    ],
                    {
                        duration: 400,
                        callback: () => { },
                    }
                );
            }

            show() {
                //this.$finger.show();
            }
            hide() {
                //this.$finger.remove();
                this.guides.forEach( tag => tag.remove() );
            }
            fingerGuide(cls_name, posArr, config) {
                //this.btn_lock.lock();
                $.extend(this.cfg, config);
                
                const $finger = $("<img/>").css({
                    position: 'fixed',
                    opacity: 0,
                    transform: this.cfg.transform + ' scale(1)',
                    transition: 'transform .2s',
                    transformOrigin: 'center top',
                    zIndex: this.cfg.zIndex
                }).attr("src", this.cfg.img).addClass(cls_name);
                this.guides.push($finger);


                $("body").append($finger);
                var firstPos = posArr[0];
                $finger.css({
                    left: firstPos[0],
                    top: firstPos[1]
                });

                for (var i = 0; i < this.cfg.repeat; i++) {
                    $finger.animate({
                        left: firstPos[0],
                        top: firstPos[1]
                    }, 0, () => {
                        $finger.css({
                            transform: this.cfg.transform + ' scale(1)'
                        })
                    }).delay(i === 0 ? this.cfg.firstDelay : this.cfg.repeatDelay).animate({
                        opacity: 1
                    }, 200, 'swing');

                    for (var j = 1; j < posArr.length; j++) {
                        ((jj) => {
                            if (Array.isArray(posArr[jj])) {
                                $finger.delay(this.cfg.delay).animate({
                                    left: posArr[jj][0],
                                    top: posArr[jj][1]
                                }, this.cfg.duration)
                            } else if (posArr[jj].type === 'click') {
                                $finger.animate({
                                    textIndent: 0
                                }, this.cfg.delay, () => {
                                    $finger.css({
                                        transform: this.cfg.transform + ' scale(0.8)'
                                    });
                                    if (posArr[jj].callback) {
                                        setTimeout(posArr[jj].callback, 300);
                                    }
                                }).animate({
                                    textIndent: 0
                                }, 300, () => {
                                    $finger.css({
                                        transform: this.cfg.transform + ' scale(1)'
                                    })
                                }).delay(300)

                            } else if (posArr[jj].type === 'mouseDown') {
                                $finger.animate({
                                    textIndent: 0
                                }, this.cfg.delay, () => {
                                    $finger.css({
                                        transform: this.cfg.transform + ' scale(0.8)'
                                    })
                                    if (posArr[jj].callback) {
                                        setTimeout(posArr[jj].callback, 300);
                                    }
                                }).delay(300)

                            } else if (posArr[jj].type === 'mouseUp') {
                                $finger.animate({
                                    textIndent: 0
                                }, this.cfg.delay, () => {
                                    $finger.css({
                                        transform: this.cfg.transform + ' scale(1)'
                                    })
                                    if (posArr[jj].callback) {
                                        posArr[jj].callback();
                                    }
                                }).delay(300)
                            } else if (posArr[jj].type === 'delay') {
                                $finger.delay(posArr[jj].delay);
                            }
                        })(j)
                    }
                    $finger.delay(this.cfg.delay).animate({
                        opacity: 0
                    }, 200)
                }
                $finger.animate({
                    opacity: 0
                }, 0, 'swing', () => {
                    //if(!this.sound_class.isPalying) this.btn_lock.release();
                    $finger.remove();
                    if (this.cfg.callback) {
                        this.cfg.callback();
                    }
                })
            }

            getAbsoluteCenterPosition(obj) {
                const gap_x = 5;
                const gap_y = 0;
                if (typeof obj === 'object' && $(obj).length > 0) {
                    return [$(obj).offset().left + $(obj).outerWidth() / 2 - gap_x, $(obj).offset().top + $(obj).outerHeight() / 2 + gap_y];
                }
                return [0, 0];
            }
        },
        SET_TIME: class SET_TIME {
            constructor() { }
            out(ms = 0) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        },
        FILE_LOADER: class FILE_LOADER {
            constructor() {

            }

            loader(type, arg, is_text) {
                if (arg == undefined || arg.length == 0) {
                    return new Promise((resolve, reject) => {
                        resolve("suc");
                    })
                };

                //console.log("arg :", arg)
                var promArr = Array.prototype.map.call(arg, (src) => {

                    return new Promise((resolve, reject) => {
                        var xobj = null;

                        xobj = new XMLHttpRequest();
                        if (xobj.overrideMimeType)
                            xobj.overrideMimeType(type);

                        src += "?" + (new Date()).getTime();
                        xobj.open('GET', src, true);
                        xobj.setRequestHeader("Content-type", type)

                        xobj.onreadystatechange = () => {
                            if (xobj.readyState == 4) {
                                //console.log("xobj.status :", xobj.status)
                                if (xobj.status == (0 || "200")) {
                                    var res = xobj.responseText
                                    if (type.indexOf("application/json") != -1) {
                                        res = JSON.parse(res);
                                    } else if (type.indexOf("text/xml") != -1) {
                                        res = (new DOMParser()).parseFromString(res, "text/xml");
                                    } else if (type.indexOf("text/html") != -1 && !is_text) {
                                        res = (new DOMParser()).parseFromString(res, "text/html");
                                    }

                                    resolve(res);
                                } else {
                                    reject(src + " loading error.")
                                }
                            }
                        }
                        xobj.send(null);
                    })
                });
                return (promArr.length == 1) ? promArr[0] : Promise.all(promArr);
            }

            converterArg() {
                if (arguments.length == 1 && typeof arguments[0] == "object")
                    return arguments[0];

                return Array.prototype.map.call(arguments, (val) => val);
            };
            //javascript 로더
            js(){
                const arg = converterArg.apply(null,arguments);
				if(arg == undefined || arg.length == 0){
					return new Promise(function(resolve,reject){
						resolve("suc");
					})
				}

				const promArr = Array.prototype.map.call(arg, (src) => {
					const tag = document.createElement("script"),
						firstTag = document.getElementsByTagName("script")[0];

					const ieCallback = function(el,callback){
						if (el.readyState === 'loaded' || el.readyState === 'complete') {
							callback();
						} else {
							setTimeout(() => { ieCallback(el, callback); }, 100);
						}
					}

					tag.type = 'text/javascript';
					tag.async = false;
					tag.src = src;
					if(firstTag){
						firstTag.parentNode.insertBefore(tag, firstTag);
					}else{
						document.getElementsByTagName('head')[0].appendChild(tag); 
					}

					return new Promise( (resolve,reject) => {
						if (typeof tag.addEventListener !== 'undefined') {
							tag.addEventListener('load', ()=> {
								resolve(src+" loaded.")
							}, false);
						}else{
							tag.onreadystatechange = () => {
								tag.onreadystatechange = null;
								ieCallback(tag,resolve);
							};
						}

					})
					

				});
				return (promArr.length ==1)?promArr[0]: Promise.all(promArr);
            }

            //json 로더
            json() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, "application/json;charset=UTF-8", arg);
            }
            //xml 로더
            xml() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, "text/xml;charset=UTF-8", arg);
            }
            //html 로더
            html() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, "text/html;charset=UTF-8", arg);
            }
            //text 로더
            txt() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, 'text/html;charset=UTF-8', arg, true)
            }
        },
        LOCAL_STORAGE: class LOCAL_STORAGE {
            constructor() {
                this.storage = win.localStorage || null;
            }

            save(key = null, name = "", value = "") {
                if (!key || !this.storage) return "failed! SAVE local storage.";

                const save_key = `${key}_${name}`;
                return this.storage.setItem(save_key, value);
            }

            load(key = null, name = "") {
                if (!key || !this.storage) return "failed! LOAD local storage.";

                const load_key = `${key}_${name}`;
                return this.storage.getItem(load_key);
            }

            remove(key = null, name = "") {
                if (!key || !this.storage) return "failed! REMOVE local storage.";

                const remove_key = `${key}_${name}`;
                return this.storage.removeItem(remove_key);
            }

            removeAll() {
                if (!this.storage) return "failed! CLEAR local storage.";

                returnthis.storage.clear();
            }
        },
        Resize_obs_class: class Resize_obs_class {
            constructor() {
                this.resize_observer = new ResizeObserver(this.resize.bind(this));

                this.check_dom = null;
                this.change_dom = null;
                this.init_w = 1280;
                this.init_h = 720;
            }

            add_dom(dom, node_dom) {
                this.resize_observer.observe(dom);
                this.check_dom = dom;
                this.change_dom = node_dom;
            }

            resize() {
                let clw = this.check_dom.clientWidth;
                let clh = this.check_dom.clientHeight;

                let hzoom = clw / this.init_w;
                let vzoom = clh / this.init_h;

                let zoom = 1;
                kbc_main.zoom = zoom = (hzoom > vzoom) ? vzoom : hzoom;
                //kbc_main.zoom = zoom = (hzoom > vzoom) ? vzoom : hzoom;
                //console.log("kbc_main.zoom : ", kbc_main.zoom)
                //this.change_dom.style.transform = 'scale(' + zoom + ') translate(-50%, -50%)';
                //this.change_dom.style.transformOrigin = "left top";
            }
        },//ok
        Main_class: class Main_class {
            constructor(_args) {
                this.main_wrap = _args.main_wrap;
                this.history_data = _args.history_data;
                this.total_quiz_num = _args.total_quiz_num;
                this.sound_class = _args.sound_class;
                this.warning_message = _args.warning_message;
                this.isLocal = _args.isLocal;
                this.page_info = _args.page_info;
                this.player_dom = _args.player_dom;
                this.cdn_path = _args.cdn_path;
                this.basic_volume = _args.basic_volume;
                this.lms = _args.lms;
                this.btn_lock = _args.btn_lock;
                this.set_time = _args.set_time;
                this.local_storage = _args.local_storage;
                this.guide = _args.guide;
                this.alert_message = _args.alert_message;
                this.file_loader = _args.file_loader;
                this.quiz_wraps = _args.main_wrap.querySelectorAll('.quiz') || [];
                this.quizs = [];
                this.tab_btns = [];
                this.main_type = this.main_wrap.dataset.type || "page";
                this.is_prev_finish = true;
                this.is_first = true;
                this.stream = null;
                this.isRecord = null;
                this.root_path = _args.root_path;
                this.page_stroge_load_name = (this.main_wrap.dataset.load_stroge_name && this.main_wrap.dataset.load_stroge_name != "") ? this.main_wrap.dataset.load_stroge_name : "";
                this.is_main_prev_dap = (this.page_stroge_load_name != "") ? this.local_storage.load("page", this.page_stroge_load_name) : null;
                if(this.is_main_prev_dap && this.is_main_prev_dap != "") this.is_main_prev_dap = this.is_main_prev_dap.split(",");
                //console.log("this.is_main_prev_dap : ", this.is_main_prev_dap)


                /**
                 * //기존 페이지의 선택된것들을 가져와서 다시 설정하기 위해(카드 뒤짚기 전용)
                 */
                if(this.is_main_prev_dap){
                    this.is_main_prev_dap.forEach((val, i) => this.is_main_prev_dap[i] = parseInt(val) );
                    
                    var sortABS = function (a, b) { return parseInt(a) - parseInt(b); }
                    this.is_main_prev_dap = this.is_main_prev_dap.sort(sortABS);
                    
                    const imsi_quiz_wraps = [];
                    this.is_main_prev_dap.forEach( value => imsi_quiz_wraps.push(this.quiz_wraps[value-1]) );
                    for(let i=this.quiz_wraps.length-1; i>=0; i--) this.quiz_wraps[i].remove();
                    
                    
                    imsi_quiz_wraps.forEach( tag => {
                        const inertTag = this.main_wrap.querySelector(".warning_message");
                        this.main_wrap.insertBefore(tag, inertTag);
                    })

                    this.quiz_wraps = this.main_wrap.querySelectorAll('.quiz') || [];
                    this.quiz_wraps[0].setAttribute("data-is_auto_play", "true");
                    this.total_quiz_num = this.main_wrap.querySelectorAll('.quiz').length || 0;
                }// if end
               
                
                const quiz_end_OSV = new MutationObserver(this.quiz_all_finish_check.bind(this))
                let tabs = this.main_wrap.querySelector(".tab_con");
                if (!tabs) {
                    tabs = document.createElement("div");
                    tabs.classList.add("tab_con");
                    this.main_wrap.insertBefore(tabs, this.main_wrap.querySelector('.quiz'));
                };
                const promsAll = [];
                //초기 로드는 무조건 한국어
                this.quiz_wraps.forEach((quiz_wrap, i) => {
                    //녹음페이지이고 마이크 가능 테스트를 
                    let quiz_type = quiz_wrap.dataset.type;
                    if(!this.stream && this.isRecord === null && quiz_type.indexOf("recorde") != -1){
                        promsAll.push(this.recordHardwareAccessCheck());
                    }

                    

                    let is_auto_play = quiz_wrap.dataset.is_auto_play || false;
                    is_auto_play = (is_auto_play == "true");
                    let load_snd_paths = (quiz_wrap.dataset.audsrc) ? quiz_wrap.dataset.audsrc.split("||") : [];
                    load_snd_paths.forEach( (st , k) => {
                        //console.log(k, st);
                        (k == 0) 
                            ? promsAll.push(this.sound_class.sound_load(`quiz_${i + 1}_KR_snd`, st, is_auto_play))
                            : promsAll.push(this.sound_class.sound_load(`quiz_${i + 1}_1_KR_snd`, st, is_auto_play));
                    });
                });
                //console.log(this.sound_class)
                //this.lang_changed_set();//언어 변경 기능 활성화
                Promise.all(promsAll).then(() => {
                    this.quiz_wraps.forEach((quiz_wrap, i) => {
                        const _st = "Q" + (i + 1);
                        const tab_button = document.createElement('button');
                        tab_button.classList.add('tabs_btn');
                        tab_button.innerHTML = _st;
                        tab_button.title = "Quiz" + (i + 1) + "이동";
                        tab_button.quiz_num = (i + 1);

                        tab_button.addEventListener('click', e => {
                            this.cur_quiz_num = e.currentTarget.quiz_num;
                            this.sound_class.play('click');
                        })
                        tabs.appendChild(tab_button);
                        this.tab_btns.push(tab_button);

                        //vod 파일이 생성되면서 active_wrap을 복제해서 다시 만드는 것으로 보임.
                        //그래서 아래 코드가 Class_manager에서 퀴즈선언 후 진행되어야 할 것으로 판단.(이동 해야 함)
                        //굳이 꼭 이시점에 다 설정해야 함?
                        //그냥 버튼 누를 때마다 찾아서 셋팅하는 형태로 하면 안될까 하는 생각을 해봄
                        const lang_texts = [];
                        const question = quiz_wrap.querySelector(".question") || null;
                        if (question) {
                            const p_tag = document.createElement("p");
                            p_tag.classList.add("lang_text");
                            question.appendChild(p_tag);
                        };
                        quiz_wrap.querySelectorAll(".lang_text").forEach(tag => lang_texts.push(tag));

                        let quiz_type = quiz_wrap.dataset.type;
                        let check_cls = false;
                        kbc_main.quiz_list.forEach(_st => {
                            if (_st == quiz_type) check_cls = true;
                            if (_st == kbc_main.cuttom_cls_name) check_cls = true;
                        });
                        if (kbc_main.quiz_list.indexOf(quiz_type) == -1) {
                            kbc_main.quiz_list.push(quiz_type);
                            if (kbc_main[quiz_type.toUpperCase()]) check_cls = true;
                        }

                        

                        const quiz_next = this.quiz_next.bind(this);
                        const quiz_prev = this.quiz_prev.bind(this);
                        //const outcome_show = this.outcome_show.bind(this);
                        const is_quiz_last = (this.total_quiz_num == i + 1) ? true : false;
                        //const outcome_wrap = document.body.querySelector('.outcome');
                        quiz_end_OSV.observe(quiz_wrap, { attributes: true });
                        //console.log("check_cls : ", check_cls)
                        if (!check_cls) {

                            //throw new Error(quiz_type + ": Quiz Type is not find.");
                            this.quizs.push(new kbc_main.CUSTOMQUIZ({
                                quiz_wrap: quiz_wrap,
                                main_type: this.main_type,
                                history_data: this.history_data[i],
                                quiz_num: (i + 1),
                                is_quiz_first: !i,
                                is_quiz_last: is_quiz_last,
                                quiz_type: quiz_type,
                                //outcome_wrap: outcome_wrap,
                                quiz_next: quiz_next,
                                quiz_prev: quiz_prev,
                                //outcome_show: outcome_show,
                                sound_class: this.sound_class,
                                warning_message: this.warning_message,
                                alert_message: this.alert_message,
                                isLocal: this.isLocal,
                                page_info: this.page_info,
                                player_dom: this.player_dom,
                                cdn_path: this.cdn_path,
                                basic_volume: this.basic_volume,
                                lms: this.lms,
                                btn_lock: this.btn_lock,
                                set_time: this.set_time,
                                local_storage: this.local_storage,
                                guide: this.guide,
                                lang_texts: lang_texts,
                                root_path : this.root_path,
                                stream : this.stream,
                                isRecord : !(!this.stream),
                                file_loader : this.file_loader
                            }))
                        } else {

                            //console.log("history_data[i] : ", history_data[i])
                            if (!this.history_data[i]) this.is_prev_finish = false;
                            this.quizs.push(new kbc_main[quiz_type.toUpperCase()]({
                                quiz_wrap: quiz_wrap,
                                main_type: this.main_type,
                                history_data: this.history_data[i],
                                quiz_num: (i + 1),
                                is_quiz_first: !i,
                                is_quiz_last: is_quiz_last,
                                quiz_type: quiz_type,
                                //outcome_wrap: outcome_wrap,
                                quiz_next: quiz_next,
                                quiz_prev: quiz_prev,
                                //outcome_show: outcome_show,
                                sound_class: this.sound_class,
                                warning_message: this.warning_message,
                                alert_message: this.alert_message,
                                isLocal: this.isLocal,
                                page_info: this.page_info,
                                player_dom: this.player_dom,
                                cdn_path: this.cdn_path,
                                basic_volume: this.basic_volume,
                                lms: this.lms,
                                btn_lock: this.btn_lock,
                                set_time: this.set_time,
                                local_storage: this.local_storage,
                                guide: this.guide,
                                lang_texts: lang_texts,
                                root_path : this.root_path,
                                stream : this.stream,
                                isRecord : !(!this.stream),
                                file_loader : this.file_loader
                            }));
                        };
                    });

                    this.common_btns = this.main_wrap.querySelector("#common_btns") || null;
                    if (!this.common_btns) {
                        this.common_btns = document.createElement("div");
                        this.common_btns.setAttribute("id", "common_btns");
                        const quiz = this.main_wrap.querySelector(".quiz");
                        this.main_wrap.insertBefore(this.common_btns, this.wraps_con);
                    };

                    this.page_wrap_div = document.createElement("div");
                    this.page_wrap_div.classList.add("page_wrap");
                    this.page_wrap_div.innerHTML = `
                        <label for="cur_num_wrap">현재 퀴즈 번호</label>
                        <input id="cur_num_wrap" type="text" readonly value="0">
                        /
                        <label for="total_num_wrap">전체 퀴즈 번호</label>
                        <input id="total_num_wrap" type="text" readonly value="0">`
                        ;

                    this.common_btns.appendChild(this.page_wrap_div);
                    this.cur_num_wrap = this.page_wrap_div.querySelector("#cur_num_wrap");
                    this.total_num_wrap = this.page_wrap_div.querySelector("#total_num_wrap");

                    this.lang_active_wrap = document.createElement("div");
                    this.lang_active_wrap.classList.add("lang_active_wrap");
                    this.lang_active_wrap.innerHTML = `
                            <button class="lang_snd_play_btn" title="지시문 음성 듣기"></button>
                            <button class="lang_act_btn" title="다국어 활성화"></button>
                        `
                        ;
                    this.common_btns.appendChild(this.lang_active_wrap);
                    this.lang_snd_play_btn = this.lang_active_wrap.querySelector(".lang_snd_play_btn");
                    this.lang_snd_play_btn.addEventListener("click", e => {
                        //console.log("lang_snd_play_btn - btn_lock.isLock() : ", this.btn_lock.isLock())
                        if (this.btn_lock.isLock()) {
                            this.alert_message.show("audio");
                            return;
                        }

                        this.lang_sound_play();
                    });
                    this.lang_act_btn = this.lang_active_wrap.querySelector(".lang_act_btn");
                    this.lang_act_btn.addEventListener("click", e => {
                        if (this.lang_active_wrap.classList.contains("active")) {
                            this.lms.is_act_lang = false;
                            this.lang_active_wrap.classList.remove("active");
                            this.lang_text_view(false);
                        } else {
                            this.lms.is_act_lang = true;
                            this.lang_active_wrap.classList.add("active");
                            this.lang_text_view(true);
                        };

                        this.lang_changed_set();
                    });
                    if (this.main_type == "intro" || this.main_type == "ganji" || this.main_type == "question" || this.main_type == "outro") {
                        this.lang_active_wrap.classList.add("dispose3")
                    };
                    if (this.main_type == "goal") {
                        $(this.lang_act_btn).trigger("click");
                    };

                    if (this.tab_btns.length == 1) tabs.style.display = "none";
                    this.cur_quiz_num = this.history_data.findIndex(val => !val || val == 'null') + 1 || 1;


                    //기존 페이지의 선택된것들을 가져와서 다시 설정하기 위해
                    /* if(this.is_main_prev_dap){
                        this.is_main_prev_dap.forEach((val, i) => {
                            this.is_main_prev_dap[i] = parseInt(val);
                        })
                        var sortABS = function (a, b) { return parseInt(a) - parseInt(b); }
                        this.is_main_prev_dap = this.is_main_prev_dap.sort(sortABS);
                        
                        const remove_quizs = () => {
                            for(let i=0; i<this.quizs.length; i++){
                                this.quizs[i].is_quiz_last = false;
                                if(this.is_main_prev_dap.indexOf(this.quizs[i].quiz_num) == -1){
                                    this.quizs[i].quiz_wrap.remove();
                                    this.quizs.splice(i, 1);
                                    remove_quizs();
                                    break;
                                }
                            }
                            
                        }
                        remove_quizs();

                        this.total_quiz_num = this.quizs.length;
                        this.quizs[this.quizs.length-1].is_quiz_last = true;
                        this.quizs[0].is_quiz_first = true;
                        this.cur_quiz_num = 1;

                        console.log("this.total_quiz_num : ", this.total_quiz_num)
                        
                        
                    } */


                    //const outcome_wrap = document.body.querySelector('.outcome');
                    //const reset_all = this.reset_all.bind(this);

                    //this.outcome_con = new kbc_main.Outcome(outcome_wrap, this.quizs, this.sound_class, reset_all);
                    //kbc_main.resizer.add_dom(document.body, this.outcome_con.wrap.con);
                });
            }

            //다국어 언어활성화에 따른 음성 변경 재생
            lang_sound_play() {
                //console.log("lang_sound_play : ", this);
                Object.keys(this.sound_class.sounds).forEach( snd_id => {
                    if(snd_id.indexOf("quiz") != -1) this.sound_class.sounds[snd_id].pause();
                });
                //console.log("lang_sound_play : ",this.lms.lang, this.lms.is_act_lang);
                if (this.lms.is_act_lang) {
                    const snd_id = "quiz_" + this.cur_quiz_num + "_" + this.lms.lang + "_snd";
                    this.sound_class.play(snd_id);
                    //console.log(snd_id);
                } else {
                    const snd_id = "quiz_" + this.cur_quiz_num + "_KR_snd";
                    this.sound_class.play(snd_id);
                    //console.log(snd_id);
                }


            }
            lang_text_view(is_show) {
                if (is_show) {
                    this.quizs.forEach((quiz, i) => {
                        const text_datas = this.page_info[`quiz_${i}_data`][this.lms.lang];
                        if (text_datas.length) quiz.quiz_wrap.classList.add("lang_active");
                    });
                } else {
                    this.quizs.forEach(quiz => quiz.quiz_wrap.classList.remove("lang_active"));
                }
            }
            //언어 변경 버튼을 클릭하면~(두 군데)
            lang_changed_set() {
                //음원 로드
                this.quiz_wraps.forEach((quiz_wrap, i) => {
                    let load_snd_paths = (quiz_wrap.dataset.audsrc) ? quiz_wrap.dataset.audsrc.split("||") : [];
                    let is_auto_play = quiz_wrap.dataset.is_auto_play || false;
                    is_auto_play = (is_auto_play == "true");
                    if(load_snd_paths.length){
                        let get_st = load_snd_paths[0].split("_").reverse()[0].split(".")[0];
                        const replace_src = load_snd_paths[0].replace(get_st, this.lms.lang);
                        this.sound_class.sound_load("quiz_" + (i + 1) + "_" + this.lms.lang + "_snd", replace_src, is_auto_play);
                    }
                    /* load_snd_paths.forEach( (st, i) => {
                        let get_st = st.split("_").reverse()[0].split(".")[0];
                        const replace_src = st.replace(get_st, this.lms.lang);
                        this.sound_class.sound_load("quiz_" + (i + 1) + "_" + this.lms.lang + "_snd", replace_src, is_auto_play);
                    }); */
                    /* if (load_snd_paths) {
                        let get_st = load_snd_path.split("_").reverse()[0].split(".")[0];
                        load_snd_path = load_snd_path.replace(get_st, this.lms.lang);
                        this.sound_class.sound_load("quiz_" + (i + 1) + "_" + this.lms.lang + "_snd", load_snd_path, is_auto_play);
                    }; */
                });

                //txt 설정
                this.quizs.forEach((quiz, i) => {
                    if (quiz.quiz_type == "vod") {
                        quiz.lang_texts = [];
                        quiz.quiz_wrap.querySelectorAll(".lang_text").forEach(tag => quiz.lang_texts.push(tag));
                    };

                    const text_datas = this.page_info[`quiz_${i}_data`][this.lms.lang];
                    quiz.lang_texts.forEach((text_tag, k) => text_tag.innerHTML = text_datas[k] || '');
                })
            };

            lang_changed_aud_txt_set() {

            }

            set cur_quiz_num(np) {
                this.sound_class.stop_all_sound();
                this._cur_quiz_num = np;
                //console.log(this.quizs)
                //영상 및 음성 정지 및 초기화
                this.quizs.forEach(quiz => {
                    //음성 녹음 일때
                    if(quiz.list) quiz.list.forEach( recorde => recorde.stop_audio() );

                    //vod 일때
                    const videos = quiz.quiz_wrap.querySelectorAll("video");
                    if (videos.length) {
                        videos.forEach(video => {
                            video.pause()
                            //video.currentTime = 0;
                        });
                    }
                    if (quiz.guide.guides.length) quiz.guide.hide();

                    if (quiz.stop_audio) {
                        quiz.stop_audio();
                    }
                    quiz.quiz_hide();

                    if(quiz.start_sound_stop) quiz.start_sound_stop();
                });

                const now_quiz = this.quizs[this._cur_quiz_num - 1];
                now_quiz.quiz_show();
                if (now_quiz.quiz_type == "linetoline") {
                    now_quiz.reset_st_point();
                    now_quiz.jung_dap_draw();
                }
                
                if (now_quiz.quiz_type == "ocr" && !now_quiz.quiz_wrap.classList.contains("finished")) now_quiz.show_init();
                if (now_quiz.quiz_type == "motion" && !now_quiz.quiz_wrap.classList.contains("finished")) now_quiz.init();

                //console.log(this.lms.isFirstConts , this._cur_quiz_num == 1 , this.main_type)
                if(this.lms.datas.isFirstConts && this._cur_quiz_num == 1 || this.main_type == "intro") {
                    now_quiz.quiz_wrap.classList.add('is_quiz_first');
                }

                this.cur_num_wrap.value = this._cur_quiz_num;
                this.total_num_wrap.value = this.total_quiz_num;
                


                now_quiz.start_sound_play();



                //bgm 재생
                if (!this.sound_class.sounds["bgm"].isPalying && now_quiz.quiz_type != "vod") {
                    this.sound_class.play("bgm");
                    this.sound_class.sounds["bgm"].addEventListener("ended", e => {
                        this.sound_class.play("bgm");
                    });
                }
                //bgm 정지
                if (now_quiz.quiz_type == "vod") {
                    this.sound_class.sounds["bgm"].isPalying = false;
                    this.sound_class.sounds["bgm"].pause();
                }


                this.tab_btns.forEach(tab => {
                    tab.classList.remove('active');
                    if (this._cur_quiz_num == tab.quiz_num) {
                        tab.classList.add('active');
                    };
                })
            }

            get cur_quiz_num() {
                return this._cur_quiz_num;
            }

            quiz_all_finish_check() {
                let finish_num = 0;
                let is_prev_dap_check = true;
                this.quizs.forEach((quiz, i) => {
                    const tab = this.tab_btns[i];
                    tab.classList.remove('tabs_btn_checked');
                    tab.classList.remove('tabs_btn_true');
                    tab.classList.remove('tabs_btn_false');
                    /* if (tab && quiz.outcome != null) tab.classList.add('tabs_btn_' + quiz.outcome);

                    //this.outcome_con.set_my_dap(quiz);
                    if (quiz.outcome != null) {
                        finish_num++;
                    } */
                    if (quiz.quiz_wrap.classList.contains('finished')) {
                        finish_num++;
                    }

                    if (is_prev_dap_check) {
                        is_prev_dap_check = quiz.is_prev_dap;
                    };
                });


                if (finish_num >= this.quizs.length) {
                    this.main_wrap.classList.add('finished');
                    if (is_prev_dap_check && this.is_first) {
                        //this.outcome_con.show();
                        this.is_first = false;
                    }
                } else {
                    this.main_wrap.classList.remove('finished');
                };
            }

            quiz_next() {
                this.cur_quiz_num++;
            }
            quiz_prev() {
                
                this.cur_quiz_num--;
            }

            outcome_show() {
                //console.log("outcome_show()")
                const isEnds = this.quizs.filter(quiz => quiz.outcome == null);
                //console.log("outcome_show-isEnds:", isEnds)
                if (isEnds.length == 0) {
                    this.outcome_con.show();
                    return true;
                }
                return false;
            }

            reset_all() {
                this.quizs.forEach(quiz => {
                    if (quiz.reset_sel) quiz.reset_sel();
                    quiz.quiz_reset();
                });
                this.cur_quiz_num = 1;
            }

            recordHardwareAccessCheck() {
                const p = this;
                return new Promise((resolve, reject) => {
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                        .then((stream) => {
                            p.stream = stream;
                            resolve(true);
                        })
                        .catch((error) => {
                            //console.log("error : ", error)
                            this.alert_message.show("recorde_author");
                            //alert("마이크 설치가 필요한 페이지입니다.");
                            resolve(false);
                        });
                })
            }
        },//ok
        Class_manager: class Class_manager {
            constructor(_args) {
                this.quiz_wrap = _args.quiz_wrap;
                this.quiz_num = _args.quiz_num;
                this.page_type = _args.main_type;
                this.quiz_type = _args.quiz_type;
                this.is_quiz_first = _args.is_quiz_first; 
                this.is_quiz_last = _args.is_quiz_last;
                this.is_prev_dap = null;
                //this.outcome_wrap = _args.outcome_wrap;
                this.sound_class = _args.sound_class;
                this.lms = _args.lms;
                //this.outcome_show = _args.outcome_show;
                this.quiz_prev = _args.quiz_prev;
                this.quiz_next = _args.quiz_next;
                this.warning_message = _args.warning_message;
                //this.outcome = null;
                
                this.user_dap = [];
                this.isLocal = _args.isLocal;
                this.page_info = _args.page_info;
                this.player_dom = _args.player_dom;
                this.cdn_path = _args.cdn_path;
                this.basic_volume = _args.basic_volume;
                this.btn_lock = _args.btn_lock;
                this.set_time = _args.set_time;
                this.local_storage = _args.local_storage;
                this.guide = _args.guide;
                this.alert_message = _args.alert_message;
                this.file_loader = _args.file_loader;
                this.guide_type = this.quiz_wrap.dataset.guide || null;
                this.guide_points = [];
                this.page_lang_text_data = this.page_info[`quiz_${this.quiz_num}_data`];
                this.lang_texts = _args.lang_texts;
                this.root_path = _args.root_path;
                this.score = 0;
                this.start_snd_names = [];//초기 실행 음성 이름 담을 곳. 퀴즈 이동 때 마다 초기화 후 재생성
                this.stream = _args.stream;//음성 녹음 관련
                this.isRecord = _args.isRecord;
                this.warning_message_try_name = 'retry_'+this.cur_try_num;
                //console.log("page_lang_text_data :", this.page_lang_text_data)
                //console.log("this.lang_texts :", this.lang_texts)
                this.is_first_show = true;
                const get_jung_dap = (!this.quiz_wrap.dataset.jung_dap) ? "" : this.quiz_wrap.dataset.jung_dap;
                this.jung_dap = get_jung_dap.split(',');
                //복수 정답용 답 만들기
                this.splitArr = ["#","||","또는"];
                this.other_dap = [];//복수 답을 담을 배열
                this.jung_dap.forEach( (value, i) => {
                    this.other_dap[i] = null;
                    this.splitArr.forEach( (check_st, k) => {
                        if(value.indexOf(check_st) != -1){
                            this.other_dap[i] = value.split(check_st);//복수 답에 분할해서 배열로 넣어놓는다.
                            this.jung_dap[i] = value.split(check_st)[0];//분할된 값중 첫번 째 것을 우선 답으로 선정해 둔다.
                        }
                    });
                });

                //console.log(this.quiz_num, "번  jung_dap : ", this.jung_dap)
                //console.log(this.quiz_num, "번 other_dap : ", this.other_dap)

                this.jung_dap_st_arr = [];//keris 데이터 전달용
                this.user_dap_st_arr = [];//keris 데이터 전달용
                //this.quiz_wrap.dataset.jung_dap = "";
                this.is_multi = this.jung_dap.length >= 2;
                this.is_limit_check = this.quiz_wrap.dataset.limit_check != "false";
                this.is_text_click = this.quiz_wrap.dataset.istextclick || "false";
                this.btns = {};

                //console.log("Class_manager : ", this.stream, this.isRecord)

                //기존 학습한 모듈에 대한 사용자 답 정보를 저장하기 위한 코드.... 
                //불러오는 부분은 개별 페이지에서 data-load_stroge_name='단계_유닛_차시_모듈_퀴즈번호' 로 만들어서 기입하면 is_prev_dap에 불러와 저장함
                const path_arr = win.location.pathname.split("/");
                path_arr.pop();
                const path_len = path_arr.length;
                (this.isLocal) ? 
                    this.page_storage_name = path_arr[path_len-4].split("_")[1] + "_" + path_arr[path_len-3].split("_")[1] + "_" + parseInt(path_arr[path_len-2], 10) + "_" + parseInt(path_arr[path_len-1].split("_")[1], 10) + "_" + this.quiz_num : 
                    this.page_storage_name = this.lms.datas.conts_type + "_" + this.lms.datas.conts_unit + "_" + this.lms.datas.conts_ele + "_" + parseInt(path_arr.reverse()[0].split("_"), 10)+ "_" + this.quiz_num;
                
                //console.log("path_arr : ",  path_arr)                    
                //console.log("isLocal : ", this.isLocal, "page_storage_name : ", this.page_storage_name);//"page_4_4_8_1_1";
                this.page_stroge_load_name = (this.quiz_wrap.dataset.load_stroge_name && this.quiz_wrap.dataset.load_stroge_name != "") ? this.quiz_wrap.dataset.load_stroge_name : "";
                //console.log("page_stroge_load_name : ", this.page_stroge_load_name);
                this.is_prev_dap = (this.page_stroge_load_name != "") ? this.local_storage.load("page", this.page_stroge_load_name) : null;
                if(this.is_prev_dap && this.is_prev_dap != "") this.is_prev_dap = this.is_prev_dap.split(",")
                //console.log("is_prev_dap : ", this.is_prev_dap);



                this.quiz_kor_type = '';
                if (this.quiz_type == "choice") this.quiz_kor_type = "선다형";
                if (this.quiz_type == "choice_move") this.quiz_kor_type = "순차선택형";
                if (this.quiz_type == "ox") this.quiz_kor_type = "OX형";
                if (this.quiz_type == "input") this.quiz_kor_type = "쓰기형";
                if (this.quiz_type == "opinion") this.quiz_kor_type = "자유쓰기형";
                if (this.quiz_type == "linetoline") this.quiz_kor_type = "선긋기형";
                if (this.quiz_type == "drag_drop") this.quiz_kor_type = "드래그앤드랍형";
                if (this.quiz_type == "step_drag_drop") this.quiz_kor_type = "드래그앤드랍형";
                if (this.quiz_type == "drag_drop_area") this.quiz_kor_type = "드래그앤드랍형";
                if (this.quiz_type == "vod") this.quiz_kor_type = "동영상형";
                if (this.quiz_type == "card_flip") this.quiz_kor_type = "카드선택형";
                if (this.quiz_type == "recorde") this.quiz_kor_type = "음성녹음형";
                if (this.quiz_type == "recorde_step") this.quiz_kor_type = "음성녹음형";
                if (this.quiz_type == "recorde_stt") this.quiz_kor_type = "음성녹음형";
                if (this.quiz_type == "scroll_check") this.quiz_kor_type = "스크롤확인형";
                if (this.quiz_type == "game_move") this.quiz_kor_type = "오답피하기";
                if (this.quiz_type == "card_flip_game") this.quiz_kor_type = "같은카드찾기";
                if (this.quiz_type == "game_dice_ox") this.quiz_kor_type = "주사위게임";
                if (this.quiz_type == "ocr") this.quiz_kor_type = "글자인식";
                if (this.quiz_type == "check") this.quiz_kor_type = "클릭형";
                if (this.quiz_type == "check_pop") this.quiz_kor_type = "클릭형";
                if (this.quiz_type == "click") this.quiz_kor_type = "클릭형";
                if (this.quiz_type == "click_acc") this.quiz_kor_type = "클릭형";
                if (this.quiz_type == "step_pop") this.quiz_kor_type = "클릭형";
                if (this.quiz_type == "star_check") this.quiz_kor_type = "클릭형";
                if (this.quiz_type == "timer") this.quiz_kor_type = "타이머형";

                

                if(kbc_main.isMobile && this.quiz_type == "linetoline") this.guide_type = "db_click";

                //좌표 설정해서 활동 가이드 움직이기
                if(this.guide_type == "click_points") {
                    this.guide_points = (this.quiz_wrap.dataset.guide_points) ? this.quiz_wrap.dataset.guide_points.split("|") : [0, 0];
                }else if(this.guide_type == "drag_points") {
                    this.guide_points = (this.quiz_wrap.dataset.guide_points) ? this.quiz_wrap.dataset.guide_points.split("|") : ["0,0", "1280,720"];
                    this.guide_points = this.guide_points.map( val => val.split(",") ); 
                };

                //console.log("this.guide_points>> : ", this.guide_points);

                this.cur_try_num = 1;
                this.limit_try_num = this.quiz_wrap.dataset.trynum ? parseInt(this.quiz_wrap.dataset.trynum, 10) : 3;

                //keris에 저장할 데이터의 종류(읽기, 쓰기, 말하기, 듣기)
                const data_point = this.quiz_wrap.dataset.point || "";
                (data_point == "") 
                    ? this.keris_points = []
                    : this.keris_points = data_point.split(",");
                
                if (this.quiz_type == "ox") {
                    this.limit_try_num = 1;
                    const add_btns = `<button data-num="1" class="" title="오표" data-bullet=""></button>
                                        <button data-num="2" class="" title="엑스표" data-bullet=""></button>`;
                    this.quiz_wrap.querySelector(".selection").innerHTML = add_btns;
                };
                if(this.quiz_type == "timer") {
                    const add_btns = `
                                        <div class="timer_btns">
                                            <button class="play_btn guide_1 active" title="타임어 시작" data-bullet=""></button>
                                            <button class="pause_btn" title="타임어 정지" data-bullet=""></button>
                                        </div>
                                        <div class="time_wrap"><p>00:00</p></div>
                                    `;
                    this.quiz_wrap.querySelector(".timer").innerHTML = add_btns;
                }

                //this.outcome_mydap_type = this.quiz_wrap.dataset.outcome_mydap_type || '';
                this.feed_wrap = this.quiz_wrap.querySelector('.quiz_exp_wrap') || null;
                if(!this.feed_wrap){
                    const div = document.createElement("div");
                    div.classList.add("quiz_exp_wrap");
                    div.innerHTML = `<div class="quiz_exp_wrap_dap">
                                        <div><span></span></div>
                                        <div class=""></div>
                                    </div>

                                    <div class="quiz_exp_wrap_exp">
                                        <div class=""><span></span></div>
                                        <div></div>
                                    </div>`
                    ;
                    this.quiz_wrap.appendChild(div);
                }

                this.check_feed_wraps = this.quiz_wrap.querySelectorAll('.check_feed_wrap') || [];

                this.question = this.quiz_wrap.querySelector('.question') || null;
                if (this.question) this.question.setAttribute("quiz_num", this.quiz_num)

                this.is_seq = this.quiz_wrap.dataset.is_seq ? this.quiz_wrap.dataset.is_seq == 'true' : false;
                
                // 힌트 켜기, 음성재생, 표시 등
                this.hints = this.quiz_wrap.querySelectorAll('.hint') || [];
                if(this.hints.length){
                    this.hints.forEach( (hint, i) => {
                        hint.id = i;
                        let load_snd_paths = (hint.dataset.audsrc && hint.dataset.audsrc != "") ? hint.dataset.audsrc.split("||") : [];
                        load_snd_paths.forEach( (st , k) => this.sound_class.sound_load(`hint_${this.quiz_num}_${i}_snd`, st) );
                        console.log()
                        hint.querySelector(".hint_close").addEventListener("click", e => {
                            this.hint_reset();
                            this.sound_class.play("click");
                        });
                    });
                }
                this.hint_btns = this.quiz_wrap.querySelectorAll('.hint_btn') || [];
                if(this.hint_btns.length){
                    this.hint_btns.forEach( (hint_btn, i) => {
                        hint_btn.id = i;
                        
                        hint_btn.addEventListener("click" , e => {
                            this.sound_class.play("click");
                            const btn = e.currentTarget || e.target;
                            //console.log("btn.id : ", btn.id);
                            this.hint_show(btn.id);
                        });
                    });
                }
                
                this.pdf_down_btn = this.quiz_wrap.querySelector(".pdf_down_btn");
                if(this.pdf_down_btn){
                    this.pdf_down_btn.addEventListener("click" , e => {
                        this.sound_class.play("click");
                        const pdf_target = this.quiz_wrap.querySelector(".pdf_target");
                        this.pdf_make_to_down(pdf_target);
                    });
                }

                // 추가 지시문 클릭해서 듣기 기능 추가
                this.supports = this.quiz_wrap.querySelectorAll(".support");
                this.supports.forEach( (tag, i) => {
                    const support_and_src = (tag.dataset.audsrc && tag.dataset.audsrc != "") ? tag.dataset.audsrc : null;
                    if(support_and_src){
                        this.sound_class.sound_load(`support_${this.quiz_num}_${i}_snd`, support_and_src);
                    }
                });
                this.support_btns =this.quiz_wrap.querySelectorAll(".support_btn");
                this.support_btns.forEach( (btn, i) => {
                    btn.setAttribute("index", i);
                    btn.addEventListener("click" , e => {
                        const _btn = e.currentTarget || e.target;
                        const index = _btn.getAttribute("index");
                        this.sound_class.play("click");

                        this.support_show(index);
                    });
                });

                if (this.is_quiz_last) this.quiz_wrap.classList.add('is_quiz_last');


                //한국어 읽어주는 버튼 관련
                this.ko_btns = this.quiz_wrap.querySelectorAll('.ko_snd');
                if (this.ko_btns.length) {
                    this.ko_btns.forEach((_btn, i) => {
                        const snd_src = _btn.dataset.src || null;
                        if (snd_src) {
                            const snd_id = this.quiz_type + "_" + this.quiz_num + "_" + i;
                            _btn.snd = this.sound_class.sound_load(snd_id, snd_src);
                            _btn.id = snd_id;
                            _btn.addEventListener("click", e => {
                                if (this.btn_lock.isLock()) return;

                                const btn = e.currentTarget || e.target;
                                this.sound_class.play(btn.id, () => { }, true);
                            });
                        };
                    });
                };

                //this.quiz_wrap.querySelectorAll(".lang_text").forEach(tag => console.dir(tag.parentNode.parentNode));
                
                //console.log("Class_manager-constructor");
                this.btns_make();
            };

            btns_make() {
                const prev_btn = document.createElement('button');
                const next_btn = document.createElement('button');
                const btns_wrap = document.createElement('div');
                prev_btn.classList.add('navi_prev_btn');
                next_btn.classList.add('navi_next_btn');
                btns_wrap.classList.add('btns_wrap');
                //this.quiz_wrap.appendChild(prev_btn);
                //this.quiz_wrap.appendChild(next_btn);
                this.quiz_wrap.insertBefore(prev_btn, this.feed_wrap);
                this.quiz_wrap.insertBefore(next_btn, this.feed_wrap);
                this.quiz_wrap.appendChild(btns_wrap);

                const retryBtnName = (this.quiz_type == "listen" || this.quiz_type == "recorde" || this.quiz_type == "listen_speak" || this.quiz_type == "listen_repeat") ? "다시 하기" : "다시 풀기";
                const confirmBtnName = (this.quiz_type == "listen" || this.quiz_type == "recorde" || this.quiz_type == "listen_speak" || this.quiz_type == "listen_repeat") ? "확인" : "정답 확인";
                btns_wrap.innerHTML = `                    
                    <button class="confirm_btn" title="${confirmBtnName}"></button>
                    <button class="reset_btn" title="${retryBtnName}"></button>
                `;
                (this._cur_quiz_num == 1) ? prev_btn.setAttribute("title", "이전 페이지") : prev_btn.setAttribute("title", "이전 문제");
                (this.is_quiz_last) ? next_btn.setAttribute("title", "다음 페이지") : next_btn.setAttribute("title", "다음 문제");


                this.btns.check = btns_wrap.querySelector(".confirm_btn");
                this.btns.reset = btns_wrap.querySelector(".reset_btn");
                this.btns.prev = this.quiz_wrap.querySelector(".navi_prev_btn");
                this.btns.next = this.quiz_wrap.querySelector(".navi_next_btn");
                if(this.page_type == "outro" && this.is_quiz_last){
                    //this.btns.next.classList.add("display_no");
                }
                //this.btns.outcome = btns_wrap.querySelector(".outcome_btn");

                if (this.quiz_num != 1) {
                    this.btns.prev.classList.add("display_inline_show");
                }

                this.btns.check.addEventListener('click', () => {
                    //if(this.btn_lock.isLock()) return;
                    //빈 활동이 없는지 체크
                    /* console.log("this.quiz_blank_check() : ", this.quiz_blank_check())
                    if(this.quiz_blank_check()){
                        return false;
                    };


                    console.log("this.btns.check") */
                    
                    this.quiz_ok_check();
                    this.sound_class.play('ting');
                });

                this.btns.reset.addEventListener('click', () => {
                    //if(this.btn_lock.isLock()) return;
                    this.quiz_reset();
                    this.sound_class.play('ting');
                });

                this.btns.prev.addEventListener('click', () => {
                    //if(this.btn_lock.isLock()) return;
                    if (this.is_quiz_first) {
                        this.lms.page_prev_move();
                    } else {
                        this.quiz_prev();
                    }
                    this.sound_class.play('ting');
                });
                this.btns.next.addEventListener('click', () => {
                    //if(this.btn_lock.isLock()) return;
                    this.sound_class.play('ting');
                    if (this.is_quiz_last) {
                        this.lms.page_finish();
                    } else {
                        this.quiz_next();
                    };


                });

                //단윈 내용 다시 보기
                this.danwon_review_btn = this.quiz_wrap.querySelector('.danwon_review_btn') || null;
                this.danwon_pop = this.quiz_wrap.querySelector('.danwon_pop') || null;
                this.danwon_pop_close = this.quiz_wrap.querySelector('.danwon_pop .close_btn') || null;
                if(this.danwon_review_btn) this.danwon_review_btn.addEventListener("click" , e => {
                    if(this.danwon_pop) this.danwon_pop.classList.add("active");
                });
                if(this.danwon_pop_close) this.danwon_pop_close.addEventListener("click" , e => {
                    if(this.danwon_pop) this.danwon_pop.classList.remove("active");
                });

                //단어장 저장 관련
                /* this.word_plus_btns = this.quiz_wrap.querySelectorAll(".word_plus") || []; 
                console.log(this.word_plus_btns)
                this.word_plus_btns.forEach( word_plus_btn => {
                    console.log(word_plus_btn)
                    const save_word_text = word_plus_btn.getAttribute("saveword") || "";
                    word_plus_btn.addEventListener("click", e => {
                        console.log(this.lms)
                        this.sound_class.play("click");
                        this.lms.addWordBook(save_word_text);
                    })
                }); */


                /* this.btns.outcome.addEventListener('click', () => {
                    //if(this.btn_lock.isLock()) return;
                    if (this.outcome_show()) {
                        this.sound_class.play('end');
                    } else {
                        this.warning_message.warning_message_show('blank');
                        this.sound_class.play('retry');
                    }
                }); */
            }
            quiz_blank_check() {
                //console.log(!this.user_dap, !this.user_dap.length, this.user_dap.length < this.jung_dap.length , this.user_dap, this.jung_dap)
                if (!this.user_dap || !this.user_dap.length || this.user_dap.length < this.jung_dap.length) {
                    //this.warning_message.warning_message_show('blank');
                    this.alert_message.show('blank');
                    this.sound_class.play('retry');
                    return true;
                } else {
                    const isEmpty = this.user_dap.findIndex((el) => !el || el == "");
                    if (isEmpty != -1) {
                        //this.warning_message.warning_message_show('blank');
                        this.alert_message.show('blank');
                        this.sound_class.play('retry');
                        return true;
                    }
                }

                return false;
            }
            quiz_ok_check(is_prev_dap) {
                //중복답 체크하기 최우선 순위 *** 띄어쓰기 맞아야 하는 판단조건입니다.
                this.warning_message_try_name = 'retry_'+this.cur_try_num;
                this.user_dap = this.user_dap.map( (val, i) => {
                    if(this.other_dap[i] != null){
                        return this.other_dap[i].find(value => {
                            if(val == value){
                                this.jung_dap[i] = value;
                                return value;
                            }
                        });
                    }else{
                        return val;
                    }
                });




                this.jung_dap_st_arr = [];
                this.user_dap_st_arr = [];
                //console.log(parse_user_dap, parse_jung_dap , "-->>",this.is_seq);
                const parse_user_dap = this.deep_copy_daps()[0];
                const parse_jung_dap = this.deep_copy_daps()[1];
                //console.log(parse_user_dap, parse_jung_dap, "--<<<", this.is_seq);


                const st_parse_user_dap = parse_user_dap.toString()//.replace(/\s/g, "");
                const st_parse_jung_dap = parse_jung_dap.toString()//.replace(/\s/g, "");

                if (st_parse_user_dap == st_parse_jung_dap) {
                    if (!is_prev_dap) {
                        this.warning_message.warning_message_show('true');
                        this.sound_class.play('true')
                        if (this.quiz_type.toString().indexOf("check") != -1) {
                            this.quiz_wrap.classList.add("check");
                        } else {
                            this.quiz_wrap.classList.add("true");
                        };
                    };

                    this.quiz_end(is_prev_dap);
                    return;
                }
                
                if (this.cur_try_num >= this.limit_try_num) {                    
                    if (!is_prev_dap) {
                        this.warning_message.warning_message_show(this.warning_message_try_name);
                        this.sound_class.play('false');
                        this.quiz_wrap.classList.add("false");
                    }
                    this.quiz_end(is_prev_dap);
                    return;
                }


                this.warning_message.warning_message_show(this.warning_message_try_name);
                this.cur_try_num++                
                this.sound_class.play('retry');
                this.quiz_retry();
            }
            deep_copy_daps() {
                //기존 정답과 사용자 답은 원본 상태 유지
                let parse_user_dap = JSON.parse(JSON.stringify(this.user_dap));
                let parse_jung_dap = JSON.parse(JSON.stringify(this.jung_dap));

                if (!this.is_seq) {//순서대로 하지 않아도 정답일 때
                    var sortABS = function (a, b) { return parseInt(a) - parseInt(b); }
                    parse_user_dap = parse_user_dap.sort(sortABS);
                    parse_jung_dap = parse_jung_dap.sort(sortABS);
                    //this.user_dap.sort(sortABS);
                };

                return [parse_user_dap, parse_jung_dap];
            }

            quiz_retry() {
                //대신 각 CLASS 에서 quiz_ok_check부분에 this.user_dap값을 처리해줘야 함. ex) this.user_dap = [1, null, 4, null, 2]
                //this.user_dap = [];
            }

            quiz_reset() {
                this.is_prev_dap = false;
                this.user_dap = [];
                //this.outcome = null;
                this.cur_try_num = 1;
                if (this.hints.length) this.hint_reset();
                this.quiz_wrap.classList.remove('finished');
                this.quiz_wrap.classList.remove("true");
                this.quiz_wrap.classList.remove("false");
                this.quiz_wrap.classList.remove("check");
                this.quiz_wrap.classList.remove("active");
                //this.lms.save({value:null, np:this.quiz_num});
            }

            quiz_end(is_prev_dap = false) {
                if(this.is_prev_dap){
                    this.is_prev_dap = is_prev_dap;
                }else{
                    this.is_prev_dap = this.user_dap;
                }
                this.quiz_wrap.classList.add('finished');
                this.sound_class.play('end');
                if(this.quiz_wrap.classList.contains("true") || this.quiz_wrap.classList.contains("check")){
                    //keris에 포인트 올리기 최대 한번에 2개 까지만 CSS에 설정되어 있음.
                    if(this.keris_points.length) this.lms.points(this.keris_points);
                };


                if (!is_prev_dap) {
                    const value = JSON.stringify(this.user_dap);
                    //this.lms.save({value, np:this.quiz_num})
                    //this.local_storage.save("page", "trans_lang", _st);
                    this.local_storage.save("page", this.page_storage_name, this.user_dap);
                };
            }
            support_show(num = null){
                if(num == null) return false;

                const support_div = this.supports[num] || null;
                if(!support_div) return alert("추가 지시어가 없습니다.");

                const callback_fn = () => {
                    support_div.classList.remove("active");
                }

                const snd_name = `support_${this.quiz_num}_${num}_snd`;
                if(!support_div.classList.contains("active")){
                    support_div.classList.add("active");
                    if(this.sound_class.sounds[snd_name]) this.sound_class.play(snd_name, callback_fn, true);
                }else{
                    support_div.classList.remove("active");
                    this.sound_class.stop(snd_name);
                    callback_fn();
                };
            }
            hint_show(num = null) {
                if(num == null) return false;

                //page별로 .hint.active에 css를 다르게 적용해서 
                //팝업이 열리는 느낌과 강조표시 등으로 변경되도록 처리하면 됨
                console.log(this.sound_class.sounds)
                this.hints[num].classList.add('active');
                const snd_name = `hint_${this.quiz_num}_${num}_snd`;
                if(this.sound_class.sounds[snd_name]) this.sound_class.play(snd_name, null, true);
            }
            hint_reset() {
                this.sound_class.stop_all_sound();
                this.hints.forEach( hint => hint.classList.remove('active') );
            }
            quiz_show() {
                this.quiz_wrap.classList.add('active');
                this.btn_lock.release();
                
            }
            quiz_hide() {
                this.quiz_wrap.classList.remove('active')
            }
            start_sound_play(){
                const start_snd_paths = (this.quiz_wrap.dataset.audsrc) ? this.quiz_wrap.dataset.audsrc.split("||") : [];
                //console.log("start_snd_paths : ", start_snd_paths)
                let is_auto_play = this.quiz_wrap.dataset.is_auto_play || false;
                is_auto_play = (is_auto_play == "true");


                //this.start_snd_names = [];
                start_snd_paths.forEach( (st, i) => {
                    (i == 0) 
                        ? this.start_snd_names[i] = "quiz_" + this.quiz_num + "_KR_snd"
                        : this.start_snd_names[i] = "quiz_" + this.quiz_num + "_1_KR_snd"
                });

                if (is_auto_play) {
                    if(this.is_first_show){
                        if (start_snd_paths.length && this.quiz_type != "vod") {
                            this.start_sound_step_play(0);
                            this.is_first_show = false;
                            //Class_manager에서 guide 셋팅된 것이 있는지 판단해보자!
                            if (this.guide_type) {
                                setTimeout(() => {
                                    if(this.guide_type == "click_points" || this.guide_type == "drag_points") {      
                                        //console.log("this.guide_type : ", this.guide_type)                              
                                        this.guide[this.guide_type](this.quiz_wrap, this.guide_points);
                                    }else{
                                        this.guide[this.guide_type](this.quiz_wrap);
                                    }
                                }, 100);
                            }
                        }
                    }else{
                        if (start_snd_paths.length > 1){
                            this.start_sound_step_play(1);
                        }
                    }

                    if(this.quiz_type == "vod" && this.player){
                        this.player.play();
                    }


                }else{
                    if(this.is_first_show){
                        if (this.guide_type) {
                            setTimeout(() => {
                                if(this.guide_type == "click_points" || this.guide_type == "drag_points") {      
                                    //console.log("this.guide_type : ", this.guide_type)                              
                                    this.guide[this.guide_type](this.quiz_wrap, this.guide_points);
                                }else{
                                    this.guide[this.guide_type](this.quiz_wrap);
                                }
                            }, 100);
                        }
                    }
                    if (start_snd_paths.length > 1){
                        this.start_sound_step_play(1);
                    }

                }
            }
            start_sound_stop(){
                //console.log("자동 재생 음성 정지 시키기-start_sound_stop");
                this.guide.hide();
                this.start_snd_names.forEach( _name => this.sound_class.stop(_name) );
            }

            start_sound_step_play( index ){
                this.sound_class.play(this.start_snd_names[index] , ()=> {
                    if(this.start_snd_names.length-1 > index){
                        this.start_sound_step_play(index+1);
                    }else{        
                        if(this.quiz_type == "card_flip_game") this.reset_sel();
                    }
                });
            }

            async pdf_make_to_down(target){
                if(!target) {
                    this.alert_message.show('pdf_target_error');
                    return false;
                };

                //this.player_dom = await this.file_loader.js("/kb/_COMMON_2024/player/kbc.player.html");
                target.classList.add("backg_white");
                html2canvas(target).then(canvas => {
                    // base64 url 로 변환
                    const imgData = canvas.toDataURL('image/jpeg');
                  
                    const imgWidth = 210; // 이미지 가로 길이(mm) A4 기준
                    const pageHeight = imgWidth * 1.414; // 출력 페이지 세로 길이 계산 A4 기준
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    const imgHeight2 = canvas.height * (imgWidth-20) / canvas.width;
                    let heightLeft = imgHeight;
                    const margin = 10;
                  
                    const doc = new jsPDF('p', 'mm', 'a4');
                    let position = 0;
                    
                  
                    // 첫 페이지 출력
                    //doc.addImage(imgData, 'jpeg', margin, position, imgWidth, imgHeight);
                    doc.addImage(imgData, 'jpeg', margin, position, imgWidth-20, imgHeight2);
                    heightLeft -= pageHeight;
                  
                    // 한 페이지 이상일 경우 루프 돌면서 출력
                    while (heightLeft >= 20) {
                      position = heightLeft - imgHeight;
                      doc.addPage();
                      doc.addImage(imgData, 'jpeg', margin, position, imgWidth, imgHeight);
                      heightLeft -= pageHeight;
                    }
                  
                    // 파일 저장
                    doc.save('sample.pdf');
                    target.classList.remove("backg_white");
                  });

            }
            
            /* get outcome_data_set() {
                const outcome_data = {
                    jung_dap: null,
                    mydap: null,
                    exp: null
                };

                const jung_dap_data = this.feed_wrap.querySelector('.quiz_exp_wrap_dap>div:nth-child(2)').cloneNode(true);
                outcome_data.jung_dap = jung_dap_data.innerHTML;


                const exp_data = this.feed_wrap.querySelector('.quiz_exp_wrap_exp>div:nth-child(2)').cloneNode(true);
                outcome_data.exp = exp_data.innerHTML;


                if (this.user_dap != null && this.user_dap.length) {

                    if (this.outcome_mydap_type == 'text') {///버튼, 입력칸 등!!!
                        const get_dap = this.user_dap.map((dap, i) => {
                            if (this.quiz_type == "input") {
                                if (!this.actives[i].dataset.bullet) {
                                    return this.actives[i].value;
                                } else {
                                    return this.actives[i].dataset.bullet + this.actives[i].value;
                                }
                            } else if (this.quiz_type == "choice") {
                                const _dap = parseInt(dap, 10) - 1;
                                if (!this.actives[_dap].dataset.bullet) {
                                    return this.actives[_dap].innerHTML;
                                } else {
                                    return this.actives[_dap].dataset.bullet + this.actives[_dap].innerHTML;
                                }
                            } else {
                                if (!this.actives[i].dataset.bullet) {
                                    return this.actives[i].innerHTML;
                                } else {
                                    return this.actives[i].dataset.bullet + this.actives[i].innerHTML;
                                }
                            }
                        }).join(", ");

                        outcome_data.mydap = get_dap;
                    } else if (this.outcome_mydap_type == 'bullet') {///오로지 블릿만 제시할 때
                        const get_dap = this.user_dap.map((dap, i) => {
                            const _dap = parseInt(dap, 10) - 1;
                            return this.actives[_dap].dataset.bullet;
                        }).join(", ");

                        outcome_data.mydap = get_dap;
                    } else if (this.outcome_mydap_type == 'bullet_link') {///오로지 블릿만 제시할 때
                        const get_dap = this.user_dap.map((dap, i) => {
                            return this.actives[i].dataset.bullet + this.actives[i].innerHTML;
                        }).join("").replace(this.actives[0].dataset.bullet, "");

                        outcome_data.mydap = get_dap;
                    } else {
                        const get_dap = this.user_dap.map((dap, i) => {
                            if (this.quiz_type == "ox") {
                                return (dap == 1) ? "O" : "X";
                            } else {
                                return dap;
                            }
                        }).join(", ");

                        console.log(get_dap)
                        outcome_data.mydap = get_dap// 기본형
                    };

                };

                return outcome_data;
            }; */

        },//ok


        ////// 이전 다음 표시용으로 사용될 것으로 예상됨
        Outcome: class Outcome {
            constructor(outcome_wrap, quizs, sound_class, reset_all) {
                const parent_dom = document.body;
                this.wrap = outcome_wrap;
                this.quizs = quizs;
                this.sound_class = sound_class;
                this.reset_all = reset_all;
                this.ok_num = 0;
                //console.log("this.wrap :", this.wrap)


                if (!this.wrap) {//기본 만들기
                    this.wrap = document.createElement("div");
                    this.wrap.classList.add("outcome");
                    parent_dom.appendChild(this.wrap);

                    this.wrap.con = document.createElement("div");
                    this.wrap.con.classList.add("outcome_con");
                    this.wrap.appendChild(this.wrap.con);

                    this.wrap.box = document.createElement("div");
                    this.wrap.box.classList.add("outcome_box");
                    this.wrap.con.appendChild(this.wrap.box);
                } else {
                    this.wrap.box = this.wrap.querySelector(".outcome_box");
                    this.wrap.con = this.wrap.querySelector(".outcome_con");
                }

                const box_contents = `<p>전체 ${this.quizs.length}문제 중 <br><span class="pen_under"><span class="calc_num">0</span>문제</span>를 맞추셨습니다.</p>`;
                this.wrap.box.innerHTML = box_contents;

                this.outcome_btns_wrap = document.createElement("div");
                this.outcome_btns_wrap.classList.add("outcome_btns_wrap");
                this.wrap.appendChild(this.outcome_btns_wrap);

                const check_quiz_type = this.quizs.some(quiz => {
                    return (quiz.quiz_type == "listen" || quiz.quiz_type == "recorde" || quiz.quiz_type == "listen_speak" || quiz.quiz_type == "listen_repeat")
                });
                const retryBtnName = (check_quiz_type) ? "다시 하기" : "다시 풀기";
                this.reset_all_btn = document.createElement("button");
                this.reset_all_btn.classList.add("outcome_reset_all_btn");
                this.reset_all_btn.setAttribute("title", `전체 문제 다시 풀기`);
                //this.reset_all_btn.setAttribute("title", `${retryBtnName}`);
                //this.reset_all_btn.innerHTML = `<span>${retryBtnName}</span>`;
                this.outcome_btns_wrap.appendChild(this.reset_all_btn);
                this.reset_all_btn.addEventListener('click', () => {
                    this.hide();
                    this.reset_all();
                    this.sound_class.play('click')
                });
            }

            show() {
                this.wrap.classList.add('active');

                this.ok_num = 0;
                this.quizs.forEach(quiz => {
                    if (quiz.outcome) this.ok_num++;
                });
                this.wrap.box.querySelector('.calc_num').innerHTML = this.ok_num;
            }

            hide() {
                this.wrap.classList.remove('active')
            }


            set_my_dap(quiz = null) {
                if (quiz == null) return;
                const quiz_data = quiz.outcome_data_set;
                const target_tr = this.tr_list[quiz.quiz_num - 1];
                if (target_tr) {
                    target_tr[1].innerHTML = `<div>${quiz_data.jung_dap}</div>`;
                    target_tr[2].innerHTML = `<div>${quiz_data.mydap}</div>`;
                    target_tr[3].innerHTML = `<div>${quiz_data.exp}</div>`;

                    target_tr[0].classList.remove("check")
                    target_tr[0].classList.remove("true")
                    target_tr[0].classList.remove("false")

                    target_tr[0].classList.add(`${quiz.outcome}`)
                };
            }
        },//ok

        //기존 녹음 기능에서 기능을 가져와서 변경해야 할 수도 있음.
        Recode_manager: class Recode_manager {
            constructor(quiz_num, quiz_wrap, dom, stream, sound_class, id, lms, alert, disposeAll, ableAll, result_pop_close, start_sound_stop, btn_lock, set_time) {
                this.mediaStream = stream || null;
                this.mediaRecorder = null;
                this.isBrowser = null;
                this.isState = "stop";
                this.maxRecTime = 30;
                this.isAble = false;
                this.recordeData = [];
                this.con_wrap = quiz_wrap;
                this.quiz_num =quiz_num;
                this.wrap = dom;//this.quiz_wrap.querySelectorAll(".record_wrap_con")
                this.index = this.wrap.dataset.num;
                this.recordeInterval = null;
                this.sound_class = sound_class;
                this.id = id;
                this.lms = lms;
                this.alert_message = alert;
                this.disposeAll = disposeAll;
                this.ableAll = ableAll;
                this.recorde_pop_closed = result_pop_close;
                this.start_sound_stop = start_sound_stop;
                this.setTimeFn = null;
                this.wrap.setAttribute("islistened", "false");
                this.btn_lock = btn_lock;
                this.set_time = set_time;
                this.rec = null;
                
                                
                //this.canvas = document.getElementById("pop_canvas_app");//추후에 공통으로 옮겨야 합니다.
                this.canvas = this.wrap.querySelector("canvas");
                this.canvasCtx = this.canvas.getContext("2d");

                //stt 관련 변수들
                this.is_stt = this.wrap.dataset.stt == "true";
                this.processing = false;
                this.question_text = this.con_wrap.querySelector(".question_box").innerText.replace(/\n/ig, " ") || "";
                this.recorde_text = (this.wrap.querySelector(".get_recorde_text")) ? this.wrap.querySelector(".get_recorde_text").innerHTML : "";
                this.dap_text = (this.is_stt) ? this.wrap.getAttribute("dap") : "";
                this.result_pop = null;
                this.active_panel_wrap = this.wrap.querySelector(".active_panel");
                this.record_btns_wrap = this.wrap.querySelector(".record_btns");
                this.text_box = null;
                this.text_confirm_btn = null;

                
                
                if (!this.mediaStream) {
                    this.wrap.setAttribute("isnotstream", "true");
                    
                }
                if (this.mediaStream) {
                    this.createAudio();
                    this.draw();
                }
                
                //녹음 창에 녹음해야 할 텍스트를 추출 및 삽입하는 부분
                this.inner_pop = this.wrap.querySelector(".pop_innner") || null;
                this.recorde_aud_wrap = this.wrap.querySelector(".recorde_aud_wrap");
                const _text_p = document.createElement("p");
                _text_p.innerHTML = (this.recorde_text == "" || !this.recorde_text) ? this.dap_text : this.recorde_text;
                this.inner_pop.insertBefore(_text_p, this.recorde_aud_wrap);
                //console.log("_text_p : ", _text_p);

                //녹음 및 음성 진행시 타임 프로그래스 올려주는 기능
                this.bar = this.wrap.querySelector(".bar");                
                this.audio = dom.querySelector("audio") || null;
                //this.sound_class.sound_load(`listen_${this.quiz_num}_${id}`, this.audio.getAttribute("src"));//추후 퀴즈 옮겨 다닐 때 제어를 위해 로드해서 걸어둠

                if (this.audio) this.audio.addEventListener("ended", e => {
                    this.stop_audio();
                    this.wrap.setAttribute("islistened", "true");
                    console.log("ended")
                });

                this.btnSet();
                this.isBrowser = this.checkBrowser();
                if (this.isBrowser) {
                    //this.requestAccess()
                } else {
                    this.alert_message.show("browser");
                    //console.log("녹음기능을 지원하지 않는 브라우저입니다.")
                }

                //console.log("Recode_manager-constructor : " , win);
            };

            checkBrowser() {
                var userAgent = navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
                    return 'safari';
                } else if (userAgent.indexOf('chrome') > -1) {
                    return 'chrome';
                } else if (userAgent.indexOf('firefox') > -1) {
                    return 'firefox';
                } else if (userAgent.indexOf('opera') > -1) {
                    return 'opera';
                } else {
                    //console.log("userAgent : ", userAgent)
                    return false;
                }
            };

            btnSet() {
                this.btns = {}
                this.btns.listen = this.wrap.querySelector(".listen_btn") || null;
                this.btns.recorde_start = this.wrap.querySelector(".record_btn") || null;
                this.btns.repeat_start = this.wrap.querySelector(".repeat_btn") || null;
                this.btns.repeat_stop = this.wrap.querySelector(".pause_btn") || null;
                this.btns.recorde_download = this.wrap.querySelector(".download_btn") || null;
                this.btns.result_btn = this.wrap.querySelector(".result_btn") || null;
                this.btns.bg = this.inner_pop;

                $(this.btns.bg).draggable({
                    cancel: false,
                    revert: false,
                    revertDuration: 0,
    
                    drag: function (e, ui) {},
                    start: function (e, ui) {},
                    stop: function (e, ui) {}
                });

                //addEventListener
                this.btns.recorde_start.addEventListener("click", () => {
                    if (this.btn_lock.isLock()) return;
                    //녹음하기
                    //console.log("녹음하기 : ", this.isState)
                    this.start_sound_stop();
                    this.sound_class.play("click");
                    if (this.isState != "stop") {

                        this.stopRecorde();
                        return;
                    };

                    this.startRecoding();
                    this.rec.record();
                });


                if (this.btns.listen) {
                    this.btns.listen.addEventListener("click", () => {
                        if (this.btn_lock.isLock()) return;

                        this.start_sound_stop();
                        this.sound_class.play("click");
                        if (this.isState != "stop") {
                            this.stop_audio();
                            return;
                        }
                        this.play_audio();

                    });
                }
                if (this.btns.repeat_start) {
                    this.btns.repeat_start.addEventListener("click", () => {
                        //녹음듣기
                        //console.log("p.recorde_aud : ", this.recorde_aud);
                        this.sound_class.play("click");
                        if (this.isState != "stop") return;
                        //kbc_main.disposeAll(p.index);
                        this.recPlayAudio()
                    });
                }
                if (this.btns.repeat_stop) {
                    this.btns.repeat_stop.addEventListener("click", () => {
                        //녹음듣기 중단
                        this.sound_class.play("click");
                        this.recstop_audio();
                    });
                }
                if (this.btns.recorde_download) {
                    this.btns.recorde_download.addEventListener("click", () => {
                        //console.log("녹음된 오디오 tag :", this.recorde_aud_wrap.querySelector("audio"))
                        this.recorde_aud_wrap.querySelector("a").click();
                        //this.recorde_aud_wrap.querySelector("#recorde_down").click();

                    });
                }
                if (this.btns.result_btn) {
                    this.btns.result_btn.addEventListener("click", async () => {
                        //결과 창 열기
                        this.sound_class.play("click");
                        
                        if(this.processing) {
                            this.alert_message.show("recordeing");
                            return false;
                        }
    
                        const pop = this.wrap.querySelector(".recorde_pop");
                        pop.classList.remove("active");
                        this.recstop_audio();
                        this.stopRecorde();
    
                        await this.set_time.out(300);
    
                        const isrecord = this.wrap.getAttribute("isrecord") == "true";
                        if(this.is_stt && isrecord){
                            this.result_pop_open();
                        }
                    });
                }

            };

            play_audio() {
                this.isState = "playing";
                this.btn_lock.lock();
                this.audio.play();
                this.progress = this.audio.duration - 0.2;
                this.wrap.classList.add("listen");                

                this.disposeAll(this.id);
            };

            stop_audio() {
                if(!this.audio) return false;

                this.isState = "stop";
                this.btn_lock.release();
                this.progress = this.audio.currentTime = 0;
                this.audio.pause();
                this.wrap.classList.remove("listen");
                
                this.ableAll();
            };

            startRecoding() {
                
                if (!this.mediaStream) {                    
                    this.alert_message.show("recorde_author");
                    //alert("마이크 권한 승인이 필요합니다.");
                    return false;
                }

                this.processing = true;
                this.recordeData.splice(0);
                this.mediaRecorder = new MediaRecorder(this.mediaStream, {
                    mineType: "audio/mp3 codecs=opus"
                    //mimeType: "audio/webm;codecs=pcm"
                });

                this.mediaRecorder.addEventListener('dataavailable', event => {
                    this.recordeData.push(event.data);
                });

                this.progress = this.maxRecTime;
                this.mediaRecorder.start();
                this.isState = "recording";
                this.wrap.classList.add('record');
                this.wrap.setAttribute('isrecord', "false");
                this.disposeAll(this.id);
                this.btns.recorde_start.setAttribute("title", "녹음 정지");

                if (this.setTimeFn) {
                    clearTimeout(this.setTimeFn);
                    this.setTimeFn = null;
                }
                this.setTimeFn = setTimeout(e => {
                    //console.log(this)
                    this.stopRecorde();
                }, this.maxRecTime * 1000);
                
                this.sound_class.sounds["bgm"].isPalying = false;
                this.sound_class.sounds["bgm"].pause();
            };



            async library_stop_recorde(blob){
                const url = URL.createObjectURL(blob);
                
                const a_tag = document.createElement("a");
                a_tag.style.display = "none";
                a_tag.setAttribute("id", `recorde_down${this.id}`);
                a_tag.setAttribute("target", "_blank");
                a_tag.setAttribute("href", url);
                a_tag.setAttribute("download", `녹음 파일 ${this.id}`);
                this.recorde_aud_wrap.appendChild(a_tag);



                //console.log("this : ", this , this.dap_text);
                const data = {
                    question_text : this.question_text,
                    dap_text : this.dap_text,
                    blob_data : blob
                };

                let result = null;
                if(this.is_stt) {
                    result = await this.lms.stt_api(data);
                    if(!result){
                        result = {
                            sentenceLevel :  {
                                text: "네트워크 통신에 오류가 발생하여 확인이 불가능합니다.",
                                proficiencyScore: {
                                    score: 69.20548996043311
                                }
                            }
                        }
                    }
                    
                    const stt_score = Math.round(result.sentenceLevel.proficiencyScore.score);
                    let after_class = "";
                    if(stt_score >= 80) after_class = "great";
                    if(stt_score >= 60 && stt_score < 80) after_class = "good";
                    if(stt_score < 60) after_class = "try";
                    
                    const text = (result.sentenceLevel.text == "") ? "녹음된 발음이 없습니다" : result.sentenceLevel.text;
                    //<p class="score_box">${Math.round(result.sentenceLevel.proficiencyScore.score)}</p>
                    if(!this.result_pop){

                        this.result_pop = document.createElement("div");
                        this.result_pop.classList.add("result_pop");
                        this.result_pop.innerHTML = `
                            <div class="pop_outer">
                                <button class="close" title="녹음 팝업창 닫기"></button>
                                <div class="pop_innner ${after_class}">                                            
                                    <p class="text_box">${text}</p>
                                </div>
                            </div>`;
                        this.wrap.appendChild( this.result_pop );        
                    }else{
                        this.result_pop.innerHTML = ``;
                        this.result_pop.innerHTML = `
                            <div class="pop_outer">
                                <button class="close" title="녹음 팝업창 닫기"></button>
                                <div class="pop_innner ${after_class}">                                            
                                    <p class="text_box">${text}</p>
                                </div>
                            </div>`;
                    }

                    const result_pop_close = this.result_pop.querySelector(".close");
                    //console.log("result_pop_close : ", result_pop_close);
                    result_pop_close.addEventListener("click", e => {
                        //console.log("result_pop_close-click");
                        this.result_pop.classList.remove("active");
                        this.recorde_pop_closed(this.wrap, this.id);
                    });
                };
            }

            stopRecorde() {
                
                if (this.setTimeFn) {
                    clearTimeout(this.setTimeFn)
                    this.setTimeFn = null;
                }
                //console.log("stopRecorde()-call");
                this.isState = "stop";
                this.progress = 0;
                this.btns.recorde_start.classList.add('check');
                this.ableAll();
                
                if (!this.mediaRecorder) return false;
                if(!this.sound_class.sounds["bgm"].isPalying) this.sound_class.play("bgm");
                
                this.mediaRecorder.stop();
                this.mediaRecorder.addEventListener('stop', async () => {
                    const blob = new Blob(this.recordeData, { type: "audio/mp3" });
                    const audioURL = URL.createObjectURL(blob);
                    const audioElement = new Audio(audioURL);
                    //audioElement.controls = true;
                    this.recordeData.splice(0);
                    this.recorde_aud_wrap.innerHTML = "";
                    this.recorde_aud_wrap.appendChild(audioElement);

                    this.recorde_aud = this.recorde_aud_wrap.querySelector("audio");
                    this.recorde_aud.currentTime = 1e101;
                    this.recorde_aud.addEventListener("ended", () => {
                        this.recstop_audio();
                    });
                    //다운로드 파일 만들기 시작
                    this.rec.stop();
                    this.rec.exportWAV(this.library_stop_recorde.bind(this));
                    //다운로드 파일 만들기 종료

                    setTimeout(e => {
                        this.recorde_aud.currentTime = 0;
                        //console.log("recorde_duration : ",this.recorde_aud.duration)
                    },100)

                    this.wrap.classList.remove('record');
                    this.wrap.setAttribute('isrecord', "true");
                    this.btns.recorde_start.setAttribute("title", "녹음하기");


                    

                    this.processing = false;
                });
            };

            recPlayAudio() {
                this.isState = "playing";
                //console.log("recorde_aud.duration : ",this.recorde_aud.duration)
                this.progress = this.recorde_aud.duration - 0.2;
                this.wrap.classList.add('recPlay');
                this.recorde_aud.play();
                this.disposeAll(this.id);
            };

            recstop_audio() {
                this.isState = "stop";
                this.progress = 0;
                if (this.recorde_aud) {
                    this.recorde_aud.currentTime = 0;
                    this.recorde_aud.pause();
                }

                this.wrap.classList.remove("recPlay");
                this.ableAll();
            };
            //마이크 소리를 데이터로 전환
            createAudio() {
                const p = this;
                this.recordeData.audioCtx = new (win.AudioContext || win.webkitAudioContext)();
                this.recordeData.analyser = this.recordeData.audioCtx.createAnalyser();
                this.recordeData.source = this.input = this.recordeData.audioCtx.createMediaStreamSource(this.mediaStream);
                this.recordeData.source.connect(this.recordeData.analyser);

                this.recordeData.analyser.fftSize = 2048;
                this.recordeData.bufferLength = this.recordeData.analyser.frequencyBinCount;
                this.recordeData.audioDataArray = new Uint8Array(p.recordeData.bufferLength);

                this.rec = new win.Recorder(this.input,{numChannels:1});
                
		
            }
            //마이크 소리 데이터를 파형으로 그리기
            draw() {
                // 파형 데이터 가져오기
                this.recordeData.analyser.getByteTimeDomainData(this.recordeData.audioDataArray);

                // 캔버스 초기화
                //this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
                //this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // 파형 Line 그리기
                this.canvasCtx.lineWidth = 3;
                this.canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
                this.canvasCtx.beginPath();
                let sliceWidth = this.canvas.width * 1.0 / this.recordeData.bufferLength;
                let x = 0;
                for (let i = 0; i < this.recordeData.bufferLength; i++) {
                    const v = this.recordeData.audioDataArray[i] / 128.0;
                    const y = v * this.canvas.height / 2;

                    if (i === 0) {
                        this.canvasCtx.moveTo(x, y);
                    } else {
                        this.canvasCtx.lineTo(x, y);
                    };

                    x += sliceWidth;
                }

                this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
                this.canvasCtx.stroke();
                requestAnimationFrame(() => this.draw());
            }

            result_pop_open(){
                this.result_pop.classList.add("active");
                //console.log("result_pop_open()")
            }

            set progress(np) {
                this.bar.style.transitionDuration = np + "s";
            }

            get stt(){
                return this.is_stt;
            }
        },//ok
        LMS_CONNECT: class LMS_CONNECT {
            constructor(_this, is_local, local_storage, add_data, alert_message) {
                this.kbc_main = _this;
                this.datas = { cdn: "", _land_mark_list: {}, langs_list: [] }
                this.path = (is_local) ? win.playerChk : top.opener.playerChk;
                this.cdn = (is_local) ? "" : top.vdpath;
                this.t_num = 42;//이게 뭐지?
                this.is_act_lang = false;
                this.local_storage = local_storage;
                console.log("add_data : ", add_data)
                this.add_data_list = add_data;
                this.alert_message = alert_message;
                this.sound_class = null;
                this.user_info = null;
                this.isFirstConts = false;

                this.stt_response = {};
                //page_init에서 init() 호출
            }

            init() {
                return new Promise(async (resolve, reject) => {
                    const setInfo = await this.path.getDefaultInfo();
                    if (setInfo.result == 'success') {
                        this.init_set();
                        resolve('success');
                    } else {
                        this.init_set();
                        resolve('fail');
                        this.alert_message.show("network");
                    }
                });
            };

            add_sound(sound) {
                this.sound_class = sound;
            }

            land_mark_split() {
                this.datas.land_list = {
                    asia: { group: [], tag: `` },
                    europe: { group: [], tag: `` },
                    america: { group: [], tag: `` },
                    afoce: { group: [], tag: `` }
                }

                Object.keys(this.datas._land_mark_list).forEach((name, i) => {
                    if (i >= 0 && i < 10) {
                        this.datas._land_mark_list[name].group = "asia";
                    } else if (i >= 10 && i < 20) {
                        this.datas._land_mark_list[name].group = "europe";
                    } else if (i >= 10 && i < 30) {
                        this.datas._land_mark_list[name].group = "america";
                    } else if (i >= 10 && i < 40) {
                        this.datas._land_mark_list[name].group = "afoce";
                    } else {
                        this.datas._land_mark_list[name].group = "asia";
                    };

                    const type = this.datas._land_mark_list[name].group;
                    this.datas.land_list[type].group.push(this.datas._land_mark_list[name]);
                });
            }

            init_set() {
                this.user_info = this.path.user_info;
                this.path.mainLangs.forEach((lang_name, i) => {
                    const push_data = { key: lang_name, name: '', index: i };
                    //["KM", "EN", "RU", "VI", "ZH", "AE", "JP", "KK", "MN", "PH"]
                    switch (lang_name) {
                        case "KM":
                            push_data.name = "ភាសាខ្មែរ";
                            break;
                        case "EN":
                            push_data.name = "English";
                            break;
                        case "RU":
                            push_data.name = "Pусский язык";
                            break;
                        case "VI":
                            push_data.name = "Tiếng Việt";
                            break;
                        case "ZH":
                            push_data.name = "中文";
                            break;
                        case "AE":
                            push_data.name = "اللغة العربية";
                            break;
                        case "JP":
                            push_data.name = "日本語";
                            break;
                        case "KK":
                            push_data.name = "Қазақ тілі";
                            break;
                        case "MN":
                            push_data.name = "Монгол хэл";
                            break;
                        case "PH":
                            push_data.name = "wikang pilipino";
                            break;
                    };
                    this.datas.langs_list.push(push_data);
                });

                Object.keys(this.path.kb_lmk_list).forEach((name, i) => {
                    this.datas._land_mark_list[name] = {};
                    this.datas._land_mark_list[name]["name"] = this.path.kb_lmk_list[name]["name"];
                    this.datas._land_mark_list[name]["price"] = this.path.kb_lmk_list[name]["price"];
                    this.datas._land_mark_list[name]["ko_name"] = this.path.kb_lmk_list[name]["ko_name"];
                    this.datas._land_mark_list[name]["get_yn"] = this.path.kb_lmk_list[name]["get_yn"];

                    this.datas._land_mark_list[name]["info_title"] = this.add_data_list[name]["info_title"];
                    this.datas._land_mark_list[name]["info_text"] = this.add_data_list[name]["info_text"];
                    this.datas._land_mark_list[name]["sub_title"] = this.add_data_list[name]["sub_title"] || this.path.kb_lmk_list[name]["ko_name"];
                });
                this.land_mark_split();//각 랜드마크에 지역분류를 추가하고 그에 맞는 배열로 추가 분할
                //console.log(this.datas._land_mark_list)

                this.get_all_points();
                // this.datas.coin = this.path.coin || 0;
                // this.datas.r_point = this.path.r_point || 0;
                // this.datas.l_point = this.path.l_point || 0;
                // this.datas.w_point = this.path.w_point || 0;
                // this.datas.s_point = this.path.s_point || 0;

                this.datas.conts_se_cd = this.path.conts_se_cd || 0; // 콘텐츠 학교 급 (1:초등, 2:중등)
                this.datas.conts_type = this.path.conts_type || 0; // 콘텐츠 타입 (1:한국어 교재, 2:익힘, 3:평가, 4:게임)
                this.datas.conts_step = this.path.conts_step || 0; // 콘텐츠 단계(1~4)
                this.datas.conts_unit = this.path.conts_unit || 0; // 콘텐츠 단원(1~8)
                this.datas.conts_ele = this.path.conts_ele || 0; // 콘텐츠 차시(1~11)

                //this.datas.possess_lmk_list = this.path.lmk_list;
                this.datas.passYn_list = this.path.passYn_list;
                this.datas.is_module_pass = this.path.isCompleted;
                this.datas.isFirstConts = this.path.isFirstConts;
                //this.datas.trans_lang = this.lang;

                let storage_lang = null;
                if (!this.local_storage.load("page", "trans_lang") || this.local_storage.load("page", "trans_lang") == "") {
                    storage_lang = null;
                    this.datas.trans_lang = this.path.getTransLang();
                } else {
                    storage_lang = this.local_storage.load("page", "trans_lang");
                    this.datas.trans_lang = storage_lang;
                }
                this.lang = this.datas.trans_lang;//수정중

                console.log("lms-datas :", this.datas);
                console.log("lms-path :", this.path)
            }

            get se_cd() {
                return this.datas.conts_se_cd;
            }
            get type() {
                return this.datas.type;
            }
            get step() {
                return this.datas.conts_step;
            }
            get unit() {
                return this.datas.conts_unit;
            }
            get ele() {
                return this.datas.conts_ele;
            }

            set lang(_st) {
                this.datas.trans_lang = _st;
                const lang_obj = this.datas.langs_list.find(obj => obj.key == this.datas.trans_lang);

                this.datas.trans_lang_index = lang_obj.index;
                this.local_storage.save("page", "trans_lang", _st);
            }
            get lang() {
                return this.datas.trans_lang;
            }

            page_finish() {
                //console.log("page_finish()")
                this.path.wcontsComplete();//진도율 처리되면서 다음 모듈(페이지)로 이동됨.
            }
            page_prev_move(){
                this.path.preContent();//이전 모듈(페이지)로 이동됨.
            }

            async add_word_book(_txt, category = 0) {//단어장 저장하기 //'00'으로 호출 시에는 error로 return
                //category => KSL단어:00, 즐겨찾기 단어:01, 틀린 단어:02, 맞춘 단어:03, 사전 단어:04
                const _catagory = "0" + category;
                if(_txt == "" || !_txt) {
                    this.alert_message.show("error");
                    return false;
                }
                
                //console.log("add_word_book : ", _txt)
                const is_success = await this.path.addWordBook(_txt, _catagory);
                if (is_success.result == 'success') {
                    this.alert_message.show("word");
                    return true;
                } else {
                    this.alert_message.show("word_error");
                    return false;
                };
            }

            //*** lmk_list가 구매한 리스트만 오는 것인지 확인 필요함 ***
            buy_land_mark(index, name) {//랜드 마크 구매하기
                return new Promise(async (resolve, reject) => {
                    const is_success = await this.path.buyLmk(name);
                    //console.log("is_success : ", is_success)
                    if (is_success.result == 'success') {
                        //this.datas.possess_lmk_list = this.path.lmk_list;
                        this.datas._land_mark_list[name]["get_yn"] = "Y";
                        resolve(true);
                        //return true;
                    } else {
                        resolve(false);
                        this.alert_message.show("land_mark");
                        //alert("통신 장애로 인하여 \n 랜드마크 구매를 실패하였습니다.");
                        //return false;
                    };
                });

            }
            //get possess_lmk_list() { return this.datas.possess_lmk_list; }


            async change_coin() {
                const is_success = await this.path.changePoint();
                if (is_success.result == 'success') {
                    this.get_all_points();
                    //this.get_coin_effect("basic", [500, 300], [733, -85]);//코인은 별다른 이팩트가 없는 것 같음.
                    if (this.kbc_main.coins) this.kbc_main.coins.update_points(["coin"]);
                } else {
                    //console.log("error.responseText : ", is_success.message);
                    if(is_success.code == "E401"){
                        this.alert_message.show("point_empty");
                    }else{
                        this.alert_message.show("coin");
                    };
                    
                    //alert("통신 장애로 인하여 \n coin 저장에 실패하였습니다.");
                };
            }
            get coin() { return this.datas.coin; }

            //포인트 4종 저장
            async points(_arr = [], num = 1) {
                this.type_list = _arr;
                const is_success = await this.path.setPoint(this.type_list.toString(), num)
                if (is_success.result == 'success') {
                    this.get_all_points();
                    const return_arr = this.type_list.map(lms_name => {
                        if (lms_name == 'LFC01') return "listen";
                        if (lms_name == 'LFC02') return "read";
                        if (lms_name == 'LFC03') return "write";
                        if (lms_name == 'LFC04') return "speak";
                    });
                    if (this.kbc_main.coins) this.kbc_main.coins.update_points(return_arr);
                    if (this.type_list.length == 1) {
                        this.get_coin_effect(return_arr[0], [500, 300], [733, -85]);
                    } else if (this.type_list.length == 2) {
                        this.get_coin_effect(return_arr[0], [250, 300], [733, -85]);
                        this.get_coin_effect(return_arr[1], [750, 300], [733, -85]);
                    };
                } else {
                    //console.log("message : ", is_success.message);
                    this.alert_message.show("point_update");
                };
            }

            /* async l_point(num = 1) { //듣기 저장
                const is_success = await this.path.setPoint('LFC01', num)
                if (is_success.result == 'success') {
                    this.get_all_points();
                    if (this.kbc_main.coins) this.kbc_main.coins.update_points(["listen"]);
                } else {
                    this.alert_message.show("coin");
                };
            } */
            get l_point() { return this.datas.l_point; }

            /* async r_point(num = 1) { //읽기
                const is_success = await this.path.setPoint('LFC02', num)
                if (is_success.result == 'success') {
                    this.get_all_points();
                    if (this.kbc_main.coins) this.kbc_main.coins.update_points(["read"]);
                } else {
                    this.alert_message.show("coin");
                };
            } */
            get r_point() { return this.datas.r_point; }

            /* async w_point(num = 1) { //쓰기
                const is_success = await this.path.setPoint('LFC03', num)
                if (is_success.result == 'success') {
                    this.get_all_points();
                    if (this.kbc_main.coins) this.kbc_main.coins.update_points(["write"]);
                } else {
                    this.alert_message.show("coin");
                };
            } */
            get w_point() { return this.datas.w_point; }

            /* async s_point(num = 1) { //말하기
                const is_success = await this.path.setPoint('LFC04', num)
                if (is_success.result == 'success') {
                    this.get_all_points();
                    if (this.kbc_main.s_point) this.kbc_main.coins.update_points(["speak"]);
                } else {
                    this.alert_message.show("coin");
                };
            } */
            get s_point() { return this.datas.s_point; }

            get_all_points() {//통신 완료 후 또는 필요시 모든 데이터를 갱신한다.
                this.datas.coin = this.path.coin;
                this.datas.l_point = this.path.l_point;
                this.datas.r_point = this.path.r_point;
                this.datas.w_point = this.path.w_point;
                this.datas.s_point = this.path.s_point;

                return this.datas;
            }

            //페이지가 로드된 이후에 사용되어야 합니다. main_wrap 없음
            async get_coin_effect(_type, start, end) {
                //start:시작 지점 배열, end:끝 지점 배열
                await this.kbc_main.set_time.out(500);
                //console.log(start)
                this.kbc_main.main_wrap.classList.add("dispose");
                this.kbc_main.Main_class.quizs.forEach( quiz => {
                    quiz.btns.check.classList.add("dispose");
                })

                this.img_path = this.kbc_main.root_path + "img/common/coins/";
                const type = "coin_" + _type;
                const newStar = $(`<div class="star_popup"><img src="${this.img_path}${type}.png" style="left:${start[0]}px; top:${start[1]}px"></div>`);
                //$(document.body).append(newStar);
                $(this.kbc_main.main_wrap).append(newStar);
                if (this.sound_class) this.sound_class.play("star");
                setTimeout(() => {
                    newStar.find("img").animate(
                        { left: end[0], top: end[1] },
                        1000,
                        () => {
                            newStar.remove();
                            this.kbc_main.main_wrap.classList.remove("dispose");
                            this.kbc_main.Main_class.quizs.forEach( quiz => {
                                quiz.btns.check.classList.remove("dispose");
                            })
                        }
                    );
                }, 1000);
            }

            async request_content_data(_arg) {
                //console.log(_arg.qnum+"퀴즈 : ", (_arg.index+1)+"번")
                this.path.contsState(
                    _arg.jimun,
                    _arg.jung_dap,
                    _arg.type,
                    _arg.user_dap,
                    _arg.score,
                    _arg.try_num,
                )
            }


            async stt_api(rec_data) {
                const formData = new FormData();
                formData.append("questionScript", rec_data.question_text);
                formData.append("script", rec_data.dap_text);
                formData.append("userInfo", this.user_info);
                formData.append("audio", rec_data.blob_data, "audio.mp3");
                //console.log("rec_data.blob_data,", rec_data.blob_data)
                
                const data = {
                    questionScript : rec_data.question_text,
                    script : rec_data.dap_text,
                    audio : rec_data.blob_data,
                    userInfo : this.user_info
                };
                let stt_response = null;
                try{
                    // stt_response = await fetch('/api/stt.do',{
                    //     method: "POST",
                    //     headers: {
                    //         'Content-Type':'application/json;charset=utf-8;'
                    //     },
                    //     body: JSON.stringify(data),
                    this.alert_message.show("recorde_post");
                    stt_response = await fetch('/api/stt.do',{
                        method: "POST",
                        body: formData,
                    })/* .then(response => {
                        if (response.ok) {
                            // 성공적인 응답 처리
                            return 
                        } else {
                            // 상태 코드에 따른 처리
                            if (response.status === 404) {
                                // 요청 오류
                            } else if (response.status === 500) {
                                // 서버 오류
                            }
                        }
                    }); */
                }catch (e){}
                
                if(!stt_response.ok) {
                    this.alert_message.show("network");
                    return false;
                }
                const return_data = this.stt_response = await stt_response.json();
                return return_data;
            }




            set cdn(_st) {
                this.datas.cdn = _st;
            }
            get cdn() { return this.datas.cdn; }

            itostr3(np) {
                return (np >= 10 && np < 100) ? "0" + String(np) : "00" + np;
            }
        },
        //설정화면 관련
        SETTINGS: class SETTINGS {
            constructor(kbc, main_wrap, lms, sound, isMobile, isLocal, local_storage, basic_volume, alert_message) {
                this.kbc_main = kbc;
                this.sound_class = sound;
                this.isMobile = isMobile;
                this.isLocal = isLocal;
                this.local_storage = local_storage;
                this.basic_volume = basic_volume;
                this.alert_message = alert_message;
                this.maxRecTime = 60;

                this.eff_name = this.kbc_main.eff_name;
                this.bgm_name = this.kbc_main.bgm_name;
                this.datas = {};
                this.range = { vwrap: null, volume: null, vThumb: null, eff_vwrap: null, eff_volume: null, eff_vThumb: null };

                this.wraps_con = main_wrap.querySelector("#common_container") || null;
                this.common_btns = main_wrap.querySelector("#common_btns") || null;
                this.lms = lms;
                if (!this.wraps_con) {
                    this.wraps_con = document.createElement("div");
                    this.wraps_con.setAttribute("id", "common_container");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.wraps_con, quiz);
                };
                if (!this.common_btns) {
                    this.common_btns = document.createElement("div");
                    this.common_btns.setAttribute("id", "common_btns");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.common_btns, this.wraps_con);
                };

                this.open_btn = document.createElement("button");
                this.open_btn.classList.add("setting_open_btn");
                this.open_btn.setAttribute("title", "설정 열기");
                this.common_btns.appendChild(this.open_btn);


                this.img_path = kbc_main.root_path + "img/common/setting/";
                this.settings_con = document.createElement("div");
                this.settings_con.classList.add("settings_con");
                this.settings_con.innerHTML =
                    `<div class="settings_board" id="settinggroup">
                    <img class="setbackground" src="${this.img_path}setbackground.png">
                
                    <div class="board_inner">
                        <h2>설정</h2>    

                        <div class="li">
                            <div><p data-icons="${this.img_path}icons_1.png">배경음</p></div>

                            <div class="backslidecontainer" id="volume">
                                <input type="range" class="volume-bar" min="0" max="1000" step="0.1" value="1" tabIndex="-1"/>
                                <div class="range_viewer">
                                    <div class="bg">
                                        <div class="fill"></div>
                                    </div>
                                </div>
                                <div class="range_thumb">
                                    <div class="thumb"></div>
                                </div>
                            </div>
                        </div>

                        <div class="li">
                            <div><p data-icons="${this.img_path}icons_2.png">효과음</p></div>

                            <div class="effectslidecontainer" id="eff_volume">
                                <input type="range" class="eff_volume-bar" min="0" max="1000" step="0.1" value="1" tabIndex="-1"/>
                                <div class="range_viewer">
                                    <div class="bg">
                                        <div class="fill"></div>
                                    </div>
                                </div>
                                <div class="range_thumb">
                                    <div class="thumb"></div>
                                </div>
                            </div>
                        </div>

                        <div class="li">
                            <div><p data-icons="icons_3.png">마이크 테스트</p></div>

                            <div id="mictest">
                                <button class="mic_test_btn btn" title="마이크 테스트창 열기"><img src="${this.img_path}mictest_start.png" alt=""></button>
                            </div>
                        </div>

                        <div class="li">
                            <div><p data-icons="icons_4.png">다국어 선택</p></div>

                            <div class="language_choice_con">
                                <button class="language_prev btn" alt="이전 언어 선택"><img src="${this.img_path}localization_prev.png" alt=""></button>
                                <div class="language_box"><img src="${this.img_path}language_btn_bg.png" alt=""><span class="lang">한국어는요?</span></div>
                                <button class="language_next btn" alt="다음 언어 선택"><img src="${this.img_path}localization_next.png" alt=""></button>
                            </div>
                        </div>

                        <div class="li">
                            <button class="settingclose btn" title="설정 창 닫기"><img src="${this.img_path}setting_close.png" alt=""></button>
                        </div>
                    </div>
                    
                    

                    <div class="mic_test_pop">
                        <h2>마이크 테스트</h2>
                        <p>마이크 버튼을 누르고 아래문장을 말해보세요.</p>
                        <div class="canvas_con">
                            <canvas id="app" style="width: 100%; height: 100px;" width="500" height="100"></canvas>
                        </div>
                        <div class="setting_recorde_aud_wrap"></div>
                        <p class="ex_text">"안녕하세요."</p>
                        <button class="_btn ready" title="녹음하기"></button>
                        <button class="_btn stop" title="녹음중지"></button>
                        <button class="_btn listening" title="녹음듣기"></button>
                        <button class="_btn pause" title="녹음듣기 정지"></button>
                        <button class="_close" title="마이크 테스트 닫기"></button>
                    </div>

                </div>
                `;

                this.wraps_con.appendChild(this.settings_con);
                this.close_btn = this.settings_con.querySelector(".settingclose");
                this.range.vwrap = this.settings_con.querySelector("#volume");
                this.range.volume = this.settings_con.querySelector("input.volume-bar");
                this.range.vThumb = this.settings_con.querySelector("#volume .thumb");
                this.range.vfill = this.settings_con.querySelector("#volume .fill");

                this.range.eff_vwrap = this.settings_con.querySelector("#eff_volume");
                this.range.eff_volume = this.settings_con.querySelector("input.eff_volume-bar");
                this.range.eff_vThumb = this.settings_con.querySelector("#eff_volume .thumb");
                this.range.eff_vfill = this.settings_con.querySelector("#eff_volume .fill");

                this.mic_test_pop = this.settings_con.querySelector(".mic_test_pop");
                this.mic_test_open_btn = this.settings_con.querySelector(".mic_test_btn");
                this.mic_test_close_btn = this.mic_test_pop.querySelector("._close");

                this.lang_change_con = this.settings_con.querySelector(".language_choice_con");
                this.language_box = this.lang_change_con.querySelector(".language_box");
                this.language_text = this.lang_change_con.querySelector(".language_box span");
                this.language_prev_btn = this.lang_change_con.querySelector(".language_prev");
                this.language_next_btn = this.lang_change_con.querySelector(".language_next");

                this.local_storage_volume_set();//init() 보다 앞서야 함
                this.langs_change();

                this.init();
            }



            init() {
                this.open_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.local_storage_volume_set();
                    this.show();
                });
                this.close_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.kbc_main.Main_class.lang_changed_set();//Class init때는 실행되면 안됨
                    this.hide();
                });

                this.range.volume.addEventListener("input", e => {
                    const v = parseFloat(e.target.value) / parseFloat(this.range.volume.max);
                    this.volume = v;
                });

                this.range.volume.addEventListener("change", e => {
                    const v = parseFloat(e.target.value) / parseFloat(this.range.volume.max);
                    this.volume = v;
                });

                this.range.eff_volume.addEventListener("input", e => {
                    const v = parseFloat(e.target.value) / parseFloat(this.range.eff_volume.max);
                    this.eff_volume = v;
                });

                this.range.eff_volume.addEventListener("change", e => {
                    const v = parseFloat(e.target.value) / parseFloat(this.range.eff_volume.max);
                    this.eff_volume = v;
                });

                this.mic_test_open_btn.addEventListener("click", async e => {
                    this.sound_class.play("ting");
                    await this.mic_test_set();
                    this.mic_test_show();
                });

                /* this.language_text.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    
                }); */
                this.language_prev_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.langs_change("prev");
                });
                this.language_next_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.langs_change("next");
                });




                //this.mic_test_set();
            }
            langs_change(_way = "") {
                const index = this.lms.datas.trans_lang_index;

                let return_key = '';
                let return_name = '';
                if (_way == "prev") {
                    const num = (index) ? index - 1 : this.lms.datas.langs_list.length - 1;
                    return_name = this.lms.datas.langs_list[num].name;
                    return_key = this.lms.datas.langs_list[num].key;
                } else if (_way == "next") {
                    const num = (index < this.lms.datas.langs_list.length - 1) ? index + 1 : 0;
                    return_name = this.lms.datas.langs_list[num].name;
                    return_key = this.lms.datas.langs_list[num].key;
                } else {
                    return_key = this.lms.datas.langs_list[index].key;
                    return_name = this.lms.datas.langs_list[index].name;
                };
                this.lms.lang = return_key;
                this.language_text.innerHTML = return_name;
            };

            //볼륨 설정에 대한 기존 조절 값 가져오기
            local_storage_volume_set() {
                (this.local_storage.load(this.eff_name, "volume")) ?
                    this.eff_volume = this.local_storage.load(this.eff_name, "volume") :
                    this.eff_volume = this.basic_volume || 1;// 위치 중요 base_btn_set() 보다 아래 위치해야 함

                (this.local_storage.load(this.bgm_name, "volume")) ?
                    this.volume = this.local_storage.load(this.bgm_name, "volume") :
                    this.volume = this.basic_volume || 1;// 위치 중요 base_btn_set() 보다 아래 위치해야 함
                    this.volume = 0;// 개발 중 너무 신경쓰여서 잠시 줄임.....
            }
            //마이크 창 테스트 보기
            mic_test_show() {
                this.mic_test_pop.classList.add("active");
                this.recordeData = [];
                this.recordeData.splice(0);
                this.recorde_aud_wrap.innerHTML = "";
                this.btn_remove();
                this.rec_start_btn.classList.add("active");
            }
            //마이크 테스트
             mic_test_set() {
                return new Promise(async (resolve, reject) => {
                    this.recorde_aud_wrap = this.mic_test_pop.querySelector(".setting_recorde_aud_wrap");
                    this.recordeData = [];
                    this.recorde_data = {};
                    this.mediaStream = null;
                    this.isRecord = await this.recordHardwareAccessCheck();

                    this.canvas = document.getElementById("app");//추후에 공통으로 옮겨야 합니다.
                    this.canvasCtx = this.canvas.getContext("2d");

                    if (this.mediaStream) {
                        this.createAudio();
                        this.draw();
                    }

                    this.rec_start_btn = this.mic_test_pop.querySelector("._btn.ready");
                    this.rec_start_btn.addEventListener("click", e => {
                        this.sound_class.play("ting");
                        this.startRecoding();
                    });

                    this.rec_stop_btn = this.mic_test_pop.querySelector("._btn.stop");
                    this.rec_stop_btn.addEventListener("click", e => {
                        this.sound_class.play("ting");
                        this.stopRecorde();
                    });

                    this.rec_listen_btn = this.mic_test_pop.querySelector("._btn.listening");
                    this.rec_listen_btn.addEventListener("click", e => {
                        this.sound_class.play("ting");
                        this.recPlayAudio();
                    });

                    this.rec_pause_btn = this.mic_test_pop.querySelector("._btn.pause");
                    this.rec_pause_btn.addEventListener("click", e => {
                        this.sound_class.play("ting");
                        this.recstop_audio();
                    });

                    this.mic_test_close_btn.addEventListener("click", e => {
                        this.sound_class.play("ting");
                        this.mic_test_hide();
                    });

                    this.btn_remove();
                    this.rec_start_btn.classList.add("active");
                    resolve(this.isRecord)
                });
                
            }
            //마이크 테스트 버튼 숨기기
            btn_remove() {
                //console.log(this.isRecord)
                this.rec_start_btn.classList.remove("active");
                this.rec_stop_btn.classList.remove("active");
                this.rec_listen_btn.classList.remove("active");
                this.rec_pause_btn.classList.remove("active");
            }
            //마이크 녹음 테스트
            startRecoding() {
                if (!this.mediaStream) {
                    this.alert_message.show("recorde_author");
                    //alert("마이크 권한 승인이 필요합니다.")
                    return false;
                }
                this.mediaRecorder = new MediaRecorder(this.mediaStream);
                this.mediaRecorder.addEventListener('dataavailable', event => {
                    this.recordeData.push(event.data);
                });

                this.mediaRecorder.start();

                this.btn_remove();
                this.rec_stop_btn.classList.add("active");

                if (this.setTimeFn) this.setTimeFn = null;
                this.setTimeFn = setTimeout(e => {
                    //console.log(this)
                    this.stopRecorde();
                }, this.maxRecTime * 1000);
            };
            //마이크 녹음 정지
            stopRecorde() {
                this.setTimeFn = null;
                //console.log("stopRecorde()-call");

                this.btn_remove();
                this.rec_listen_btn.classList.add("active");

                this.mediaRecorder.stop();
                this.mediaRecorder.addEventListener('stop', () => {
                    const blob = new Blob(this.recordeData, { type: "audio/mpeg-3" });
                    const audioURL = URL.createObjectURL(blob);
                    const audioElement = new Audio(audioURL);
                    //audioElement.controls = true;
                    this.recordeData.splice(0);

                    this.recorde_aud_wrap.innerHTML = "";
                    this.recorde_aud_wrap.appendChild(audioElement);
                    //console.log(this.recorde_aud_wrap, audioElement)
                    this.recorde_aud = this.recorde_aud_wrap.querySelector("audio");
                    this.recorde_aud.currentTime = 1e101;
                    this.recorde_aud.pause();
                    this.recorde_aud.addEventListener("ended", () => {
                        this.recstop_audio();
                    });
                    setTimeout(e => {
                        this.recorde_aud.currentTime = 0;
                    }, 50)
                });



            };
            //마이크 녹음 파일 듣기
            recPlayAudio() {
                this.recorde_aud.play();

                this.btn_remove();
                this.rec_pause_btn.classList.add("active");
            };
            //마이크 녹음 파일 듣기 멈춤
            recstop_audio() {
                this.recorde_aud.pause();

                this.btn_remove();
                this.rec_listen_btn.classList.add("active");
            };
            //마이크 소리를 데이터로 전환
            createAudio() {
                const p = this;
                this.recorde_data.audioCtx = new (win.AudioContext || win.webkitAudioContext)();
                this.recorde_data.analyser = this.recorde_data.audioCtx.createAnalyser();
                this.recorde_data.source = this.recorde_data.audioCtx.createMediaStreamSource(this.mediaStream);
                this.recorde_data.source.connect(this.recorde_data.analyser);

                this.recorde_data.analyser.fftSize = 2048;
                this.recorde_data.bufferLength = this.recorde_data.analyser.frequencyBinCount;
                this.recorde_data.audioDataArray = new Uint8Array(p.recorde_data.bufferLength);
            }
            //마이크 소리 데이터를 파형으로 그리기
            draw() {
                // 파형 데이터 가져오기
                this.recorde_data.analyser.getByteTimeDomainData(this.recorde_data.audioDataArray);

                // 캔버스 초기화
                //this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
                //this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // 파형 Line 그리기
                this.canvasCtx.lineWidth = 3;
                this.canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
                this.canvasCtx.beginPath();
                let sliceWidth = this.canvas.width * 1.0 / this.recorde_data.bufferLength;
                let x = 0;
                for (let i = 0; i < this.recorde_data.bufferLength; i++) {
                    const v = this.recorde_data.audioDataArray[i] / 128.0;
                    const y = v * this.canvas.height / 2;

                    if (i === 0) {
                        this.canvasCtx.moveTo(x, y);
                    } else {
                        this.canvasCtx.lineTo(x, y);
                    };

                    x += sliceWidth;
                }

                this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
                this.canvasCtx.stroke();
                requestAnimationFrame(() => this.draw());
            }
            //마이크 사용 가능 확인 하기
            recordHardwareAccessCheck() {
                const p = this;
                return new Promise((resolve, reject) => {
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                        .then((stream) => {
                            p.mediaStream = stream;
                            resolve(true);
                        })
                        .catch((error) => {
                            //console.log("error : ", error)
                            this.alert_message.show("recorde_author");
                            //alert("마이크 설치가 필요한 페이지입니다.");
                            resolve(false);
                        });
                })
            }
            //마이크 테스트 창 닫기
            mic_test_hide() {
                this.mic_test_pop.classList.remove("active");
            }


            set eff_volume(num) {

                num = Math.min(1, num);
                num = Math.max(0, num);
                this.datas.eff_volume = num;
                this.local_storage.save(this.eff_name, "volume", this.datas.eff_volume);

                this.range.eff_volume.value = parseFloat(this.range.eff_volume.max) * num;
                this.range.eff_vThumb.style.left = num * 100 + "%";
                this.range.eff_vfill.style.width = this.range.eff_vThumb.style.left;
                try {//영상 찾기
                    if (this.kbc_main.Main_class && this.kbc_main.Main_class.quizs) {
                        kbc_main.Main_class.quizs.forEach(cls => {
                            if (cls.quiz_type == "vod") {
                                cls.player.volume = this.datas.eff_volume;
                            }
                        });
                    }
                } catch { }

                this.sound_class.sound_volume_change(this.datas.eff_volume);
                //(num == 0) ? console.log("eff_muted") : console.log("eff_not-muted");
            }
            get eff_volume() {
                return this.datas.eff_volume;
            }

            set volume(num) {

                num = Math.min(1, num);
                num = Math.max(0, num);
                this.datas.volume = num;
                this.local_storage.save(this.bgm_name, "volume", this.datas.volume);

                this.range.volume.value = parseFloat(this.range.volume.max) * num;
                this.range.vThumb.style.left = num * 100 + "%";
                this.range.vfill.style.width = this.range.vThumb.style.left;
                this.sound_class.bgm_sound_volume_change(this.datas.volume);
                //(num == 0) ? console.log("muted") : console.log("not-muted");
            }
            get volume() {
                return this.datas.volume;
            }

            show() {
                this.wraps_con.classList.add("active");
                this.settings_con.classList.add("active");
            }

            hide() {
                this.wraps_con.classList.remove("active");
                this.settings_con.classList.remove("active");
                this.mic_test_pop.classList.remove("active");
            }
        },
        //코인 관련
        COINS: class COINS {
            constructor(main_wrap, lms, sound, set_time, alert_message) {
                this.sound_class = sound;
                this.set_time = set_time;
                this.alert_message = alert_message;
                this.common_btns = main_wrap.querySelector("#common_btns") || null;
                this.lms = lms;
                if (!this.common_btns) {
                    this.common_btns = document.createElement("div");
                    this.common_btns.setAttribute("id", "common_btns");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.common_btns, this.wraps_con);
                };

                this.img_path = kbc_main.root_path + "img/common/coins/";
                this.coins_con = document.createElement("div");
                this.coins_con.classList.add("coins_con");
                this.coins_con.innerHTML =
                    `<div class="coins_board">
                    <button class="plusbtn" title="코인으로 교환하기"><img src="${this.img_path}plusbtn.png" alt=""></button>
                    <div id="coin">
                        <label for="coin_num">코인 점수</label> 
                        <input id="coin_num" type="text" readonly value="0">
                    </div>
                    <div id="speak">
                        <img src="${this.img_path}speakingCoin.png" alt="말하기 포인트 아이콘">
                        <label for="speak_num">말하기 점수</label>
                        <input id="speak_num" type="text" readonly value="0">
                    </div>
                    <div id="read">
                        <img src="${this.img_path}readCoin.png" alt="일기 포인트 아이콘">
                        <label for="read_num">일기 점수</label>
                        <input id="read_num" type="text" readonly value="0">
                    </div>
                    <div id="listen">
                        <img src="${this.img_path}listeningCoin.png" alt="듣기 포인트 아이콘">
                        <label for="listen_num">듣기 점수</label>
                        <input id="listen_num" type="text" readonly value="0">
                    </div>
                    <div id="write">
                        <img src="${this.img_path}writeCoin.png" alt="쓰기 포인트 아이콘">
                        <label for="write_num">쓰기 점수</label>
                        <input id="write_num" type="text" readonly value="0">
                    </div>
                </div>
                `;

                this.common_btns.appendChild(this.coins_con);

                this.coin = this.coins_con.querySelector("#coin_num");
                this.speak = this.coins_con.querySelector("#speak_num");
                this.read = this.coins_con.querySelector("#read_num");
                this.listen = this.coins_con.querySelector("#listen_num");
                this.write = this.coins_con.querySelector("#write_num");
                this.coin_plus_btn = this.coins_con.querySelector(".plusbtn") || null;
                if(this.coin_plus_btn) this.coin_plus_btn.addEventListener("click", e => {
                    this.lms.change_coin();
                });
                //this.init();
                //this.update_points(["coin", "speak"]);
                this.update_points();


                //this.test();//코인 모션 테스터
            }
            async test() {
                await this.set_time.out(2500);
                //this.lms.points(['LFC01', 'LFC02']);
                this.lms.points(['LFC03']);
            }

            async update_points(types = []) {
                this.coin.value = this.lms.coin;
                this.speak.value = this.lms.s_point;
                this.read.value = this.lms.r_point;
                this.listen.value = this.lms.l_point;
                this.write.value = this.lms.w_point;

                types.forEach(name => {
                    this[name].classList.add("rotate_effect");
                });

                await this.set_time.out(2500);
                this.coin.classList.remove("rotate_effect");
                this.speak.classList.remove("rotate_effect");
                this.read.classList.remove("rotate_effect");
                this.listen.classList.remove("rotate_effect");
                this.write.classList.remove("rotate_effect");


            }

        },
        //여권 관련 //ok!
        PASSPORT: class PASSPORT {
            constructor(main_wrap, lms, sound, alert_message) {
                this.sound_class = sound;
                this.alert_message = alert_message;
                this.wraps_con = main_wrap.querySelector("#common_container") || null;
                this.common_btns = main_wrap.querySelector("#common_btns") || null;
                this.lms = lms;
                if (!this.wraps_con) {
                    this.wraps_con = document.createElement("div");
                    this.wraps_con.setAttribute("id", "common_container");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.wraps_con, quiz);
                };
                if (!this.common_btns) {
                    this.common_btns = document.createElement("div");
                    this.common_btns.setAttribute("id", "common_btns");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.common_btns, this.wraps_con);
                };


                //const open_btn = `<button class="passport_btn" title="여권 열기"></button>`;
                this.open_btn = document.createElement("button");
                this.open_btn.classList.add("passport_btn");
                this.open_btn.setAttribute("title", "여권 열기");
                this.common_btns.appendChild(this.open_btn);


                this.img_path = kbc_main.root_path + "img/common/passport/";
                this.passport_div = document.createElement("div");
                this.passport_div.classList.add("passport");
                this.passport_div.innerHTML = `
                    <button class="close_btn" title="여권 닫기"></button>
                    <div class="stamps">
                        <div class="stamp" title="1단원 이동"><img src="${this.img_path}1.png" alt=""></div>
                        <div class="stamp" title="2단원 이동"><img src="${this.img_path}2.png" alt=""></div>
                        <div class="stamp" title="3단원 이동"><img src="${this.img_path}3.png" alt=""></div>
                        <div class="stamp" title="4단원 이동"><img src="${this.img_path}4.png" alt=""></div>
                        <div class="stamp" title="5단원 이동"><img src="${this.img_path}5.png" alt=""></div>
                        <div class="stamp" title="6단원 이동"><img src="${this.img_path}6.png" alt=""></div>
                        <div class="stamp" title="7단원 이동"><img src="${this.img_path}7.png" alt=""></div>
                        <div class="stamp" title="8단원 이동"><img src="${this.img_path}8.png" alt=""></div>
                    </div>
                `;
                this.wraps_con.appendChild(this.passport_div);
                this.stamps = this.passport_div.querySelectorAll(".stamp");
                this.close_btn = this.passport_div.querySelector(".close_btn");

                this.init();
            }

            init() {
                //단원 완료 상태에 따른 이미지변경 작업
                //console.log("yn_list : ", this.lms.datas.passYn_list)
                this.lms.datas.passYn_list.list.forEach((val, i) => {
                    if (val.pass_yn == "Y") {
                        const img = this.stamps[i].querySelector("img");
                        let src = img.getAttribute("src").split("/").reverse()[0].split(".")[0];
                        //console.log(src);
                        let add_text = "";
                        if (this.lms.step == 3) {
                            add_text = "americaPassport";
                        } else if (this.lms.step == 4) {
                            add_text = "afocePassport";
                        }
                        let change_src = this.img_path + add_text + src + ".png";
                        //console.log("change_src : ", change_src)
                        img.setAttribute("src", change_src);
                    }
                });

                this.open_btn.addEventListener("click", e => {
                    this.sound_class.play("ting")
                    this.show();
                })
                this.close_btn.addEventListener("click", e => {
                    this.sound_class.play("ting")
                    this.hide();
                })
            }

            show() {
                this.wraps_con.classList.add("active");
                this.passport_div.classList.add("active");
            }

            hide() {
                this.wraps_con.classList.remove("active");
                this.passport_div.classList.remove("active");
            }
        },
        //랜드마크 관련
        //info 정보 갱신해야 함.
        LANDMARKS: class LANDMARKS {
            constructor(main_wrap, lms, sound, itostr, alert_message) {
                this.sound_class = sound;
                this.alert_message = alert_message;
                this.wraps_con = main_wrap.querySelector("#common_container") || null;
                this.common_btns = main_wrap.querySelector("#common_btns") || null;
                this.lms = lms;
                this.itostr = itostr;
                if (!this.wraps_con) {
                    this.wraps_con = document.createElement("div");
                    this.wraps_con.setAttribute("id", "common_container");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.wraps_con, quiz);
                };
                if (!this.common_btns) {
                    this.common_btns = document.createElement("div");
                    this.common_btns.setAttribute("id", "common_btns");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.common_btns, this.wraps_con);
                };


                this.types = ["asia", "europe", "america", "afoce"];



                this.open_btn = document.createElement("button");
                this.open_btn.classList.add("land_mark_btn");
                this.open_btn.setAttribute("title", "세계지도 열기");
                this.common_btns.appendChild(this.open_btn);


                this.img_path = kbc_main.root_path + "img/common/market/";
                this.land_con_div = document.createElement("div");
                this.land_con_div.classList.add("land_mark_container");

                this.land_con_div.innerHTML = `
                    <button class="close_btn" title="세계지도 닫기"></button>
                    <div class="world_map_con">
                        <div class="world_map" style="transform: scale(1);">
                            <div class="points"></div>
                        </div>
                    </div>

                    <button class="zoom_in_btn" title="지도 크게 보기"></button>
                    <button class="zoom_out_btn dispose op5" title="지도 작게 보기"></button>

                    <button class="market_open_btn" title="랜드마크 구매 상점 열기"></button>
                    <div class="market">
                        <button class="close_btn" title="상점 닫기"></button>
                        <div class="market_tabs">
                            <button class="tab_btn" title="아시아 목록 열기"><img src="${this.img_path}asiabtn.png" alt=""></button>
                            <button class="tab_btn" title="유럽 목록 열기"><img src="${this.img_path}europebtn.png" alt=""></button>
                            <button class="tab_btn" title="아메리카 목록 열기"><img src="${this.img_path}americabtn.png" alt=""></button>
                            <button class="tab_btn" title="아프리카 & 오세아니아 목록 열기"><img src="${this.img_path}afocebtn.png" alt=""></button>
                        </div>

                        <button class="list_move_btn list_prev_btn" title="이전 리스트 보기" tabIndex="-1"><img src="${this.img_path}sel_prev_btn.png" alt=""></button>
                        <div class="list_con">
                            <div class="list asia"></div>
                            <div class="list europe"></div>
                            <div class="list america"></div>
                            <div class="list afoce"></div>
                        </div>
                        <button class="list_move_btn list_next_btn" title="다음 리스트 보기"><img src="${this.img_path}sel_next_btn.png" alt=""></button>

                    </div>
                    
                    <div class="buyFail">
                        <button class="buy_complet" title="구매 실패 확인"></button>
                    </div>
                    <div class="buySuccess">
                        <button class="buy_complet" title="구매 확인"></button>
                    </div>
                    <div class="info_pop">
                        <button class="close_btn" title="상세 설명 닫기"></button>
                    </div>
                `;




                this.wraps_con.appendChild(this.land_con_div);
                this.world_map = this.land_con_div.querySelector(".world_map");
                this.points = this.world_map.querySelector(".points");
                this.add_land_point();
                /* Object.keys(this.lms.datas._land_mark_list).forEach(name => {
                    if (this.lms.datas._land_mark_list[name].get_yn == "Y") {
                        const add_btn = document.createElement("button");
                        add_btn.classList.add(name);
                        this.points.appendChild(add_btn);
                    }
                }); */



                this.close_btn = this.land_con_div.querySelector(".close_btn");
                this.market_open_btn = this.land_con_div.querySelector(".market_open_btn");
                this.market_close_btn = this.land_con_div.querySelector(".market .close_btn");
                this.market = this.land_con_div.querySelector(".market");
                this.land_points_btns = this.land_con_div.querySelectorAll(".points button") || [];
                this.land_list_con = this.land_con_div.querySelector(".list_con");
                this.land_list_wraps = this.land_con_div.querySelectorAll(".list_con .list") || [];
                this.tabs_btns = this.land_con_div.querySelectorAll(".market_tabs .tab_btn") || [];
                this.list_prev_btn = this.land_con_div.querySelector(".list_prev_btn");
                this.list_next_btn = this.land_con_div.querySelector(".list_next_btn");
                this.buyFail = this.land_con_div.querySelector(".buyFail");
                this.buySuccess = this.land_con_div.querySelector(".buySuccess");
                this.buy_complets = this.land_con_div.querySelectorAll(".buy_complet");
                this.info_pop = this.land_con_div.querySelector(".info_pop");
                this.info_pop_close_btn = this.info_pop.querySelector(".close_btn");

                this.init();
                this.map_control_fn();
            }
            init() {
                this.open_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.show();
                });
                this.close_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.hide();
                });
                this.market_open_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.market_show();
                });
                this.market_close_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.market_hide();
                });
                if (this.land_points_btns.length) {
                    this.land_points_btns.forEach((btn, i) => {
                        btn.addEventListener("click", e => {
                            const _btn = e.currentTarget || e.target;
                            //console.log(_btn.classList[0])
                            this.show_info_pop(_btn.classList[0]);
                        });
                    });
                }

                this.tabs_btns.forEach((btn, i) => {
                    btn.addEventListener("click", e => {
                        this.sound_class.play("ting");
                        this.market_tab_move(i);
                    });
                });

                this.list_prev_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.market_position_move("prev");
                });
                this.list_next_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.market_position_move("next");
                });

                this.buy_complets.forEach((btn, i) => {
                    btn.addEventListener("click", e => {
                        this.sound_class.play("ting");

                        this.buyFail.classList.remove("active");
                        this.buySuccess.classList.remove("active");

                        this.close_buy_box();
                    });
                });
                this.info_pop_close_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.hide_info_pop();
                });
            }


            show() {
                this.wraps_con.classList.add("active");
                this.land_con_div.classList.add("active");
            }

            hide() {
                this.wraps_con.classList.remove("active");
                this.land_con_div.classList.remove("active");
            }
            market_show() {
                //this.move = 1;
                this.tabs = 1;
                this.market.classList.add("active");
                this.market_tab_move(0);
                this.add_land_list(0);
            }
            market_hide() {
                //this.move = 1;
                this.market.classList.remove("active");
            }
            market_tab_move(num) {
                this.add_land_list(num);
                this.close_buy_box();
                this.land_list_wraps.forEach(list => {
                    list.classList.remove("active");
                })
                this.land_list_wraps[num].classList.add("active");
                this.active_tab_name = this.land_list_wraps[num].classList[1];
                this.active_tab_num = num;


                this.list_prev_btn.classList.remove("dispose2");
                this.list_next_btn.classList.remove("dispose2");

                const cur_move = this.lms.datas.land_list[this.active_tab_name].move;
                if (cur_move == 0) {
                    this.list_prev_btn.classList.add("dispose2")
                } else if (cur_move == 2) {
                    this.list_next_btn.classList.add("dispose2")
                };
            }
            market_position_move(way) {
                let cur_move = this.lms.datas.land_list[this.active_tab_name].move;

                if (way == "prev") {
                    cur_move = this.lms.datas.land_list[this.active_tab_name].move = cur_move - 1;
                } else if (way == "next") {
                    cur_move = this.lms.datas.land_list[this.active_tab_name].move = cur_move + 1;
                };

                this.list_prev_btn.classList.remove("dispose2");
                this.list_next_btn.classList.remove("dispose2");

                if (cur_move <= 0) {
                    this.lms.datas.land_list[this.active_tab_name].move = 0;
                    this.list_prev_btn.classList.add("dispose2")
                } else if (cur_move >= 2) {
                    this.lms.datas.land_list[this.active_tab_name].move = 2;
                    this.list_next_btn.classList.add("dispose2")
                };

                const pos_x_st = this.land_list_con.getBoundingClientRect().width * this.lms.datas.land_list[this.active_tab_name].move * -1 + "px";
                this.land_list_wraps[this.active_tab_num].style.left = pos_x_st;

                this.close_buy_box();
            }
            close_buy_box() {
                this.land_con_div.querySelectorAll(".land_card").forEach(tag => {
                    tag.classList.remove("active");
                });
                this.land_con_div.querySelectorAll(".confirm_box").forEach(tag => {
                    tag.classList.remove("active");
                });
            }
            //해당 타입의 리스트를 테그로 생성해놓고 없으면 불러오도록 처리
            //
            add_land_list(num) {
                const list_wrap = this.land_list_wraps[num];
                const type = list_wrap.classList[1];
                const is_nodes = list_wrap.childNodes.length;
                if (!is_nodes) {
                    this.lms.datas.land_list[type].move = 0;
                    this.lms.datas.land_list[type].group.forEach((val, i) => {
                        const tag_con = document.createElement("div");
                        tag_con.classList.add("land_card");
                        tag_con.classList.add(val.name);
                        tag_con.innerHTML =
                            `<button class="list_btn" title="${val.ko_name} 구매창 열기" data-price="${val.price}"><img src="${this.img_path}${val.group}_${this.itostr(i + 1)}.png" alt=""></button>
                                <div class="confirm_box">
                                    <button class="buy_btn" title="구매하기"><img src="${this.img_path}buy_btn.png" alt=""></button>
                                    <button class="info_btn" title="정보보기"><img src="${this.img_path}info_btn.png" alt=""></button>
                                    <button class="close_btn" title="구매창 닫기"></button>
                                </div>
                            `;
                        list_wrap.appendChild(tag_con);

                        const open_btn = tag_con.querySelector(".list_btn");
                        const confirm_box = tag_con.querySelector(".confirm_box");
                        const buy_btn = tag_con.querySelector(".buy_btn");
                        const info_btn = tag_con.querySelector(".info_btn");
                        const close_btn = tag_con.querySelector(".close_btn");

                        open_btn.addEventListener("click", e => {
                            this.sound_class.play("ting");
                            this.close_buy_box();
                            const btn = e.currentTarget || e.target;
                            const parent_box = btn.parentNode;
                            parent_box.classList.add("active");
                            //console.log("parent_box : ", parent_box)
                            confirm_box.classList.add("active");
                        });
                        buy_btn.addEventListener("click", e => {
                            this.sound_class.play("ting");
                            if (this.lms.coin >= 3) {
                                this.show_buy_pop(i, val.name);
                            } else {
                                this.show_error_pop();
                            };
                            //console.log("코인 확인 후 구매 완료 창 열어야 함.")
                        });
                        info_btn.addEventListener("click", e => {
                            this.sound_class.play("ting");
                            this.show_info_pop(val.name);
                        });
                        close_btn.addEventListener("click", e => {
                            this.sound_class.play("ting");
                            this.close_buy_box();
                        });
                    });

                    this.history_check();
                };
            }
            //세계지도에 랜드마크 포인트 넣기
            add_land_point(){
                Object.keys(this.lms.datas._land_mark_list).forEach(name => {
                    if (this.lms.datas._land_mark_list[name].get_yn == "Y") {
                        const add_btn = document.createElement("button");
                        add_btn.classList.add(name);
                        this.points.appendChild(add_btn);
                    }
                });
            }
            history_check() {
                this.land_card_all = this.land_list_con.querySelectorAll(".land_card");
                this.land_card_all.forEach(land_card => {
                    const check_class = land_card.classList[1];
                    if (this.lms.datas._land_mark_list[check_class].get_yn == "Y") {
                        //console.log(this.lms.datas._land_mark_list[check_class])
                        land_card.classList.add("dim");
                    };
                });
            }

            show_error_pop(index, land_id) {
                //console.log("구매 실패 창 열어야 함.");
                this.buyFail.classList.add("active");
            }
            async show_buy_pop(index, land_id) {
                const is_buy_ok = await this.lms.buy_land_mark(index, land_id);
                if (is_buy_ok) {
                    //console.log("구매 완료 창 열어야 함.");
                    this.buySuccess.classList.add("active");
                    this.close_buy_box();
                    this.history_check();
                    this.add_land_point();
                } else {

                }

            }
            //설명 팝업 열기
            show_info_pop(name) {
                const data = this.lms.datas._land_mark_list[name];
                //console.log('data : ', data)
                this.info_pop.classList.add("active");
                let info_content = this.info_pop.querySelector(".info_content") || null;
                if (info_content) info_content.remove();
                info_content = document.createElement("div");
                info_content.classList.add("info_content");
                info_content.classList.add(name);
                info_content.innerHTML =
                    `<div class="left_page">
                        <div class="info_title"><p>${data.info_title}</p></div>
                        <img src="${this.img_path}BOOK_${data.name}.png" alt="">
                        <div class="sub_title"><p>${data.sub_title}</p></div>
                    </div>
                    <div class="right_page">
                        <p class="info_text">${data.info_text}</p>
                    </div>`;

                this.info_pop.appendChild(info_content);
            }
            hide_info_pop() {
                this.info_pop.classList.remove("active");
            }



            zoom_fn(_zoom) {
                //style="transform: scale(1.4);"
                if (_zoom < 1) _zoom = 1;
                this.world_map.style.transform = "scale(" + _zoom + ")";
                if (_zoom >= 2) {
                    this.zoom_in_btn.classList.add("dispose");
                    this.zoom_in_btn.classList.add("op5");
                } else {
                    this.zoom_in_btn.classList.remove("dispose");
                    this.zoom_in_btn.classList.remove("op5");
                };

                if (_zoom <= 1) {
                    this.zoom_out_btn.classList.add("dispose");
                    this.zoom_out_btn.classList.add("op5");
                } else {
                    this.zoom_out_btn.classList.remove("dispose");
                    this.zoom_out_btn.classList.remove("op5");
                };

                //console.log("_zoom : ", _zoom)
            }
            map_control_fn() {
                this.curDown = false;
                this.curYPos = 0;
                this.curXPos = 0;
                this.preX = 0;
                this.preY = 0;

                this.zoom_in_btn = this.land_con_div.querySelector(".zoom_in_btn");
                this.zoom_out_btn = this.land_con_div.querySelector(".zoom_out_btn");
                this.zoom_in_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    let get_zoom = Number(this.world_map.style.transform.split("(")[1].split(")")[0]);
                    if (get_zoom < 1.9) {
                        get_zoom = get_zoom + 0.2;
                        this.zoom_fn(get_zoom);
                    }
                });
                this.zoom_out_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    let get_zoom = Number(this.world_map.style.transform.split("(")[1].split(")")[0]);
                    if (get_zoom > 1) {
                        get_zoom = get_zoom - 0.2;
                        this.zoom_fn(get_zoom);
                    }
                });

                $(window).mousemove((m) => {
                    if (this.curDown) {
                        $(".world_map_con").scrollLeft(this.preX + (this.curXPos - m.pageX))
                        $(".world_map_con").scrollTop(this.preY + (this.curYPos - m.pageY))
                    }
                });

                $(window).mousedown((m) => {
                    this.preX = $(".world_map_con").scrollLeft();
                    this.preY = $(".world_map_con").scrollTop();
                    this.curYPos = m.pageY;
                    this.curXPos = m.pageX;
                    this.curDown = true;
                });

                $(window).mouseup(() => {
                    this.curDown = false;
                });
                //this.zoom_fn(1);//초기 셋팅을 위해 실행
            }
        },

        /*
            keris fullscreen의 경우 iframe이 2개로 이루어져 있어 외부의 콘텐츠를 감싸고 있는 
            iframe자체를 fullscreen해야 하고 또한 iframe 내부의 콘텐츠를 scale 조절 해줘야 함
        */
        FULLSCREEN: class FULLSCREEN {
            constructor(main_wrap, isLocal ,sound, local_storage, alert_message) {
                this.isLocal = isLocal;
                this.sound_class = sound;
                this.alert_message = alert_message;
                this.local_storage = local_storage;
                this.isfullscreen = true;//나중에 옵션처리
                this.target_dom = parent.document.querySelector(".content_frm");
                //console.log(parent.document.querySelector(".content_frm"))
                //console.log(this.local_storage)

                this.main_wrap = main_wrap;
                this.wraps_con = main_wrap.querySelector("#common_container") || null;
                this.common_btns = main_wrap.querySelector("#common_btns") || null;
                if (!this.wraps_con) {
                    this.wraps_con = document.createElement("div");
                    this.wraps_con.setAttribute("id", "common_container");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.wraps_con, quiz);
                };
                if (!this.common_btns) {
                    this.common_btns = document.createElement("div");
                    this.common_btns.setAttribute("id", "common_btns");
                    const quiz = main_wrap.querySelector(".quiz");
                    main_wrap.insertBefore(this.common_btns, this.wraps_con);
                };


                //const open_btn = `<button class="passport_btn" title="여권 열기"></button>`;
                this.fullscreen_btn = document.createElement("button");
                this.fullscreen_btn.classList.add("fullscreen_btn");
                this.fullscreen_btn.setAttribute("title", "전체 화면으로 보기");
                this.common_btns.appendChild(this.fullscreen_btn);

                this.normalscreen_btn = document.createElement("button");
                this.normalscreen_btn.classList.add("normalscreen_btn");
                this.normalscreen_btn.setAttribute("title", "일반 화면으로 보기");
                this.common_btns.appendChild(this.normalscreen_btn);


                this.is_screenfull = (this.local_storage.load("is", "screenfull") == "true") ? true : false;

                this.init();
            }

            init() {

                if (this.isfullscreen) this.fullscreen_set();
            }

            /**
             * fullscreen 관련 모음
             */
            fullscreen_is_support() {
                if (
                    parent.document.fullscreenEnabled ||
                    parent.document.msFullscreenEnabled ||
                    parent.document.webkitFullscreenEnabled ||
                    parent.document.mozFullscreenEnabled
                ) return true;

                return false;
            }
            fullscreenchange() {
                this.normalscreen_btn.style.display = "none";
                this.fullscreen_btn.style.display = "none";
                if (this.fullscreen()) {
                    this.target_dom.classList.add("fullscreen");
                    this.local_storage.save("is", "screenfull", "true");
                    let _scale = '';
                    setTimeout(() => {
                        _scale = this.target_dom.style.transform.split(")")[0].split("(")[1];
                        this.main_wrap.style.transform = `scale(${_scale}) translate(0%, 0%)`;                        
                    }, 50);

                    this.normalscreen_btn.style.display = "";
                } else {
                    this.target_dom.classList.remove("fullscreen");
                    this.local_storage.save("is", "screenfull", "false");
                    this.main_wrap.style.transform = "";
                    this.fullscreen_btn.style.display = "";
                }
            }
            fullscreen_set() {
                this.events = ["fullscreenchange", "mozfullscreenchange", "webkitfullscreenchange", "MSFullscreenChange"];
                this.fullscreen_btn = this.main_wrap.querySelector("button.fullscreen_btn");
                this.normalscreen_btn = this.main_wrap.querySelector("button.normalscreen_btn");

                if (!this.normalscreen_btn || !this.fullscreen_btn) return;

                //추후 옵션에 따른 전체보기 버튼의 비사용 여부를 판단하는 코드 삽입 가능
                /* if (!this.option.fullscreen) {
                    this.fullscreen_btn.style.display = "none";
                    this.normalscreen_btn.style.display = "none";
                    return;
                } */

                this.normalscreen_btn.style.display = "none";

                this.fullscreen_btn.addEventListener("click", e => {
                    this.isfullscreen = true;
                    this.fullscreen(this.target_dom);
                });
                this.normalscreen_btn.addEventListener("click", e => {
                    this.isfullscreen = false;
                    this.fullscreen(this.target_dom);
                });


                if (this.fullscreen_is_support()) {
                    this.fullscreen_btn.parentNode.style.display = "";
                    this.events.forEach(event => {
                        parent.document.addEventListener(event, e => {
                            //console.log("event : ", event)
                            this.fullscreenchange();
                        })
                    });

                    if(this.is_screenfull && !this.isLocal){
                        this.isfullscreen = true;
                        this.fullscreen(this.target_dom);
                    }
                } else {
                    this.fullscreen_btn.parentNode.style.display = "none";
                }
            }
            fullscreen(elem) {
                if (!elem) {
                    if (parent.document.fullscreenElement || parent.document.fullscreen || parent.document.mozFullScreen || parent.document.webkitIsFullScreen || parent.document.msFullscreenElement) {
                        return true;
                    }
                    return false;
                }
                if (this.fullscreen()) {
                    if (parent.document.exitFullscreen) {
                        parent.document.exitFullscreen();
                    } else if (parent.document.mozCancelFullScreen) {
                        parent.document.mozCancelFullScreen();
                    } else if (parent.document.webkitExitFullscreen) {
                        parent.document.webkitExitFullscreen();
                    } else if (parent.document.msExitFullscreen) {
                        parent.document.msExitFullscreen();
                    }
                } else {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                }
            }
        },
    };
    //영상 팝업용 상호작용 클래스 4_4_10_m07, 3_1_10_m07
    win.kbc_main.vod_check_pop = class VOD_CHECK_POP{
        constructor(_arg){
            console.log("_arg : ", _arg);
            this.player = _arg.player;
            this.quiz_num = _arg.quiz_num;
            this.quiz_wrap = _arg.quiz_wrap;
            this.wrap = _arg.wrap;
            this.guide = _arg.guide;
            this.guide_type = _arg.guide_type;
            this.guide_points = _arg.guide_points;
            this.sound_class = _arg.sound_class;
            this.act_num = _arg.num;
            this.lms = _arg.lms;
            this.alert_message = _arg.alert_message;
            this.btn_lock = _arg.btn_lock;
            this.set_time = _arg.set_time;

            const get_jung_dap = (!this.wrap.dataset.jung_dap) ? "" : this.wrap.dataset.jung_dap;
            this.jung_dap = get_jung_dap.split(',');
            this.user_dap = null;
            this.check_feed_wraps = this.wrap.querySelectorAll('.check_feed_wrap') || [];
            console.log("this.check_feed_wraps : ", this.check_feed_wraps)
            
            this.init();
        }

        init(){
            this.select_arr = [];
            this.actives = this.quiz_wrap.querySelectorAll('.sel_btn');
            this.actives.forEach((btn, i) => {
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    const num = parseInt(btn.dataset.num, 10);

                    if (btn.classList.contains('check')) {
                        //btn.classList.remove('check')
                        this.select_arr.splice(this.select_arr.indexOf(num), 1);
                    } else {
                        //btn.classList.add('check');
                        this.select_arr.push(num);
                    };

                    this.user_dap = this.select_arr;
                    this.sound_class.play('click');
                    this.quiz_ok_check(num-1);
                    //console.log("this.user_dap : ", this.user_dap)
                })
            });


            if(this.check_feed_wraps.length){
                this.check_feed_wraps.forEach( pop => {
                    this.check_feed_close_btn = pop.querySelector(".check_feed_close_btn");
                    this.check_feed_close_btn.addEventListener("click", e => {
                        this.sound_class.play("click");
                        pop.classList.remove("active");

                        this.quiz_ok_check();
                    });

                    const word_plus_btn = pop.querySelector(".word_plus");
                    const save_word_text = word_plus_btn.getAttribute("saveword") || "";
                    word_plus_btn.addEventListener("click", e => {
                        this.sound_class.play("click");
                        this.lms.add_word_book(save_word_text);
                    })

                });
            };
        }

        quiz_ok_check(num = null) {
            if(!this.check_feed_wraps.length){
                console.log("check_feed_wraps.length : ", this.check_feed_wraps.length)
                this.quiz_end();
            }else{
                let pop_cnt = 0;
                this.check_feed_wraps.forEach( pop => {
                    if(pop.classList.contains("pop_finished")){
                        pop_cnt++;
                    }
                });
                if(pop_cnt >= this.check_feed_wraps.length){
                    console.log(pop_cnt >= this.check_feed_wraps.length)
                    this.quiz_end();
                }
            };


            //순서 중요 위의 if문보다 아래 있어야 함
            if(num != null && this.check_feed_wraps.length){
                if(this.check_feed_wraps[num]) 
                    this.check_feed_wraps[num].classList.add("active");//팝업 열림
                    this.check_feed_wraps[num].classList.add("pop_finished");//팝업 열림
            }
        }
        reset_sel(all_clear = true) {            
            this.actives.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
                btn.classList.remove('dispose');
            });
        }
        quiz_retry() {
            this.user_dap = [];
            this.select_arr = [];
            this.reset_sel(true);
        }

        quiz_reset() {
            this.select_arr = [];
            //console.log("quiz_reset - ", this.select_arr, this.user_dap)
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
            });
            this.check_feed_wraps.forEach(pop => pop.classList.remove("pop_finished") );
            this.wrap.classList.remove("finished");
        }
        quiz_end(is_prev_dap = false) {
            this.wrap.classList.add("finished");
            this.player.end_check();
        }




        guide_show(){
            setTimeout(() => {
                if(!this.guide_type) return false;

                if(this.guide_type == "click_points" || this.guide_type == "drag_points") {      
                    //console.log("this.guide_type : ", this.guide_type)                              
                    this.guide[this.guide_type](this.wrap, this.guide_points);
                }else{
                    this.guide[this.guide_type](this.wrap);
                }
            }, 100);
        }
    }

    win.kbc_main.VOD = class VOD extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            const p = this;
            const _url = (this.isLocal) ? "./mp4/" + this.page_info.vod_url[this.quiz_num - 1] : this.cdn_path + "mp4/" + this.page_info.vod_url[this.quiz_num - 1];
            const is_caption_able = (!this.quiz_wrap.dataset.cation_able) ? false : (this.quiz_wrap.dataset.cation_able=="true");

            this.is_control_show = (this.quiz_wrap.dataset.control_hide == "true") || false;


            //console.log("is_caption_able :", is_caption_able)
            this.quiz_wrap.insertAdjacentHTML("afterbegin", this.player_dom);
            this.player = new win.KBC_PLAYER(this, _url, is_caption_able);//위치 중요
            this.btns.check.classList.add("display_no");
            if(this.is_control_show) this.player.wrap.control.classList.add("display_no");


            this.activity = this.player.activity;
            //console.log(this.activity);
            console.log("main - VOD Class - player :", this.player);
            //console.log("keris container 쪽에서 변경하는 언어셋에 따라 텍스트 변경 또는 display 변경 필요")//Main_class lang_changed_set()에서 처리완료.
            this.activity.vod_acts.forEach( (vod_act, i) => {
                vod_act.type = vod_act.dataset.type || null;
                vod_act.guide_type = vod_act.dataset.guide || null;
                vod_act.guide_points = [];
                if(vod_act.guide_type == "click_points") {
                    vod_act.guide_points = (vod_act.dataset.guide_points) ? vod_act.dataset.guide_points.split("|") : [0, 0];
                }else if(vod_act.guide_type == "drag_points") {
                    vod_act.guide_points = (vod_act.dataset.guide_points) ? vod_act.dataset.guide_points.split("|") : ["0,0", "1280,720"];
                    vod_act.guide_points = vod_act.guide_points.map( val => val.split(",") ); 
                };
                if(vod_act.type){
                    vod_act.clss = new win.kbc_main[vod_act.type]({
                        player: this.player,
                        quiz_num: this.quiz_num,
                        quiz_wrap: this.quiz_wrap,
                        wrap: vod_act,
                        guide: this.guide,
                        guide_type: vod_act.guide_type,
                        guide_points: vod_act.guide_points,
                        sound_class: this.sound_class,
                        num: i,
                        lms: this.lms,
                        alert_message: this.alert_message,
                        btn_lock: this.btn_lock,
                        set_time: this.set_time
                    });
                    vod_act.classList.add("finished");//우선 그냥 끝나게 처리해놓자!!! 
                }else{
                    vod_act.classList.add("finished");
                }
            });
        }
        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
        }
    }//학습 데이터 처리 --필요 없음--.
    win.kbc_main.MOTION = class MOTION extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.quiz_wrap.classList.add("dispose");
            this.btns.check.classList.add("display_no")

            this.motions = [];
            this.mo_count = 0;
            this.motion_wraps = [];

            const wait_time = parseFloat(this.quiz_wrap.dataset.wait_time);
            this.motions.push({ target_tag: "", wait_time: parseFloat(wait_time) || 0, tag_audio_id: "" });

            const promsAll = [];
            this.quiz_wrap.querySelectorAll('.motion_tag').forEach((tag, i) => {
                this.motion_wraps.push(tag);
                const tag_wait_time = parseFloat(tag.dataset.wait_time) || 0;
                const tag_motion = tag.dataset.motion || "";
                const tag_audio = tag.dataset.tag_audio || "";
                const audio_id = `mo_audio_${this.quiz_num}_${i}`;
                let tag_audio_name = audio_id;
                if (tag_audio != "") {
                    //promsAll.push(this.sound_class.sound_load("mo_audio_" + i, tag_audio));
                    promsAll.push(this.sound_class.sound_load(audio_id, tag_audio));
                } else {
                    tag_audio_name = "";
                };

                const set_data = {
                    target_tag: tag,
                    target_motion: tag_motion,
                    wait_time: tag_wait_time,
                    tag_audio_id: tag_audio_name
                }
                this.motions.push(set_data);
            });

            //음성에 따른 모션 싱크등을 재생하기 위해 음성이 로드 된 후 페이지 진행됨
            Promise.all(promsAll).then(() => {
                this.quiz_wrap.classList.remove("dispose");
                //this.init();
            });
        };

        init() {
            //console.log("win.kbc_main.MOTION : ", this.motions);
            this.play_motion(0);
        }

        async play_motion(cnt = 0) {
            const count = cnt;
            const tag = (this.motions[count].target_tag != "") ? this.motions[count].target_tag : null;
            const motion = (this.motions[count].target_motion != "") ? this.motions[count].target_motion : "none";
            const audio = (this.motions[count].tag_audio_id != "") ? this.motions[count].tag_audio_id : null;
            const wait_time = (this.motions[count].wait_time) ? this.motions[count].wait_time : 0;
            //console.log(count, motion, wait_time, audio, tag)
            //음성이 있으면 음성 싱크에 맞춤
            if (audio) {
                if (tag) tag.classList.add(motion);
                //console.log("this.motions : ", this.motions[cnt])
                this.sound_class.play(audio, e => {
                    if (this.motions.length - 1 > count) {
                        this.play_motion(count + 1);
                    } else {
                        this.quiz_end();
                    };
                });
            } else {//음성이 없으면 대기 시간 후 다음 진행
                if (tag) tag.classList.add(motion);
                await this.set_time.out(wait_time);

                if (this.motions.length - 1 > count) {
                    this.play_motion(count + 1);
                } else {
                    this.quiz_end();
                };
            };
        }

        quiz_end() {
            super.quiz_end();
        }
    };//학습 데이터 처리 --필요 없음--.
    win.kbc_main.CHOICE = class CHOICE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.select_arr = [];
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach((btn, i) => {
                //btn.setAttribute("title", `보기${i + 1} `);
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;
                    
                    this.start_sound_stop();
                    const num = parseInt(btn.dataset.num, 10);
                    if (this.is_multi) {
                        if (btn.classList.contains('check')) {
                            btn.classList.remove('check')
                            this.select_arr.splice(this.select_arr.indexOf(num), 1);
                        } else {
                            if (this.select_arr.length == this.jung_dap.length) {
                                let last_ele_num = parseInt(this.select_arr.pop(), 10);
                                this.actives[last_ele_num - 1].classList.remove('check');
                            }

                            btn.classList.add('check');
                            this.select_arr.push(num);
                        }
                        this.user_dap = this.select_arr;
                    } else {
                        this.reset_sel();
                        btn.classList.add('check');
                        this.select_arr.push(num);
                        this.user_dap = this.select_arr;
                    }
                    this.sound_class.play('click');
                    //console.log("this.user_dap : ", this.user_dap)
                })
            });


        }

        quiz_ok_check(is_prev_dap = false) {

            if (this.quiz_blank_check()) return false;

            this.jung_dap.forEach((val, i) => {
                //정답 텍스트 구하기
                const jdap_num = parseInt(val, 10) - 1;
                const j_title = this.actives[jdap_num].getAttribute("title");
                const j_text = this.actives[jdap_num].innerText.replace(/\n/ig, " ");
                const st_jdap = (!j_title || j_title == "") ? j_text : j_title;

                this.jung_dap_st_arr.push(st_jdap);
            });
            const copy_user_dap = this.deep_copy_daps()[0];
            copy_user_dap.forEach((val, i) => {
                const udap_num = parseInt(val, 10) - 1;
                const u_title = this.actives[udap_num].getAttribute("title");
                const u_text = this.actives[udap_num].innerText.replace(/\n/ig, " ");
                const st_udap = (!u_title || u_title == "") ? u_text : u_title;

                this.user_dap_st_arr.push(st_udap);

            });
            const jst = this.jung_dap_st_arr.join("||");
            const ust = this.user_dap_st_arr.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: (jst == ust) ? 100 : 0,
                try_num: this.cur_try_num - 1
            });

            super.quiz_ok_check(is_prev_dap);
        }

        reset_sel(all_clear = true) {
            if (!all_clear && this.is_multi) {
                this.user_dap.forEach((val, i) => {
                    const num = val - 1;
                    if (this.jung_dap.indexOf(val.toString()) == -1) {//클릭한게 정답에 없으면

                        this.actives[num].classList.remove("active");
                        this.actives[num].classList.remove("true");
                        this.actives[num].classList.remove("false");
                        this.actives[num].classList.remove("check");
                        this.user_dap[i] = null;
                    }else{
                        this.actives[num].classList.add("dispose");
                    }
                });
                this.select_arr = [];
                this.select_arr = this.user_dap = this.user_dap.filter(val => {
                    if (val) return val;
                });

                /////// OX 표시해줘야 합니다.



            } else {
                this.user_dap = [];
                this.select_arr = [];
                this.actives.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.remove('true');
                    btn.classList.remove('false');
                    btn.classList.remove('check');
                    btn.classList.remove('dispose');
                });
            };
        }

        quiz_retry() {
            this.reset_sel(false);
            super.quiz_retry();
        }

        quiz_reset() {
            this.select_arr = [];
            //console.log("quiz_reset - ", this.select_arr, this.user_dap)
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
            });
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
            this.actives.forEach((btn, i) => {
                if (this.jung_dap.indexOf((i + 1).toString()) != -1) {//여기선 string
                    btn.classList.add('true')
                } else {
                    btn.classList.add('false')
                }
            });
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 ok!!!
    win.kbc_main.OX = class OX extends win.kbc_main.CHOICE {
        constructor(_args) {
            super(_args);
        }
    };//학습 데이터 처리 ok!!!
    win.kbc_main.CARD_FLIP = class CARD_FLIP extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.btns.check.classList.add("display_no");//정답확인 지우기
            
            //단어장 저장 하기 버튼 생성
            this.card_con = this.quiz_wrap.querySelector(".card_con");
            this.word_plus_btn = document.createElement("button");
            this.word_plus_btn.classList.add("word_plus");
            this.word_plus_btn.setAttribute("title", "홈페이지 단어장에 저장");
            this.quiz_wrap.insertBefore(this.word_plus_btn, this.card_con);

            
            this.word_plus_btn.addEventListener("click", e => {
                const get_save_word = this.card_con.querySelector(".card_title .kor_text").innerText;
                this.sound_class.play("click");
                this.lms.add_word_book(get_save_word);
            });


            this.ko_btns.forEach((_btn, i) => {
                const snd_src = _btn.dataset.src || null;
                if (snd_src) {
                    const snd_id = this.quiz_type + "_" + this.quiz_num + "_" + i;
                    _btn.snd = this.sound_class.sound_load(snd_id, snd_src);
                    _btn.id = snd_id;
                    _btn.addEventListener("click", e => {
                        if (this.btn_lock.isLock()) return;

                        const btn = e.currentTarget || e.target;
                        this.sound_class.play(btn.id, () => { }, true);
                    });
                };
            });


            this.actives = this.quiz_wrap.querySelectorAll('.card');
            this.actives.forEach((btn, i) => {
                const snd_src = btn.dataset.src || null;
                if (snd_src) {
                    const snd_id = this.quiz_type + "_" + this.quiz_num + "_" + i;
                    btn.snd = this.sound_class.sound_load(snd_id, snd_src);
                    btn.id = snd_id;
                };

                btn.addEventListener("click", async e => {
                    if (this.btn_lock.isLock()) return;
                    this.start_sound_stop();
                    this.btn_lock.lock();
                    const _btn = e.currentTarget || e.target;
                    //console.log(this.sound_class.sounds)
                    if (!_btn.classList.contains("on")) {
                        if(this.sound_class.sounds[_btn.id]) this.sound_class.play(_btn.id, () => { }, true);
                        _btn.classList.add("on");
                        this.quiz_ok_check();
                    } else {
                        _btn.classList.remove("on");
                    };
                    this.sound_class.play('click');


                    await this.set_time.out(800);
                    this.btn_lock.release();
                });
            });
            //console.log(this);

        };


        reset_sel() {
            this.actives.forEach((btn, i) => {
                btn.classList.remove("camp");
                btn.classList.remove("on");
            });
        }
        quiz_retry() {
            this.reset_sel();
            super.quiz_retry();
        }

        quiz_ok_check(is_prev_dap = false) {
            this.user_dap = this.jung_dap;//뒤짚으면 정답임으로....

            const jst = this.actives[0].querySelector(".front img").getAttribute("alt");
            const ust = this.actives[0].querySelector(".back img").getAttribute("alt");

            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: -1,
                try_num: 1
            });


            this.quiz_end(is_prev_dap);
            //super.quiz_ok_check(is_prev_dap);
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
        }
    }//학습 데이터 처리 ok!!!
    win.kbc_main.CARD_FLIP_GAME = class CARD_FLIP_GAME extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);

            this.btns.check.classList.add("display_no");//정답확인 지우기
        }

        init(history_data) {
            this.frist_st = "";
            this.frist_num = 0;
            this.dap_cnt = 0;

            this.actives = this.quiz_wrap.querySelectorAll('.card');
            this.actives.forEach((btn, i) => {
                btn.addEventListener("click", async e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    this.btn_lock.lock();
                    const _btn = e.currentTarget || e.target;
                    const ck_num = parseInt(_btn.dataset.value, 10);
                    const img = _btn.querySelector(".back img") || null;
                    const p = _btn.querySelector(".back p") || null;



                    _btn.classList.add("on");
                    this.sound_class.play('click');

                    if (!this.frist_num) {//처음 클릭
                        this.frist_st = (p) ? p.innerText.replace(/\n/ig, " ") : img.getAttribute("alt") + " - 이미지";
                        this.frist_num = ck_num;
                    } else {//두번째 것 클릭
                        const cur_st = (p) ? p.innerText.replace(/\n/ig, " ") : img.getAttribute("alt") + " - 이미지";
                        if (this.frist_num == ck_num) {//정답 일때
                            this.add_comp();
                            //this.cur_try_num = 1;
                            this.dap_cnt++;
                            this.set_content_data(this.frist_st , cur_st, true);
                            if (this.dap_cnt == this.jung_dap.length) {//모든 쌍을 다 맞췄을 때
                                this.quiz_ok_check();
                                return;
                            };
                            this.sound_class.play('true');
                        } else {//오답일 때
                            await this.set_time.out(800);
                            this.sound_class.play('retry');
                            this.reset_sel();
                            this.cur_try_num++;
                            //console.log((this.cur_try_num-1) % 3)
                            this.set_content_data(this.frist_st , cur_st, false);
                            if (!((this.cur_try_num-1) % 3)) {
                                await this.set_time.out(800);
                                this.open_sel();
                                await this.set_time.out(800);
                                this.reset_sel();
                                //this.cur_try_num = 1;
                            };
                        };
                        this.frist_st = "";
                        this.frist_num = 0;
                    };
                    this.btn_lock.release();
                });
            });
            //console.log(this);
            this.open_sel();
        }
        set_content_data(f_st , e_st, is_ok = false){
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: f_st,
                user_dap: e_st,
                score: (is_ok) ? 100 : 0,
                try_num: this.cur_try_num - 1
            });
        }
        add_comp() {
            this.actives.forEach((btn, i) => {
                if (btn.classList.contains("on")) {
                    btn.classList.add("comp");
                };
            });
        }

        open_sel() {
            this.actives.forEach((btn, i) => btn.classList.add("on"));
        }
        reset_sel() {
            this.actives.forEach((btn, i) => btn.classList.remove("on"));
        }
        quiz_retry() {
            this.reset_sel();
            super.quiz_retry();
        }
        quiz_ok_check(is_prev_dap = false) {
            this.user_dap = this.jung_dap;
            super.quiz_ok_check(is_prev_dap);
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
        }
    }//학습 데이터 처리 ok!!!
    win.kbc_main.LINETOLINE = class LINETOLINE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            //super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(_args.history_data);
        }

        async init(history_data) {
            //console.log("history_data : ", history_data);
            this.history_data = history_data;
            //this.history_data = '[1@a,2@c,3@b]';
            this.lines = {};
            
            this.phaser_init_width = parseInt(this.quiz_wrap.dataset.width, 10) || 1000;
            this.phaser_init_height = parseInt(this.quiz_wrap.dataset.height, 10) || 500;
            this.phaser_wrap = this.quiz_wrap.querySelector("[phaser]");

            // 개별 페이지 수정 필요!
            const config = {
                type: Phaser.AUTO,

                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 0 },
                        fps: 30
                    }
                },
                scale: {
                    autoCenter: Phaser.Scale.NO_CENTER,
                    mode: Phaser.Scale.NONE,
                    width: this.phaser_init_width,
                    height: this.phaser_init_height,
                    parent: this.phaser_wrap
                },
                render: {
                    antialias: true,
                    transparent: true,
                    pixelArt: false,
                    preserveDrawingBuffer: false,
                },
                scene: {
                    async: true,
                    preload: this.phaser_preload.bind(this),
                    create: this.phaser_create.bind(this),
                    update: this.phaser_update.bind(this)
                },
                dom: {
                    createContainer: true,
                    behindCanvas: false
                }
            };

            this.phaser = new Phaser.Game(config);
        }


        lint_init() {
            this.prev_dap_len = Object.keys(this.lines).length;
            this.line_option = {
                color: "0xff8439",
                dap_color: "0x0066FF",
                weight: 2,
                alpha: 1
            };

            this.add_line_container = this.scene.add.container(0, 0).setDepth(10000);
            this.drawing_container = this.scene.add.container(0, 0).setDepth(10000);
            this.jung_dapContainer = this.scene.add.container(0, 0).setDepth(10001);

            this.cur_line = null;
            this.actives = [];
            this.direction = this.clone_wrap.querySelector('.phaser_wrap_body').getAttribute("direction");
            this.clone_wrap.querySelectorAll('.line_box').forEach(box => this.actives.push(box));

            this.first_click = true;
            this.start_btn = null;
            this.end_btn = null;
            this.actives.forEach((box, i) => {
                //학습데이터 전달용 변수 선언
                //console.log(box.querySelector("img"))
                /* if(box.querySelector("div")){
                    //box.dap_st = box.querySelector("img").getAttribute("alt");
                    box.dap_st = box.querySelector("div").innerText.replace(/\n/ig, " ");
                }else{
                    box.dap_st = box.querySelector(".inner_box p").innerText.replace(/\n/ig, " ");
                } */
                box.dap_st = box.querySelector("p").innerText.replace(/\n/ig, " ");
                //console.log(i, box)
                //console.log(box.dap_st)


                const btn_offset = this.get_offset(box);
                const _get_st = this.abs_point(btn_offset._x, btn_offset._y);//버튼의 위치(시작 위치)

                box.st_x = _get_st._x;//점별 좌표 등록
                box.st_y = _get_st._y;//점별 좌표 등록
                box._way = box.getAttribute("bullet_way");//블릿의 위치
                box._num = box.getAttribute("num");//답 파라미터
                box.is_check_line = false;

                if(kbc_main.isMobile){
                    box.addEventListener("click",e=>{
                        e.stopPropagation();
                        e.preventDefault();

                        this.start_sound_stop();
                        const btn = e.currentTarget;
                        //console.log(btn._way , btn._way == "left" , btn._way == "up")

                        //if ((btn._way == "left" || btn._way == "up") && this.first_click) return false;// 그리기 방향 제한
                        //if (btn.is_check_line == true) return false;// 중복으로 시작못하게하기 위해서
                        let remove_line_name = null;
                        let remove_st_btn = null;
                        let remove_ed_btn = null;
                        let is_remove = false;
                        
                        
                        


                        //선을 시작할 대
                        if(this.first_click){
                            Object.keys(this.lines).forEach(key_name => {
                                if (key_name.indexOf(btn._num) != -1) {
                                    is_remove = true;
                                    remove_line_name = key_name;
                                    remove_st_btn = this.lines[key_name].start_btn;
                                    remove_ed_btn = this.lines[key_name].end_btn;
                                }
                            });
                            //console.log("click-remove_line_name : ", remove_line_name)
                            //console.log("click-lines : ", this.lines)
    
                            //그려진 부분 중에 한곳을 클릭하면 그려진 곳과 연결된 곳을 지운다.
                            //선이 그려진 곳을 선택했으면 관련 설정을 초기화
                            if(is_remove) {
                                this.actives.forEach( (box, i) => box.classList.remove("start_click") );
                                if(remove_st_btn) remove_st_btn.is_check_line = false;
                                if(remove_ed_btn) remove_ed_btn.is_check_line = false;
                                this.add_line_container.remove(this.lines[remove_line_name]);
                                delete this.lines[remove_line_name];
                            }
                            

                            this.first_click = false;
                            btn.classList.add("start_click");
                            this.start_btn = btn;//여기까지 해놓고 다음 클릭을 대기


                        }else{//두번 째가 선택되어 있을 때
                            this.end_btn = btn;
                            if(this.start_btn._way == this.end_btn._way){//출발지가 같은 그룹이면 초기화 후 다시 선택
                                Object.keys(this.lines).forEach(key_name => {
                                    if (key_name.indexOf(btn._num) != -1) {
                                        is_remove = true;
                                        remove_line_name = key_name;
                                        remove_st_btn = this.lines[key_name].start_btn;
                                        remove_ed_btn = this.lines[key_name].end_btn;
                                    }
                                });
                                //console.log("click-remove_line_name : ", remove_line_name)
                                //console.log("click-lines : ", this.lines)
        
                                //그려진 부분 중에 한곳을 클릭하면 그려진 곳과 연결된 곳을 지운다.
                                //선이 그려진 곳을 선택했으면 관련 설정을 초기화
                                if(is_remove) {                                    
                                    if(remove_st_btn) remove_st_btn.is_check_line = false;
                                    if(remove_ed_btn) remove_ed_btn.is_check_line = false;
                                    this.add_line_container.remove(this.lines[remove_line_name]);
                                    delete this.lines[remove_line_name];
                                };
                                
                                this.actives.forEach( (box, i) => box.classList.remove("start_click") );
                                this.first_click = false;
                                this.start_btn = btn;
                                this.end_btn = null;
                                this.start_btn.classList.add("start_click");
                            }else{//다른 그룹을 선택하면 위치 찾아서 그리기

                                if(btn.is_check_line){//선을 그려 놓은 곳이면~
                                    this.alert_message.show("line_break");
                                    this.sound_class.play('retry');

                                }else{//그려진 선이 없이 빈공간이면~
                                    this.end_btn.classList.add("end_click");
                                    const line_name = `${this.start_btn._num}@${this.end_btn._num}`;
                                    this.start_btn.is_check_line = true;// 중복으로 시작못하게하기 위해서
                                    this.end_btn.is_check_line = true;// 중복으로 시작못하게하기 위해서    
                                    this.lines[line_name] = this.draw_line(this.start_btn.st_x, this.start_btn.st_y, this.end_btn.st_x, this.end_btn.st_y, this.add_line_container, this.line_option.color, false, false);
                                    this.lines[line_name].start_btn = this.start_btn;
                                    this.lines[line_name].end_btn = this.end_btn;
                                    this.lines[line_name].push_index = Object.keys(this.lines).length - 1;/// add_line_container에 들어간 순서를 저장한다.
                                    
                                    this.click_start_way_check_reset();
                                };
                            };
                        };
                    });

                    this.line_dom.node.addEventListener('click',()=>{
                        //console.log("this.line_dom.node-click")
                        /* if(this.startDot){
                            this.startDot.classList.remove("clicked")
                            this.startDot = null;
                        } */
                    })
                }else{
                    box.addEventListener("pointerdown", e => {
                        if (this.btn_lock.isLock()) return;

                        this.start_sound_stop();
                        const btn = e.currentTarget;
                        this.draw_stop();

                        //console.log(btn._way , btn._way == "left" , btn._way == "up")
                        //if (btn._way == "left" || btn._way == "up") return false;// 그리기 방향 제한
                        //if (btn.is_check_line == true) return false;// 중복으로 시작못하게하기 위해서
                        let remove_line_name = null;
                        let remove_st_btn = null;
                        let remove_ed_btn = null;
                        Object.keys(this.lines).forEach(key_name => {
                            if (key_name.indexOf(btn._num) != -1) {
                                remove_line_name = key_name;
                                remove_st_btn = this.lines[key_name].start_btn;
                                remove_ed_btn = this.lines[key_name].end_btn;
                            }
                        });
                        //console.log("pointerdwon-remove_line_name : ", remove_line_name)
                        //console.log("pointerdwon-lines : ", this.lines)

                        //그려진 부분 중에 한곳을 클릭하면 그려진 곳과 연결된 곳을 지운다.
                        if(remove_st_btn) remove_st_btn.is_check_line = false;
                        if(remove_ed_btn) remove_ed_btn.is_check_line = false;
                        this.add_line_container.remove(this.lines[remove_line_name]);
                        delete this.lines[remove_line_name];



                        this.start_btn = btn;//매우 중요!!! 위치도 중요!!
                        const _mouse = this.abs_point(e.clientX, e.clientY);



                        this.clone_wraps.on("pointermove", e => {
                            if (this.btn_lock.isLock()) return;
                            const _mouse = this.abs_point(e.clientX, e.clientY);
                            this.cur_line = this.draw_line(this.start_btn.st_x, this.start_btn.st_y, _mouse._x, _mouse._y, this.drawing_container, this.line_option.color, true, true);
                        });
                    });

                    box.addEventListener("pointerup", e => {
                        if (this.btn_lock.isLock()) return;
                        if (!this.start_btn) return;
                        this.end_btn = e.currentTarget;//매우 중요!!! 위치도 중요!!

                        if (this.start_btn._way != this.end_btn._way && !this.end_btn.is_check_line) {
                            const line_name = `${this.start_btn._num}@${this.end_btn._num}`;
                            this.start_btn.is_check_line = true;// 그려진 곳인지 확인하기 위해
                            this.end_btn.is_check_line = true;// 그려진 곳인지 확인하기 위해
                            this.lines[line_name] = this.draw_line(this.start_btn.st_x, this.start_btn.st_y, this.end_btn.st_x, this.end_btn.st_y, this.add_line_container, this.line_option.color, false, false);
                            this.lines[line_name].start_btn = this.start_btn;
                            this.lines[line_name].end_btn = this.end_btn;
                            this.lines[line_name].push_index = Object.keys(this.lines).length - 1;/// add_line_container에 들어간 순서를 저장한다.
                            this.sound_class.play('ting');
                        }else if (this.start_btn._way != this.end_btn._way && this.end_btn.is_check_line) {
                            this.alert_message.show("line_break");
                            this.sound_class.play('retry');
                        }

                        this.draw_stop();
                        
                        //console.log("pointerup-lines : ", this.lines)
                    })
                    this.clone_wrap.addEventListener('pointerup', () => {
                        this.draw_stop();
                    });

                    this.clone_wrap.addEventListener('pointerout', (event) => {
                        const e = event.toElement || event.relatedTarget;
                        if (e == event.target || this.line_dom.node.contains(e)) return;
                        this.draw_stop();
                    });
                }
            });


            //정답 미리 그려놓기
            this.jung_dap_draw();
            this.jung_dapContainer.setAlpha(0.0);

            win.addEventListener("resize", e => {
                
            });
        }
        click_start_way_check_reset(){
            this.actives.forEach( (box, i) => {
                box.classList.remove("start_click");
                box.classList.remove("end_click");
            });
            this.start_btn = null;
            this.end_btn = null;
            this.first_click = true;
        }

        
        reset_st_point() {
            if (!this.actives) return false;
            this.actives.forEach((box, i) => {
                const btn_offset = this.get_offset(box);

                const _get_st = this.abs_point(btn_offset._x, btn_offset._y);//버튼의 위치(시작 위치)

                box.st_x = _get_st._x;//점별 좌표 등록
                box.st_y = _get_st._y;//점별 좌표 등록
            });
        }

        //정답 그리기
        async jung_dap_draw() {
            //console.log("this.jung_dapContainer: ", this.jung_dapContainer);
            if(this.jung_dapContainer && this.jung_dapContainer.list.length) this.jung_dapContainer.removeAll(true);
            
            await this.set_time.out(200);

            this.jung_dap.forEach(dap => {
                const splits = dap.split("@");
                let startDom_x = 0;
                let startDom_y = 0;
                let endDom_x = 0;
                let endDom_y = 0;
                
                this.actives.forEach(dom => {
                    if (dom._num == splits[0]) {
                        //console.log(dom.st_x)
                        startDom_x = dom.st_x;
                        startDom_y = dom.st_y;
                    }
                    if (dom._num == splits[1]) {
                        endDom_x = dom.st_x;
                        endDom_y = dom.st_y;
                    }
                });
                
                
                //console.log(startDom_x, startDom_y, endDom_x, endDom_y );
                //console.log(this.quiz_num, dap, "this.actives : ", this.actives);                

                const line_name = `${splits[0]}@${splits[1]}`;
                this.draw_line(startDom_x, startDom_y, endDom_x, endDom_y, this.jung_dapContainer, 0x0066FF, false, false);
            })
        }

        quiz_reset() {
            this.quiz_retry();
            super.quiz_reset();
        }

        quiz_retry() {
            Object.keys(this.lines).forEach(key_name => {
                const sort_key_name = key_name.split("@").sort().join("@").toString();
                if (this.jung_dap.indexOf(sort_key_name) == -1) {
                    this.lines[key_name].start_btn.is_check_line = false;
                    this.lines[key_name].end_btn.is_check_line = false;
                    this.add_line_container.remove(this.lines[key_name]);
                    delete this.lines[key_name];
                } else {
                    
                    const st_btn = this.lines[key_name].start_btn;
                    const ed_btn = this.lines[key_name].end_btn;
                    //console.log("key_name : ", st_btn, ed_btn)
                    this.lines[key_name] = this.draw_line(this.lines[key_name].start_btn.st_x, this.lines[key_name].start_btn.st_y, this.lines[key_name].end_btn.st_x, this.lines[key_name].end_btn.st_y, this.add_line_container, this.line_option.dap_color, false, false);
                    this.lines[key_name].start_btn = st_btn;
                    this.lines[key_name].end_btn = ed_btn;
                    st_btn.classList.add("dispose");
                    ed_btn.classList.add("dispose");
                    //console.log(this.lines[key_name])
                }
            });



            super.quiz_retry();
            //console.log("quiz_retry : ", this.lines)
            this.prev_dap_len = Object.keys(this.lines).length;
        }

        quiz_end(is_prev_dap = false) {
            //Object.keys(this.lines).forEach(line => this.lines[line].alpha = 0.3);
            this.jung_dapContainer.setAlpha(1.0);


            super.quiz_end(is_prev_dap);
        }

        quiz_ok_check(is_prev_dap = false) {
            //console.log("prev_dap_len : ", this.prev_dap_len);
            let isEnd = true;
            let check_arr = Object.keys(this.lines);

            if( this.prev_dap_len == check_arr.length) {//처음이거나 다시풀 때 아무것도 연결을 하지 않았다.
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }
            const user_string = Object.keys(this.lines).toString();
            //console.log("user_string : ", user_string)
            this.jung_dap.forEach(val => {
                const num = val.split("@")[0];
                //console.log("num: ", num)
                if (user_string.indexOf(num) == -1) {
                    //console.log("없는 것 : ", val);
                    isEnd = false;
                }
            });

            

            if (isEnd) {
                this.user_dap = check_arr.map(udap => {
                    return udap.split("@").sort().join("@").toString();
                }).sort();
                console.log("this.user_dap : ", this.user_dap)
            }else{
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }
            
            //console.log("this.user_dap : ", this.user_dap, '["1@a","2@c","3@b"]', check_arr, "prev_dap_len : ", this.prev_dap_len);


            this.jung_dap_st_arr = [];
            this.user_dap_st_arr = [];
            this.jung_dap.forEach(dap => {
                const splits = dap.split("@"); // 1,c
                let jdap_st = "";
                let jdap_ed = "";
                this.actives.forEach(dom => {
                    if (dom._num == splits[0]) {
                        jdap_st = dom.dap_st;
                    }
                });
                this.actives.forEach(dom => {
                    if (dom._num == splits[1]) {
                        jdap_ed = dom.dap_st;
                    }
                });
                this.jung_dap_st_arr.push(`${jdap_st}@${jdap_ed}`);
                /* this.actives.forEach(dom => {
                    if (dom._num == splits[0]) {
                        jdap_st = dom.querySelector("img").getAttribute("alt");
                        console.log(jdap_st)
                    }
                    if (dom._num == splits[1]) {
                        jdap_ed = dom.querySelector(".inner_box p").innerText.replace(/\n/ig, " ");
                        console.log(jdap_ed)
                    }
                    this.jung_dap_st_arr.push(`${jdap_st}@${jdap_ed}`);
                }); */
            });

            this.user_dap.forEach(dap => {
                const splits = dap.split("@");
                let user_st = "";
                let user_ed = "";
                this.actives.forEach(dom => {
                    if (dom._num == splits[0]) {
                        user_st = dom.dap_st;
                    }
                });
                this.actives.forEach(dom => {
                    if (dom._num == splits[1]) {
                        user_ed = dom.dap_st;
                    }
                });
                this.user_dap_st_arr.push(`${user_st}@${user_ed}`);
            })

            //console.log("jung_dap_st_arr : ",this.jung_dap_st_arr)
            //console.log("user_dap_st_arr : ",this.user_dap_st_arr)

            const jst = this.jung_dap_st_arr.join("||");
            const ust = this.user_dap_st_arr.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: (jst == ust) ? 100 : 0,
                try_num: this.cur_try_num - 1
            });


            super.quiz_ok_check(is_prev_dap)
        }

        draw_stop() {
            this.clone_wraps.off("pointermove");
            this.drawing_container.removeAll(true);
            this.nowLine = null;
            this.start_btn = null;
            this.end_btn = null;

            this.quiz_wrap.blur();
            this.clone_wrap.blur();
            this.actives.forEach(box => box.blur());
        }

        draw_line(st_x, st_y, end_x, end_y, target_container, color, reset, dot) {
            //console.log(start_offset, end_offset)
            const line = this.scene.add.line(0, 0, st_x, st_y, end_x, end_y, color, this.line_option.alpha).setOrigin(0, 0);
            line.setLineWidth(this.line_option.weight);

            if (reset) target_container.removeAll(true);
            target_container.add(line);

            if (dot) {
                line.dot = this.scene.add.circle(end_x, end_y, 8, 0xFF6600).setAlpha(0.9).setDepth(100);
                target_container.add(line.dot);
            }

            return line;
        }

        abs_point(x, y) {
            const offset = this.clone_wrap.getBoundingClientRect()
            const return_offset = { _x: 0, _y: 0 };

            //100% 반응형일 때 사용
            // return_offset._x = (x - offset.left) / this.phaser.scale.zoom,
            // return_offset._y = (y - offset.top) / this.phaser.scale.zoom

            //적응형일 때 사용
            return_offset._x = (x - offset.left) / kbc_main.zoom,
            return_offset._y = (y - offset.top) / kbc_main.zoom

            return return_offset;
        }

        get_offset(wrap) {
            const _weight = this.line_option.weight;

            const type = wrap.getAttribute("bullet_way");
            const return_offset = { _x: 0, _y: 0 };

            const offset = wrap.getBoundingClientRect();
            return_offset._x = offset.left;
            return_offset._y = offset.top;
            return_offset._w = offset.width;
            return_offset._h = offset.height;
            //100% 반응형일 때 사용
            // switch(type){
            //     case "left":
            //             return_offset._x = return_offset._x - (42+_weight/2) * this.phaser.scale.zoom;
            //             return_offset._y = return_offset._y + (offset.height/2);
            //         break;
            //     case "right":
            //             return_offset._x = return_offset._x + offset.width + (42-_weight/2) * this.phaser.scale.zoom;
            //             return_offset._y = return_offset._y + (offset.height/2);
            //         break;
            // };

            //적응형일 때 사용
            switch (type) {
                case "up":
                    return_offset._x = return_offset._x + return_offset._w / 2;
                    return_offset._y = return_offset._y - (16 + _weight / 2) * kbc_main.zoom;
                    break;
                case "down":
                    return_offset._x = return_offset._x + return_offset._w / 2;
                    return_offset._y = return_offset._y + return_offset._h + (20 + _weight / 2) * kbc_main.zoom;
                    break;
                case "left":
                    return_offset._x = return_offset._x - (37 + _weight / 2) * kbc_main.zoom;
                    return_offset._y = return_offset._y + (offset.height / 2) + 3;
                    break;
                case "right":
                    return_offset._x = return_offset._x + offset.width + (37 - _weight / 2) * kbc_main.zoom;
                    return_offset._y = return_offset._y + (offset.height / 2) + 3;
                    break;
            };
            return return_offset;
        };



        phaser_preload() {
            this.scene = this.phaser.scene.scenes[0];
            const origin_wrap = this.phaser_wrap.querySelector("div[phaser-dom]");
            this.line_dom = this.clone_wraps = this.scene.add.dom(0, 0).createFromHTML(origin_wrap.innerHTML).setOrigin(0, 0);//wrap copy
            this.clone_wraps.node.classList.add("line_container");
            this.clone_wrap = this.clone_wraps.node;

            const mainDom = this.scene.game.domContainer;
            mainDom.classList.add("event_dom");

            this.phaser_wrap.removeChild(origin_wrap);
            this.clone_wraps.addListener("pointermove");
        }

        phaser_create() {
            window.addEventListener("resize", () => {
                /* //100% 반응형일 때 사용
                const mw = this.phaser_wrap.clientWidth || parseInt(this.phaser_init_width , 10);
                const limitX = Math.min(1, mw/this.phaser_init_width);
                this.phaser.scale.setZoom(limitX) */

                //적응형일 때 사용
                this.phaser.scale.setZoom(1);
            });
            window.dispatchEvent(new Event("resize"));
            if (this.phaser.input.touch) {
                this.phaser.input.touch.capture = false;
            }
            this.lint_init();/// 페이지 시작
        }

        phaser_update() { };
    }//학습 데이터 처리 ok!!!
    win.kbc_main.GAME_MOVE = class GAME_MOVE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);

            this.btns.check.classList.add("display_no");//정답확인 지우기

            this.step_num = 0;
            this.score_num = 0
            this.quiz_time = 5000;//css에도 맞춰줘야 함
            this.character_way_num = 1;
            this.character_way_arr = ["left","center","right"];
            this.img_path = 'img/quiz/game_move/'

            this.init();
        }


        init(){            
            this.character = $(this.quiz_wrap).find(".character_wrap");
            this.game_step  = $(this.quiz_wrap).find(".game_step");
            this.steps = $(this.quiz_wrap).find(".game_step .step");
            this.scoreboard = $(this.quiz_wrap).find(".score_board");
            const ox_panel = `
                <div class="ox_panel">
                    <img src="${this.root_path}${this.img_path}oo.png" alt="동그라미 표시">
                    <img src="${this.root_path}${this.img_path}xx.png" alt="엑스 표시">
                </div>`;
            this.steps.each( i => this.scoreboard.append($(ox_panel)) );
            this.oxs = $(this.quiz_wrap).find(".score_board .ox_panel");

            this.start_section = $(this.quiz_wrap).find(".start_section");
            this.start_btn = $(this.quiz_wrap).find(".start_btn");
            this.start_btn.on("click", e => {
                if (this.btn_lock.isLock()) return;

                this.start_sound_stop();
                this.start_section.addClass("display_no");                
                this.sound_class.play("click");
                this.game_start();
            });

            this.l_btn = $(this.quiz_wrap).find(".l_btn");
            this.r_btn = $(this.quiz_wrap).find(".r_btn");
            this.l_btn.on("click", e => {
                if (this.btn_lock.isLock()) return;

                this.sound_class.play("click");
                this.character_way_set(--this.character_way_num);
            });
            this.r_btn.on("click", e => {
                if (this.btn_lock.isLock()) return;

                this.sound_class.play("click");
                this.character_way_set(++this.character_way_num);
            });
        }

        quiz_resset(){
            super.quiz_resset();
            this.step_num = 0;
            this.score_num = 0;
            this.start_section.removeClass("display_no");        
            this.character_way_set(1);
            this.oxs.removeClass("true").removeClass("false");
            $(this.steps).find("div").removeClass("active");

            //this.game_set(0);//게임 시작
        }

        async game_start(num = 0){
            this.character.removeClass("dispose");    
            this.step_num = num;
            this.character_way_set(1);
            const cur_step = $(this.steps).eq(num);

            $(this.game_step).addClass("active");
            cur_step.addClass("active");
            const _dap = this.jung_dap[this.step_num] - 1;
            await this.set_time.out(500);
            

            cur_step.find(".left").addClass("block_move_left");
            cur_step.find(".center").addClass("block_move_center");
            cur_step.find(".right").addClass("block_move_right");


            await this.set_time.out(this.quiz_time);
            let cur_step_ox = false;
            if(this.character_way_num == _dap){
                cur_step_ox = true;
                this.oxs.eq(num).addClass("true");
                this.warning_message.warning_message_show('true');
                this.sound_class.play('true');
            }else{
                this.oxs.eq(num).addClass("false");
                this.warning_message.warning_message_show(this.warning_message_try_name);
                this.sound_class.play("false");
            };
            cur_step.find("div").eq(_dap).addClass("active");

            const f_st = cur_step.find("div").eq(_dap).text().replace(/\n/ig, "");
            const e_st = cur_step.find("div").eq(this.character_way_num).text().replace(/\n/ig, "");
            this.set_content_data(f_st , e_st, cur_step_ox);
            
            await this.set_time.out(2000);            
            if(this.step_num >= this.jung_dap.length-1){
                this.quiz_end();
            }else{
                cur_step.removeClass("active");
                cur_step.find(".left").removeClass("block_move_left");
                cur_step.find(".center").removeClass("block_move_center");
                cur_step.find(".right").removeClass("block_move_right");
                this.game_start(++this.step_num);
            };
        }

        set_content_data(f_st , e_st, is_ok = false){
            this.lms.request_content_data({
                qnum: this.step_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: f_st,
                user_dap: e_st,
                score: (is_ok) ? 100 : 0,
                try_num: this.cur_try_num - 1
            });
        }

        character_way_set(num){
            this.character_way_num = num;
            const _way = this.character_way_arr[num];
            this.character.removeClass("dis").removeClass("left").removeClass("center").removeClass("right")
            this.character.addClass(_way);

            if(_way == "left"){
                this.l_btn.addClass("dispose");
            }else if(_way == "right"){
                this.r_btn.addClass("dispose");
            }else{
                this.l_btn.removeClass("dispose");
                this.r_btn.removeClass("dispose");
            }
        }
        random_index(){
            let randomIndexArray = [];
            for (let i=0; i<3; i++) {
                randomNum = Math.floor(Math.random() * 4) + 1;
                if (randomIndexArray.indexOf(randomNum) === -1) {
                    randomIndexArray.push(randomNum)
                } else {
                    i--;
                }
            }
            return randomIndexArray;// [1, 2] // [4, 1]
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
        }
    };//학습 데이터 처리 ok!!!
    win.kbc_main.SCROLL_CHECK = class SCROLL_CHECK extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.scroll_wrap = this.quiz_wrap.querySelector(".scroll_con");
            this.btns.check.classList.add("display_no");
            
            this.init();
        };

        async init(){                    
            this.scrollHeight = this.scroll_wrap.scrollHeight;
            this.clientHeight = this.scroll_wrap.clientHeight;

            if(!this.scrollHeight){
                await this.set_time.out(100);
                this.init();
                return false;
            };
            
            this.scroll_wrap.addEventListener('scroll', () => {
                const a = this.scroll_wrap.scrollTop;
                const b = this.scrollHeight - this.clientHeight;
                const c = a / b;
                
                if (c >= 1) {
                    //console.log(a , b, c)
                    this.quiz_end();
                }
            });
        }

        quiz_end(){
            super.quiz_end();
        }
    };//학습 데이터 처리 필요 없음!!!
    win.kbc_main.OCR = class OCR extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            
            this.btns.check.classList.add("display_no");
            this.ocr_frame = this.quiz_wrap.querySelector("iframe.ocr_iframe");
            this.ocr_frame_src = this.ocr_frame.getAttribute("src");
            this.ocr_images = [];

            this.btns.ocr_start = this.quiz_wrap.querySelector("button.start_btn") || null;
            this.btns.ocr_close = this.quiz_wrap.querySelector(".ocr_pop button.close") || null;
            this.ocr_pop = this.quiz_wrap.querySelector(".ocr_pop") || null;

            if(this.btns.ocr_start) this.btns.ocr_start.addEventListener("click", e => {
                if (this.btn_lock.isLock()) return;
                    
                this.start_sound_stop();
                this.sound_class.play('click');
                this.ocr_pop.classList.add("active");
                this.show_init();
            });

            if(this.btns.ocr_close) this.btns.ocr_close.addEventListener("click", e => {
                this.sound_class.play('click');
                this.ocr_pop.classList.remove("active");
            });
        };

        async show_init(){  
            this.ocr_frame.setAttribute("src" , "");
            setTimeout(()=>{
                this.ocr_frame.setAttribute("src" , this.ocr_frame_src);
            },100);
            //console.log(this.ocr_frame)
            //console.log(this.ocr_frame.document)
        }


        set_images(datas = null){
            //console.log("datas : ", datas)
        }
        error_message(){
            this.alert_message.show('ocr_error');
            this.sound_class.play('retry')
        }
        retry_fn(failCnt){
            this.warning_message_try_name = 'retry' + failCnt;
            this.warning_message.warning_message_show(this.warning_message_try_name);
            this.sound_class.play('retry')
        }
        end_check_fn(is_true, failCnt){
            this.warning_message_try_name = 'retry' + failCnt;
            if(is_true){
                this.quiz_wrap.classList.add("true");
                this.warning_message.warning_message_show('true');
                this.sound_class.play('true')
            }else{
                this.quiz_wrap.classList.add("false");
                this.warning_message.warning_message_show(this.warning_message_try_name);
                this.sound_class.play('false')
            }
            this.quiz_end();
        }
        quiz_end(){            
            super.quiz_end();
        }
    };//학습 데이터 처리 필요 없음!!!
    //3_1_1_m08
    win.kbc_main.CLICK = class CLICK extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach((btn, i) => {
                //btn.setAttribute("title", `보기${i + 1} `);
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const num = parseInt(btn.dataset.num, 10);

                    btn.classList.add('check');
                    this.user_dap[num-1] = num;
                    this.sound_class.play('click');
                    
                    this.quiz_ok_check();//선택하면 바로 완료 판단 시작!
                });
            });
        }

        quiz_ok_check(is_prev_dap = false) {
            if( !this.user_dap.length ) {//아무것도 하지 않았다.
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }

            const st_user_dap = this.user_dap.toString().replace(/\s/g, "");
            const st_jung_dap = this.jung_dap.toString().replace(/\s/g, "");

            if(st_user_dap == st_jung_dap) this.quiz_end();
        }

        reset_sel(all_clear = true) {
            this.user_dap = [];
            this.actives.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
                btn.classList.remove('dispose');
            });
        }

        quiz_retry() {
            this.reset_sel(true);
            super.quiz_retry();
        }

        quiz_reset() {
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
            });
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
            this.actives.forEach((btn, i) => {
                // if (this.jung_dap.indexOf((i + 1)) != -1) {//여기선 string
                //     btn.classList.add('true')
                // } else {
                //     btn.classList.add('false')
                // }
            });
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 ok!!!
    win.kbc_main.CLICK_ACC = class CLICK_ACC extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.click_acc_arr = [];
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach((btn, i) => {
                this.click_acc_arr[i] = 0;
                this.user_dap[i] = 0;
                btn.setAttribute("data-ck_acc_num", 0);
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;
                    this.start_sound_stop();
                    this.sound_class.play('click');

                    const num = parseInt(btn.dataset.num, 10) - 1;
                    const limit_num = parseInt(this.jung_dap[num], 10);
                    const acc_num = parseInt(btn.dataset.ck_acc_num, 10);
                    if(acc_num < limit_num){
                        const acc_result_num = parseInt(btn.dataset.ck_acc_num, 10) + 1;
                        btn.setAttribute("data-ck_acc_num", acc_result_num);
                        this.user_dap[i] = acc_result_num;
                        if(acc_result_num >= limit_num) {
                            this.ck_btn_state(num);
                            this.quiz_ok_check();
                        }
                    };                    
                })
            });
        }

        ck_btn_state(btn_index){
            this.actives[btn_index].classList.add("dispose");
            this.sound_class.play('true');

            const u_title = this.actives[btn_index].getAttribute("title");
            const u_text = this.actives[btn_index].innerText.replace(/\n/ig, " ");
            const st_udap = (!u_title || u_title == "") ? u_text : u_title;

            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: st_udap,
                user_dap: st_udap,
                score: -1,
                try_num: 1
            });
        }


        quiz_ok_check(is_prev_dap = false) {
            const udap_st = this.user_dap.toString();
            const jdap_st = this.jung_dap.toString();
            
            if( udap_st != jdap_st ) {//완료가 되지 않은 것으로 판단해서 그냥 처리를 중단한다.
                return false;
            }

            this.quiz_end();
            //super.quiz_ok_check(is_prev_dap);
        }

        reset_sel(all_clear = true) {
            this.actives.forEach((btn, i) => {
                this.user_dap[i] = 0;
                this.click_acc_arr[i] = 0;
                btn.setAttribute("data-ck_acc_num", 0);
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
                btn.classList.remove('dispose');
            });
        }

        quiz_retry() {
            this.reset_sel(true);
            super.quiz_retry();
        }

        quiz_reset() {
            this.quiz_retry();
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            this.quiz_wrap.classList.add("check")
            super.quiz_end(is_prev_dap);
            /* this.actives.forEach((btn, i) => {
                if (this.jung_dap.indexOf((i + 1)) != -1) {//여기선 string
                    btn.classList.add('true')
                } else {
                    btn.classList.add('false')
                }
            }); */
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 ok!!!
    win.kbc_main.CHECK = class CHECK extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.select_arr = [];
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach((btn, i) => {
                //btn.setAttribute("title", `보기${i + 1} `);
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const num = parseInt(btn.dataset.num, 10);
                    if (this.is_multi) {
                        if (btn.classList.contains('check')) {
                            btn.classList.remove('check')
                            this.select_arr.splice(this.select_arr.indexOf(num), 1);
                        } else {
                            if (this.select_arr.length == this.jung_dap.length && this.is_limit_check) {
                                let last_ele_num = parseInt(this.select_arr.pop(), 10);
                                this.actives[last_ele_num - 1].classList.remove('check');
                            }

                            btn.classList.add('check');
                            this.select_arr.push(num);
                        }
                        this.user_dap = this.select_arr;
                    } else {
                        this.reset_sel();
                        btn.classList.add('check');
                        this.select_arr.push(num);
                        this.user_dap = this.select_arr;
                    }
                    this.sound_class.play('click');
                    //console.log("this.user_dap : ", this.user_dap)
                })
            });

            if(this.feed_wrap){
                this.exp_close_btn = this.feed_wrap.querySelector(".exp_close_btn") || null;
                if(this.exp_close_btn) this.exp_close_btn.addEventListener("click", e => {
                    this.sound_class.play("click");
                    this.feed_wrap.classList.add("close");
                });   
            }
        }

        quiz_ok_check(is_prev_dap = false) {
            if( !this.user_dap.length ) {//아무것도 하지 않았다.
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }



            this.jung_dap = this.user_dap;
            this.jung_dap.forEach((val, i) => {
                //정답 텍스트 구하기
                const jdap_num = parseInt(val, 10) - 1;
                const j_title = this.actives[jdap_num].getAttribute("title");
                const j_text = this.actives[jdap_num].innerText.replace(/\n/ig, " ");
                const st_jdap = (!j_title || j_title == "") ? j_text : j_title;

                this.jung_dap_st_arr.push(st_jdap);
            });
            const copy_user_dap = this.deep_copy_daps()[0];
            copy_user_dap.forEach((val, i) => {
                const udap_num = parseInt(val, 10) - 1;
                const u_title = this.actives[udap_num].getAttribute("title");
                const u_text = this.actives[udap_num].innerText.replace(/\n/ig, " ");
                const st_udap = (!u_title || u_title == "") ? u_text : u_title;

                this.user_dap_st_arr.push(st_udap);

            });
            const jst = this.jung_dap_st_arr.join("||");
            const ust = this.user_dap_st_arr.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: -1,
                try_num: this.cur_try_num - 1
            });


            this.quiz_end();
            //super.quiz_ok_check(is_prev_dap);
        }

        reset_sel(all_clear = true) {
            this.user_dap = [];
            this.select_arr = [];
            this.actives.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
                btn.classList.remove('dispose');
            });
        }

        quiz_retry() {
            this.reset_sel(true);
            super.quiz_retry();
        }

        quiz_reset() {
            this.select_arr = [];
            //console.log("quiz_reset - ", this.select_arr, this.user_dap)
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
            });
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
            this.actives.forEach((btn, i) => {
                if (this.jung_dap.indexOf((i + 1)) != -1) {//여기선 string
                    btn.classList.add('true')
                } else {
                    btn.classList.add('false')
                }
            });
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 ok!!!

    //4단계 4단원 10차시 14모듈
    win.kbc_main.STAR_CHECK = class STAR_CHECK extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.stars = [];
            this.star_con = this.quiz_wrap.querySelectorAll('.star_con') || []; 
            this.star_con.forEach( (con, i) => {
                this.stars[i] = con.querySelectorAll(".star") || [];
                this.stars[i].forEach( (star, k) => {
                    star.index = i;
                    star.num = k;
                    star.addEventListener("click", e => {
                        const btn = e.currentTarget || e.target;
                        this.user_dap[i] = btn.num + 1;
                        this.sound_class.play('click');

                        this.resel_stars(btn.index, btn.num);
                    });
                })
            });
        }

        resel_stars(index = null, num = null) {
            if(index == null || num == null) return false;
            
            this.stars[index].forEach( star => star.classList.remove("check"));//클릭 라인 초기화
            this.stars[index].forEach( (star, i) => {
                if(i <= num) star.classList.add("check");
            });
            
        }

        quiz_ok_check(is_prev_dap = false) {
            let isEmpty = false;
            isEmpty = this.user_dap.find( value => {
                if(!value || value=="") return true;
            });

            if( isEmpty ) {//체크하지 않고 빈 라인이 있다.
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            };

            this.quiz_end();
        }

        

        quiz_retry() {}

        quiz_reset() {
            this.star_con.forEach( (con, i) => this.resel_stars(i, 0) );
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            console.log(this.user_dap)
            super.quiz_end(is_prev_dap);
        }

    };//학습 데이터 처리 필요 없는 것으로 확인됨!!!!



    //사용 안하고 있음.
    win.kbc_main.CHECK_POP = class CHECK_POP extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach((btn, i) => {
                //btn.setAttribute("title", `보기${i + 1} `);
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const num = parseInt(btn.dataset.num, 10);
                    
                    this.reset_sel();
                    btn.classList.add('check');
                    this.popsp[num-1].classList.add("active");
                    this.popsp[num-1].classList.add("finished");
                    this.user_dap[i] = num;
                    
                    this.sound_class.play('click');
                })
            });

            this.pops = this.quiz_wrap.querySelectorAll('.pop_con .pop');
            this.pops.forEach( (pop, i) => {
                const close_btn = pop.querySelector("button.close_btn")
                close_btn.addEventListener( "click" , e => {
                    const num = i;
                    this.pops[num].classList.remove("active");
                    this.quiz_ok_check();
                });
            });

            if(this.feed_wrap){
                this.exp_close_btn = this.feed_wrap.querySelector(".exp_close_btn") || null;
                if(this.exp_close_btn) this.exp_close_btn.addEventListener("click", e => {
                    this.sound_class.play("click");
                    this.feed_wrap.classList.add("close");
                });   
            }
        }

        quiz_ok_check(is_prev_dap = false) {
            /* if( !this.user_dap.length ) {//아무것도 하지 않았다.
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            } */
            //super.quiz_ok_check(is_prev_dap);

            const uDap_st = this.user_dap.toString();
            const jDap_st = this.jung_dap.toString();

            if(uDap_st == jDap_st){
                this.quiz_end();
            }
        }

        reset_sel(all_clear = true) {
            this.actives.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
                btn.classList.remove('dispose');
            });
        }

        quiz_retry() {
            this.reset_sel(true);
            this.pops.forEach( pop => pop.classList.remove('check') );
            super.quiz_retry();
        }

        quiz_reset() {
            this.user_dap = [];
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
                
            });
            this.pops.forEach( pop => pop.classList.remove('check') );
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            //this.jung_dap = this.user_dap;
            this.jung_dap.forEach((val, i) => {
                //정답 텍스트 구하기
                const jdap_num = parseInt(val, 10) - 1;
                const j_title = this.actives[jdap_num].getAttribute("title");
                const j_text = this.actives[jdap_num].innerText.replace(/\n/ig, " ");
                const st_jdap = (!j_title || j_title == "") ? j_text : j_title;

                this.jung_dap_st_arr.push(st_jdap);
            });
            const copy_user_dap = this.deep_copy_daps()[0];
            copy_user_dap.forEach((val, i) => {
                const udap_num = parseInt(val, 10) - 1;
                const u_title = this.actives[udap_num].getAttribute("title");
                const u_text = this.actives[udap_num].innerText.replace(/\n/ig, " ");
                const st_udap = (!u_title || u_title == "") ? u_text : u_title;

                this.user_dap_st_arr.push(st_udap);

            });
            const jst = this.jung_dap_st_arr.join("||");
            const ust = this.user_dap_st_arr.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: -1,
                try_num: this.cur_try_num - 1
            });





            super.quiz_end(is_prev_dap);
            this.actives.forEach((btn, i) => {
                if (this.jung_dap.indexOf((i + 1)) != -1) {//여기선 string
                    btn.classList.add('true')
                } else {
                    btn.classList.add('false')
                }
            });
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 ok!!!
    win.kbc_main.INPUT = class INPUT extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.actives = [];
            this.quiz_wrap.querySelectorAll('.quiz_input').forEach(input => {
                this.actives.push(input);
                input.addEventListener("input", e => {
                    const target = e.currentTarget || e.target;
                    const value = target.value;
                    (value) ? target.classList.add("isNotEmpty") : target.classList.remove("isNotEmpty");
                })
            });



            if (history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        }

        quiz_reset() {
            
            this.actives.forEach(v => {
                v.value = '';
                v.classList.remove('true');
                v.classList.remove('false');
                input.removeAttribute('readonly');
            });
            super.quiz_reset();
        }

        quiz_retry() {

            this.actives.forEach((input, i) => {
                console.log("input-quiz_retry : ",this.jung_dap[i] , input.value)
                if(this.jung_dap[i] != input.value){//정답이 아니면 초기화
                    input.value = '';
                    input.classList.remove("isNotEmpty");
                }else{//정답이면 수정 불가하게 변경
                    input.setAttribute('readonly', true);
                }
            });
            super.quiz_retry();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);

            this.actives.forEach((input, i) => {
                const user = this.user_dap[i].toString().replace(/\s/g, "");
                const jung_dap = this.jung_dap[i].toString().replace(/\s/g, "");
                input.setAttribute('readonly', true);
                if (user == jung_dap) {
                    input.classList.add("true");
                } else {
                    input.classList.add("false");
                    input.value = this.jung_dap[i].toString();
                }
            });

        }
        prev_data_quiz_end(history_data) {
            this.user_dap = JSON.parse(history_data);
            this.actives.forEach((input, i) => input.value = this.user_dap[i]);

            this.quiz_ok_check(true);
        }

        quiz_ok_check(is_prev_dap = false) {
            this.user_dap = this.actives.map(input => input.value);

            let isEnd = true;
            this.user_dap.forEach(val => {
                if (!val || val == "") {
                    isEnd = false;
                }
            });
            if (!isEnd) {//빈 활동이 없는지 체크
                this.user_dap = [];
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }


            /**
             * 학습 데이터 전달 처리
             */
            const jst = this.jung_dap.join("||");
            const ust = this.user_dap.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: (jst == ust) ? 100 : 0,
                try_num: this.cur_try_num - 1
            });

            super.quiz_ok_check(is_prev_dap);
        }

        /* get outcome_data_set() {
            return super.outcome_data_set;
        } */
    };//학습 데이터 처리 ok!!!
    win.kbc_main.OPINION = class OPINION extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.actives = [];
            this.quiz_wrap.querySelectorAll('.quiz_input').forEach(input => {
                this.actives.push(input);
                input.addEventListener("input", e => {
                    const target = e.currentTarget || e.target;
                    const value = target.value;
                    (value) ? target.classList.add("isNotEmpty") : target.classList.remove("isNotEmpty");
                })
            });



            if (history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        }

        quiz_reset() {
            this.actives.forEach(v => {
                v.value = '';
                v.classList.remove('true');
                v.classList.remove('false');
                input.removeAttribute('readonly');
            });
            super.quiz_reset();
        }

        quiz_retry() {
            this.actives.forEach((input, i) => {
                if(this.jung_dap[i] != input.value){//정답이 아니면 초기화
                    input.value = '';
                    input.classList.remove("isNotEmpty");
                }else{//정답이면 수정 불가하게 변경
                    input.setAttribute('readonly', true);
                }
            });
            super.quiz_retry();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);

            this.actives.forEach((input, i) => {
                const user = this.user_dap[i].toString().replace(/\s/g, "");
                const jung_dap = this.jung_dap[i].toString().replace(/\s/g, "");
                input.setAttribute('readonly', true);
                if (user == jung_dap) {
                    input.classList.add("true");
                } else {
                    input.classList.add("false");
                }
            });

        }
        prev_data_quiz_end(history_data) {
            this.user_dap = JSON.parse(history_data);
            this.actives.forEach((input, i) => input.value = this.user_dap[i]);

            this.quiz_ok_check(true);
        }

        quiz_ok_check(is_prev_dap = false) {
            this.jung_dap = this.user_dap = this.actives.map(input => input.value);
            
            let isEnd = true;
            this.user_dap.forEach(val => {
                if (!val || val == "") {
                    isEnd = false;
                }
            });
            if (!isEnd) {//빈 활동이 없는지 체크
                this.user_dap = [];
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }


            /**
             * 학습 데이터 전달 처리
             */
            const jst = this.jung_dap.join("||");
            const ust = this.user_dap.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: "",
                user_dap: ust,
                score: -1,
                try_num: this.cur_try_num - 1
            });

            super.quiz_ok_check(is_prev_dap);
        }

        /* get outcome_data_set() {
            return super.outcome_data_set;
        } */
    };//학습 데이터 처리 ok!!!

    //4_4_10_m11, 3_1_10_m11
    win.kbc_main.TIMER = class TIMER extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.btns.check.classList.add("display_no");
            this.time = 0;
            //버튼 눌러서 진행할 부분 처리 필요.
            this.timer_con = this.quiz_wrap.querySelector(".timer");
            this.btns.play_btn = this.quiz_wrap.querySelector(".play_btn");
            this.btns.pause_btn = this.quiz_wrap.querySelector(".pause_btn");
            this.time_wrap = this.quiz_wrap.querySelector(".time_wrap p");
            this.timer_feed_con = this.quiz_wrap.querySelector(".timer_feed_con");


            this.btns.play_btn.addEventListener("click", e => {
                this.sound_class.play('click');
                this.play_time();
            });
            this.btns.pause_btn.addEventListener("click", e => {
                this.sound_class.play('click');
                this.pause_time();
            });


            /* this.actives = [];
            this.quiz_wrap.querySelectorAll('.quiz_input').forEach(input => {
                this.actives.push(input);
                input.addEventListener("input", e => {
                    const target = e.currentTarget || e.target;
                    const value = target.value;
                    (value) ? target.classList.add("isNotEmpty") : target.classList.remove("isNotEmpty");
                })
            });
            */
        }
        play_time( num = 0){
            this.time = num;
            this.time_wrap.innerHTML = this.toStr(num);


            this.btns.play_btn.classList.remove("active");
            this.btns.pause_btn.classList.add("active");

            this.timeout = null;
            this.timeout = setInterval( () => {
                this.time = this.time + 1;
                this.time_wrap.innerHTML = this.toStr(this.time);
            }, 1000);
        }
        pause_time(){
            this.btns.play_btn.classList.add("active");
            this.btns.pause_btn.classList.remove("active");

            clearInterval(this.timeout);
            this.timeout = null;
            this.quiz_ok_check();


        }
        toStr(np, timeFormat="m:s") {
            console.log("toStr-np : ", np)

            let min = Math.floor(np / 60);
            const hour = Math.floor(min / 60);
            const sec = Math.floor(np - min * 60);
            min = Math.floor((np - hour * 60 * 60) / 60);

            const rHour = (hour < 10) ? "0" + String(hour) : String(hour);
            const rMin = (min < 10) ? "0" + String(min) : String(min);
            const rSec = (sec < 10) ? "0" + String(sec) : String(sec);

            switch (timeFormat) {
                case "m:s":
                    if (hour == 0) {
                        return rMin + ":" + rSec;
                    }

                case "h:m:s":
                    return rHour + ":" + rMin + ":" + rSec;

                case "분:초":
                    if (hour == 0) {
                        return String(min) + "분 " + String(sec) + "초";
                    }

                case "시:분:초":
                    return String(hour) + " 시" + String(min) + " 분" + String(sec) + " 초";
                default:
                    return rHour + ":" + rMin + ":" + rSec;
            }
        }
        quiz_reset() {            
            super.quiz_reset();
        }

        quiz_retry() {
            this.time = num;
            this.time_wrap.innerHTML = this.toStr(num);
            this.btns.play_btn.classList.add("active");
            this.btns.pause_btn.classList.remove("active");
            this.timer_feed_con.removeAttribute("data-type");
            super.quiz_retry();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
        }
        

        quiz_ok_check(is_prev_dap = false) {
            //문제지문, 정답 (n분n초), 사용자답 (n분n초), 점수(제한시간 내 입력완료 시 1), 시도횟수, 문제유형(타이머)
            this.user_dap = this.time;
            
            
            if (!this.user_dap) {//빈 활동이 없는지 체크
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }


            /**
             * 학습 데이터 전달 처리
             */
            const jnum = parseInt(this.jung_dap, 10);
            const unum = this.user_dap;
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jnum.toString(),
                user_dap: unum.toString(),
                score: (unum <= jnum) ? 100 : 0,
                try_num: this.cur_try_num - 1
            });

            if(unum <= jnum) {
                this.timer_feed_con.setAttribute("data-type", "good");
            }else{
                this.timer_feed_con.setAttribute("data-type", "try");
            }
            setTimeout(() => this.timer_feed_con.removeAttribute("data-type"), 2000);

            this.quiz_end();
            //super.quiz_ok_check(is_prev_dap);
        }

        /* get outcome_data_set() {
            return super.outcome_data_set;
        } */
    };//학습 데이터 처리 ok!!!


    //선택한 버튼에 대한 popup이 열리는 형태 팝업이 없으면 바로 페이지 완료됨
    //4단계 4단원 10차시 6모듈, 3단계 1단원 1차시 8모듈, 3단계 1단원 11차시 11모듈
    win.kbc_main.STEP_POP = class STEP_POP extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.select_arr = [];
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach((btn, i) => {
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const num = parseInt(btn.dataset.num, 10);

                    if (btn.classList.contains('check')) {
                        //btn.classList.remove('check')
                        this.select_arr.splice(this.select_arr.indexOf(num), 1);
                    } else {
                        //btn.classList.add('check');
                        this.select_arr.push(num);
                    };

                    this.user_dap = this.select_arr;
                    this.sound_class.play('click');
                    this.quiz_ok_check(num-1);
                    //console.log("this.user_dap : ", this.user_dap)
                })
            });


            if(this.check_feed_wraps.length){
                this.check_feed_wraps.forEach( pop => {
                    this.check_feed_close_btn = pop.querySelector(".check_feed_close_btn");
                    this.check_feed_close_btn.addEventListener("click", e => {
                        this.sound_class.play("click");
                        pop.classList.remove("active");

                        this.quiz_ok_check();
                    });
                });
            };

        }

        quiz_ok_check(num = null) {
            if(!this.check_feed_wraps.length){
                console.log("check_feed_wraps.length : ", this.check_feed_wraps.length)
                this.quiz_end();
            }else{
                let pop_cnt = 0;
                this.check_feed_wraps.forEach( pop => {
                    if(pop.classList.contains("pop_finished")){
                        pop_cnt++;
                    }
                });
                if(pop_cnt >= this.check_feed_wraps.length){
                    console.log(pop_cnt >= this.check_feed_wraps.length)
                    this.quiz_end();
                }
            };


            //순서 중요 위의 if문보다 아래 있어야 함
            if(num != null && this.check_feed_wraps.length){
                if(this.check_feed_wraps[num]) 
                    this.check_feed_wraps[num].classList.add("active");//팝업 열림
                    this.check_feed_wraps[num].classList.add("pop_finished");//팝업 열림
            }

            //super.quiz_ok_check(is_prev_dap);
        }

        reset_sel(all_clear = true) {
            
            this.actives.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
                btn.classList.remove('dispose');
            });
        }

        quiz_retry() {
            this.user_dap = [];
            this.select_arr = [];
            this.reset_sel(true);
            super.quiz_retry();
        }

        quiz_reset() {
            this.select_arr = [];
            //console.log("quiz_reset - ", this.select_arr, this.user_dap)
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
            });
            this.check_feed_wraps.forEach(pop => pop.classList.remove("pop_finished") );
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            this.jung_dap = this.user_dap;
            this.jung_dap.forEach((val, i) => {
                //정답 텍스트 구하기
                const jdap_num = parseInt(val, 10) - 1;
                const j_title = this.actives[jdap_num].getAttribute("title");
                const j_text = this.actives[jdap_num].innerText.replace(/\n/ig, " ");
                const st_jdap = (!j_title || j_title == "") ? j_text : j_title;

                this.jung_dap_st_arr.push(st_jdap);
            });
            const copy_user_dap = this.deep_copy_daps()[0];
            copy_user_dap.forEach((val, i) => {
                const udap_num = parseInt(val, 10) - 1;
                const u_title = this.actives[udap_num].getAttribute("title");
                const u_text = this.actives[udap_num].innerText.replace(/\n/ig, " ");
                const st_udap = (!u_title || u_title == "") ? u_text : u_title;

                this.user_dap_st_arr.push(st_udap);

            });
            const jst = this.jung_dap_st_arr.join("||");
            const ust = this.user_dap_st_arr.join("||");
            this.lms.request_content_data({
                qnum: this.quiz_num,
                index: 0,
                jimun: this.question.innerText.replace(/\n/ig, " "),
                type: this.quiz_kor_type,
                jung_dap: jst,
                user_dap: ust,
                score: -1,
                try_num: this.cur_try_num - 1
            });





            super.quiz_end(is_prev_dap);
            this.actives.forEach((btn, i) => {
                if (this.jung_dap.indexOf((i + 1)) != -1) {//여기선 string
                    btn.classList.add('true')
                } else {
                    btn.classList.add('false')
                }
            });
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 ok!!!
    

    win.kbc_main.CUSTOMQUIZ = class CUSTOMQUIZ extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            //console.log("win.kbc_main.CUSTOMQUIZ :", this)
        }
    };//학습 데이터 처리 작업 필요!!!
    
    //4단계 4단원 8차시 
    win.kbc_main.RECORDE = class RECORDE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            //console.log("RECORDE-constructor")
            this.btns.check.classList.add("display_no");
            this.check_btns = this.quiz_wrap.querySelectorAll(".question_check_box .btn") || [];
            this.init(_args.history_data);
        }

        async init(history_data) {
            this.isAble = false;
            this.recorde_data = {};
            //console.log("RECORDE-init")
            //this.stream = null;
            //this.isRecord = await this.recordHardwareAccessCheck();

            //console.log(this)
            //this.btns.check.classList.add("display_no");
            //this.createAudio();
            //this.draw();

            this.list = [];
            this.actives = [];
            this.quiz_wrap.querySelectorAll(".record_wrap_con").forEach((dom, i) => {
                const pop = dom.querySelector(".recorde_pop");//이 위치에 팝업 생성
                pop.innerHTML = `<div class="pop_outer">
                                    <div class="pop_innner">                                
                                        <div class="recorde_aud_wrap"></div>

                                        <div class="direction_con">
                                            <div class="pop_canvas_con">
                                                <canvas id="pop_canvas_app" style="width: 100%; height: 60px;" width="500" height="60"></canvas>
                                            </div>
                                            <div class="direction">
                                                <div class="record_btns">
                                                    <button class="record_btn" title="녹음하기"></button>
                                                    <button class="repeat_btn" title="내 발음 듣기"></button>
                                                    <button class="pause_btn" title="내 발음 일시정지"></button>
                                                    <button class="download_btn" title="녹음 파일 다운로드"></button>
                                                    <button class="result_btn" title="녹음 결과 보기"></button>
                                                </div>
                                                <div class="audio_progress"><div class="bar"></div></div>
                                            </div>
                                            <button class="close" title="녹음 팝업창 닫기"></button>                                    
                                        </div>
                                        
                                    </div>
                                </div>`;

                this.actives.push(dom);
                dom.dataset.num = i;
                this.list.push(
                    new kbc_main.Recode_manager(
                        this.quiz_num,
                        this.quiz_wrap,
                        dom,
                        this.stream,
                        this.sound_class,
                        i,
                        this.lms,
                        this.alert_message,
                        this.disposeAll.bind(this),
                        this.ableAll.bind(this),
                        this.recorde_pop_closed.bind(this),
                        this.start_sound_stop.bind(this),
                        this.btn_lock,
                        this.set_time
                    )
                );
            });

            this.actives.forEach((dom, i) => {
                const pop = dom.querySelector(".recorde_pop");
                const open_btn = dom.querySelector(".pop_open_btn");
                const close_btn = pop.querySelector(".close");

                open_btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    dom.classList.add("active");//여러개의 녹음일 경우 z-index조절용 css 붙여짐
                    this.start_sound_stop();
                    this.sound_class.stop_all_sound();
                    //녹음이 가능해야 팝업을 열어줌
                    if(this.isRecord) { 
                        pop.classList.add("active")
                    }else{
                        //this.alert_message.show("recorde_author");
                        this.alert_message.show("top_move");
                        this.sound_class.play("retry");
                        //퀴즈를 종료 시키러 가야함( 6월 3일 다시 진행을 못하게 막으라고 하여 주석처리 함)
                        //this.recorde_pop_closed(dom, i);
                    }
                });
                close_btn.addEventListener("click", async e => {
                    if(this.list[i].processing) {
                        this.alert_message.show("recordeing");
                        return false;
                    }

                    dom.classList.remove("active");//여러개의 녹음일 경우 z-index조절용 css 붙여짐을 제거
                    pop.classList.remove("active");
                    this.list[i].recstop_audio();
                    this.list[i].stopRecorde();

                    await this.set_time.out(300);

                    const isrecord = dom.getAttribute("isrecord") == "true";
                    if(this.list[i].stt && isrecord){
                        this.list[i].result_pop_open();
                        //console.log(this.list[i].result_pop_open)
                    }else{
                        this.recorde_pop_closed(dom, i);
                    };                    
                });
            });

            this.check_btns.forEach( (btn, i) => {
                const snd_src = btn.dataset.src || null;
                if (snd_src) {
                    const snd_id = this.quiz_type + "_" + this.quiz_num + "_" + i;
                    btn.snd = this.sound_class.sound_load(snd_id, snd_src);
                    btn.id = snd_id;
                };

                btn.addEventListener("click", e => {
                    // console.log(this.btn_lock.isLock())
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const _btn = e.currentTarget || e.target;
                    _btn.classList.add("display_no");
                    if (snd_src) this.sound_class.play(_btn.id, () => { }, true);
                });
            });
        };



        disposeAll(num) {
            this.list.forEach((obj, i) => {
                obj.wrap.classList.add("dispose");
                if (i == num) {
                    obj.wrap.classList.remove("dispose");
                }
            })
        };

        ableAll() {
            this.list.forEach(obj => obj.wrap.classList.remove("dispose"));
        };


        quiz_reset() {
            this.list.forEach(cls => {
                cls.wrap.classList.remove("dispose");
            });
            this.reset_sel();

            super.quiz_reset();
        }

        reset_sel(np = -1) {
            this.list.forEach(cls => {
                cls.stop_audio();
                cls.stopRecorde();
                cls.recstop_audio();
                cls.wrap.setAttribute("isrecord", "false");
                cls.recorde_aud_wrap.innerHTML = "";
            })
        }

        recorde_pop_closed(wrap, num){
            this.quiz_ok_check();
        }
        quiz_ok_check(is_prev_dap = false) {
            let isblank = false;
            let isblank_num = 0;

            if(this.isRecord){//녹음이 가능한 상태이면...                
                this.list.forEach(cls => {
                    if (cls.wrap.getAttribute("isrecord") != "true") {
                        isblank = true;
                        isblank_num++;
                    }
                });

                if(isblank_num && isblank_num < this.list.length){
                    return true;
                }

                if (isblank) {
                    this.alert_message.show("recorde_blank");
                    this.sound_class.play('retry');
                    return true;
                };

                this.user_dap = this.jung_dap;


                let type = '';
                if (this.quiz_type == "recorde") type = "음성녹음형";
                //이렇게 단순 녹음인 경우 정답과 사용자답을 어떻게 보내야 하는지 확인 필요.
                this.lms.request_content_data({
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    type: type,
                    jung_dap: this.jung_dap,
                    user_dap: this.user_dap,
                    score: this.score,
                    try_num: this.cur_try_num
                });
            }//이부분이 step_recorde와 다름(마이크가 없을 때 완료 여부를 구분할 수 있는 방법이 없음)

            this.quiz_end(is_prev_dap);
        }


        quiz_end(is_prev_dap = false) {
            this.quiz_wrap.classList.add("check");
            super.quiz_end(is_prev_dap);
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 작업 필요!!!
    //4단계 4단원 8차시 
    win.kbc_main.STEP_RECORDE = class STEP_RECORDE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);

            this.btns.check.classList.add("display_no");
            this.init(_args.history_data);
        }

        async init(history_data) {
            this.isAble = false;
            this.recorde_data = {};
            //this.stream = null;
            //this.isRecord = await this.recordHardwareAccessCheck();

            //console.log(this)

            this.list = [];
            this.actives = [];
            this.quiz_wrap.querySelectorAll(".record_wrap_con").forEach((dom, i) => {
                const pop = dom.querySelector(".recorde_pop");//이 위치에 팝업 생성
                pop.innerHTML = `<div class="pop_outer">
                                    <div class="pop_innner">                                
                                        <div class="recorde_aud_wrap"></div>

                                        <div class="direction_con">
                                            <div class="pop_canvas_con">
                                                <canvas id="pop_canvas_app" style="width: 100%; height: 60px;" width="500" height="60"></canvas>
                                            </div>
                                            <div class="direction">
                                                <div class="record_btns">
                                                    <button class="record_btn" title="녹음하기"></button>
                                                    <button class="repeat_btn" title="내 발음 듣기"></button>
                                                    <button class="pause_btn" title="내 발음 일시정지"></button>
                                                    <button class="download_btn" title="녹음 파일 다운로드"></button>
                                                    <button class="result_btn" title="녹음 결과 보기"></button>
                                                </div>
                                                <div class="audio_progress"><div class="bar"></div></div>
                                            </div>
                                            <button class="close" title="녹음 팝업창 닫기"></button>                                    
                                        </div>
                                        
                                    </div>
                                </div>`;

                this.actives.push(dom)
                dom.dataset.num = i;
                dom.classList.add("dispose");
                this.list.push(
                    new kbc_main.Recode_manager(
                        this.quiz_num,
                        this.quiz_wrap,
                        dom,
                        this.stream,
                        this.sound_class,
                        i,
                        this.lms,
                        this.alert_message,
                        this.disposeAll.bind(this),
                        this.ableAll.bind(this),
                        this.recorde_pop_closed.bind(this),
                        this.start_sound_stop.bind(this),
                        this.btn_lock,
                        this.set_time
                    )
                );
            });

            this.actives.forEach((dom, i) => {
                const pop = dom.querySelector(".recorde_pop");
                const open_btn = dom.querySelector(".pop_open_btn");
                const close_btn = pop.querySelector(".close");

                open_btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    //녹음이 가능해야 팝업을 열어줌
                    if(this.isRecord) { 
                        pop.classList.add("active")
                    }else{
                        //this.alert_message.show("recorde_author");
                        this.alert_message.show("top_move");
                        this.sound_class.play("retry");
                        //퀴즈를 종료 시키러 가야함( 6월 3일 다시 진행을 못하게 막으라고 하여 주석처리 함)
                        //this.recorde_pop_closed(dom, i);
                    }
                });
                close_btn.addEventListener("click", async e => {
                    if(this.list[i].processing) {
                        this.alert_message.show("recordeing");
                        return false;
                    }

                    pop.classList.remove("active");
                    this.list[i].recstop_audio();
                    this.list[i].stopRecorde();

                    await this.set_time.out(300);

                    const isrecord = dom.getAttribute("isrecord") == "true";
                    if(this.list[i].stt && isrecord){
                        this.list[i].result_pop_open();
                    }else{
                        this.recorde_pop_closed(dom, i);
                    };
                    
                });
            });

            this.disposeAll(0)
        };



        disposeAll(num) {
            this.list[num].wrap.classList.remove("dispose2");
            this.list[num].wrap.classList.remove("dispose");
            this.list[num].wrap.classList.add("active");
            this.list[num].wrap.scrollIntoView({ behavior: 'smooth' })
        };

        ableAll() {
            //this.list.forEach(obj => obj.wrap.classList.remove("dispose"));
        };



        quiz_reset() {
            this.list.forEach(cls => {
                cls.wrap.classList.remove("dispose");
            });
            this.reset_sel();

            super.quiz_reset();
        }

        reset_sel(np = -1) {
            this.list.forEach(cls => {
                cls.stop_audio();
                cls.stopRecorde();
                cls.recstop_audio();
                cls.wrap.setAttribute("isrecord", "false");
                cls.recorde_aud_wrap.innerHTML = "";
            })
        }
        recorde_pop_closed(wrap, num){
            this.check_step_finish(wrap, num);
        }
        check_step_finish(wrap, index) {
            if(this.isRecord){//녹음이 가능한 상태이면...
                if (wrap.getAttribute("isrecord") != "true") {
                    this.alert_message.show("recorde_blank");
                    this.sound_class.play('retry');
                    return false;
                }
            }else{
                if (wrap.getAttribute("islistened") != "true") {
                    // this.alert_message.show("recorde_blank");
                    // this.sound_class.play('retry');
                    return false;
                }
            }

            if (index < this.list.length - 1) {
                //다음 step 열기
                this.disposeAll(index + 1)
            } else {
                //종료시키키
                this.quiz_ok_check();
            }            
        }
        quiz_ok_check(is_prev_dap = false) {
            let isblank = false;
            if(this.isRecord){//녹음이 가능한 상태이면...  
                this.list.forEach(cls => {
                    if (cls.wrap.getAttribute("isrecord") != "true") {
                        isblank = true;
                    }
                });

                if (isblank) {
                    this.alert_message.show("recorde_blank");
                    this.sound_class.play('retry');
                    return true;
                };

                this.user_dap = this.jung_dap;


                let type = '';
                if (this.quiz_type == "recorde") type = "음성녹음형";
                //이렇게 단순 녹음인 경우 정답과 사용자답을 어떻게 보내야 하는지 확인 필요.
                this.lms.request_content_data({
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    type: type,
                    jung_dap: this.jung_dap,
                    user_dap: this.user_dap,
                    score: this.score,
                    try_num: this.cur_try_num
                });
            }else{
                this.list.forEach(cls => {
                    if (cls.wrap.getAttribute("islistened") != "true") {
                        isblank = true;
                    }
                });

                if (isblank) {
                    // this.alert_message.show("recorde_blank");
                    // this.sound_class.play('retry');
                    return true;
                };

            }

            this.quiz_end(is_prev_dap);
        }


        quiz_end(is_prev_dap = false) {
            //this.outcome = "checked";
            this.quiz_wrap.classList.add("check");
            super.quiz_end(is_prev_dap);
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 작업 필요!!!
    //4단계 4단원 8차시 
    win.kbc_main.STT_RECORDE = class STT_RECORDE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);

            this.btns.check.classList.add("display_no");
            this.check_btns = this.quiz_wrap.querySelectorAll(".question_check_box .btn") || [];
            this.init(_args.history_data);
        }

        async init(history_data) {
            this.isAble = false;
            this.recorde_data = {};
            //this.stream = null;
            //this.isRecord = await this.recordHardwareAccessCheck();

            //console.log(this)
            //this.btns.check.classList.add("display_no");
            //this.createAudio();
            //this.draw();

            this.list = [];
            this.actives = [];
            this.quiz_wrap.querySelectorAll(".record_wrap_con").forEach((dom, i) => {
                const pop = dom.querySelector(".recorde_pop");//이 위치에 팝업 생성
                pop.innerHTML = `<div class="pop_outer">
                                    <div class="pop_innner">                                
                                        <div class="recorde_aud_wrap"></div>

                                        <div class="direction_con">
                                            <div class="pop_canvas_con">
                                                <canvas id="pop_canvas_app" style="width: 100%; height: 60px;" width="500" height="60"></canvas>
                                            </div>
                                            <div class="direction">
                                                <div class="record_btns">
                                                    <button class="record_btn" title="녹음하기"></button>
                                                    <button class="repeat_btn" title="내 발음 듣기"></button>
                                                    <button class="pause_btn" title="내 발음 일시정지"></button>
                                                    <button class="download_btn" title="녹음 파일 다운로드"></button>
                                                    <button class="result_btn" title="녹음 결과 보기"></button>
                                                </div>
                                                <div class="audio_progress"><div class="bar"></div></div>
                                            </div>
                                            <button class="close" title="녹음 팝업창 닫기"></button>                                    
                                        </div>
                                        
                                    </div>
                                </div>`;

                this.actives.push(dom)
                dom.dataset.num = i;
                this.list.push(
                    new kbc_main.Recode_manager(
                        this.quiz_num,
                        this.quiz_wrap,
                        dom,
                        this.stream,
                        this.sound_class,
                        i,
                        this.lms,
                        this.alert_message,
                        this.disposeAll.bind(this),
                        this.ableAll.bind(this),
                        this.recorde_pop_closed.bind(this),
                        this.start_sound_stop.bind(this),
                        this.btn_lock,
                        this.set_time
                    )
                );
            });

            this.actives.forEach((dom, i) => {
                const pop = dom.querySelector(".recorde_pop");
                const open_btn = dom.querySelector(".pop_open_btn");
                const close_btn = pop.querySelector(".close");

                open_btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    //녹음이 가능해야 팝업을 열어줌
                    if(this.isRecord) { 
                        pop.classList.add("active")
                    }else{
                        //this.alert_message.show("recorde_author");
                        this.alert_message.show("top_move");
                        this.sound_class.play("retry");
                        //퀴즈를 종료 시키러 가야함( 6월 3일 다시 진행을 못하게 막으라고 하여 주석처리 함)
                        //this.recorde_pop_closed(dom, i);
                    }
                });
                close_btn.addEventListener("click", async e => {
                    if(this.list[i].processing) {
                        this.alert_message.show("recordeing");
                        return false;
                    }

                    pop.classList.remove("active");
                    this.list[i].recstop_audio();
                    this.list[i].stopRecorde();

                    await this.set_time.out(300);

                    // const isrecord = dom.getAttribute("isrecord") == "true";
                    // if(this.list[i].stt && isrecord){
                    //     this.list[i].result_pop_open();
                    // }else{
                        this.recorde_pop_closed(dom, i);
                    // };
                    
                });
            });

            this.check_btns.forEach( (btn, i) => {
                const snd_src = btn.dataset.src || null;
                if (snd_src) {
                    const snd_id = this.quiz_type + "_" + this.quiz_num + "_" + i;
                    btn.snd = this.sound_class.sound_load(snd_id, snd_src);
                    btn.id = snd_id;
                };

                btn.addEventListener("click", e => {
                    // console.log(this.btn_lock.isLock())
                    if (this.btn_lock.isLock()) return;

                    const _btn = e.currentTarget || e.target;
                    _btn.classList.add("display_no");
                    if (snd_src) this.sound_class.play(_btn.id, () => { }, true);
                });
            });
        };



        disposeAll(num) {
            this.list.forEach((obj, i) => {
                obj.wrap.classList.add("dispose");
                if (i == num) {
                    obj.wrap.classList.remove("dispose");
                }
            })
        };

        ableAll() {
            this.list.forEach(obj => obj.wrap.classList.remove("dispose"));
        };

        
        quiz_reset() {
            this.list.forEach(cls => {
                cls.wrap.classList.remove("dispose");
            });
            this.reset_sel();

            super.quiz_reset();
        }

        reset_sel(np = -1) {
            this.list.forEach(cls => {
                cls.stop_audio();
                cls.stopRecorde();
                cls.recstop_audio();
                cls.wrap.setAttribute("isrecord", "false");
                cls.recorde_aud_wrap.innerHTML = "";
            })
        }
        recorde_pop_closed(wrap, num){
            this.quiz_ok_check();
        }
        quiz_ok_check(is_prev_dap = false) {
            let isblank = false;
            let isblank_num = 0;

            if(this.isRecord){//녹음이 가능한 상태이면...
                this.list.forEach(cls => {
                    if (cls.wrap.getAttribute("isrecord") != "true") {
                        isblank = true;
                        isblank_num++;
                    }
                });

                if(isblank_num && isblank_num < this.list.length){
                    return true;
                }

                if (isblank) {
                    this.alert_message.show("recorde_blank");
                    this.sound_class.play('retry');
                    return true;
                };

                this.user_dap = this.jung_dap;


                //console.log("quiz_ok_check")
                let type = '';
                if (this.quiz_type == "recorde") type = "음성녹음형";
                //이렇게 단순 녹음인 경우 정답과 사용자답을 어떻게 보내야 하는지 확인 필요.
                this.lms.request_content_data({
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    type: type,
                    jung_dap: this.jung_dap,
                    user_dap: this.user_dap,
                    score: this.score,
                    try_num: this.cur_try_num
                });
            }//이부분이 step_recorde와 다름(마이크가 없을 때 완료 여부를 구분할 수 있는 방법이 없음)

            this.quiz_end(is_prev_dap);
        }


        quiz_end(is_prev_dap = false) {
            this.quiz_wrap.classList.add("check");
            super.quiz_end(is_prev_dap);
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//학습 데이터 처리 작업 필요!!!
    win.kbc_main.RECORDE_CUSTOM = class RECORDE_CUSTOM extends win.kbc_main.RECORDE {
        constructor(_args) {
            super(_args);
            //추가 선언 불가 추가 선언은 init() 안에서 작업
        }

        async init() {
            //기능 추가부분
            //개별 페이지에 console.log() 추가 절대 금지!!!
            this.quiz_wrap.querySelectorAll('.quiz_input').forEach(input => {
                input.addEventListener("input", e => {
                    const target = e.currentTarget || e.target;
                    const value = target.value;
                    (value) ? target.classList.add("isNotEmpty") : target.classList.remove("isNotEmpty");
                })
            });

            this.imsi_select_arr = [];
            this.imsi_btns = this.quiz_wrap.querySelectorAll('.record_wrap_con .imsi_btn_wraps button');
            this.imsi_btns.forEach((btn, i) => {
                btn.addEventListener("click", e => {
                    if (this.btn_lock.isLock()) return;

                    //this.start_sound_stop();
                    const num = parseInt(btn.dataset.num, 10);
                    if (this.is_multi) {
                        if (btn.classList.contains('check')) {
                            btn.classList.remove('check')
                            this.imsi_select_arr.splice(this.imsi_select_arr.indexOf(num), 1);
                        } else {
                            if (this.imsi_select_arr.length == this.jung_dap.length) {
                                let last_ele_num = parseInt(this.imsi_select_arr.pop(), 10);
                                this.imsi_btns[last_ele_num - 1].classList.remove('check');
                            }

                            btn.classList.add('check');
                            this.imsi_select_arr.push(num);
                        }
                    } else {
                        this.check_btn_resel();
                        btn.classList.add('check');
                        this.imsi_select_arr.push(num);
                    }
                    this.sound_class.play('click');
                })
            });
            super.init();
        };
        
        check_btn_resel(){
            this.imsi_btns.forEach((btn, i) => btn.classList.remove("check"));
        }

    };

    //유형 추가 필요
    win.kbc_main.DRAG_DROP = class DRAG_DROP extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        /*
            제작 작업 중.
         */
        init(history_data) {
            const p = this;
            this.drag_con = this.quiz_wrap.querySelector(".drag_con");
            this.drag_type = this.drag_con.dataset.type || "";
            this.drop_con = this.quiz_wrap.querySelector(".drop_con");
            this.drag_btns = this.quiz_wrap.querySelectorAll(".drag_con .drag");
            this.drop_btns = this.quiz_wrap.querySelectorAll(".drop_con .drop");
            $(this.drag_con).find(".drag").draggable({
                cancel: false,
                revert: true,
                revertDuration: 0,

                /* helper: "clone", */
                drag: function (e, ui) {
                    //if (p.btn_lock.isLock()) return false;
                },
                start: function (e, ui) {
                    //if (p.btn_lock.isLock()) return false;

                    p.start_sound_stop();                    
                    $(ui.helper).css("z-index", 3);
                },
                stop: function (e, ui) {
                    $(ui.helper).css("z-index", 0);
                }
            });

            $(this.drop_con).find(".drop").droppable({
                tolerance: 'pointer',
                drop: function (e, ui) { // drop되었을때 발생
                    if (!p.user_dap) p.user_dap = [];
                    
                    // $(this).addClass("disable");//드랍칸 비활성화
                    // ui.draggable.addClass("disable");//드래그한 곳 비활성화
                    // const _clone = $(ui.helper[0]).clone();//드래그 하던 놈 복사
                    // _clone.attr("style", "").appendTo($(this));//드래그 하던 놈 드랍칸으로 삽입

                    $(this).droppable("disable");

                    const drag_num = parseInt($(ui.helper[0]).attr("data-num"), 10);
                    const drop_num = parseInt($(this).attr("data-num"), 10) - 1;
                    if(p.drag_type == "" || !p.drag_type) {
                        $(p.drag_con).find(".drag").eq(drag_num-1).addClass("dispose3");
                    }
                    p.change_drop(drag_num, $(this))
                    //p.into_drop(drag_num, drop_num);//복사해서 넣기
                    p.user_dap[drop_num] = drag_num;
                    p.sound_class.play('ting');
                    //console.log("p.user_dap :", p.user_dap, drop_num, drag_num)
                }
            });
            $(this.drop_con).find(".drop").off().on("click", function() {
                const ck_num = parseInt($(this).attr("data-num"), 10) - 1;
                $(this).find("img").removeClass("active");
                $(this).find("img").eq(0).addClass("active");

                //위치 중요 p.user_dap 보다 위에 있어야 함
                if(p.drag_type == "") {
                    const drag = $(p.drag_con).find(".drag").eq(p.user_dap[ck_num]-1)
                    drag.removeClass("dispose3");
                    //console.log(p.user_dap[ck_num] , drag)
                };

                $(this).droppable("enable");
                p.user_dap[ck_num] = null;
                p.sound_class.play('ting');
            });

            //history_data = '["3","2","1","4"]';//테스트...
            if (history_data && history_data != 'null') {
                this.prev_data_quiz_end(history_data);
            } else {
                this.user_dap = [];
            };
        }
        change_drop(drag_num, drop_target){
            drop_target.find("img").removeClass("active");
            drop_target.find("img").eq(drag_num).addClass("active");
        }

        into_drop(drag_num, drop_num) {
            const dropDom = $(this.drop_con).find(".drop").eq(drop_num);
            dropDom.addClass("disable");//드랍칸 비활성화

            const dragDom = $(this.drag_con).find(".drag").eq(drag_num - 1);
            const _clone = dragDom.clone();//드래그 하던 놈 복사
            dragDom.addClass("disable");//드래그한 곳 비활성화
            _clone.attr("style", "").removeClass("dispose").appendTo(dropDom);//드래그 하던 놈 드랍칸으로 삽입
        }


        prev_data_quiz_end(history_data) {
            this.user_dap = JSON.parse(history_data);

            this.user_dap.forEach((val, i) => {
                const num = parseInt(val, 10);
                this.into_drop(num, i);
            });
            /*
                드랍했을 때 일어나는 이벤트를 함수로 빼고 파라미터를 받아서
                지금 drop과 동일한 기능을 구현한 함수를 만들어놔야 추후 
                이전 답을 가지고 동일한 기능을 구현할 수 있음.
            */

            this.quiz_ok_check(true);
        }

        quiz_ok_check(is_prev_dap = false) {
            //빈 활동이 없는지 체크
            console.log(this.user_dap)
            if (this.quiz_blank_check()) return false;

            //드래그 앤 드랍을 개별로 보내는 방식
            this.jung_dap.forEach((val, i) => {
                //정답 텍스트 구하기
                const jdap_num = parseInt(val, 10) - 1;
                const j_title = this.drag_btns[jdap_num].getAttribute("title");
                const j_text = this.drag_btns[jdap_num].innerText.replace(/\n/ig, " ");
                const st_jdap = (!j_title || j_title == "") ? j_text : j_title;

                //사용자 답 텍스트 구하기
                const udap_num = this.user_dap[i] - 1;
                const u_title = this.drag_btns[udap_num].getAttribute("title");
                const u_text = this.drag_btns[udap_num].innerText.replace(/\n/ig, " ");
                const st_udap = (!u_title || u_title == "") ? u_text : u_title;

                //저장할 데이터 보내기
                this.lms.request_content_data({
                    qnum: this.quiz_num,
                    index: i,
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    type: this.quiz_kor_type,
                    jung_dap: st_jdap,
                    user_dap: st_udap,
                    score: (st_jdap == st_udap) ? 100 : 0,
                    try_num: this.cur_try_num
                });

                //정답과 사용자 답이 다르면
                //if (st_jdap != st_udap) this.user_dap[i] = null;
            });

            //필요에 따라 드래그 앤 드랍을 모아서 보내는 방식도 필요할 수 있음.

            super.quiz_ok_check(is_prev_dap);
        }

        reset_sel(all_clear = true) {
            //console.log(this.user_dap)
            if (!all_clear) {
                this.jung_dap.forEach((val, i) => {
                    const jdap_num = parseInt(val, 10) - 1;
                    const udap_num = this.user_dap[i] - 1;
                    //console.log(jdap_num+1 , " -- ", udap_num+1);

                    const drag = $(this.drag_con).find(".drag")[udap_num];
                    const drop = $(this.drop_con).find(".drop")[i];
                    if (jdap_num != udap_num) {//답하고 다를 경우
                        //드래그 칸 쪽 처리
                        
                        //console.log(this.user_dap, this.user_dap[i], udap_num, drag)
                        $(drag).removeClass("dispose3");


                        //드랍 칸 쪽 처리
                        $(drop).droppable("enable");
                        $(drop).find("img").removeClass("active");
                        $(drop).find("img").eq(0).addClass("active");
                        this.user_dap[i] = null;
                    } else {//답하고 같을 경우
                        $(drop).addClass("dispose");
                    }
                });
            } else {
                $(this.drag_con).find(".drag").removeClass("dispose3");
                $(this.drop_con).find(".drop").droppable("enable").removeClass("dispose");
            };
            //console.log("reset_sel-user_dap : ", this.user_dap)
        }

        quiz_retry() {
            this.reset_sel(false);
            super.quiz_retry();
        }

        quiz_reset() {
            this.reset_sel();
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            //오답 표시 여부
            //정답 표시 여부
            //여기서 부터 작업
            //기획쪽과 어떻게 표시 할 것인지 확인 후 진행

            super.quiz_end(is_prev_dap);
        }
    }//학습 데이터 처리 ok!!!
    win.kbc_main.DRAG_DROP_AREA = class DRAG_DROP_AREA extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        /*
            제작 작업 중.
         */
        init(history_data) {
            const p = this;
            const reget_jung_dap = (!this.quiz_wrap.dataset.jung_dap) ? "" : this.quiz_wrap.dataset.jung_dap;
            const parse_dap = reget_jung_dap.split('/');
            this.jung_dap = parse_dap.map( (st, i) => {
                this.user_dap[i] = [];
                return st.split(",");
            });
            
            //console.log("this.jung_dap : ", this.jung_dap, "this.user_dap : ", this.user_dap)

            this.drag_con = this.quiz_wrap.querySelector(".drag_con");
            this.drag_type = this.drag_con.dataset.type || "";
            this.drop_con = this.quiz_wrap.querySelector(".drop_con");
            this.drag_btns = this.quiz_wrap.querySelectorAll(".drag_con .drag");
            this.drop_btns = this.quiz_wrap.querySelectorAll(".drop_con .drop");
            this.drop_area_boxs = this.quiz_wrap.querySelectorAll(".drop_con .drop_area_box");
            this.drop_area_boxs.forEach( (drop_area, i) => {
                drop_area.querySelectorAll(".drop").forEach( drop => {
                    drop.dataset.area_num = i;
                });
            });
            $(this.drag_con).find(".drag").draggable({
                cancel: false,
                revert: true,
                revertDuration: 0,

                /* helper: "clone", */
                drag: function (e, ui) {
                    //if (p.btn_lock.isLock()) return false;
                },
                start: function (e, ui) {
                    //if (p.btn_lock.isLock()) return false;

                    p.start_sound_stop();                    
                    $(ui.helper).css("z-index", 3);
                },
                stop: function (e, ui) {
                    $(ui.helper).css("z-index", 0);
                }
            });

            $(this.drop_con).find(".drop_area").droppable({
                tolerance: 'pointer',
                drop: function (e, ui) { // drop되었을때 발생
                    //if (!p.user_dap) p.user_dap = [];
                    //$(this).droppable("disable");
                    const drag_num = parseInt($(ui.helper[0]).attr("data-num"), 10);
                    const drop_num = parseInt($(this).attr("data-num"), 10) - 1;
                    const ck_num = ( p.user_dap[drop_num].findIndex( val => !val ) == -1) 
                                        ? p.user_dap[drop_num].length 
                                        : p.user_dap[drop_num].findIndex( val => !val );

                    //console.log("ck_num : ", ck_num, p.user_dap[drop_num].length >= p.jung_dap[drop_num].length);
                    if(ck_num && ck_num >= p.jung_dap[drop_num].length && p.user_dap[drop_num].length >= p.jung_dap[drop_num].length) return false;

                    if(p.drag_type == "") $(p.drag_con).find(".drag").eq(drag_num-1).addClass("dispose3");
                    //p.user_dap[0] = [null,1,2,3,4]; //tester
                    


                    p.change_drop(drag_num, drop_num, ck_num);
                    p.user_dap[drop_num][ck_num] = drag_num;
                    p.sound_class.play('ting');
                }
            });
            $(this.drop_con).find(".drop").off().on("click", function() {
                const area_num = parseInt($(this).attr("data-area_num"), 10);
                //const ck_num = parseInt($(this).attr("data-num"), 10) - 1;
                const ck_num = $(this).index();
                $(this).find("img").removeClass("active");
                $(this).find("img").eq(0).addClass("active");

                //위치 중요 p.user_dap 보다 위에 있어야 함
                if(p.drag_type == "") {
                    //console.log(area_num, ck_num, p.user_dap[area_num][ck_num]-1)
                    const drag = $(p.drag_con).find(".drag").eq(p.user_dap[area_num][ck_num]-1);
                    drag.removeClass("dispose3");
                };

                //$(this).droppable("enable");
                p.user_dap[area_num][ck_num] = null;
                p.sound_class.play('ting');
            });

            //history_data = '["3","2","1","4"]';//테스트...
            if (history_data && history_data != 'null') {
                this.prev_data_quiz_end(history_data);
            }
        }
        change_drop(drag_num, group_num, ck_num){
            const drop_target = $(this.drop_area_boxs[group_num]).find(".drop").eq(ck_num);
            drop_target.find("img").removeClass("active");
            drop_target.find("img").eq(drag_num).addClass("active");
        }
        reset_sel(all_clear = true) {
            //console.log(this.user_dap)
            if (!all_clear) {    
                this.user_dap.forEach((_arr, i) => {
                    _arr.forEach((val, k) => {
                        const jung_dap_arr = this.jung_dap[i];
                        const is_ok_num = jung_dap_arr.findIndex( dap => val == parseInt(dap, 10) );
                        const drag_target = $(this.drag_con).find(".drag").eq(val-1);
                        const drop_target = $(this.drop_area_boxs[i]).find(".drop").eq(k);
                        if(is_ok_num == -1){//정답에 없으면
                            drag_target.removeClass("dispose3");//해당 드래그 객체 살려내고
                            drop_target.find("img").removeClass("active");//드랍칸 지우기
                            drop_target.find("img").eq(0).addClass("active");//빈칸 표시해주고
                            _arr[k] = null;//정답을 빈칸으로 값을 바꾸고
                        }else{//정답이면
                            drop_target.addClass("dispose");//드랍칸 남기고 사용 못하게 설정
                        }
                    });
                });

            } else {
                $(this.drag_con).find(".drag").removeClass("dispose3");
                $(this.drop_con).find(".drop").droppable("enable").removeClass("dispose");

            };
            //console.log("reset_sel-user_dap : ", this.user_dap)
        }
        into_drop(drag_num, drop_num) {
            const dropDom = $(this.drop_con).find(".drop").eq(drop_num);
            dropDom.addClass("disable");//드랍칸 비활성화

            const dragDom = $(this.drag_con).find(".drag").eq(drag_num - 1);
            const _clone = dragDom.clone();//드래그 하던 놈 복사
            dragDom.addClass("disable");//드래그한 곳 비활성화
            _clone.attr("style", "").removeClass("dispose").appendTo(dropDom);//드래그 하던 놈 드랍칸으로 삽입
        }


        prev_data_quiz_end(history_data) {
            this.user_dap = JSON.parse(history_data);

            this.user_dap.forEach((val, i) => {
                const num = parseInt(val, 10);
                this.into_drop(num, i);
            });
            /*
                드랍했을 때 일어나는 이벤트를 함수로 빼고 파라미터를 받아서
                지금 drop과 동일한 기능을 구현한 함수를 만들어놔야 추후 
                이전 답을 가지고 동일한 기능을 구현할 수 있음.
            */

            this.quiz_ok_check(true);
        }

        //부모클래스는 포함처리가 불가능해서 상속 받지 않고 별도 처리함.
        quiz_ok_check(is_prev_dap = false) {
            //빈 활동이 없는지 체크
            //console.log(this.user_dap)
            this.warning_message_try_name = 'retry_'+this.cur_try_num;
            let is_blank = false;
            this.jung_dap.forEach( (_arr , i) => {
                if(_arr.length != this.user_dap[i].length) is_blank = true;
                _arr.forEach( (val , k) => {
                    if(!this.user_dap[i][k]) is_blank = true;
                });
            });

            if(is_blank){   //빈 활동이 있으면 정지 및 경고창 제시
                this.alert_message.show('blank');
                this.sound_class.play('retry');
                return false;
            }

            

            const data_push = (is_true) => {
                /**
                 * 빈활동이 없으면 활동 데이터를 보낼 작업을 진행한다.
                 */

                const all_push_jung_dap_data = [];
                const all_push_user_dap_data = [];
                this.jung_dap.forEach((_arr, i) => {
                    const push_jung_dap_data = [];
                    const push_user_dap_data = [];
                    _arr.forEach((val, k) => {
                        const jdap_num = parseInt(val, 10) - 1;
                        const j_title = this.drag_btns[jdap_num].getAttribute("title");
                        const j_text = this.drag_btns[jdap_num].innerText.replace(/\n/ig, " ");
                        const st_jdap = (!j_title || j_title == "") ? j_text : j_title;
                        push_jung_dap_data.push(st_jdap);

                        const udap_num = this.user_dap[i][k] - 1;
                        const u_title = this.drag_btns[udap_num].getAttribute("title");
                        const u_text = this.drag_btns[udap_num].innerText.replace(/\n/ig, " ");
                        const st_udap = (!u_title || u_title == "") ? u_text : u_title;
                        push_user_dap_data.push(st_udap);
                    });

                    if(is_true){
                        push_jung_dap_data.sort();
                        push_user_dap_data.sort();
                    }
                    all_push_jung_dap_data.push(push_jung_dap_data);
                    all_push_user_dap_data.push(push_user_dap_data);
                });




                //저장할 데이터 보내기
                this.lms.request_content_data({
                    qnum: this.quiz_num,
                    index: 0,
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    type: this.quiz_kor_type,
                    jung_dap: all_push_jung_dap_data.toString(),
                    user_dap: all_push_user_dap_data.toString(),
                    score: (is_true) ? 100 : 0,
                    try_num: this.cur_try_num
                });

               
            };





            //빈 활동이 없으면 정오답 판별을 시작한다.
            this.jung_dap_st_arr = [];
            this.user_dap_st_arr = [];

            const parse_user_dap = this.deep_copy_daps()[0];
            const parse_jung_dap = this.deep_copy_daps()[1];

            const st_parse_user_dap = parse_user_dap.join("/").toString().replace(/\s/g, "");
            const st_parse_jung_dap = parse_jung_dap.join("/").toString().replace(/\s/g, "");
            
            //console.log(st_parse_user_dap , " ::: ",st_parse_jung_dap);
            
            if (st_parse_user_dap == st_parse_jung_dap) {
                if (!is_prev_dap) {
                    this.warning_message.warning_message_show('true');
                    this.sound_class.play('true')
                    if (this.quiz_type.toString().indexOf("check") != -1) {
                        this.quiz_wrap.classList.add("check");
                    } else {
                        this.quiz_wrap.classList.add("true");
                    };
                    data_push(true);
                };
                
                this.quiz_end(is_prev_dap);
                return;
            }

            data_push(false);
            if (this.cur_try_num >= this.limit_try_num) {                    
                if (!is_prev_dap) {
                    this.warning_message.warning_message_show(this.warning_message_try_name);
                    this.sound_class.play('false');
                    this.quiz_wrap.classList.add("false");
                }
                this.quiz_end(is_prev_dap);
                return;
            }


            this.warning_message.warning_message_show(this.warning_message_try_name);
            this.cur_try_num++            
            this.sound_class.play('retry');
            this.quiz_retry();

            //super.quiz_ok_check(is_prev_dap);//상속을 사용하지 않음!!!!!!
        }

        deep_copy_daps() {
            const sort_parse = (_arr) => {

                let parse_data = JSON.parse(JSON.stringify(_arr));
                if (!this.is_seq) {//순서대로 하지 않아도 정답일 때
                    var sortABS = function (a, b) { return parseInt(a) - parseInt(b); }
                    parse_data = parse_data.sort(sortABS);                    
                };
                return parse_data;
            }

            const user_dap = this.user_dap.map( _arr => sort_parse(_arr) );
            const jung_dap = this.jung_dap.map( _arr => sort_parse(_arr) );
            
            return [user_dap, jung_dap];
        }

        

        quiz_retry() {
            this.reset_sel(false);
            super.quiz_retry();
        }

        quiz_reset() {
            this.reset_sel();
            super.quiz_reset();
        }

        quiz_end(is_prev_dap = false) {
            //오답 표시 여부
            //정답 표시 여부
            //여기서 부터 작업
            //기획쪽과 어떻게 표시 할 것인지 확인 후 진행
            //console.log(this.user_dap, "---", this.jung_dap);
            
            this.user_dap.forEach((_arr, i) => {
                const remainder_user_dap = [];
                const remainder_jung_dap = [];
                this.user_dap[i].forEach(dap => remainder_user_dap.push(dap));
                this.jung_dap[i].forEach(dap => remainder_jung_dap.push(dap));

                _arr.forEach((val, k) => {
                    const jung_dap_arr = this.jung_dap[i];
                    const is_ok_num = jung_dap_arr.findIndex( dap => val == parseInt(dap, 10) );
                    const drop_target = $(this.drop_area_boxs[i]).find(".drop").eq(k);
                    drop_target.addClass("dispose");

                    if(is_ok_num == -1){//정답에 없으면
                        drop_target.addClass("false");
                        drop_target.find("img").removeClass("active");//드랍칸 지우기
                    }else{//정답이면
                        drop_target.addClass("true");
                        remainder_user_dap[k] = null;
                        remainder_jung_dap[is_ok_num] = null;
                    }
                });

                //console.log("remainder_user_dap : ", remainder_user_dap);
                //console.log("remainder_jung_dap : ", remainder_jung_dap);
                const insert_arr = [];//오답난 칸의 위치 배열
                remainder_user_dap.forEach( (val, k) => {
                    if(val) insert_arr.push(k);
                });


                //console.log("drop_area_",i , insert_arr)
                //남은 정답을 drop 빈칸에 넣어준다.
                let insert_num = 0;
                remainder_jung_dap.forEach( (val, k) => {                    
                    if(val){
                        const drop_target = $(this.drop_area_boxs[i]).find(".drop").eq(insert_arr[insert_num]);
                        drop_target.find("img").eq(val).addClass("active");
                        insert_num++;
                    }
                });
            });




            super.quiz_end(is_prev_dap);
        }
    }//학습 데이터 처리 ok!!!
    
    //사용 안하고 있음
    win.kbc_main.CHOICE_MOVE = class CHOICE_MOVE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.space = 1;
            this.move_speed = 0.5;
            this.click_btns = [];
            this.quiz_wrap.querySelectorAll('.move_btn').forEach(btn => this.click_btns.push(btn));
            this.click_btns.forEach((btn, i) => {
                btn.setAttribute("title", `선택 보기${i + 1} `);
                btn.addEventListener('click', async (e) => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const blank_target = this.target_check_blank;//빈칸 체크해서 리턴
                    if (blank_target == null) return;
                    this.sound_class.play('click');

                    const _btn = e.currentTarget;
                    const clone_btn = _btn.cloneNode(true);
                    this.quiz_wrap.appendChild(clone_btn);
                    blank_target._link = _btn;
                    _btn.classList.add('dispose');

                    await this.move_btn(clone_btn, _btn, blank_target);

                    clone_btn.parentNode.removeChild(clone_btn);

                    /**
                     * 2024-02-02
                     * 순차선택형 blank_box가 문장의 맨 앞일 때 첫글자 대문자 처리
                     */
                    if (blank_target.dataset.frist != "" && blank_target.dataset.frist) {
                        let text = _btn.innerHTML.toString();

                        const f_text = text.slice(0, 1).toUpperCase();
                        const s_text = text.slice(1);
                        text = f_text + s_text;

                        blank_target.innerHTML = text;
                    } else {
                        blank_target.innerHTML = _btn.innerHTML;
                    };
                    blank_target.classList.add('active');

                })
            });

            this.actives = [];
            this.quiz_wrap.querySelectorAll('.blank_box').forEach(btn => this.actives.push(btn));
            this.actives.forEach((btn, i) => {
                btn.setAttribute("title", `빈칸 보기${i + 1} `);
                btn._link = null;
                btn.prev_text = (btn.innerHTML != "") ? btn.innerHTML : "&nbsp;";
                if (btn.prev_text == "&nbsp;") btn.innerHTML = "&nbsp;";
                //console.log("btn.prev_text : ", btn.prev_text)
                btn.addEventListener('click', async (e) => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const _btn = e.currentTarget;
                    //console.dir(_btn)
                    if (_btn._link == null) return;
                    this.sound_class.play('ting');


                    const return_target = _btn._link;
                    _btn._link = null;
                    const clone_btn = _btn.cloneNode(true);
                    //const clone_btn = _btn.cloneNode(true);
                    this.quiz_wrap.appendChild(clone_btn);
                    _btn.innerHTML = btn.prev_text;
                    _btn.classList.remove('active');


                    await this.move_btn(clone_btn, _btn, return_target);

                    clone_btn.parentNode.removeChild(clone_btn);
                    return_target.classList.remove('dispose')
                })
            })

            if (history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        }

        get target_check_blank() {
            let ele = null;
            for (var i = 0; i < this.actives.length; i++) {
                if (!this.actives[i]._link) {
                    ele = this.actives[i];
                    return ele;
                }
            }
            return ele;
        };

        prev_data_quiz_end(history_data) {
            this.user_dap = JSON.parse(history_data);
            this.user_dap.forEach((value, i) => {
                const c_btn = this.click_btns[value - 1];
                const b_btn = this.actives[i];
                b_btn.classList.add("active");
                b_btn.link = c_btn;
                b_btn.innerHTML = c_btn.innerHTML;
            });

            this.actives.forEach(btn => btn.classList.add('dispose'));
            this.quiz_ok_check(true);
        }

        quiz_ok_check(is_prev_dap = false) {
            let isEnd = true;
            this.actives.forEach(btn => {
                if (!btn._link)
                    isEnd = false;
            });

            if (isEnd) this.user_dap = this.actives.map(btn => {
                return btn._link.dataset.ans;
            });


            //빈 활동이 없는지 체크
            if (this.quiz_blank_check()) return false;
            super.quiz_ok_check(is_prev_dap)
        }

        quiz_reset() {
            this.quiz_retry();
            super.quiz_reset();
        }

        quiz_retry() {
            this.actives.forEach(btn => {
                btn._link = null;
                btn.innerHTML = btn.prev_text;
                btn.classList.remove('active')
                btn.classList.remove('dispose')
            });

            this.click_btns.forEach(btn => {
                btn.classList.remove('dispose')
            });

            super.quiz_retry();
        }

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
            this.user_dap.forEach((value, i) => {
                const c_btn = this.click_btns[value - 1];
                const b_btn = this.actives[i];
                c_btn.classList.add("dispose");
                b_btn.classList.add("dispose");

                /**
                 * 2024-01-02 => 2024-02-02 업데이트 사항 있음
                 * 순차선택형 blank_box가 문장의 맨 앞일 때 첫글자 대문자 처리
                 */
                /* if(b_btn.dataset.frist != "" && b_btn.dataset.frist){
                    let text = b_btn.innerHTML.toString();
                    const f_text = text.slice(0, 1).toUpperCase();
                    const s_text = text.slice(1, -1);
                    text = f_text + s_text;
                    b_btn.innerHTML = text;
                } */
            });
        }

        move_btn(copy_btn, from, to, space, callback) {
            return new Promise((resolve, reject) => {
                copy_btn.classList.add('clone');

                const from_offset = from.getBoundingClientRect();
                const to_offset = to.getBoundingClientRect();
                const quiz_wrap_offset = this.quiz_wrap.getBoundingClientRect();

                copy_btn.style.left = from_offset.left - quiz_wrap_offset.left + 'px';
                copy_btn.style.top = from_offset.top - quiz_wrap_offset.top + 'px';
                copy_btn.style.zIndex = 1000000;

                const inv = setInterval(() => {
                    this.btns.check.classList.add('disabled')
                    let copy_btn_top = parseFloat(copy_btn.style.top);
                    let copy_btn_left = parseFloat(copy_btn.style.left);
                    const gab_top = to_offset.top - copy_btn_top - quiz_wrap_offset.top;
                    const gab_left = to_offset.left - copy_btn_left - quiz_wrap_offset.left;

                    copy_btn_top += gab_top * this.move_speed;
                    copy_btn_left += gab_left * this.move_speed;

                    copy_btn.style.left = copy_btn_left + 'px';
                    copy_btn.style.top = copy_btn_top + 'px';
                    if (Math.abs(gab_left) <= this.space && Math.abs(gab_top) <= this.space) {
                        this.btns.check.classList.remove('disabled');
                        clearInterval(inv);
                        resolve();
                    }
                }, 50)
            });


        }
    };//학습 데이터 처리 작업 필요!!!
    //학습도구 3차시 프로토
    win.kbc_main.STEP_CHECK_MOVE = class STEP_CHECK_MOVE extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        init(history_data) {
            this.steps = this.quiz_wrap.querySelectorAll('.step_con') || [];
            this.step_num = 0;
            this.space = 1;
            this.move_speed = 0.25;
            this.half_pos = null;
            this.next_step(0);
        }
        next_step(index){
            this.steps.forEach( tag => tag.classList.remove("active"));
            this.steps[index].classList.add("active");
            const step_con = this.steps[index];
            this.half_pos = step_con.dataset.is_pos || null;

            this.targets = step_con.querySelectorAll('.blank_box') || [];
            this.click_btns = [];
            step_con.querySelectorAll('.move_btn').forEach(btn => this.click_btns.push(btn));
            this.click_btns.forEach((btn, i) => {
                //btn.setAttribute("title", `선택 보기${i + 1} `);
                btn.addEventListener('click', async (e) => {
                    if (this.btn_lock.isLock()) return;

                    this.start_sound_stop();
                    const _target = this.target_check;//빈칸 체크해서 리턴
                    if (_target == null) return;
                    this.sound_class.play('click');

                    const _btn = e.currentTarget;
                    const clone_btn = _btn.cloneNode(true);
                    this.quiz_wrap.appendChild(clone_btn);
                    _btn.classList.add('dispose');
                    console.log(_target)
                    await this.move_btn(clone_btn, _btn, _target);

                    clone_btn.parentNode.removeChild(clone_btn);
                    _target.classList.add('active');
                    const num = this.step_num = this.step_num + 1;
                    ;(num < this.steps.length) ? this.next_step(num) : this.quiz_end();
                })
            });
        }
        get target_check() {
            console.log("this.step_num : ", this.step_num)
            const num = parseInt(this.jung_dap[this.step_num], 10) - 1;
            console.log("num : ", num)
            return this.targets[num];
        };

        quiz_ok_check(is_prev_dap = false) {}

        quiz_reset() {}

        quiz_retry() {}

        quiz_end(is_prev_dap = false) {
            super.quiz_end(is_prev_dap);
        }

        move_btn(copy_btn, from, to, space, callback) {
            return new Promise((resolve, reject) => {
                copy_btn.classList.add('clone');

                const from_offset = from.getBoundingClientRect();
                const to_offset = to.getBoundingClientRect();
                const quiz_wrap_offset = this.quiz_wrap.getBoundingClientRect();
                const half_width = to_offset.width/2;

                copy_btn.style.left = from_offset.left - quiz_wrap_offset.left + 'px';
                copy_btn.style.top = from_offset.top - quiz_wrap_offset.top + 'px';
                copy_btn.style.zIndex = 1000000;

                const inv = setInterval(() => {
                    this.btns.check.classList.add('disabled')
                    let copy_btn_top = parseFloat(copy_btn.style.top);
                    let copy_btn_left = parseFloat(copy_btn.style.left);
                    
                    let gab_top = 0;
                    let gab_left = 0;
                    if(!this.half_pos){
                        gab_top = to_offset.top - copy_btn_top - quiz_wrap_offset.top;
                        gab_left = to_offset.left - copy_btn_left - quiz_wrap_offset.left;
                    }else if(this.half_pos=="t_h"){
                        gab_top = to_offset.top - copy_btn_top - quiz_wrap_offset.top;
                        gab_left = to_offset.left - copy_btn_left + half_width - quiz_wrap_offset.left;
                    }
                    

                    copy_btn_top += gab_top * this.move_speed;
                    copy_btn_left += gab_left * this.move_speed;

                    //console.log(copy_btn_top , copy_btn_left)

                    copy_btn.style.left = copy_btn_left + 'px';
                    copy_btn.style.top = copy_btn_top + 'px';
                    if (Math.abs(gab_left) <= this.space && Math.abs(gab_top) <= this.space) {
                        this.btns.check.classList.remove('disabled');
                        clearInterval(inv);
                        resolve();
                    }
                }, 50)
            });


        }
    };//학습 데이터 처리 작업 필요!!!
    //금요일
})(window, jQuery, add_data_list);
//console.log("window.kbc_main : ", window.kbc_main)
