class MediaClass {
    constructor (el){
        this.media = el;
        this._media = el[0];
    };
    playSet(){
        let _this = this._media;
        _this.play();
        $('.play_btn').hide();
        $('.pause_btn').show();

        console.log('play');
    };
    pausedSet() {
        let _this = this._media;
        _this.pause();

        console.log('paused');
        
    };


}


function mediaFn() {
    const media = new MediaClass($('video'));
    const _media = media._media
    console.log(media.media);    
    
    $('.media_box').on('click', function () {
        _media.paused ? media.playSet() : media.pausedSet();
    });

    $('.media_container').on('mouseover', function(){
        $('.controls').addClass('active');
    });
    
    $('.media_container').on('mouseleave', function(){
        setTimeout(() => {
            $('.controls').removeClass('active');
        }, 3000);
    });

    $(".controlLock_btn").on('mouseover', function (){
        $(this).addClass('on');
        
    });
    $(".controlLock_btn").on('mouseleave', function (){
        $(this).removeClass('on');
        
    });
    $(".controlLock_btn").on('click', function (){
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
    });
};