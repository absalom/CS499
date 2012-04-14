function load(){
   //console.log("laoding");
   resizeCanvas();
   //console.log(newWidth, " ", newHeight);
   Crafty.init(newWidth, newHeight)
       .background("#000");
   Crafty.canvas.init();
   Crafty.scene("loading");
}

function resizeCanvas() {
    var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    var pixelRatio = window.devicePixelRatio;

    newWidth = 600;
    /*
    if(mobile && pixelRatio>= 2){
        if(screen.width*pixelRatio < WIDTH) newWidth = screen.width * pixelRatio;
    }
    else{
        if(screen.width < WIDTH) newWidth = screen.width;
    }*/
    if(screen.width < WIDTH) newWidth = screen.width;
    newHeight = newWidth * ASPECT;
    //console.log(newHeight);
    //console.log(newWidth);
    scaleX = newWidth / WIDTH;
    //scaleX = .5;
    //newWidth = 300;
    //newHeight=400;
    Crafty.viewport.width = newWidth;
    Crafty.viewport.height = newHeight;
}

Crafty.scene("loading", function(){
    Crafty.e("2D, DOM, Text")
        .attr({w:Crafty.viewport.width, h:Crafty.viewport.height, y:Crafty.viewport.width/2})
        .text("Loading...")
        .textColor("#FFFFFF")
        .textFont({ family: 'Arial', size: 30*scaleX+'px'})
        .css({ 'text-align':'center', 'vertical-align':'middle'});

    Crafty.load([IMG_STARBACK, IMG_STARMID, IMG_STARFORE, IMG_FIGHTER, IMG_LASER, IMG_TOUCHSPOT, IMG_ENEMY], function(){
        Crafty.sprite(FIGHTER_SIZE, IMG_FIGHTER, { fighter:[3, 0] });
        Crafty.sprite(LASER_SIZE, IMG_LASER, { laser:[0,0] })
        Crafty.sprite(64, IMG_TOUCHSPOT, { spot:[0,0] });
        Crafty.sprite(ENEMY_SIZE, IMG_ENEMY, {baseEnemy:[0,0] });
        Crafty.audio.add({
            laserSound: ["sounds/laser.wav",
                         "sounds/laser.mp3"]});
        Crafty.scene("start");
    });
})