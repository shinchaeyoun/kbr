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
            'ox',
            'input'
        ],
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
            //const warning_message = p.warning_message = new p.warning_message(p.root_path, p.SND, main_wrap);
            const alert_message = p.alert_message = new p.alert_message(p.SND, main_wrap);

            

            p.page_info = await p.file_loader.json("./page.json");
            p.player_dom = await p.file_loader.txt("/kb/_COMMON_2024/player/kbc.player.html");



            p.isMobile = (p.mobile()) ? true : false;
            if (p.isMobile) main_wrap.classList.add("mob");
            p.isLocal = p.IS_LOCAL();
            p.btn_lock = p.BUTTON_LOCK();
            p.set_time = new p.SET_TIME();//
            p.guide = new p.GUIDE(p.btn_lock, p.SND);

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
            const _predata = predata || [];

            //JSON 로드 추가 해야함
            interval = setInterval(e => {
                if (sound.loaded) {//JSON 로드 상태 확인해야 함
                    clearInterval(interval);
                    p.settings = new p.SETTINGS(p, main_wrap, p.LMS, sound, p.isMobile, p.isLocal, p.local_storage, p.basic_volume, alert_message);
                    p.fullscreen = new p.FULLSCREEN(main_wrap, p.isLocal, sound, p.local_storage, alert_message);
                    p.LMS.add_sound(sound);

                    p.Main_class = new p.Main_class({
                        main_wrap: main_wrap,
                        history_data: _predata,
                        total_quiz_num: total_quiz_num,
                        sound_class: sound,
                        //warning_message: warning_message,
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
                    preloader.classList.add("display_scale");
                    //console.log(this);
                };                
            }, 100);
        },
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
                sound.pause();
                sound.removeEventListener("ended", sound.event.ended);
            }
            stop_all_sound() {
                Object.keys(this.sounds).forEach(name => {
                    let sound = this.sounds[name];
                    if (name != "bgm") {
                        try {
                            sound.isPalying = false;
                            this.isAudioPalying = false;
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
                if(is_check) {
                    this.isAudioPalying = true;
                };
                

                if (isSinglePlaying) this.stop_all_sound();
                if (sound.currentTime > 0) sound.currentTime = 0;
                sound.event.ended = (e) => {
                    sound.isPalying = sound.isPlayed = false;
                    if(is_check) {
                        this.isAudioPalying = false;
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
        },
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
                };

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
                this.main_wrap.appendChild(this.warning_message);

                this.init();
            }
            init() {
                this.phaser_init_width = this.option.phaser.width || 1280;
                this.phaser_init_height = this.option.phaser.height || 720;

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
            }


            phaser_preload() {
                const p = this;
                this.scene = p.phaser.scene.scenes[0];
                Object.keys(p.warning_type).forEach(function (k) {
                    p.scene.load.spritesheet(k, p.warning_type[k].img.path, { frameWidth: p.warning_type[k].img.width, frameHeight: p.warning_type[k].img.height })
                });

            }

            phaser_create() {
                const p = this;
                Object.keys(p.warning_type).forEach(function (k) {
                    p.warning_type[k].image = p.scene.add.sprite(p.warning_type[k].img.posx, p.warning_type[k].img.posy, k).setFrame(0).setOrigin(0, 0);
                    p.scene.anims.create({
                        key: k,
                        frames: p.scene.anims.generateFrameNumbers(k, { start: 0, end: 2 }),
                        frameRate: 6,
                        repeat: 0
                    });
                    p.warning_type[k].image.visible = false;
                });



                window.addEventListener("resize", () => this.phaser.scale.setZoom(1) );
                window.dispatchEvent(new Event("resize"));
                if (this.phaser.input.touch) {
                    this.phaser.input.touch.capture = false;
                }
            }

            phaser_update() { };



            warning_message_show(type) {
                //this.warning_message.setAttribute("data-type", type);
                //console.log(type)
                this._nowAni = this.warning_type[type].image;
                this._nowAni.visible = true;
                this._nowAni.anims.play(type, true);
                this._nowAni.once('animationcomplete', (anim, frame) => {
                    setTimeout(() => this.warning_message_hide(type), 2000);
                });
            }
            warning_message_hide() {
                //this.warning_message.removeAttribute('data-type');
                this._nowAni.visible = false;
            }
        },
        alert_message: class alert_message {
            constructor(sound_class , main_wrap) {
                this.main_wrap = main_wrap;
                this.message_wraps = {};
                this.datas = [
                    { id: 'network', text: `서버 통신 오류` },
                    { id: 'loading', text: `파일을 불러오는 중입니다.` },
                    { id: 'local', text: `로컬 테스트 버전에서는 <br> 사용이 제한 됩니다.` },
                    { id: 'author', text: `권한이 없습니다.` },
                    { id: 'recorde_author', text: `마이크 설치가 필요한 페이지입니다.` },
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
                this.main_wrap.appendChild(this.alert_message);
            }
            show(type) {
                this.alert_message.setAttribute("data-type", type);
                setTimeout(() => this.hide(), 2000);
            }
            hide() {
                this.alert_message.removeAttribute('data-type');
            }
        },
        mobile: function mobile() {
            const mobile = {}
            mobile.Andiroid = () => navigator.userAgent.match(/Android/i);
            mobile.BlackBerry = () => navigator.userAgent.match(/BlackBerry/i);
            mobile.Opera = () => navigator.userAgent.match(/Opera Mini/i);
            mobile.Windows = () => navigator.userAgent.match(/IEMobile/i);
            mobile.iOS = () => navigator.userAgent.match(/iPhone|iPad|iPod/i);
            return mobile.Andiroid() || mobile.BlackBerry() || mobile.Opera() || mobile.Windows() || mobile.iOS();
        },
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
                    //console.log("버튼 잠김 변수 처리")
                },
                release: function () {
                    btn_lock = false;
                    //console.log("버튼 풀림 변수 처리")
                }
            }
        },
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
                const target_tag = (target) ? target : _wrap.querySelector(".guide_1");
                if (!target_tag) return false;//타겟 설정이 안되어 있으면 가이드 재생 안돼게~

                const fingerPos = this.getAbsoluteCenterPosition(target_tag);
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
                const startObj = target_1_position[0];
                const endObj = target_1_position[1];
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

            
            hide() {
                this.guides.forEach( tag => tag.remove() );
            }
            fingerGuide(cls_name, posArr, config) {
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

            json() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, "application/json;charset=UTF-8", arg);
            }
            xml() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, "text/xml;charset=UTF-8", arg);
            }
            html() {
                var arg = this.converterArg.apply(null, arguments);
                return this.loader.call(this, "text/html;charset=UTF-8", arg);
            }
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
            }
        },
        LMS_CONNECT: class LMS_CONNECT {
            constructor(_this, is_local, local_storage, add_data, alert_message) {
                this.kbc_main = _this;
                this.datas = { cdn: "", _land_mark_list: {}, langs_list: [] }
                this.path = (is_local) ? win.playerChk : top.opener.playerChk;
                this.cdn = (is_local) ? "" : top.vdpath;
                this.t_num = 42;//이게 뭐지?
                this.is_act_lang = false;
                this.local_storage = local_storage;
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


                this.datas.conts_se_cd = this.path.conts_se_cd || 0; // 콘텐츠 학교 급 (1:초등, 2:중등)
                this.datas.conts_type = this.path.conts_type || 0; // 콘텐츠 타입 (1:한국어 교재, 2:익힘, 3:평가, 4:게임)
                this.datas.conts_step = this.path.conts_step || 0; // 콘텐츠 단계(1~4)
                this.datas.conts_unit = this.path.conts_unit || 0; // 콘텐츠 단원(1~8)
                this.datas.conts_ele = this.path.conts_ele || 0; // 콘텐츠 차시(1~11)

                this.datas.passYn_list = this.path.passYn_list;
                this.datas.is_module_pass = this.path.isCompleted;
                this.datas.isFirstConts = this.path.isFirstConts;

                let storage_lang = null;
                if (!this.local_storage.load("page", "trans_lang") || this.local_storage.load("page", "trans_lang") == "") {
                    storage_lang = null;
                    this.datas.trans_lang = this.path.getTransLang();
                } else {
                    storage_lang = this.local_storage.load("page", "trans_lang");
                    const is_lang_check = this.datas.langs_list.find( data => data.key == storage_lang);
                    this.datas.trans_lang = (is_lang_check) ? is_lang_check.key : this.path.getTransLang();
                }
                this.lang = this.datas.trans_lang;//수정중

                //console.log("lms-datas :", this.datas);
                //console.log("lms-path :", this.path)
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
                //데이터 전송처리는 this.btns.next click event에서 await로 처리하고 이쪽으로 넘어옮.
                this.path.wcontsComplete();//진도율 처리되면서 다음 모듈(페이지)로 이동됨.
            }
            page_prev_move(){
                this.path.preContent();//이전 모듈(페이지)로 이동됨.
            }


            //형성평가용으로 변경됨.
            async request_content_data(_arg, _evals) {
                
                return new Promise ( async (resolve, reject) => {                    
                    let _contsState = await this.path.contsState(
                        _arg.jimun,
                        _arg.jung_dap,
                        _arg.type,
                        _arg.user_dap,
                        _arg.score,
                        _arg.try_num,
                    );
                    let _questionSubmit = await this.path.questionSubmit(
                        _evals.choice_jung_dap,
                        _evals.input_jung_dap,
                        _evals.choice_user_dap,
                        _evals.input_user_dap,
                        _evals.eval_qnum,
                        _evals.jimun,
                        _evals.is_correct_yn,
                        _evals.eval_points,
                        _evals.is_input,
                        _evals.save_tag_st
                    );
                    
                    if(_contsState.result == 'success' && _questionSubmit.result == 'success'){
                        resolve(this.path.conts_question_answer_list);
                    }else{
                        resolve(false);
                    };
                });
            }

            async return_result_data(){
                return new Promise( async (resolve, reject) => {
                    const result_update_check = await this.path.getQuestionRslt();
                    if(result_update_check.result == 'success' && result_update_check.result == 'success'){
                        resolve(this.path.conts_question_answer_list);
                    }else{
                        resolve(false);
                    };
                });
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
                            <div><p data-icons="${this.img_path}icons_3.png">마이크 테스트</p></div>

                            <div id="mictest">
                                <button class="mic_test_btn btn" title="마이크 테스트창 열기"><img src="${this.img_path}mictest_start.png" alt=""></button>
                            </div>
                        </div>

                        <div class="li">
                            <div><p data-icons="${this.img_path}icons_4.png">다국어 선택</p></div>

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

                this.language_prev_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.langs_change("prev");
                });
                this.language_next_btn.addEventListener("click", e => {
                    this.sound_class.play("ting");
                    this.langs_change("next");
                });
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
                    //this.volume = 0;// 개발 중 너무 신경쓰여서 잠시 줄임.....
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
                this.rec_start_btn.classList.remove("active");
                this.rec_stop_btn.classList.remove("active");
                this.rec_listen_btn.classList.remove("active");
                this.rec_pause_btn.classList.remove("active");
            }
            //마이크 녹음 테스트
            startRecoding() {
                if (!this.mediaStream) {
                    this.alert_message.show("recorde_author");

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

                    this.stopRecorde();
                }, this.maxRecTime * 1000);
            };
            //마이크 녹음 정지
            stopRecorde() {
                this.setTimeFn = null;

                this.btn_remove();
                this.rec_listen_btn.classList.add("active");

                this.mediaRecorder.stop();
                this.mediaRecorder.addEventListener('stop', () => {
                    const blob = new Blob(this.recordeData, { type: "audio/mpeg-3" });
                    const audioURL = URL.createObjectURL(blob);
                    const audioElement = new Audio(audioURL);
                    this.recordeData.splice(0);

                    this.recorde_aud_wrap.innerHTML = "";
                    this.recorde_aud_wrap.appendChild(audioElement);
                    this.recorde_aud = this.recorde_aud_wrap.querySelector("audio");
                    this.recorde_aud.currentTime = 1e101;
                    this.recorde_aud.pause();
                    this.recorde_aud.addEventListener("ended", () => {
                        this.recstop_audio();
                    });
                    setTimeout(e => {
                        this.recorde_aud.currentTime = 0;
                    }, 50);
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

            draw() {
                // 파형 데이터 가져오기
                this.recorde_data.analyser.getByteTimeDomainData(this.recorde_data.audioDataArray);
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
                            this.alert_message.show("recorde_author");
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
                this.sound_class.sound_volume_change(this.datas.eff_volume);
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
        FULLSCREEN: class FULLSCREEN {
            constructor(main_wrap, isLocal ,sound, local_storage, alert_message) {
                this.isLocal = isLocal;
                this.sound_class = sound;
                this.alert_message = alert_message;
                this.local_storage = local_storage;
                this.isfullscreen = true;//나중에 옵션처리
                this.target_dom = parent.document.querySelector(".content_frm");

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
        Main_class: class Main_class {
            constructor(_args) {
                this.main_wrap = _args.main_wrap;
                this.history_data = _args.history_data;
                this.total_quiz_num = _args.total_quiz_num;
                this.sound_class = _args.sound_class;
                //this.warning_message = _args.warning_message;
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
                this.insertAfter = function (referenceNode, newNode) {
                    if (!!referenceNode.nextSibling) {
                        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                    } else {
                        referenceNode.parentNode.appendChild(newNode);
                    }
                };
                
                
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
                    };

                    let is_auto_play = quiz_wrap.dataset.is_auto_play || false;
                    is_auto_play = (is_auto_play == "true");
                    let load_snd_paths = (quiz_wrap.dataset.audsrc) ? quiz_wrap.dataset.audsrc.split("||") : [];
                    load_snd_paths.forEach( (st , k) => {
                        (k == 0) 
                            ? promsAll.push(this.sound_class.sound_load(`quiz_${i + 1}_KR_snd`, st, is_auto_play))
                            : promsAll.push(this.sound_class.sound_load(`quiz_${i + 1}_1_KR_snd`, st, is_auto_play));
                    });
                });

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

                        const lang_texts = [];
                        const question = quiz_wrap.querySelector(".question") || null;
                        const question_box = quiz_wrap.querySelector(".question_box") || null;
                        if (question) {
                            const p_tag = document.createElement("p");
                            p_tag.classList.add("lang_text");
                            p_tag.classList.add("question_lang_text");
                            question_box.appendChild(p_tag);
                            //this.insertAfter(question, p_tag)
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
                        const is_quiz_last = (this.total_quiz_num == i + 1) ? true : false;
                        quiz_end_OSV.observe(quiz_wrap, { attributes: true });
                        

                        if (!this.history_data[i]) this.is_prev_finish = false;
                        this.quizs.push(new kbc_main[quiz_type.toUpperCase()]({
                            quiz_wrap: quiz_wrap,
                            main_type: this.main_type,
                            history_data: this.history_data[i],
                            quiz_num: (i + 1),
                            is_quiz_first: !i,
                            is_quiz_last: is_quiz_last,
                            quiz_type: quiz_type,
                            quiz_next: quiz_next,
                            quiz_prev: quiz_prev,
                            sound_class: this.sound_class,
                            //warning_message: this.warning_message,
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
                        
                    });

                    this.common_btns = this.main_wrap.querySelector("#common_btns") || null;
                    if (!this.common_btns) {
                        this.common_btns = document.createElement("div");
                        this.common_btns.setAttribute("id", "common_btns");
                        const quiz = this.main_wrap.querySelector(".quiz");
                        this.main_wrap.insertBefore(this.common_btns, this.wraps_con);
                    };

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

                    if (this.tab_btns.length == 1) tabs.style.display = "none";
                    this.cur_quiz_num = this.history_data.findIndex(val => !val || val == 'null') + 1 || 1;


                });
            }
            hide_arg() {
                //console.log("캡쳐용 화면 조절");
                this.main_wrap.querySelector("#common_btns").style.opacity = 0;
                this.main_wrap.querySelector(".tab_con").style.opacity = 0;

                this.quizs.forEach((quiz, i) => {
                    if (quiz.quiz_wrap.querySelector(".navi_prev_btn")) quiz.quiz_wrap.querySelector(".navi_prev_btn").style.opacity = 0;
                    if (quiz.quiz_wrap.querySelector(".navi_next_btn")) quiz.quiz_wrap.querySelector(".navi_next_btn").style.opacity = 0;
                    if (quiz.quiz_wrap.querySelector(".btns_wrap")) quiz.quiz_wrap.querySelector(".btns_wrap").style.opacity = 0;
                    if (quiz.quiz_wrap.querySelector(".video_controls")) quiz.quiz_wrap.querySelector(".video_controls").style.opacity = 0;
                });
            }
            //다국어 언어활성화에 따른 음성 변경 재생
            lang_sound_play() {
                Object.keys(this.sound_class.sounds).forEach( snd_id => {
                    if(snd_id.indexOf("quiz") != -1) this.sound_class.sounds[snd_id].pause();
                });

                if (this.lms.is_act_lang) {
                    const snd_id = "quiz_" + this.cur_quiz_num + "_" + this.lms.lang + "_snd";
                    this.sound_class.play(snd_id);
                } else {
                    const snd_id = "quiz_" + this.cur_quiz_num + "_KR_snd";
                    this.sound_class.play(snd_id);
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
                
                //영상 및 음성 정지 및 초기화
                this.quizs.forEach(quiz => {
                    //음성 녹음 일때
                    if(quiz.list) quiz.list.forEach( recorde => recorde.stop_audio() );

                    //vod 일때
                    const videos = quiz.quiz_wrap.querySelectorAll("video");
                    if (videos.length) {
                        videos.forEach(video => {
                            video.pause()
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

                if(this.lms.datas.isFirstConts && this._cur_quiz_num == 1 || this.main_type == "intro") {
                    now_quiz.quiz_wrap.classList.add('is_quiz_first');
                }
                if (this.main_type == "not_langs") {
                    this.lang_active_wrap.classList.add("dispose3");
                    if(now_quiz.is_coerce){
                        this.lang_active_wrap.classList.remove("dispose3");
                    }
                };

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
                            this.alert_message.show("recorde_author");
                            resolve(false);
                        });
                })
            }
        },
        Class_manager: class Class_manager {
            constructor(_args) {
                this.quiz_wrap = _args.quiz_wrap;
                this.quiz_num = _args.quiz_num;
                this.page_type = _args.main_type;
                this.quiz_type = _args.quiz_type;
                this.is_quiz_first = _args.is_quiz_first; 
                this.is_quiz_last = _args.is_quiz_last;
                this.is_prev_dap = null;
                this.sound_class = _args.sound_class;
                this.lms = _args.lms;
                this.quiz_prev = _args.quiz_prev;
                this.quiz_next = _args.quiz_next;
                //this.warning_message = _args.warning_message;
                
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
                this.is_first_show = true;
                this.is_coerce = (!this.quiz_wrap.dataset.langs_show) ? false : (this.quiz_wrap.dataset.langs_show == "true");
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

                this.jung_dap_st_arr = [];//keris 데이터 전달용
                this.user_dap_st_arr = [];//keris 데이터 전달용
                this.is_multi = this.jung_dap.length >= 2;
                this.is_limit_check = this.quiz_wrap.dataset.limit_check != "false";
                this.is_text_click = this.quiz_wrap.dataset.istextclick || "false";
                this.btns = {};


                //기존 학습한 모듈에 대한 사용자 답 정보를 저장하기 위한 코드.... 
                //불러오는 부분은 개별 페이지에서 data-load_stroge_name='단계_유닛_차시_모듈_퀴즈번호' 로 만들어서 기입하면 is_prev_dap에 불러와 저장함
                const path_arr = win.location.pathname.split("/");
                path_arr.pop();
                const path_len = path_arr.length;
                //console.log("location.pathname : ", win.location.pathname);
                //console.log("path_arr : ", path_arr);
                //const sco_num = parseInt(path_arr.reverse()[0].split("_"), 10);
                //console.log("sco_num : ", sco_num)
                /* (this.isLocal) ? 
                    this.page_storage_name = path_arr[path_len-4].split("_")[1] + "_" + path_arr[path_len-3].split("_")[1] + "_" + parseInt(path_arr[path_len-2], 10) + "_" + parseInt(path_arr[path_len-1].split("_")[1], 10) + "_" + this.quiz_num : 
                    this.page_storage_name = this.lms.datas.conts_type + "_" + this.lms.datas.conts_unit + "_" + this.lms.datas.conts_ele + "_" + parseInt(path_arr[path_len-1].split("_")[1], 10)+ "_" + this.quiz_num; */
                

                //contents/step_3/unit_1/01 형태에서 /wb/lv03/ut01/ls01  형태로 변경되어 아래 코드로 변경함.(2024_09_10);
                (this.isLocal) ?
                    this.page_storage_name = parseInt(path_arr[path_len - 4].slice(-2), 10) + "_" + parseInt(path_arr[path_len - 3].slice(-2), 10) + "_" + parseInt(path_arr[path_len - 2].slice(-2), 10) + "_" + parseInt(path_arr[path_len - 1].split("_")[1], 10) + "_" + this.quiz_num :
                    this.page_storage_name = this.lms.datas.conts_type + "_" + this.lms.datas.conts_unit + "_" + this.lms.datas.conts_ele + "_" + parseInt(path_arr[path_len-1].split("_")[1], 10) + "_" + this.quiz_num;

                //console.log("page_storage_name : ", this.page_storage_name)
                this.page_stroge_load_name = (this.quiz_wrap.dataset.load_stroge_name && this.quiz_wrap.dataset.load_stroge_name != "") ? this.quiz_wrap.dataset.load_stroge_name : "";
                this.is_prev_dap = (this.page_stroge_load_name != "") ? this.local_storage.load("page", this.page_stroge_load_name) : null;
                if(this.is_prev_dap && this.is_prev_dap != "") this.is_prev_dap = this.is_prev_dap.split(",")



                this.quiz_kor_type = '';
                if (this.quiz_type == "choice") this.quiz_kor_type = "선택형";
                if (this.quiz_type == "input") this.quiz_kor_type = "타이핑";

                

                if(kbc_main.isMobile && this.quiz_type == "linetoline") this.guide_type = "db_click";

                this.cur_try_num = 1;
                this.limit_try_num = this.quiz_wrap.dataset.trynum ? parseInt(this.quiz_wrap.dataset.trynum, 10) : 3;

                this.feed_wrap = this.quiz_wrap.querySelector('.quiz_exp_wrap') || null;
                if(!this.feed_wrap){
                    const div = document.createElement("div");
                    div.classList.add("quiz_exp_wrap");
                    div.innerHTML = `<div class="quiz_exp_wrap_dap">
                                        <div class=""><span>정답</span></div>
                                        <div class="exp_dap_text"></div>
                                    </div>

                                    <div class="quiz_exp_wrap_exp">
                                        <div class=""><span>해설</span></div>
                                        <div class=""></div> 
                                    </div>`
                    ;
                    this.feed_wrap = div;
                    this.quiz_wrap.appendChild(div);
                }

                this.check_feed_wraps = this.quiz_wrap.querySelectorAll('.check_feed_wrap') || [];
                this.exp_dap_wrap = this.feed_wrap.querySelector('.quiz_exp_wrap_dap>div:nth-child(2)') || null;
                if(this.exp_dap_wrap){
                    const _html = this.jung_dap.reduce((acc, cur, i, arr) => {
                        let acc_text = null;
                        if(i==0){
                            acc_text = `${acc}<span>${cur}</span>`;
                        }else if(i && i < arr.length){
                            acc_text = `${acc}, <span>${cur}</span>`;
                        }
                        return acc_text;
                    }, "");
                    
                    this.exp_dap_wrap.innerHTML = _html;
                }

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
                        //console.log()
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
                            this.hint_show(btn.id);
                        });
                    });
                }
                
                this.pdf_down_btn = this.quiz_wrap.querySelector(".pdf_down_btn");
                if(this.pdf_down_btn){
                    this.pdf_down_btn.addEventListener("click" , e => {
                        this.sound_class.play("click");
                        const pdf_target = this.quiz_wrap.querySelector(".pdf_target") || this.quiz_wrap;
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
                                btn.classList.add("listen");
                                this.sound_class.play(btn.id, () => { btn.classList.remove("listen"); }, true);
                            });
                        };
                    });
                };

                this.btns_make();
            };

            btns_make() {
                const prev_btn = document.createElement('button');
                const next_btn = document.createElement('button');
                const btns_wrap = document.createElement('div');
                prev_btn.classList.add('navi_prev_btn');
                next_btn.classList.add('navi_next_btn');
                btns_wrap.classList.add('btns_wrap');
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
                (this.is_quiz_last) ? next_btn.setAttribute("title", "결과 보기") : next_btn.setAttribute("title", "다음 문제");


                this.btns.check = btns_wrap.querySelector(".confirm_btn");
                this.btns.reset = btns_wrap.querySelector(".reset_btn");
                this.btns.prev = this.quiz_wrap.querySelector(".navi_prev_btn");
                this.btns.next = this.quiz_wrap.querySelector(".navi_next_btn");
                //console.log(this.page_type == "outro" , this.is_quiz_last)
                if(this.page_type == "outro" && this.is_quiz_last){
                    this.btns.next.classList.add("result_btn");
                }
                if(this.page_type == "result"){
                    this.btns.next.classList.add("dispose3");
                }

                this.btns.check.addEventListener('click', () => {                    
                    this.quiz_ok_check();
                    this.sound_class.play('ting');
                });

                this.btns.reset.addEventListener('click', () => {
                    this.quiz_reset();
                    this.sound_class.play('ting');
                });

                this.btns.prev.addEventListener('click', () => {
                    if (this.is_quiz_first) {
                        this.lms.page_prev_move();
                    } else {
                        this.quiz_prev();
                    }
                    this.sound_class.play('ting');
                });
                this.btns.next.addEventListener('click', async () => {
                    this.sound_class.play('ting');
                    const cdata = await this.get_contents_datas();
                    //console.log("qqq1111111111111111111111111")
                    if (this.is_quiz_last) {
                        const is_data_connect = await this.lms.request_content_data(cdata[0],cdata[1]);
                        //console.log("is_data_connect : ", is_data_connect);
                        (is_data_connect) ? this.lms.page_finish() : this.alert_message.show('network');
                    } else {
                        const is_data_connect = await this.lms.request_content_data(cdata[0],cdata[1]);
                        //console.log("is_data_connect : ", is_data_connect);
                        (is_data_connect) ? this.quiz_next() : this.alert_message.show('network');
                    };
                });

                //this.test_init();
            }

            async test_init(){
                await this.set_time.out(1000);
                //console.log("test_init - call-return_data");
                const return_data = await this.lms.return_result_data();
                //console.log("return_data : ", return_data);
            }
            async get_contents_datas(){
                this.local_storage.save("pageType", this.page_storage_name, this.quiz_type);
                if(this.quiz_type != "result"){
                    //const value = JSON.stringify(this.quiz_wrap.innerHTML);
                    const value = this.quiz_wrap.innerHTML;
                    this.local_storage.save("pageWrap", this.page_storage_name, value);
                }


                const jst = this.jung_dap.join("||");
                const ust = this.user_dap.join("||");
                const info_arr = this.page_storage_name.split("_");
                //console.log("info_arr : ", info_arr, 'qnum : ', parseInt(info_arr[info_arr.length-2], 10))

                const contsState_data = {
                    qnum: this.quiz_num,
                    index: 0,
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    type: this.quiz_kor_type,
                    jung_dap: jst,
                    user_dap: ust,
                    score: (jst == ust) ? 100 : 0,
                    try_num: this.cur_try_num
                };
                //console.log("this.quiz_type : ", this.quiz_type)
                const questionSubmit_data = {
                    choice_jung_dap: (this.quiz_type=="choice") ? parseInt(jst, 10) : null,
                    input_jung_dap: (this.quiz_type=="choice") ? null : jst,
                    choice_user_dap: (this.quiz_type=="choice") ? parseInt(ust, 10) : null,
                    input_user_dap: (this.quiz_type=="choice") ? null : ust,
                    eval_qnum: parseInt(info_arr[info_arr.length-2], 10),
                    jimun: this.question.innerText.replace(/\n/ig, " "),
                    is_correct_yn: (jst == ust) ? "Y" : "N",
                    eval_points: (this.quiz_wrap.dataset.eval_point) ? parseInt(this.quiz_wrap.dataset.eval_point, 10) : "5",
                    is_input: (this.quiz_type=="choice") ? "N" : "Y",
                    save_tag_st: this.quiz_wrap.innerHTML
                };
                
                //console.log("contsState_data : ", contsState_data);
                //console.log("questionSubmit_data : ", questionSubmit_data);
                
                await this.set_time.out(50);
                return [contsState_data, questionSubmit_data];
            }

            quiz_blank_check() {
                //console.log(!this.user_dap, !this.user_dap.length, this.user_dap.length < this.jung_dap.length , this.user_dap, this.jung_dap)
                if (!this.user_dap || !this.user_dap.length || this.user_dap.length < this.jung_dap.length) {
                    this.alert_message.show('blank');
                    this.sound_class.play('retry');
                    return true;
                } else {
                    const isEmpty = this.user_dap.findIndex((el) => !el || el == "");
                    if (isEmpty != -1) {
                        this.alert_message.show('blank');
                        this.sound_class.play('retry');
                        return true;
                    }
                }

                return false;
            }
            quiz_ok_check(is_prev_dap) {
                //중복답 체크하기 최우선 순위 *** 띄어쓰기 맞아야 하는 판단조건입니다.
                //this.warning_message_try_name = 'retry_'+this.cur_try_num;
                /* this.user_dap = this.user_dap.map( (val, i) => {
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
                }); */
                //console.log("this.other_dap : ", this.other_dap);
                this.other_dap.forEach( (dap_arr, i) => {
                    if(dap_arr != null){///다른 답이 있을 경우에~                        
                        dap_arr.find( otDap => {
                            if(this.user_dap.indexOf(otDap) != -1){//다른 답과 사용자 답이 같은 것이 있으면.
                                this.jung_dap[i] = otDap;
                            };
                        });
                    };
                }); 


                //console.log(this.jung_dap, this.user_dap, this.other_dap)

                this.jung_dap_st_arr = [];
                this.user_dap_st_arr = [];
                const parse_user_dap = this.deep_copy_daps()[0];
                const parse_jung_dap = this.deep_copy_daps()[1];


                const st_parse_user_dap = parse_user_dap.toString()//.replace(/\s/g, "");
                const st_parse_jung_dap = parse_jung_dap.toString()//.replace(/\s/g, "");

                if (st_parse_user_dap == st_parse_jung_dap) {
                    if (!is_prev_dap) {
                        //this.warning_message.warning_message_show('true');
                        this.sound_class.play('true')
                        if (this.quiz_type.toString().indexOf("check") != -1) {
                            this.quiz_wrap.classList.add("check");
                        } else {
                            this.quiz_wrap.classList.add("true");
                            this.local_storage.save("pageOX", this.page_storage_name, "true");
                        };
                    };

                    this.quiz_end(is_prev_dap);
                    return;
                };
                this.local_storage.save("pageOX", this.page_storage_name, "false");



                if (this.cur_try_num >= this.limit_try_num) {                    
                    if (!is_prev_dap) {
                        //this.warning_message.warning_message_show(this.warning_message_try_name);
                        this.sound_class.play('false');
                        this.quiz_wrap.classList.add("false");
                    }
                    this.quiz_end(is_prev_dap);
                    return;
                }


                //this.warning_message.warning_message_show(this.warning_message_try_name);
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
                this.cur_try_num = 1;
                if (this.hints.length) this.hint_reset();
                this.quiz_wrap.classList.remove('finished');
                this.quiz_wrap.classList.remove("true");
                this.quiz_wrap.classList.remove("false");
                this.quiz_wrap.classList.remove("check");
                this.quiz_wrap.classList.remove("active");
            }

            quiz_end(is_prev_dap = false) {
                if(this.is_prev_dap){
                    this.is_prev_dap = is_prev_dap;
                }else{
                    this.is_prev_dap = this.user_dap;
                }
                this.quiz_wrap.classList.add('finished');
                this.sound_class.play('end');


                if (!is_prev_dap) {
                    const value = JSON.stringify(this.user_dap);
                    this.local_storage.save("page", this.page_storage_name, this.user_dap);
                    //this.local_storage.save("pageType", this.page_storage_name, this.quiz_type);
                };
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
                            this.is_first_show = false;
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
        }
    };


    win.kbc_main.CHOICE = class CHOICE extends win.kbc_main.Class_manager {
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
                })
            });


        }

        quiz_ok_check(is_prev_dap = false) {
            if (this.quiz_blank_check()) return false;
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
    };

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
                //console.log("input-quiz_retry : ",this.jung_dap[i] , input.value)
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
            //console.log(this.actives, this.user_dap)
            this.actives.forEach((input, i) => {
                
                const user = this.user_dap[i].toString();//.replace(/\s/g, "");
                const jung_dap = this.jung_dap[i].toString();//.replace(/\s/g, "");
                input.setAttribute('readonly', true);
                if (user == jung_dap) {
                    input.classList.add("true");
                } else {
                    input.classList.add("false");
                    //input.value = this.jung_dap[i].toString();//형성평가라서 안바꿔줘도 해설창에 보임.
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
            //console.log("quiz_ok_check : ", this.user_dap)
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
            };

            super.quiz_ok_check(is_prev_dap);
        }
    };

    win.kbc_main.RESULT = class RESULT extends win.kbc_main.Class_manager {
        constructor(_args) {
            super(_args);
            this.init(_args.history_data);
        }

        async init(history_data) {
            this.return_data = await this.lms.return_result_data();
            //console.log("this.return_data : ", this.return_data);

            let score = 0;
            let t_num = this.return_data.length;
            let ok_num = 0;

            this.result_pop = this.quiz_wrap.querySelector(".result_pop");
            this.pop_quizs = [];
            this.selection = this.quiz_wrap.querySelector(".selection");
            this.total_score_wrap = this.quiz_wrap.querySelector(".total_score .score");
            this.total_num_wrap = this.quiz_wrap.querySelector(".total_list_num .t_num");
            this.ok_num_wrap = this.quiz_wrap.querySelector(".total_list_num .ok_num");
            

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //// 로컬일 때~~~    ///////////////////////////////////////////////////////////////////////////////////////////////////
            if(this.isLocal) {
                t_num = (this.quiz_wrap.dataset.total) ? parseInt(this.quiz_wrap.dataset.total) : 20;

                for(let i=0; i<t_num; i++){
                    /**
                     *  결과보기 layer popup 생성
                     */
                    const name_arr = this.page_storage_name.split("_");
                    const load_stroge_name = `${name_arr[0]}_${name_arr[1]}_${name_arr[2]}_${i+1}_1`;
                    const load_wrap_data = this.local_storage.load("pageWrap", load_stroge_name);
                    const load_type_data = this.local_storage.load("pageType", load_stroge_name);
                    const load_dap_data = this.local_storage.load("page", load_stroge_name);
                    const load_isOX_data = this.local_storage.load("pageOX", load_stroge_name);

                    const add_result_pop_quiz = document.createElement("div");
                    add_result_pop_quiz.classList.add("quiz");
                    add_result_pop_quiz.classList.add("finished");
                    add_result_pop_quiz.classList.add((load_isOX_data == "true").toString());
                    add_result_pop_quiz.setAttribute("data-type", load_type_data);

                    add_result_pop_quiz.innerHTML = (load_wrap_data != "" && load_wrap_data != undefined && load_wrap_data != null) ? load_wrap_data : `<h1>저장된 로컬데이터가 없습니다.</h1>`;
                    this.result_pop.append(add_result_pop_quiz);/// 우선 퀴즈를 등록!!!!!!! 중요!!!!!!
                    this.pop_quizs.push(add_result_pop_quiz);


                    //주관식 일 때 입력한 답 다시 넣어주기!!!!
                    const quizs = this.result_pop.querySelectorAll(".quiz");
                    if(quizs[quizs.length-1].querySelector(".quiz_input")) {
                        quizs[quizs.length-1].querySelector(".quiz_input").value = (load_dap_data != "" && load_dap_data != undefined && load_dap_data != null) ? load_dap_data : "";
                    };

                    
                    /**
                     * omr 카드 생성
                     */
                    let add_tag = document.createElement("button");
                    add_tag.classList.add("omr");
                    add_tag.setAttribute("data-num", (i+1));

                    // 맞은 갯수 누적
                    if(load_isOX_data == "true") ok_num++; 
                    add_tag.classList.add((load_isOX_data == "true").toString());
    
                    let is_empty_dap = false;
                    add_tag.classList.add((load_type_data) ? load_type_data : "choice");
                    if(load_dap_data == "0" || load_dap_data == "" || !load_dap_data) is_empty_dap = true;
                    
                    
                    if(!is_empty_dap){
                        add_tag.innerHTML = 
                            `<h3>${i+1} 번</h3>
                            <p><span>${load_dap_data}</span></p>`
                        ;
                    }else{
                        add_tag.innerHTML = 
                            `<h3>${i+1} 번</h3>
                            <p></p>`
                        ;
                    };
    
                    add_tag.addEventListener("click" , e => {
                        const _btn = e.currentTarget || e.target;
                        this.sound_class.play('ting');
                        this.layer_pop_isopen(_btn.getAttribute("data-num"));
                    });
                    //add_tag.addEventListener
                    this.selection.append(add_tag);
                };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //// LMS 탑재되면~~~    ////////////////////////////////////////////////////////////////////////////////////////////////
            }else{
                this.return_data.forEach( (data, i) => {
                    if(i >= t_num){
                        return false;
                    }

                    /**
                     * omr 카드 생성
                     */
                    let add_tag = document.createElement("button");
                    add_tag.classList.add("omr");
                    add_tag.setAttribute("data-num", (i+1));
    
                    // 맞은 갯수 누적
                    if(data.contsAnswerCorrectYn == "Y") ok_num++; 
                    add_tag.classList.add((data.contsAnswerCorrectYn == "Y").toString());
    
                    let is_empty_dap = false;
                    let dap_st = "";
                    //console.log(i,"번 퀴즈 데이터 : ", data)
                    if(data.contsSubjectiveYn == "N"){// 객관식
                        add_tag.classList.add("choice");
                        dap_st = data.contsMyAnswerNumber;
                        if(dap_st == "0" || dap_st == "" || !dap_st) is_empty_dap = true;
                    }else{// 주관식
                        add_tag.classList.add("input");
                        dap_st = data.contsMyAnswerText;
                        if(dap_st == "" || !dap_st) is_empty_dap = true;
                    }
                    //console.log(i,"번 퀴즈 빈 상태 : ", is_empty_dap, (dap_st == "0" || dap_st == "" || !dap_st), (dap_st == "" || !dap_st))
                    if(!is_empty_dap){
                        add_tag.innerHTML = 
                            `<h3>문제 ${i+1}</h3>
                            <p><span>${dap_st}</span></p>`
                        ;
                    }else{
                        add_tag.innerHTML = 
                            `<h3>문제 ${i+1}</h3>
                            <p></p>`
                        ;
                    };
    
                    add_tag.addEventListener("click" , e => {
                        const _btn = e.currentTarget || e.target;
                        this.sound_class.play('ting');
                        this.layer_pop_isopen(_btn.getAttribute("data-num"));
                    });
                    //add_tag.addEventListener
                    this.selection.append(add_tag);

                    /**
                     *  결과보기 layer popup 생성
                     */
                    const add_result_pop_quiz = document.createElement("div");
                    add_result_pop_quiz.classList.add("quiz");
                    add_result_pop_quiz.classList.add("finished");
                    add_result_pop_quiz.classList.add((data.contsAnswerCorrectYn == "Y").toString());
                    add_result_pop_quiz.setAttribute("data-type", (data.contsSubjectiveYn == "N") ? "choice" : "input");
    
                    add_result_pop_quiz.innerHTML = data.contsQuestionResultPage;
                    
                    this.result_pop.append(add_result_pop_quiz);/// 우선 퀴즈를 등록!!!!!!! 중요!!!!!!
                    this.pop_quizs.push(add_result_pop_quiz);
                    
                    const quizs = this.result_pop.querySelectorAll(".quiz");
                    if(quizs[quizs.length-1].querySelector(".quiz_input")) 
                        quizs[quizs.length-1].querySelector(".quiz_input").value = data.contsMyAnswerText;
                   
                });
            };


            

            // 총점 처리
            score = ok_num / t_num * 100;
            this.total_score_wrap.innerHTML = (score.toString().length >= 4) ? Math.round(score) : score;

            //전체 문항 수 처리
            this.total_num_wrap.innerHTML = t_num;
            //맞은 갯수 처리
            this.ok_num_wrap.innerHTML = ok_num;


            this.result_pop.querySelector(".close").addEventListener("click" , e => {
                const _btn = e.currentTarget || e.target;
                this.sound_class.play('ting');
                this.layer_pop_isopen();
            });
        }

        layer_pop_isopen(index = 0){
            if(!index){
                this.result_pop.classList.remove("active");
                this.pop_quizs.forEach( tag => tag.classList.remove("active") );
                return false;
            }

            this.result_pop.classList.add("active");
            this.pop_quizs.forEach( (tag, i) => {
                if(index == (i+1)) tag.classList.add("active");
            });
        }

    };

})(window, jQuery, add_data_list);
