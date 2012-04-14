/*This module declares the load() function called when the initial page is loaded.
*It also includes the resizeCanvas() function and the initial Crafty.js scene called
*loading.  The load function calls resizeCanvas() which calculates the screen size
*of the device the code is running on, sets the sizing variables, and then adjusts
*the size of the Crafty stage.  After completion the Crafty.js engine is intialized
*and the loading scene begins.   This scene shows "Loading..." while game assets
*are loaded from the server.  On completion the start scene is presented which is
*described in start.js
*
*Authors: Zaid Mullins, Stephen Burgin, and Clint Woodson
 */

function load(){
   //console.log("laoding");
   resizeCanvas();
   //console.log(newWidth, " ", newHeight);
   Crafty.init(newWidth, newHeight)
       .background("#000");
   Crafty.canvas.init();
   Crafty.scene("loading");  //loading crafty scene
}

function resizeCanvas() {
    //used to test for mobile or not
    mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    var pixelRatio = window.devicePixelRatio;

    newWidth = 600;  //initial, base width
    /* This if statement can be used in the future to take into account the increased pixel density of things like
    the iPhone 4 and new iPad
    if(mobile && pixelRatio>= 2){
        if(screen.width*pixelRatio < WIDTH) newWidth = screen.width * pixelRatio;
    }
    else{
        if(screen.width < WIDTH) newWidth = screen.width;
    }*/

    //Change the screen size based on device screen size
    if(screen.width < WIDTH) newWidth = screen.width;
    newHeight = newWidth * ASPECT;
    //console.log(newHeight);
    //console.log(newWidth);
    scaleX = newWidth / WIDTH;

    //Set the crafty stage size
    Crafty.viewport.width = newWidth;
    Crafty.viewport.height = newHeight;
}

Crafty.scene("loading", function(){
    //Displays "Loading..." text
    Crafty.e("2D, DOM, Text")
        .attr({w:Crafty.viewport.width, h:Crafty.viewport.height, y:Crafty.viewport.width/2})
        .text("Loading...")
        .textColor("#FFFFFF")
        .textFont({ family: 'Arial', size: 30*scaleX+'px'})
        .css({ 'text-align':'center', 'vertical-align':'middle'});

    //Loads the entities and creates sprites for the game objects.
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
        //console.log(mobile);
        //Sounds currently don't work well on mobile devices so don't load them to save time and bandwidth
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
            Crafty.audio.add({
                laserSound: []});
            Crafty.audio.add({
                enemySound: []});
            Crafty.audio.add({
                exploding: []});
        }
        //Move to the crafty start scene
        Crafty.scene("start");
    });
})