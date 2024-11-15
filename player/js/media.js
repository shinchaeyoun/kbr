class MediaClass {
    constructor(el) {
        this.media = el;
        this._media = el[0];

        this.btnSet();
        this.timeSet();

    };
    btnSet() {
        this.btns = {};
        this.btns.play = $('.play_btn');
        this.btns.pause = $('.pause_btn');
        this.btns.stop = $('.stop_btn');
        this.btns.speed = $('.speed_btn');
        this.btns.speedText = $('.speed_btn p');
        this.btns.mute = $('.mute_btn');
        this.speedArr = [0.8, 1.0, 1.2, 1.5, 2.0];
        this.speedIdx = 1;

        this.btns.play.on('click', () => {
            this.playSet();
        });
        this.btns.pause.on('click', () => {
            this.pausedSet();
        });
        this.btns.stop.on('click', () => {
            this.stopSet();
        });
        this.btns.speed.on('click', () => {
            this.speedSet();
        });
        this.btns.speedText.text('x' + setPoint(this.speedArr[this.speedIdx]));
        this.btns.mute.on('click', () => {
            this.muteSet();
        })
    };
    timeSet() {
        let media = this.media;
        let mediaTime;

        this.media.on('loadedmetadata', function () {
            mediaTime = parseInt(this.duration)
            let minutes = parseInt(mediaTime / 60);
            let seconds = mediaTime % 60;

            let min = secToStr(minutes);
            let sec = secToStr(seconds);

            let durationTime = min + ':' + sec;
            $(".duration_time").text(durationTime);
        });

        this.media.on("timeupdate", function () {
            let curPos = this.currentTime,
                maxDur = mediaTime,
                curMin = Math.floor(curPos / 60),
                curSec = Math.floor(curPos % 60),
                min = secToStr(curMin),
                sec = secToStr(curSec),
                percentage = 100 * curPos / maxDur;

            let currentTime = min + ':' + sec;

            $(".current_time").text(currentTime);
            $(".current_bar").width(percentage + '%');
        });
    };
    playSet() {
        this._media.play();
        $('.play_btn').hide();
        $('.pause_btn').show();
    };
    pausedSet() {
        this._media.pause();
        $('.play_btn').show();
        $('.pause_btn').hide();
    };
    stopSet() {
        this._media.currentTime = 0;
    };
    speedSet() {
        this.speedIdx++;
        if (this.speedIdx > this.speedArr.length - 1) this.speedIdx = 0;

        this._media.playbackRate = this.speedArr[this.speedIdx];
        this.btns.speedText.text('x' + setPoint(this.speedArr[this.speedIdx]));
    };
    muteSet(){
        console.log(this._media.volume,'b');
        this._media.volume = 0;

        console.log(this._media.volume,'a');
        
    }
};

function mediaFn() {
    const media = new MediaClass($('video'));
    const _media = media._media

    $('.media_box').on('click', function () {
        _media.paused ? media.playSet() : media.pausedSet();
    });

    $('.media_container').on('mouseenter', function () {
        $('.controls').addClass('active');
    });

    $('.media_container').on('mouseleave', function () {
        setTimeout(() => {
            $('.controls').removeClass('active');
        }, 3000);
    });

    $(".controlLock_btn").on('mouseover', function () {
        $(this).addClass('on');

    });
    $(".controlLock_btn").on('mouseleave', function () {
        $(this).removeClass('on');

    });
    $(".controlLock_btn").on('click', function () {
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
    });
};