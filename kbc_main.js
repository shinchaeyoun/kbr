(function(win){    
    win.kbc_main = {
        sound_path : '../../../_common_kbc/mp3/',
        school:"",
        subject:"",
        isMobile:false, 
        basic_volume:0.5,
        cuttom_cls_name:"",
        quiz_list:[
            'choice',
            'choice_move',
            'ox',
            'input',
            'linetoline',
            'recode',
            'listen',
            'listen_speak',
            'listen_repeat',
            'listen_repeat_type_2'
        ],//ok
        page_init : async function (predata){
            const p = kbc_main;
            const flie_name = location.href.split("/").reverse()[0];
            const preloader = document.body.querySelector('.pre_con');
            const main_wrap = document.querySelector('.main');
            const total_quiz_num = document.querySelectorAll(".quiz").length;
            
            let school = p.school = (flie_name.indexOf("ms")) ? "ms" : "hs";
            let subject = p.subject = flie_name.split("Plus")[1].substring(0, 3);

            const sound = p.SND = new p.Sound_control(p.sound_path);
            const warning_message = p.warning_message = new p.warning_message();
            
            const post_message_resize = p.post_message.send.ifr_resize;
            p.resizer = new p.Resize_obs_class(post_message_resize);
            p.resizer.add_dom(main_wrap);
            

            p.isMobile = (p.mobile()) ? true : false;
            if(p.isMobile) main_wrap.classList.add("mob");
            
            window.addEventListener("message", function(e){
                const type = e.data.type;
                const predata = e.data.value;
                //console.log("predata : ", predata);

                let interval = null;
                clearInterval(interval);
                if(type == "load"){
                    interval = setInterval( e => {
                        if(sound.loaded){
                            clearInterval(interval);
                            p.Main_class = new p.Main_class(main_wrap, predata, school, subject, total_quiz_num, sound, warning_message, p.post_message.send);
                            main_wrap.classList.add('active');
                            preloader.classList.add("dis");    
                        }
                    }, 100);
                }
            }, false);

            p.post_message.send.load(total_quiz_num);
        },//ok
        Sound_control : class Sound_control{
            constructor(sound_path){
                this.isAllLoaded = false;
                this.sounds = {};
                const snds = [
                    {id:'click',path:sound_path+"click.mp3"},
                    {id:'ting',path:sound_path+"ting.mp3"},                    
                    {id:'retry',path:sound_path+"retry.mp3"},
                    {id:'true',path:sound_path+"true.mp3"},
                    {id:'false',path:sound_path+"false.mp3"},
                    {id:'end',path:sound_path+"end.mp3"},
                ]

                const promsAll = [];
                snds.forEach( s => promsAll.push( this.sound_load(s.id, s.path) ));
                Promise.all(promsAll).then(()=>{
                    this.isAllLoaded = true;
                })
            };
            
            sound_load(id, path){
                return new Promise((resolve,reject)=>{
                    let sound = null;
                    sound = new Audio();
                    sound.src = path;
                    sound.isPlayed = sound.isPalying = false;
                    sound.volume = kbc_main.basic_volume || 1.0;
                    sound.event = {}
                    sound.event.loadedmetadata = (e) => resolve();
                    sound.addEventListener("loadedmetadata",sound.event.loadedmetadata);
                    sound.load();

                    this.sounds[id] = sound;
                });                     
            };

            stop_all_sound(){
                Object.keys(this.sounds).forEach( name => {
                    let sound = this.sounds[name];
                    try{
                        sound.isPalying = false;
                        sound.pause();
                    }catch(e){}
                });
            };

            play(id, callback, isSinglePlaying = false){
                let sound = this.sounds[id] || null;
                if(sound == null) throw new Error(id +" not sound.");  
                    
                if(isSinglePlaying) this.stop_all_sound();
                if(sound.currentTime > 0) sound.currentTime = 0;
                sound.event.ended = (e) => {
                    sound.isPalying = sound.isPlayed = false;
                    if(callback) callback(e);
                    sound.removeEventListener("ended", sound.event.ended);
                };
                sound.addEventListener("ended", sound.event.ended);

                sound.isPalying = true;
                return sound.play();
            }
            get loaded(){
                return this.isAllLoaded;
            }
        },//ok
        warning_message : class warning_message{
            constructor(){
                this.message_wraps = {};
                this.datas = [
                    { id:'blank', text:'완료하지 않은<br>학습이 있습니다.' },
                    { id:'check', text:'문항을<br>완료하셨습니다.' },
                    { id:'true', text:'정답입니다.' },
                    { id:'false', text:'오답입니다.' },
                    { id:'retry', text:'정답이 아닙니다.<br>다시 생각해<br>보세요.' }
                ];
                this.warning_message = document.createElement('div');
                this.warning_message.classList.add('warning_message');

                this.warning_message_wrap = document.createElement('div');
                this.warning_message_wrap.classList.add('warning_message_wrap');
                this.datas.forEach(v=>{
                    const text_wrap = document.createElement("div");
                    text_wrap.innerHTML = v.text;
                    text_wrap.classList.add('warning_message_text');
                    text_wrap.classList.add('warning_message_'+v.id);
                    this.message_wraps[v.id] = text_wrap;
                    this.warning_message_wrap.appendChild(text_wrap);
                });
                this.warning_message.appendChild(this.warning_message_wrap);


                document.body.appendChild(this.warning_message);
                if(kbc_main.subject == "eng") this.scale_set();
            }
            scale_set(){
                var mw = this.warning_message.clientWidth;
                var limitX = Math.min(1,mw/983);
                limitX = Math.max(0.7, limitX);
                this.warning_message_wrap.style.transform = 'scale('+limitX+')';
                const divs = this.warning_message_wrap.querySelectorAll("div");
                divs.forEach( wrap => {
                    wrap.style.transform = 'scale('+limitX+')';
                });
            }
            warning_message_show(type){
                if(kbc_main.subject == "eng") this.scale_set();
                this.warning_message.setAttribute("data-type", type);
                setTimeout(()=> this.warning_message_hide() , 1500);
            }
            warning_message_hide(){
                this.warning_message.removeAttribute('data-type');
                if(kbc_main.subject == "eng") this.scale_set()
            }
        },//ok
        mobile : function mobile(){
            const mobile={}
            mobile.Andiroid = ()=>navigator.userAgent.match(/Android/i);            
            mobile.BlackBerry = ()=>navigator.userAgent.match(/BlackBerry/i);
            mobile.Opera = ()=>navigator.userAgent.match(/Opera Mini/i);
            mobile.Windows = ()=>navigator.userAgent.match(/IEMobile/i); 
            mobile.iOS = ()=>navigator.userAgent.match(/iPhone|iPad|iPod/i);
            return mobile.Andiroid() || mobile.BlackBerry() || mobile.Opera() || mobile.Windows()|| mobile.iOS();
        },//ok
        post_message : {
            send:{
                load(tp=1){ 
                    window.parent.postMessage({id:"load",type:"load",tp},'*');
                },
                save({value,np=1}){ 
                    window.parent.postMessage({id:"save",type:"save",np,value},'*');
                },
                ifr_resize(value){
                    window.parent.postMessage({type:"resize",value},'*')
                }
            }
        },//ok
        Recode_manager : class Recode_manager{
            constructor(dom, stream, sound_class, id, disposeAll, ableAll){
                this.mediaStream = stream || null;
                this.mediaRecorder = null;
                this.isBrowser = null;
                this.isState = "stop";
                this.maxRecTime = 20;
                this.isAble = false;
                this.recordeData = [];
                this.wrap = dom;
                this.index = this.wrap.dataset.num;
                this.recordeInterval = null;
                this.sound_class = sound_class;
                this.id = id;
                this.disposeAll = disposeAll;
                this.ableAll = ableAll;
                this.setTimeFn = null;

                if(!this.mediaStream){
                    this.wrap.setAttribute("isnotstream", "true");
                }
                
                this.bar = this.wrap.querySelector(".bar");
                this.redcorde_aud_wrap = this.wrap.querySelector(".redcorde_aud_wrap");
                this.audio = dom.querySelector("audio");
                this.audio.addEventListener("ended", e => {
                    this.stop_audio();
                });

                this.btnSet();
                this.isBrowser = this.checkBrowser();
                if(this.isBrowser){
                    //this.requestAccess()
                }else{
                    console.log("녹음기능을 지원하지 않는 브라우저입니다.")
                }
            };

            checkBrowser(){
                var userAgent = navigator.userAgent.toLowerCase();
                if(userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1){
                    return 'safari';
                }else if(userAgent.indexOf('chrome') > -1){
                    return 'chrome';
                }else if(userAgent.indexOf('firefox') > -1){
                    return 'firefox';
                }else if(userAgent.indexOf('opera') > -1){
                    return 'opera';
                }else{
                    console.log("userAgent : ",userAgent)
                    return false;
                }
            };

            btnSet(){
                this.btns = {}
                this.btns.listen = this.wrap.querySelector(".listen_btn");
                this.btns.recorde_start = this.wrap.querySelector(".record_btn");
                this.btns.repeat_start = this.wrap.querySelector(".repeat_btn");
                this.btns.repeat_stop = this.wrap.querySelector(".pause_btn");

                //addEventListener
                this.btns.listen.addEventListener("click", () => {
                    this.sound_class.play("click");
                    if(this.isState != "stop"){
                        this.stop_audio();
                        return;
                    }
                    this.play_audio();
                    
                });
                this.btns.recorde_start.addEventListener("click", () => {
                    //녹음하기
                    console.log("녹음하기 : ", this.isState)
                    this.sound_class.play("click");
                    if(this.isState != "stop") {
                        
                        this.stopRecorde();
                        return;
                    };

                    this.startRecoding()
                });
                this.btns.repeat_start.addEventListener("click", () => {
                    //녹음듣기
                    console.log("p.redcorde_aud : ", this.redcorde_aud);
                    this.sound_class.play("click");
                    if(this.isState != "stop") return;
                    //kbc_main.disposeAll(p.index);
                    this.recPlayAudio()
                });
                this.btns.repeat_stop.addEventListener("click", () => {
                    //녹음듣기 중단
                    this.sound_class.play("click");
                    this.recstop_audio();
                });
            };

            play_audio(){
                this.isState = "playing";
                this.audio.play();
                this.wrap.classList.add("listen");
                this.progress = this.audio.duration - 0.2;
                
                this.disposeAll(this.id);
            };

            stop_audio(){
                this.isState = "stop";
                this.progress = this.audio.currentTime = 0;
                this.audio.pause();                
                this.wrap.classList.remove("listen");
                this.ableAll();
            };

            startRecoding(){
                if(!this.mediaStream) {
                    alert("마이크 권한 승인이 필요합니다.")
                    return false;
                }
                this.mediaRecorder = new MediaRecorder(this.mediaStream);
                this.mediaRecorder.addEventListener('dataavailable', event => {
                    this.recordeData.push(event.data);
                });
                
                this.progress = this.maxRecTime;
                this.mediaRecorder.start();
                this.isState = "recording";
                this.wrap.classList.add('record');
                this.wrap.setAttribute('isrecord', "false");
                this.disposeAll(this.id);
                
                if(this.setTimeFn) this.setTimeFn = null;
                this.setTimeFn = setTimeout( e => {
                    console.log(this)
                    this.stopRecorde();
                }, this.maxRecTime*1000);
            };

            stopRecorde(){
                this.setTimeFn = null;
                console.log("stopRecorde()-call");
                this.isState = "stop";
                this.progress = 0;
                this.btns.recorde_start.classList.add('check');
                this.ableAll();
                this.mediaRecorder.stop();
                this.mediaRecorder.addEventListener('stop', () => {
                    const blob = new Blob(this.recordeData, {type : "audio/mp3"});
                    const audioURL = URL.createObjectURL(blob);
                    const audioElement = new Audio(audioURL);
                    //audioElement.controls = true;
                    this.recordeData.splice(0);
                    this.redcorde_aud_wrap.innerHTML = "";
                    this.redcorde_aud_wrap.appendChild(audioElement);
                    this.redcorde_aud = this.redcorde_aud_wrap.querySelector("audio");
                    this.redcorde_aud.currentTime = 1e101;
                    this.redcorde_aud.addEventListener("ended", () => {
                        this.recstop_audio();
                    });
                    setTimeout( e => {
                        this.redcorde_aud.currentTime = 0;
                    },50)
                    
                    this.wrap.classList.remove('record');
                    this.wrap.setAttribute('isrecord', "true");                    
                });
            };

            recPlayAudio(){
                this.isState = "playing";

                this.wrap.classList.add('recPlay');
                this.redcorde_aud.play();
                this.disposeAll(this.id);
                
                this.progress = this.redcorde_aud.duration - 0.2;
            };

            recstop_audio(){
                this.isState = "stop";
                this.progress = this.redcorde_aud.currentTime = 0;
                this.redcorde_aud.pause();
                this.wrap.classList.remove("recPlay");
                this.ableAll();
            };


            
            set progress(np){
                this.bar.style.transitionDuration = np+"s";
            }
        },//ok
        Listen_manager : class Listen_manager{
            constructor(dom, sound_class, id, disposeAll, ableAll){
                this.isState = "stop";
                this.wrap = dom;
                this.index = this.wrap.dataset.num;
                this.sound_class = sound_class;
                this.id = id;
                this.disposeAll = disposeAll;
                this.ableAll = ableAll;
                                
                this.bar = this.wrap.querySelector(".bar");
                this.audio = dom.querySelector("audio");
                this.audio.addEventListener("ended", e => {
                    this.stop_audio();
                });

                this.btns = {}
                this.btns.listen = this.wrap.querySelector(".listen_btn");

                //addEventListener
                this.btns.listen.addEventListener("click", () => {
                    this.sound_class.play("click");
                    if(this.isState != "stop"){
                        this.stop_audio();
                        return;
                    }
                    this.play_audio();
                    
                });  
            };

            play_audio(){
                this.isState = "playing";
                this.audio.play();
                this.wrap.classList.add("listen");
                this.wrap.setAttribute('isplayed', "true");
                this.progress = this.audio.duration - 0.2;
                
                this.disposeAll(this.id);
            };

            stop_audio(){
                this.isState = "stop";
                this.progress = this.audio.currentTime = 0;
                this.audio.pause();                
                this.wrap.classList.remove("listen");
                this.ableAll();
            };


            
            set progress(np){
                this.bar.style.transitionDuration = np+"s";
            }
        },//ok
        Resize_obs_class : class Resize_obs_class {
            constructor(recive_resize){
                this.resize_send = recive_resize;
                this.resize_observer = new ResizeObserver(this.resize.bind(this));
                this.check_dom = [];                
                this.init_h = 500;                
                this.resize_send(this.init_h);
            }

            add_dom(dom){
                //console.log(dom)
                this.resize_observer.observe(dom);
                this.check_dom.push(dom);
            }

            resize(){
                let bigger_h = this.init_h;
                this.check_dom.forEach(dom => {
                    bigger_h = Math.max(dom.getBoundingClientRect().height, bigger_h);
                });
                this.resize_send(bigger_h + 50);
            }
        },//ok
        Main_class : class Main_class{
            constructor(main_wrap, history_data, school, subject, total_quiz_num, sound_class, warning_message, send){
                this.main_wrap = main_wrap;
                this.history_data = history_data;
                this.school = school;
                this.subject = subject;                
                this.total_quiz_num = total_quiz_num;
                this.sound_class = sound_class;
                this.warning_message = warning_message;                
                this.send = send;
                this.quiz_wraps = main_wrap.querySelectorAll('.quiz') || [];
                this.quizs = [];
                this.tab_btns = [];
                this.is_prev_finish = true;
                this.is_frist = true;

                const quiz_end_OSV = new MutationObserver(this.quiz_all_finish_check.bind(this))
                let tabs = main_wrap.querySelector(".tab_con");
                if(!tabs){
                    tabs = document.createElement("div");
                    tabs.classList.add("tab_con");
                    main_wrap.insertBefore(tabs, main_wrap.querySelector('.quiz'));
                };

                this.quiz_wraps.forEach((quiz_wrap , i)=>{
                    const _st = "Q"+(i+1);
                    const tab_button = document.createElement('button');
                    tab_button.classList.add('tabs_btn');
                    tab_button.innerHTML = _st;
                    tab_button.title = "Quiz"+(i+1)+"이동";
                    tab_button.quiz_num = (i+1);
                    
                    tab_button.addEventListener('click', e => {
                        this.cur_quiz_num = e.currentTarget.quiz_num;
                        this.sound_class.play('click');
                    })
                    tabs.appendChild(tab_button);
                    this.tab_btns.push(tab_button);

                    let quiz_type = quiz_wrap.dataset.type;
                    let check_cls = false;
                    kbc_main.quiz_list.forEach(_st =>{
                        if(_st == quiz_type) check_cls = true;
                        if(_st == kbc_main.cuttom_cls_name) check_cls = true;
                    });

                    if(!check_cls) {
                        throw new Error(quiz_type + ": Quiz Type is not find.");
                    }else{
                        const quiz_next = this.quiz_next.bind(this);
                        const outcome_show = this.outcome_show.bind(this);
                        const is_quiz_last = (this.total_quiz_num == i+1) ? true : false;
                        const outcome_wrap = document.body.querySelector('.outcome');
                        quiz_end_OSV.observe(quiz_wrap, {attributes:true});
                        console.log("history_data[i] : ", history_data[i])
                        if(!history_data[i]) this.is_prev_finish = false;
                        this.quizs.push(new kbc_main[quiz_type.toUpperCase()](quiz_wrap, history_data[i], (i+1), is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, this.sound_class, this.warning_message, send));
                    };                    
                });
                if(this.tab_btns.length == 1) tabs.style.display = "none";
                this.cur_quiz_num = this.history_data.findIndex( val => !val || val == 'null' ) + 1 || 1;
               
                const outcome_wrap = document.body.querySelector('.outcome');
                const reset_all = this.reset_all.bind(this);

                this.outcome_con = new kbc_main.Outcome(outcome_wrap, school, subject, this.quizs, this.sound_class, reset_all);
                kbc_main.resizer.add_dom(this.outcome_con.wrap.con);
            }

            set cur_quiz_num(np){
                this._cur_quiz_num = np;

                this.quizs.forEach(quiz => {
                    if(quiz.stop_audio) quiz.stop_audio();
                    quiz.quiz_hide();
                });
                this.quizs[this._cur_quiz_num-1].quiz_show();

                this.tab_btns.forEach(tab=>{
                    tab.classList.remove('active');
                    if(this._cur_quiz_num == tab.quiz_num){
                        tab.classList.add('active');
                    };
                })
            }

            get cur_quiz_num(){
                return this._cur_quiz_num;
            }


            quiz_all_finish_check(){
                let finish_num = 0;
                let is_prev_dap_check = true;
                this.quizs.forEach( (quiz, i) => {
                    const tab = this.tab_btns[i];
                    tab.classList.remove('tabs_btn_checked');
                    tab.classList.remove('tabs_btn_true');
                    tab.classList.remove('tabs_btn_false');
                    if(tab && quiz.outcome != null) tab.classList.add('tabs_btn_'+quiz.outcome);

                    this.outcome_con.set_my_dap(quiz);
                    if(quiz.outcome != null) {
                        finish_num++;
                    }

                    if(is_prev_dap_check){
                        is_prev_dap_check = quiz.is_prev_dap;
                    };
                });


                if(finish_num >= this.quizs.length){
                    this.main_wrap.classList.add('finished');
                    if(is_prev_dap_check && this.is_frist) {
                        this.outcome_con.show();
                        this.is_frist = false;
                    }
                }else{
                    this.main_wrap.classList.remove('finished');
                };                
            }

            quiz_next(){
                this.cur_quiz_num++;
            }

            outcome_show(){
                const isEnds = this.quizs.filter( quiz => quiz.outcome == null );
                if(isEnds.length == 0){
                    this.outcome_con.show();
                    return true;    
                }
                return false;
            }

            reset_all(){
                this.quizs.forEach( quiz => {
                    if(quiz.reset_sel) quiz.reset_sel();
                    quiz.quiz_reset();                    
                });
                this.cur_quiz_num = 1;
            }            
        },//ok
        Class_manager : class Class_manager{
            constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
                this.quiz_wrap = quiz_wrap;
                this.quiz_num = quiz_num;
                this.quiz_type = quiz_type;
                this.outcome_wrap = outcome_wrap;

                this.sound_class = sound_class;
                this.send = send;
                this.outcome_show = outcome_show;
                this.quiz_next = quiz_next;
                this.warning_message = warning_message;
                this.outcome = null;
                this.user_dap = null;
                
                this.jung_dap = this.quiz_wrap.dataset.jung_dap.split(',');
                this.is_multi = this.jung_dap.length >= 2;
                this.is_limit_check = this.quiz_wrap.dataset.limit_check != "false";
                this.is_text_click = this.quiz_wrap.dataset.istextclick || "false";
                this.btns = {};
                
                this.cur_try_num = 1;
                this.limit_try_num = this.quiz_wrap.dataset.trynum ? parseInt(this.quiz_wrap.dataset.trynum, 10) : 2;
                
                this.outcome_mydap_type = this.quiz_wrap.dataset.outcome_mydap_type || '';
                this.feed_wrap = this.quiz_wrap.querySelector('.quiz_exp_wrap');
                
                this.is_seq = this.quiz_wrap.dataset.is_seq ? this.quiz_wrap.dataset.is_seq == 'true' : false;
                this.hint = this.quiz_wrap.querySelector('.quiz_hint') || null;
                if(is_quiz_last) this.quiz_wrap.classList.add('is_quiz_last');

                this.btns_make();
            }   

            btns_make(){
                const btns_warp = document.createElement('div');
                btns_warp.classList.add('btns_wrap');
                this.quiz_wrap.appendChild(btns_warp);

                const retryBtnName = (this.quiz_type == "listen" || this.quiz_type == "recode" || this.quiz_type == "listen_speak" || this.quiz_type == "listen_repeat") ? "다시 하기" :  "다시 풀기";
                const confirmBtnName = (this.quiz_type == "listen" || this.quiz_type == "recode" || this.quiz_type == "listen_speak" || this.quiz_type == "listen_repeat") ? "확인" :  "정답 확인";
                btns_warp.innerHTML =`
                    <button class="qbtn confirm_btn" title="${confirmBtnName}"><span>${confirmBtnName}</span></button>
                    <button class="qbtn reset_btn" title="${retryBtnName}"><span>${retryBtnName}</span></button>
                    <button class="qbtn next_btn" title="다음 문제"><span>다음 문제</span></button>
                    <button class="qbtn outcome_btn" title="결과 보기"><span>결과 보기</span></button>
                `;

                this.btns.check = btns_warp.querySelector(".confirm_btn");
                this.btns.reset = btns_warp.querySelector(".reset_btn");
                this.btns.next = btns_warp.querySelector(".next_btn");
                this.btns.outcome = btns_warp.querySelector(".outcome_btn");

                this.btns.check.addEventListener('click',()=>{
                    this.quiz_ok_check();
                    this.sound_class.play('ting');
                });

                this.btns.reset.addEventListener('click',()=>{
                    this.quiz_reset();
                    this.sound_class.play('ting');
                });

                this.btns.next.addEventListener('click',()=>{
                    this.quiz_next();
                    this.sound_class.play('ting');
                }); 

                this.btns.outcome.addEventListener('click',()=>{
                    if(this.outcome_show()){
                        this.sound_class.play('end');
                    }else{
                        this.warning_message.warning_message_show('blank');
                        this.sound_class.play('retry');
                    } 
                }); 
            }

            quiz_ok_check(is_prev_dap=false){
                if(!is_prev_dap){
                    if(this.user_dap == null || this.user_dap.length==0  || this.user_dap.length != this.jung_dap.length){
                        this.warning_message.warning_message_show('blank');
                        this.sound_class.play('retry');
                        return;
                    }
                }else{
                    this.cur_try_num = this.limit_try_num;
                }

                //기존 정답과 사용자 답은 원본 상태 유지
                let parse_user_dap = JSON.parse(JSON.stringify(this.user_dap).replace(/\s/g, ""));
                let parse_jung_dap = JSON.parse(JSON.stringify(this.jung_dap).replace(/\s/g, ""));

                //console.log(parse_user_dap, parse_jung_dap , "-->>",this.is_seq)
                if(!this.is_seq){//순서대로 하지 않아도 정답일 때
                    var sortABS = function(a,b){return parseInt(a) - parseInt(b);}
                    parse_user_dap = parse_user_dap.sort(sortABS);
                    parse_jung_dap = parse_jung_dap.sort(sortABS);
                    this.user_dap.sort(sortABS);
                }
                //console.log(parse_user_dap, parse_jung_dap, "--<<<" , this.is_seq)
                parse_user_dap = parse_user_dap.toString();
                parse_jung_dap = parse_jung_dap.toString();
                

                if(parse_user_dap == parse_jung_dap){
                    this.outcome = true;
                   
                    this.quiz_end(is_prev_dap)
                    if(!is_prev_dap){
                        this.warning_message.warning_message_show('true');
                        this.sound_class.play('true')
                    }
                    return;
                }

                if(this.cur_try_num>=this.limit_try_num){
                    this.outcome = false;
                    this.quiz_end(is_prev_dap)
                    if(!is_prev_dap){
                        this.warning_message.warning_message_show('false');
                        this.sound_class.play('false')
                    }
                    return;
                }
                

                if(this.hint) this.hint_show();                
                this.cur_try_num++
                this.warning_message.warning_message_show('retry');
                this.sound_class.play('retry');
                this.quiz_retry();
            }


            quiz_retry(){
                this.user_dap = null;
            }

            quiz_reset(){
                this.is_prev_dap = false;
                this.user_dap = null;
                this.outcome = null;
                this.cur_try_num = 1;
                if(this.hint) this.hint_reset();
                this.quiz_wrap.classList.remove('finished');
                this.send.save({value:null, np:this.quiz_num});
            }

            quiz_end(is_prev_dap=false){
                this.is_prev_dap = is_prev_dap;
                this.quiz_wrap.classList.add('finished');
                
                if(!is_prev_dap){
                    const value = JSON.stringify(this.user_dap);
                    this.send.save({value, np:this.quiz_num})
                };
            }

            hint_show(){                
                this.hint.classList.add('active')
            }
            hint_reset(){
                this.hint.classList.remove('active')          
            }
            quiz_show(){
                this.quiz_wrap.classList.add('active')
            }
            quiz_hide(){
                this.quiz_wrap.classList.remove('active')
            }

            get outcome_data_set(){
                const outcome_data = {
                    jung_dap : null,
                    mydap : null,
                    exp : null
                };

                const jung_dap_data = this.feed_wrap.querySelector('.quiz_exp_wrap_dap>div:nth-child(2)').cloneNode(true);
                outcome_data.jung_dap = jung_dap_data.innerHTML;


                const exp_data = this.feed_wrap.querySelector('.quiz_exp_wrap_exp>div:nth-child(2)').cloneNode(true);
                outcome_data.exp = exp_data.innerHTML;


                if(this.user_dap != null){

                    if(this.outcome_mydap_type == 'text'){///버튼, 입력칸 등!!!
                        const get_dap = this.user_dap.map( (dap, i) => {                            
                            if(this.quiz_type == "input"){
                                if(!this.actives[i].dataset.bullet){
                                    return this.actives[i].value;    
                                }else{
                                    return this.actives[i].dataset.bullet + this.actives[i].value;
                                }
                            }else if(this.quiz_type == "choice"){
                                const _dap = parseInt(dap, 10) - 1;
                                if(!this.actives[_dap].dataset.bullet){
                                    return this.actives[_dap].innerHTML;    
                                }else{
                                    return this.actives[_dap].dataset.bullet + this.actives[_dap].innerHTML;
                                }
                            }else{
                                if(!this.actives[i].dataset.bullet){
                                    return this.actives[i].innerHTML;    
                                }else{
                                    return this.actives[i].dataset.bullet + this.actives[i].innerHTML;    
                                }
                            }
                        }).join(", ");
                        
                        outcome_data.mydap = get_dap;
                    }else if(this.outcome_mydap_type == 'bullet'){///오로지 블릿만 제시할 때
                        const get_dap = this.user_dap.map( (dap, i) => {  
                            const _dap = parseInt(dap, 10) - 1;                          
                            return this.actives[_dap].dataset.bullet;                            
                        }).join(", ");
                        
                        outcome_data.mydap = get_dap;
                    }else if(this.outcome_mydap_type == 'bullet_link'){///오로지 블릿만 제시할 때
                        const get_dap = this.user_dap.map( (dap, i) => {  
                            return this.actives[i].dataset.bullet + this.actives[i].innerHTML;                            
                        }).join("").replace(this.actives[0].dataset.bullet, "");
                        
                        outcome_data.mydap = get_dap;
                    }else{
                        const get_dap = this.user_dap.map( (dap, i) => {
                            if(this.quiz_type =="ox"){
                                return (dap == 1) ? "O" : "X";
                            }else{
                                return dap;
                            }
                        }).join(", ");

                        console.log(get_dap)
                        outcome_data.mydap = get_dap// 기본형
                    };

                };

                return outcome_data;
            };

        },//ok
        Outcome : class Outcome{
            constructor(outcome_wrap, school, subject, quizs, sound_class, reset_all){
                const parent_dom = document.body;
                this.wrap = outcome_wrap;
                this.school = school;
                this.subject = subject;
                this.quizs = quizs;
                this.sound_class = sound_class;
                this.reset_all = reset_all;
                
                
                this.close_btn = null;
                this.title_list = ["번호", "정답","나의 답", "해설"];
                this.tr_list = [];
                if(this.school == "ms" && this.subject == "mat"){
                    this.title_list[0] = '문제';
                }
                
                if(!this.wrap){//기본 만들기
                    this.wrap = document.createElement("div");
                    this.wrap.classList.add("outcome");
                    parent_dom.appendChild(this.wrap);

                    this.wrap.con = document.createElement("div");
                    this.wrap.con.classList.add("outcome_con");
                    this.wrap.appendChild(this.wrap.con);

                    this.wrap.box = document.createElement("div");
                    this.wrap.box.classList.add("outcome_box");
                    this.wrap.con.appendChild(this.wrap.box);
                    
                    this.table_con = document.createElement("div");
                    this.table_con.classList.add("outcome_table");
                    this.wrap.box.appendChild(this.table_con);

                    this.make_table_head();
                    this.quizs.forEach( (quiz, i) => {
                        this.make_table_tr(i);
                        this.make_table_tr_td(quiz, i);
                    });
                }else{
                    this.wrap.box = this.wrap.querySelector(".outcome_box");
                    this.wrap.con = this.wrap.querySelector(".outcome_con");
                }

                //공통 부분
                this.title = document.createElement("div");
                this.title.innerHTML = "수고하셨습니다. 다음 학습을 진행하세요.";
                this.title.classList.add("outcome_title");
                this.wrap.box.insertBefore(this.title, this.wrap.box.childNodes[0]);
                
                this.close_btn = document.createElement("button");
                this.close_btn.classList.add("outcome_close");
                this.close_btn.setAttribute("title", "결과창 닫기");
                this.wrap.box.insertBefore(this.close_btn, this.wrap.box.childNodes[0]);
                this.close_btn.addEventListener('click',()=>{
                    this.hide();
                    this.sound_class.play('click')
                });

                
                this.outcome_btns_wrap = document.createElement("div");
                this.outcome_btns_wrap.classList.add("outcome_btns_wrap");
                this.wrap.box.appendChild(this.outcome_btns_wrap);

                
                
                const check_quiz_type = this.quizs.some( quiz => {
                    return (quiz.quiz_type == "listen" || quiz.quiz_type == "recode" || quiz.quiz_type == "listen_speak" || quiz.quiz_type == "listen_repeat")
                });
                const retryBtnName = (check_quiz_type) ? "다시 하기" : "다시 풀기";
                this.reset_all_btn = document.createElement("button");
                this.reset_all_btn.classList.add("outcome_reset_all_btn");
                this.reset_all_btn.classList.add("qbtn");
                this.reset_all_btn.setAttribute("title", `${retryBtnName}`);
                this.reset_all_btn.innerHTML = `<span>${retryBtnName}</span>`;
                this.outcome_btns_wrap.appendChild(this.reset_all_btn);
                this.reset_all_btn.addEventListener('click',()=>{
                    this.hide();
                    this.reset_all();
                    this.sound_class.play('click')
                });
            }

            make_table_head(){//this.table_con.head에 넣을 부분
                this.table_con.head = document.createElement("div");
                this.table_con.head.classList.add("outcome_table_head");
                this.table_con.appendChild(this.table_con.head);

                this.table_con.head_numbers = document.createElement("div");
                this.table_con.head_numbers.classList.add("head_numbers");
                this.table_con.head_numbers.innerHTML = this.title_list[0];

                this.table_con.head_daps = document.createElement("div");
                this.table_con.head_daps.classList.add("head_daps");
                this.table_con.head_daps.innerHTML = this.title_list[1];

                this.table_con.head_mydaps = document.createElement("div");
                this.table_con.head_mydaps.classList.add("head_mydaps");
                this.table_con.head_mydaps.innerHTML = this.title_list[2];
                
                this.table_con.head_exps = document.createElement("div");
                this.table_con.head_exps.classList.add("head_exps");
                this.table_con.head_exps.innerHTML = this.title_list[3];

                this.table_con.head.appendChild(this.table_con.head_numbers);
                this.table_con.head.appendChild(this.table_con.head_daps);
                this.table_con.head.appendChild(this.table_con.head_mydaps);
                this.table_con.head.appendChild(this.table_con.head_exps);

                this.table_con.bodys = [];

                this.table_con.body = document.createElement("div");
                this.table_con.body.classList.add("outcome_table_body");
                this.table_con.appendChild(this.table_con.body);
            };

            make_table_tr(num){//this.table_con.body에 넣을 부분
                const tr = document.createElement("div");
                tr.classList.add("outcome_table_body_tr");
                this.table_con.body.appendChild(tr);

                const body_numbers = document.createElement("div");
                body_numbers.classList.add("body_numbers");
                body_numbers.setAttribute("reaction", this.title_list[0]);

                const body_daps = document.createElement("div");
                body_daps.classList.add("body_daps");
                body_daps.setAttribute("reaction", this.title_list[1]);

                const body_mydaps = document.createElement("div");
                body_mydaps.classList.add("body_mydaps");
                body_mydaps.setAttribute("reaction", this.title_list[2]);
                
                const body_exps = document.createElement("div");
                body_exps.classList.add("body_exps");
                body_exps.setAttribute("reaction", this.title_list[3]);

                tr.appendChild(body_numbers);
                tr.appendChild(body_daps);
                tr.appendChild(body_mydaps);
                tr.appendChild(body_exps);

                this.table_con.bodys[num] = tr;
            }

            make_table_tr_td(quiz, num){//this.table_con에 넣을 부분
                const target_td = this.table_con.bodys[num];
                target_td.numbers = target_td.querySelector(".body_numbers");
                target_td.daps = target_td.querySelector(".body_daps");
                target_td.mydaps = target_td.querySelector(".body_mydaps");
                target_td.exps = target_td.querySelector(".body_exps");
                if(this.school == "ms" && this.subject == "mat"){
                    target_td.numbers.innerHTML = `<div>Q${num+1}</div>`;
                }else{
                    target_td.numbers.innerHTML = `<div>문제${num+1}</div>`;
                };

                this.tr_list.push([target_td.numbers, target_td.daps, target_td.mydaps, target_td.exps]);
            }

            show(){
                this.wrap.classList.add('active')
            }

            hide(){
                this.wrap.classList.remove('active')
            }


            set_my_dap(quiz = null){
                if(quiz ==null) return;
                const quiz_data = quiz.outcome_data_set;
                const target_tr = this.tr_list[quiz.quiz_num-1];
                if(target_tr){
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
    };
    win.kbc_main.CHOICE = class CHOICE extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data); 
        }

        init(history_data){
            this.my_dap_dom = [];
            this.select_arr = [];
            this.actives = this.quiz_wrap.querySelectorAll('.selection button');
            this.actives.forEach( (btn, i) => {                
                btn.setAttribute("title", `보기${i+1}`);
                btn.addEventListener("click", e =>{
                    const num = parseInt(btn.dataset.num, 10);
                    if(this.is_multi){
                        if(btn.classList.contains('check')){
                            btn.classList.remove('check')
                            this.select_arr.splice(this.select_arr.indexOf(num),1);
                        }else{
                            if(this.select_arr.length == this.jung_dap.length){
                                let last_ele_num = parseInt(this.select_arr.pop(),10);
                                this.actives[last_ele_num-1].classList.remove('check');
                            }
                                                                
                            btn.classList.add('check');
                            this.select_arr.push(num);
                            this.user_dap = this.select_arr;
                        }
                    }else{
                        this.reset_sel();
                        btn.classList.add('check');
                        this.select_arr.push(num);
                        this.user_dap = this.select_arr;
                    }
                    this.sound_class.play('click');
                })
            });
            
            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);                
        }

        prev_data_quiz_end(history_data){
            this.user_dap = JSON.parse(history_data);
            this.actives.forEach((btn, i)=>{
                if(this.user_dap.indexOf((i+1)) != -1){//여기전 int
                    btn.classList.add('check');
                };
            });
            
            this.quiz_ok_check(true);
        }

        quiz_ok_check(is_prev_dap=false){
            this.actives.forEach((btn, i)=>{
                if(btn.classList.contains('check')){
                    this.my_dap_dom.push(btn.cloneNode(true));
                };
            });

            this.my_dap_dom.forEach( clone_btn => {
                clone_btn.classList.remove('check');
            });
            super.quiz_ok_check(is_prev_dap);
        }

        reset_sel(){
            this.user_dap = null;
            this.select_arr = [];
            this.actives.forEach( btn => {
                btn.classList.remove('active');
                btn.classList.remove('true');
                btn.classList.remove('false');
                btn.classList.remove('check');
            });
        }

        quiz_retry(){
            this.reset_sel();
            super.quiz_retry();
        }

        quiz_reset(){
            this.select_arr = [];
            this.actives.forEach(btn => {
                btn.classList.remove('false')
                btn.classList.remove('true')
                btn.classList.remove('check');
            });
            super.quiz_reset();
        }

        quiz_end(is_prev_dap=false){
            super.quiz_end(is_prev_dap);
            this.actives.forEach((btn, i)=>{
                if(this.jung_dap.indexOf((i+1).toString()) != -1){//여기선 string
                    btn.classList.add('true')
                }else{
                    btn.classList.add('false')
                }
            });
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//ok
    win.kbc_main.CHOICE_MOVE = class CHOICE_MOVE extends win.kbc_main.Class_manager{    
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data);  
        }

        init(history_data){
            this.space= 1;
            this.move_speed= 0.5;
            this.click_btns = [];
            this.quiz_wrap.querySelectorAll('.move_btn').forEach( btn => this.click_btns.push(btn) );
            this.click_btns.forEach( (btn, i) => {
                btn.setAttribute("title", `선택 보기${i+1}`);
                btn.addEventListener('click', async (e)=>{
                    const blank_target = this.target_check_blank;//빈칸 체크해서 리턴
                    if(blank_target == null) return;
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
                    if(blank_target.dataset.frist != "" && blank_target.dataset.frist){
                        let text = _btn.innerHTML.toString();
                        
                        const f_text = text.slice(0, 1).toUpperCase();
                        const s_text = text.slice(1);
                        text = f_text + s_text;
                        
                        blank_target.innerHTML = text;
                    }else{  
                        blank_target.innerHTML = _btn.innerHTML;
                    };
                    blank_target.classList.add('active');
                    
                })
            });

            this.actives = [];
            this.quiz_wrap.querySelectorAll('.blank_box').forEach( btn => this.actives.push(btn) );
            this.actives.forEach((btn,i)=>{
                btn.setAttribute("title", `빈칸 보기${i+1}`);
                btn._link = null;
                btn.prev_text = (btn.innerHTML != "") ? btn.innerHTML : "&nbsp;";
                if(btn.prev_text == "&nbsp;") btn.innerHTML = "&nbsp;";
                console.log("btn.prev_text : ", btn.prev_text)
                btn.addEventListener('click',async (e)=>{
                    const _btn = e.currentTarget;
                    //console.dir(_btn)
                    if(_btn._link == null) return;
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

            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);                 
        }

        get target_check_blank(){
            let ele = null;
            for(var i=0; i<this.actives.length; i++){
                if(!this.actives[i]._link){
                    ele = this.actives[i];
                    return ele;
                }
            }
            return ele;
        };

        prev_data_quiz_end(history_data){
            this.user_dap = JSON.parse(history_data);
            this.user_dap.forEach((value,i)=>{
                const c_btn = this.click_btns[value-1];
                const b_btn = this.actives[i];
                b_btn.classList.add("active");
                b_btn.link = c_btn;
                b_btn.innerHTML = c_btn.innerHTML;
            });

            this.actives.forEach( btn => btn.classList.add('dispose') );
            this.quiz_ok_check(true);
        }            

        quiz_ok_check(is_prev_dap=false){
            let isEnd = true;
            this.actives.forEach( btn => {
                if(!btn._link) 
                    isEnd = false; 
            });

            if(isEnd) this.user_dap = this.actives.map( btn => {
                return btn._link.dataset.ans;
            });

            super.quiz_ok_check(is_prev_dap)
        }

        quiz_reset(){
            this.quiz_retry();
            super.quiz_reset();                
        }

        quiz_retry(){
            this.actives.forEach( btn =>{
                btn._link = null;
                btn.innerHTML = btn.prev_text;
                btn.classList.remove('active')
                btn.classList.remove('dispose')
            });

            this.click_btns.forEach( btn => {
                btn.classList.remove('dispose')
            });

            super.quiz_retry();
        }

        quiz_end(is_prev_dap=false){
            super.quiz_end(is_prev_dap);
            this.user_dap.forEach((value,i)=>{
                const c_btn = this.click_btns[value-1];
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

        move_btn(copy_btn, from, to, space ,callback){
            return new Promise((resolve, reject) => {
                copy_btn.classList.add('clone');
                
                const from_offset = from.getBoundingClientRect();
                const to_offset = to.getBoundingClientRect();
                const quiz_wrap_offset = this.quiz_wrap.getBoundingClientRect();

                copy_btn.style.left = from_offset.left - quiz_wrap_offset.left + 'px';
                copy_btn.style.top = from_offset.top - quiz_wrap_offset.top + 'px';
                copy_btn.style.zIndex = 1000000;

                const inv = setInterval(()=>{
                    this.btns.check.classList.add('disabled')
                    let copy_btn_top = parseFloat(copy_btn.style.top);
                    let copy_btn_left = parseFloat(copy_btn.style.left);
                    const gab_top = to_offset.top - copy_btn_top - quiz_wrap_offset.top;
                    const gab_left = to_offset.left - copy_btn_left - quiz_wrap_offset.left;

                    copy_btn_top += gab_top * this.move_speed;
                    copy_btn_left += gab_left * this.move_speed;
                    
                    copy_btn.style.left = copy_btn_left +'px';
                    copy_btn.style.top = copy_btn_top +'px';
                    if(Math.abs(gab_left) <= this.space && Math.abs(gab_top) <= this.space){
                        this.btns.check.classList.remove('disabled');
                        clearInterval(inv);
                        resolve();
                    }
                },50)
            });

            
        }
    };//ok
    win.kbc_main.OX = class OX extends win.kbc_main.CHOICE{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);              
        }       
    };//ok
    win.kbc_main.INPUT = class INPUT extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data);           
        }

        init(history_data){
            this.actives = [];
            this.quiz_wrap.querySelectorAll('.quiz_input').forEach( btn => this.actives.push(btn) );
            
            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);                
        }

        quiz_reset(){
            this.actives.forEach(v=>{
                v.value = '';
                v.classList.remove('true');
                v.classList.remove('false');
            });
            super.quiz_reset();
        } 

        quiz_retry(){
            this.actives.forEach( input => {
                input.value = '';
            });
            super.quiz_retry();
        }    

        quiz_end(is_prev_dap=false){
            super.quiz_end(is_prev_dap);

            this.actives.forEach((input, i)=>{
                const user = this.user_dap[i].toString().replace(/\s/g, "");
                const jung_dap = this.jung_dap[i].toString().replace(/\s/g, "");
                if(user == jung_dap){
                    input.classList.add("true");
                }else{
                    input.classList.add("false");
                }
            });
            
        }
        prev_data_quiz_end(history_data){
            this.user_dap = JSON.parse(history_data);
            this.actives.forEach( (input, i) => input.value = this.user_dap[i] );
            
            this.quiz_ok_check(true);
        }    

        quiz_ok_check(is_prev_dap=false){
            this.user_dap = this.actives.map( input => input.value );
            
            let isEnd = true;
            this.user_dap.forEach( val => {
                if(!val || val == "") {
                    isEnd = false;
                }
            });
            if(!isEnd) this.user_dap = null;
            
            super.quiz_ok_check(is_prev_dap);
        }

        get outcome_data_set(){
            return super.outcome_data_set;
        }
    };//ok
    win.kbc_main.RECODE = class RECODE extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data); 
        }

        async init(history_data){
            this.isAble = false;
            this.stream = null;
            this.isRecord = await this.recordHardwareAccessCheck();

            this.list = [];
            this.actives=[];
            this.quiz_wrap.querySelectorAll(".record_wrap_con").forEach((dom, i) => {
                this.actives.push(dom)
                dom.dataset.num = i;
                this.list.push( 
                    new kbc_main.Recode_manager(
                        dom, 
                        this.stream, 
                        this.sound_class, 
                        i, 
                        this.disposeAll.bind(this), 
                        this.ableAll.bind(this)
                    )
                );
            });
        };

        disposeAll(num){
            this.list.forEach((obj, i) => {
                obj.wrap.classList.add("dispose");
                if(i == num){                        
                    obj.wrap.classList.remove("dispose");
                }
            })
        };

        ableAll(){
            this.list.forEach( obj => obj.wrap.classList.remove("dispose") );
        };

        recordHardwareAccessCheck(){
            const p = this;
            return new Promise((resolve,reject)=>{
                navigator.mediaDevices.getUserMedia({audio:true})
                    .then(function(stream){
                        p.stream = stream;
                        resolve(true);
                    })
                    .catch(function(error){
                        //console.log("error : ", error)
                        alert("마이크 설치가 필요한 페이지 입니다.");
                        resolve(false);
                    });
            })
        }


        quiz_reset(){
            this.list.forEach( cls => {
                cls.wrap.classList.remove("dispose");
            });
            this.reset_sel();

            super.quiz_reset();
        }

        reset_sel(np=-1){
            this.list.forEach( cls => {
                cls.stop_audio();
                cls.stopRecorde();
                cls.recstop_audio();
                cls.wrap.setAttribute("isrecord", "false");
                cls.redcorde_aud_wrap.innerHTML = "";
            })
        }
        
        quiz_ok_check(is_prev_dap=false){
            let isEnd = true;
            this.list.forEach( cls => {
                if(cls.wrap.getAttribute("isrecord") != "true"){
                    isEnd = false;
                }
            });
            
            if(!isEnd){
                this.warning_message.warning_message_show('blank');
                this.sound_class.play('retry');
                return;
            };
            
            if(!is_prev_dap){
                this.warning_message.warning_message_show('check');
                this.sound_class.play('true')
            };
            this.user_dap = this.jung_dap;
            this.outcome = "checked";

            this.quiz_end(is_prev_dap);
        }
       

        quiz_end(is_prev_dap=false){
            this.outcome = "checked";
            super.quiz_end(is_prev_dap);            
        }
        
        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//ok
    win.kbc_main.LISTEN = class LISTEN extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data); 
        }

        async init(history_data){
            this.list = [];
            this.actives=[];
            this.quiz_wrap.querySelectorAll(".record_wrap_con").forEach((dom, i) => {
                this.actives.push(dom)
                dom.dataset.num = i;
                this.list.push( 
                    new kbc_main.Listen_manager(
                        dom, 
                        this.sound_class, 
                        i, 
                        this.disposeAll.bind(this), 
                        this.ableAll.bind(this)
                    )
                );
            });

            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        };

        prev_data_quiz_end(history_data){
            this.list.forEach( cls => cls.wrap.setAttribute("isplayed", "true") );
            this.quiz_ok_check(true);
        }

        disposeAll(num){
            this.list.forEach((obj, i) => {
                obj.wrap.classList.add("dispose");
                if(i == num){                        
                    obj.wrap.classList.remove("dispose");
                }
            });
            this.btns.check.classList.add("disabled")
        };

        ableAll(){
            this.list.forEach( obj => obj.wrap.classList.remove("dispose") );
            this.btns.check.classList.remove("disabled")
        };




        quiz_reset(){
            this.list.forEach( cls => {
                cls.wrap.classList.remove("dispose");
            });
            this.reset_sel();

            super.quiz_reset();
        }

        reset_sel(np=-1){
            this.list.forEach( cls => {
                cls.stop_audio();
                cls.wrap.setAttribute("isplayed", "false");
            })
        }
        
        quiz_ok_check(is_prev_dap=false){
            let isEnd = true;
            this.list.forEach( cls => {
                if(cls.wrap.getAttribute("isplayed") != "true"){
                    isEnd = false;
                }
            });
            
            if(!isEnd){
                this.warning_message.warning_message_show('blank');
                this.sound_class.play('retry');
                return;
            };
            
            if(!is_prev_dap){
                this.warning_message.warning_message_show('check');
                this.sound_class.play('true')
            };
            this.user_dap = this.jung_dap;
            this.outcome = "checked";

            this.quiz_end(is_prev_dap);
        }
       

        quiz_end(is_prev_dap=false){
            this.outcome = "checked";
            super.quiz_end(is_prev_dap);            
        }
        
        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//ok
    win.kbc_main.LISTEN_SPEAK = class LISTEN_SPEAK extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data); 
        }

        async init(history_data){
            this.actives=[];
            this.quiz_wrap.querySelectorAll('.selection_con .listen_btn').forEach( btn => this.actives.push(btn) );
            this.actives.forEach((btn,i)=>{
                btn.dataset.num = i;
                btn.addEventListener('click', e => {
                    const ck_num = e.currentTarget.dataset.num;
                    e.currentTarget.classList.add('active');
                    if(this.audios[ck_num]){
                        this.audios[ck_num].play();    
                    }else{
                        this.audios[0].play();
                    }                    
                })
            });

            this.audios = [];
            this.quiz_wrap.querySelectorAll('audio').forEach( audio => this.audios.push(audio) );
            this.audios.forEach( (audio, i) => {
                audio.addEventListener("ended", e => {
                    this.stop_audio();
                    if(!this.quiz_wrap.classList.contains("finished"))
                        this.quiz_ok_check();
                });    
            });

            if(this.is_text_click == "true"){//문장 클릭 옵션
                this.text_btn = this.quiz_wrap.querySelector(".front_box_wrap .word_text");
                this.text_btn.addEventListener('click', e =>{
                    this.audios[0].play();
                })
            };

            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        };


        prev_data_quiz_end(history_data){
            this.user_dap = JSON.parse(history_data);
            this.quiz_ok_check(true);
        }

        stop_audio(){
            this.audios.forEach( (snd, i) => {
                snd.currentTime = 0;
                snd.pause(); 
            })
            this.actives.forEach( b => b.classList.remove('active') );
        };

        quiz_retry(){
            this.stop_audio();
            super.quiz_retry();
        }

        quiz_reset(){
            this.outcome = null;
            this.stop_audio();
            super.quiz_reset();
        }
        
        quiz_ok_check(is_prev_dap=false){
            this.user_dap = ["true"];
            
            this.quiz_end(is_prev_dap);
            if(!is_prev_dap){
                this.warning_message.warning_message_show('check');
                this.sound_class.play('true')
            }
        };

        quiz_end(is_prev_dap=false){
            this.outcome = "checked";
            super.quiz_end(is_prev_dap);
        }
        
        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */

    };//ok
    win.kbc_main.LISTEN_REPEAT = class LISTEN_REPEAT extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data);
        }

        init(history_data){
            this.actives=[];
            this.isStep = "before";
            this.isPlayStyle = "listen";
            this.text_list = this.quiz_wrap.querySelectorAll(".text_list");
            

            this.audios = this.quiz_wrap.querySelectorAll("audio");
            this.audios.forEach( (sound, i) => {
                sound.dataset.num = i;
                sound.addEventListener("ended", e => {
                    const num = parseInt(e.currentTarget.dataset.num);
                    if(num < this.audios.length-1){
                        setTimeout(()=>{
                            this.play_audio(num+1);
                        },1000);                        
                    }else{
                        if(this.isPlayStyle == "listen"){
                            this.isStep = "listened";
                        }else{
                            this.isStep = "repeated";
                        }
                        this.stop_audio();
                        if(!this.quiz_wrap.classList.contains("finished") && this.isStep == "repeated")
                            this.quiz_ok_check();
                    }                        
                });    
            });
            
            this.listen_btns = this.quiz_wrap.querySelector('.listen');
            this.listen_btns.addEventListener('click', e => {
                if(e.currentTarget.classList.contains("active")){
                    this.stop_audio();
                    return;
                }
                this.isPlayStyle = "listen";
                this.click_btn();
            });

            this.repeat_btn = this.quiz_wrap.querySelector(".repeat");
            this.repeat_btn.addEventListener("click", e => {
                if(e.currentTarget.classList.contains("active")){
                    this.stop_audio();
                    return;
                }
                this.isPlayStyle = "repeat";
                this.click_btn();
            });
            
            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        }//end - init

        prev_data_quiz_end(history_data){
            this.quiz_ok_check(true);
        }

        click_btn(){
            //초기화
            this.stop_audio();
            //버튼별 설정
            if(this.isPlayStyle == "listen"){
                this.listen_btns.classList.add('active');
                this.check_listen_change_btn();
            }else{
                this.repeat_btn.classList.add('active');
                this.check_repeat_change_btn();
            };
            //공통 실행부
            this.play_audio(0);
        }

        check_listen_change_btn(){
            if(this.listen_btns.classList.contains("active")){
                this.listen_btns.innerHTML = "<span>음성 중지</span>";
            }else{
                this.listen_btns.innerHTML = "<span>음성 듣기</span>";
            }
        }
        check_repeat_change_btn(){
            if(this.repeat_btn.classList.contains("active")){
                this.repeat_btn.innerHTML = "<span>읽기 중지</span>";
            }else{
                this.repeat_btn.innerHTML = "<span>읽어 보기</span>";
            }
        }
        play_audio(num){
            if(this.isPlayStyle == "listen"){
                this.audios[num].volume = 1;
            }else{
                this.audios[num].volume = 0;
            }
            this.audios[num].play();
            this.text_list[num].classList.add("active");
        }
        stop_audio(){
            this.quiz_retry();
            this.audios.forEach( (sound, i) => {
                sound.currentTime = 0;
                sound.pause(); 
            })
            
            this.listen_btns.classList.remove('active');
            this.repeat_btn.classList.remove('active');

            if(this.isStep == "listened"){
                this.quiz_wrap.dataset.isstep = "listened";
                this.repeat_btn.classList.add("on")
            }
        };
        quiz_retry(){//버튼과 텍스트만 초기화
            this.text_list.forEach( _t => _t.classList.remove('active') );
            
            this.listen_btns.classList.remove('active');
            this.check_listen_change_btn();

            this.repeat_btn.classList.remove('active');
            this.check_repeat_change_btn();
        }

        quiz_reset(){
            this.listen_btns.classList.remove('active');
            this.check_listen_change_btn();

            this.repeat_btn.classList.remove('active');
            this.check_repeat_change_btn();
            this.repeat_btn.classList.remove('on');
            this.outcome = null;
            
            super.quiz_reset();
        }
        
        quiz_ok_check(is_prev_dap=false){
            this.user_dap = ["true"]; 
            
            this.quiz_end(is_prev_dap)
            if(!is_prev_dap){
                this.warning_message.warning_message_show('check');
                this.sound_class.play('true')
            }
        };

        quiz_end(is_prev_dap=false){
            this.outcome = "checked";
            super.quiz_end(is_prev_dap);
        }

        /* get outcome_data_set(){
            return super.outcome_data_set;
        } */
    };//ok
    win.kbc_main.LISTEN_REPEAT_TYPE_2 = class LISTEN_REPEAT extends win.kbc_main.Class_manager{
        constructor(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send){
            super(quiz_wrap, history_data, quiz_num, is_quiz_last, quiz_type, outcome_wrap, quiz_next, outcome_show, sound_class, warning_message, send);
            this.init(history_data);
        }

        init(history_data){
            this.stnum = 0;
            this.endnum = 0;
            this.actives=[];
            this.isStep = "before";
            this.isPlayStyle = "listen";
            this.text_list = this.quiz_wrap.querySelectorAll(".text_list");
            

            this.audios = this.quiz_wrap.querySelectorAll("audio");
            this.audios.forEach( (sound, i) => {
                sound.dataset.num = i;
                sound.addEventListener("ended", e => {
                    const num = parseInt(e.currentTarget.dataset.num);
                    //if(num < this.audios.length-1){
                    console.log("num : ", num, "this.endnum : ", this.endnum)
                    if(num < this.endnum){
                        setTimeout(()=>{
                            this.play_audio(num+1);
                        },1000);
                    }else{
                        if(this.isPlayStyle == "listen"){
                            this.isStep = "listened";
                        }else{                            
                            this.isStep = "repeated";
                        }
                        this.stop_audio();
                        this.quiz_wrap.dataset.isplaystate = "";

                        if(!this.quiz_wrap.classList.contains("finished") && this.isStep == "repeated")
                            this.quiz_ok_check();
                    };
                });    
            });
            
            this.listen_btns = this.quiz_wrap.querySelectorAll('.listen_btn');
            this.listen_btns.forEach( btn => this.actives.push(btn) );
            this.actives.forEach((btn, i)=>{
                btn.addEventListener('click', e => {
                    this.isPlayStyle = "listen";
                    this.stnum = parseInt( e.currentTarget.dataset.stnum, 10 );
                    this.endnum = parseInt( e.currentTarget.dataset.endnum, 10 ) - 1;
                    e.currentTarget.dataset.ischeck = "check";
                    //this.listen_btn_checks();
                    this.click_btn(this.stnum);
                });
            });

            this.repeat_btn = this.quiz_wrap.querySelector(".repeat");
            this.repeat_btn.addEventListener("click", e => {
                if(e.currentTarget.classList.contains("active")){
                    this.quiz_wrap.dataset.isplaystate = "";
                    this.stop_audio();
                    return;
                }
                this.stnum = 0;
                this.endnum = this.audios.length-1;
                this.isPlayStyle = "repeat";
                this.quiz_wrap.dataset.isplaystate = "repeat";
                this.click_btn();
            });
            
            if(history_data && history_data != 'null')
                this.prev_data_quiz_end(history_data);
        }//end - init

        prev_data_quiz_end(history_data){
            this.quiz_ok_check(true);
        }
        
        click_btn(ck_num=0){
            //초기화
            this.stop_audio();
            //버튼별 설정
            if(this.isPlayStyle == "listen"){
                this.check_listen_change_btn();
            }else{
                this.repeat_btn.classList.add('active');
                this.check_repeat_change_btn();
            };
            //공통 실행부
            this.play_audio(ck_num);
        }

        check_listen_change_btn(){}

        check_repeat_change_btn(){
            if(this.repeat_btn.classList.contains("active")){
                this.repeat_btn.innerHTML = "<span>읽기 중지</span>";
            }else{
                this.repeat_btn.innerHTML = "<span>읽어 보기</span>";
            }
        }
        play_audio(num){
            if(this.isPlayStyle == "listen"){
                this.audios[num].volume = 1;
            }else{
                this.audios[num].volume = 0;
            }
            this.audios[num].play();
            this.text_list[num].classList.add("active");
        }
        stop_audio(){
            this.quiz_retry();
            this.audios.forEach( (sound, i) => {
                sound.currentTime = 0;
                sound.pause(); 
            })
            
            this.repeat_btn.classList.remove('active');

            if(this.isStep == "listened" && !this.listen_btn_checks()){
                this.repeat_btn.classList.add("on")
            }
        };
        quiz_retry(){//버튼과 텍스트만 초기화
            this.text_list.forEach( _t => _t.classList.remove('active') );
            
            this.check_listen_change_btn();

            this.repeat_btn.classList.remove('active');
            this.check_repeat_change_btn();
        }

        quiz_reset(){
            this.actives.forEach( _btn => _btn.removeAttribute("data-ischeck"));
            this.repeat_btn.classList.remove('active');
            this.repeat_btn.classList.remove('on');
            this.outcome = null;

            this.stop_audio();

            super.quiz_reset();
        }
        
        listen_btn_checks(){
            return this.actives.find(btn => {
                if(!btn.dataset.ischeck) return true;
            });
        }

        quiz_ok_check(is_prev_dap=false){
            this.user_dap = ["true"]; 
            
            this.quiz_end(is_prev_dap)
            if(!is_prev_dap){
                this.warning_message.warning_message_show('check');
                this.sound_class.play('true')
            }
        };

        quiz_end(is_prev_dap=false){
            this.outcome = "checked";
            super.quiz_end(is_prev_dap);
        }

    };//
    
    //금요일
})(window);
console.log("window.kbc_main : ", window.kbc_main)
