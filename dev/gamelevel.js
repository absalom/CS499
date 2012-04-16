/*This module declares the main game scene.  It creates the player's character, binds
 *events to the window, and creates enemies for the player to kill.  This module uses
 *Crafty objects declared in player.js, enemy.js and explosions.js.  When the player
 *runs out of lives, they are presented with a game over screen that reloads the game
 *when the player clicks on it.
 *
 *Authors: Zaid Mullins, Stephen Burgin, and Clint Woodson
 */

Crafty.scene("gamelevel", function(){
    //console.log("start");

    //Game variables
    var lastTouch = 0, enemyCounter = 30, readyCount=0;

    //Background image
    Crafty.background("url("+IMG_STARBACK+")");

    //The player entity
    var player = Crafty.e("Player")

    //Creates enemies for the player to kill.
    //Every so many frames new enemies are created
    var enemysIncoming = function(frame){
        //Check to see if player is ready and creates a "SpaceBug" enemy
        if(frame % enemyCounter == 0 && player.playerReady){
            Crafty.e("SpaceBug")
                .attr({
                    h:ENEMY_SIZE*scaleX,
                    y:-ENEMY_SIZE*scaleX,
                    w:ENEMY_SIZE*scaleX,
                    x:Crafty.math.randomInt(ENEMY_SIZE*scaleX,Crafty.viewport.width-ENEMY_SIZE*scaleX)
                });
        }
        //Creates an EnemyShip enemy
        if(frame % (enemyCounter*10) == 0 && player.playerReady){
            Crafty.e("EnemyShip")
                .attr({
                    h:ENEMY_SIZE*scaleX,
                    y:-ENEMY_SIZE*scaleX,
                    w:ENEMY_SIZE*scaleX,
                    x:Crafty.math.randomInt(ENEMY_SIZE*scaleX,Crafty.viewport.width-ENEMY_SIZE*scaleX)
                });
        }
        //Used to increase difficulty over time
        if(frame % 1000 == 0 && enemyCounter != 0 && player.playerReady){
            enemyCounter--;
        }
        //Used to make the player ready after a delay.  This is for when the game
        //first loads or when the player dies.
        if(!player.playerReady && readyCount < 100){
            readyCount++;
        }
        else{
            readyCount = 0;
            player.playerReady = true;
            if('createTouch' in document){//this may need adjusting to get autofire correct
                player.auto = true;
            }
        }
    }

    //Pauses the game when the window loses focus
    this.addEvent(this, window, "blur", function() {
        Crafty.pause(true);
    });
    //Unpauses the game when the window regains focus
    this.addEvent(this, window, "focus", function() {
        Crafty.pause(false);
    });

    //Adds event for click on the stage to allow the player to move
    //the ship with a mouse click or turn on auto fire with a right
    //mouse click
    this.addEvent(this, Crafty.stage.elem , "mousedown", function(e){
        if(e.mouseButton == Crafty.mouseButtons.LEFT) {
            //console.log("mousedown");
            touchEvent(e.realX, e.realY);
        }
        else if(e.mouseButton == Crafty.mouseButtons.RIGHT) {
            //console.log("rightbutton");
            player.auto = !player.auto; // toggle auto fire
        }
    } );

    //Events for handling touch inputs.  These add support for moving
    //the player using touch controls on mobile devices.
    this.addEvent(this, Crafty.stage.elem, "touchstart", function(e) {
        e.preventDefault();
        touchEvent(e.touches[0].pageX, e.touches[0].pageY);
    });

    this.addEvent(this, Crafty.stage.elem, "touchend", function(e) {
        e.preventDefault();
    });

    //Makes the background scroll and triggers the creation of enemies
    Crafty.bind("EnterFrame", function(frame){
        enemysIncoming(frame.frame);
        Crafty.stage.elem.style.backgroundPosition = "0px "+frame.frame*2+"px";
    });

    //Creates a text overlay for the score of the player
    var scoreText = Crafty.e("2D, DOM, Text")
        .attr({w:Crafty.viewport.width/4, h:Crafty.viewport.height/15, y:Crafty.viewport.height - Crafty.viewport.height/15, x:Crafty.viewport.width - Crafty.viewport.width/4})
        .textColor("#FFFFFF")
        .text(String(player.score))
        .textFont({ family: 'Arial', size: 30*scaleX+'px'})
        .css({ 'text-align':'right', 'vertical-align':'bottom'});

    //Creates a text overlay for the lives of the player
    var lives = Crafty.e("2D, DOM, Text")
        .attr({w:Crafty.viewport.width/4, h:Crafty.viewport.height/15, y:Crafty.viewport.height - Crafty.viewport.height/15, x:0})
        .textColor("#FFFFFF")
        .text(String(player.lives))
        .textFont({ family: 'Arial', size: 30*scaleX+'px'})
        .css({ 'text-align':'left', 'vertical-align':'bottom'});

    //Updates the score and lives of the player when events trigger it
    Crafty.bind("UpdateStats", function(){
        if(player.score % 400 == 0) player.lives++;
        scoreText.text(String(player.score));
        lives.text(String(player.lives));
    });

    //Creates the game over effect
    Crafty.bind("GameOver", function(){
        var text = Crafty.e("2D, DOM, Text")
            .attr({w:Crafty.viewport.width, h:Crafty.viewport.height, y:Crafty.viewport.width/2})
            .textColor("#FFFFFF")
            .text("Game Over.<br>" +
            "Score: "+ String(player.score))
            .css({"text-align":"center", "vertical-align":"middle"});

        this.addEvent(this, Crafty.stage.elem , "mousedown", function(){
            window.location.reload();
        } );

        this.addEvent(this, Crafty.stage.elem, "touchend", function(e) {
            e.preventDefault();
            window.location.reload();
         })
    });

    //This fuction handles touch and mouseclicks by calling the
    //movePlayer(from) function defined in player.js
    function touchEvent(_x, _y) {
        //console.log("touchEvent");
        player.movePlayer({x:_x-FIGHTER_SIZE*scaleX/2, y:_y-FIGHTER_SIZE*scaleX/2});
        //Crafty.e("TouchSpot").TouchSpot(_x-64*scaleX/2,_y-64*scaleX/2);
    }
})
