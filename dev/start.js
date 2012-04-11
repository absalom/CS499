Crafty.scene("start", function(){
    //console.log("start");
    var lastTouch = 0;
    Crafty.background("url(img/star_back.png)");
    var player = Crafty.e("Player")
    var enemysIncoming = function(frame){
        if(frame % 30 == 0){
            var temp = Crafty.e("Enemy")
                .attr({
                    h:64*scaleX,
                    y:-64*scaleX,
                    w:64*scaleX,
                    x:Crafty.math.randomInt(64*scaleX,Crafty.viewport.width-64*scaleX)
                });
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
        var now = new Date().getTime();
        var lt = lastTouch || now + 1
        var delta = now - lt;
        if(delta < 500 && delta > 0) {
            player.auto = !player.auto;
        }else {
            // single tap
        }
        lastTouch = now;
    });

    Crafty.bind("EnterFrame", function(frame){
       enemysIncoming(frame.frame);
       Crafty.stage.elem.style.backgroundPosition = "0px "+frame.frame*2+"px";
    });

    function touchEvent(_x, _y) {
        //console.log("touchEvent");
        if(_x <= (PAUSE_BOX*scaleX) && _y >= (Crafty.viewport.height - PAUSE_BOX*scaleX)) {
            //console.log("pause");
            Crafty.pause();
        }else {
            //player.trigger('Moved',{x:_x, y:_y});
            //player.trigger("NewDirection", {x:_x, y:_y});
            player.movePlayer({x:_x-64*scaleX/2, y:_y-64*scaleX/2});
        }
        //Crafty.e("TouchSpot").TouchSpot(_x-64*scaleX/2,_y-64*scaleX/2);
    }
})