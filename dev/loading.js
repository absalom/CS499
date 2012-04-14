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
    mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
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

    Crafty.load([IMG_STARBACK, IMG_STARMID, IMG_STARFORE, IMG_FIGHTER, IMG_LASER, IMG_TOUCHSPOT, IMG_ENEMY_BUG, IMG_ENEMY_SHIP, IMG_ENEMY_FIRE, IMG_EXPLOSIONS], function(){
        Crafty.sprite(FIGHTER_SIZE, IMG_FIGHTER, { fighter:[3, 0] });
        Crafty.sprite(LASER_SIZE, IMG_LASER, { laser:[0,0] })
        Crafty.sprite(64, IMG_TOUCHSPOT, { spot:[0,0] });
        Crafty.sprite(ENEMY_SIZE, IMG_ENEMY_BUG, { spaceBug:[0,0] });
        Crafty.sprite(ENEMY_SIZE, IMG_ENEMY_SHIP, { enemySpaceShip:[0,0] });
        Crafty.sprite(ENEMY_SIZE, IMG_ENEMY_FIRE, { enemySpaceFire:[0,0] });
        Crafty.sprite(ENEMY_SIZE, IMG_EXPLOSIONS, {
            explosion1:[0,0],
            explosion2:[0,1],
            explosion3:[0,2]
        });
        if(!mobile){
            Crafty.audio.add({
                laserSound: ["sounds/laser.wav",
                             "sounds/laser.mp3"]});
            Crafty.audio.add({
                enemySound: ["sounds/enemy.wav",
                            "sounds/enemy.mp3"]});
            Crafty.audio.add({
                exploding: ["sounds/explode.mp3",
                           "sounds/explode.ogg"]});
        }
        else{
            rafty.audio.add({
                laserSound: []});
            Crafty.audio.add({
                enemySound: []});
            Crafty.audio.add({
                exploding: []});
        }
        Crafty.scene("start");
    });
})