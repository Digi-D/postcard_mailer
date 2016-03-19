//ORIGINAL DIMENSIONS
var CARD_HEIGHT = 269;
var CARD_WIDTH = 395;
var SLIDE_WIDTH = 900;  //height is the same

var CONTAINER_WIDTH = 0;
var CONTAINER_HEIGHT = 0;

var working_card_height = 0;
var working_card_width = 0;


process_timeline = new TimelineMax();
//process_timeline.set(".process-explained",{autoAlpha:0});

var runAnimation = function(condition){
  if(condition=='restart'){
    process_timeline.restart();
  }
  else {
    process_timeline.to("#txt_slide_0",0.5,{autoAlpha:1})
    .to("#txt_slide_0",1,{autoAlpha:0},"+=1.5")

    .to("#img_slide_1",1,{autoAlpha:1},"image_fadein")
    .to("#single_card",1,{autoAlpha:1},"image_fadein")

    .to("#img_slide_1",1.5,{autoAlpha:0},"image_fadein+=5.5")
    .to("#txt_slide_1",1,{autoAlpha:1},"image_fadein+=5.5")

    .to("#txt_slide_1",1,{top:(CONTAINER_HEIGHT/5)*4},"present_card")
    .to("#single_card",1,{
      rotation: "+=90_cw",
      scale:1.5,
      top:(CONTAINER_HEIGHT/2-working_card_height),
      left:(CONTAINER_WIDTH/2-working_card_width/2)
    },"present_card")

    .to("#txt_slide_1",1,{opacity:0},"+=2.0")
    .set("#txt_slide_1", {
      text:"The card is moved, rotated and repeated to create a larger image."
    })
    .to("#txt_slide_1",1,{opacity:1})

    .to("#txt_slide_1",1,{opacity:0},"+=2.0")
    .set("#txt_slide_1", {text:"You can <a href='#orders'>order</a> cards here and follow the score below to create <em>The International</em>"})
    .to("#txt_slide_1",1,{opacity:1});

    console.log((CONTAINER_HEIGHT/5)*4);
  }
}



var resizeAnimationContainer = function(){
  // if($(window).width() < $('#process_animation').width()){
  //   $('.animation-container').width($(window).width()-30).height($(window).width()-30);
  // }
  //
  //console.log($('.animation-container').width());

  CONTAINER_WIDTH = $('#process_presentation').width();


  console.log(CONTAINER_WIDTH + " : " + CONTAINER_HEIGHT);

  $('.animation-container').height(($('.animation-container').width()/6)*4);
  CONTAINER_HEIGHT = $('.animation-container').height();

  var slide_0_left = ($('.animation-container').width()-$('#txt_slide_0').width())/2;
  var slide_0_top = ($('.animation-container').height()-$('#txt_slide_0').height())/2;
  $('#txt_slide_0').css({left:slide_0_left,top:slide_0_top});

  var slide_1_left = ($('.animation-container').width()-$('#txt_slide_1').width())/2;
  var slide_1_top = ($('.animation-container').height()-$('#txt_slide_1').height())/2;
  $('#txt_slide_1').css({left:slide_0_left,top:slide_1_top});


  $('#img_slide_1').height($('.animation-container').height()-10);
  $('#img_slide_1').width($('#img_slide_1').height()); //dependent on 1:1 aspect ratio
  var slide_1_left = ($('.animation-container').width()-$('#img_slide_1').width())/2;
  var slide_1_top = ($('.animation-container').height()-$('#img_slide_1').height())/2;
  $('#img_slide_1').css({left:slide_1_left,top:slide_1_top});

  var single_card_aspect_ratio = $('#img_slide_1').width()/900;
  console.log(single_card_aspect_ratio);
  working_card_width = CARD_WIDTH*single_card_aspect_ratio;
  working_card_height = CARD_HEIGHT*single_card_aspect_ratio;
  $('#single_card').width(working_card_width);
  $('#single_card').height(working_card_height);
  $('#single_card').css({left:slide_1_left,top:slide_1_top});

}

$(window).resize(
  function(){
    resizeAnimationContainer();
    runAnimation('restart');
  }
);

resizeAnimationContainer();
runAnimation('start');


//fix media breakpoints
//background for second image
//shims for mobile
//give subsections headers
//how to retrigger
