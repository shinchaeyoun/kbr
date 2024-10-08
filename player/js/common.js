$(function(){
  $('#wrap').append('<div class="index_container"></div>');
  $('#wrap').append('<div class="media_container"></div>');
  
  $('.index_container').load('index.html', function (){
    complete();
  });
  $('.media_container').load('media.html', function (){
    complete();
  });
})

let loadCheck = 0;

function complete (){
  ++loadCheck;
  
  if(loadCheck == 2){
    mediaFn();
  }

}