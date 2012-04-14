Crafty.scene("gamelevel", function(){
    //console.log("start");
    var lastTouch = 0, enemyCounter = 30, readyCount=0;
    Crafty.background("url("+IMG_STARBACK+")");

    var player = Crafty.e("Player")
    var enemysIncoming = function(frame){
        if(frame % enemyCounter == 0 && player.playerReady){
            Crafty.e("SpaceBug")
                .attr({
                    h:64*scaleX,
                    y:-64*scaleX,
                    w:64*scaleX,
                    x:Crafty.math.randomInt(ENEMY_SIZE*scaleX,Crafty.viewport.width-ENEMY_SIZE*scaleX)
                });
        }
        if(frame % (enemyCounter*10) == 0 && player.playerReady){
            Crafty.e("EnemyShip")
                .attr({
                    h:64*scaleX,
                    y:-64*scaleX,
                    w:64*scaleX,
                    x:Crafty.math.randomInt(ENEMY_SIZE*scaleX,Crafty.viewport.width-ENEMY_SIZE*scaleX)
                });
        }
        if(frame % 1000 == 0 && enemyCounter != 0 && player.playerReady){
            enemyCounter--;
        }
        if(!player.playerReady && readyCount < 100){
            readyCount++;
        }
        else{
            readyCount = 0;
            player.playerReady = true;
        }
    }

    this.addEvent(this, window, "blur", function() {
        Crafty.pause(true);
    });
    this.addEvent(this, window, "focus", function() {
        Crafty.pause(false);
    });

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

    this.addEvent(this, Crafty.stage.elem, "touchstart", function(e) {
        e.preventDefault();
        touchEvent(e.touches[0].pageX, e.touches[0].pageY);
    });

    this.addEvent(this, Crafty.stage.elem, "touchend", function(e) {
        e.preventDefault();
    });

    Crafty.bind("EnterFrame", function(frame){
        enemysIncoming(frame.frame);
        Crafty.stage.elem.style.backgroundPosition = "0px "+frame.frame*2+"px";
    });

    var test = Crafty.e("2D, DOM, Text")
        .attr({w:Crafty.viewport.width/4, h:Crafty.viewport.height/15, y:Crafty.viewport.height - Crafty.viewport.height/15, x:Crafty.viewport.width - Crafty.viewport.width/4})
        .textColor("#FFFFFF")
        .text(String(player.score))
        .textFont({ family: 'Arial', size: 30*scaleX+'px'})
        .css({ 'text-align':'right', 'vertical-align':'bottom'});

    var lives = Crafty.e("2D, DOM, Text")
        .attr({w:Crafty.viewport.width/4, h:Crafty.viewport.height/15, y:Crafty.viewport.height - Crafty.viewport.height/15, x:0})
        .textColor("#FFFFFF")
        .text(String(player.lives))
        .textFont({ family: 'Arial', size: 30*scaleX+'px'})
        .css({ 'text-align':'left', 'vertical-align':'bottom'});

    Crafty.bind("UpdateStats", function(){
        if(player.score % 400 == 0) player.lives++;
        test.text(String(player.score));
        lives.text(String(player.lives));
    });

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

    function touchEvent(_x, _y) {
        //console.log("touchEvent");
        if(_x <= (PAUSE_BOX*scaleX) && _y >= (Crafty.viewport.height - PAUSE_BOX*scaleX)) {
            //console.log("pause");
            Crafty.pause();
        }else {
            player.movePlayer({x:_x-FIGHTER_SIZE*scaleX/2, y:_y-FIGHTER_SIZE*scaleX/2});
        }
        //Crafty.e("TouchSpot").TouchSpot(_x-64*scaleX/2,_y-64*scaleX/2);
    }
})
