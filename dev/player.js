Crafty.c("Player",{
    playerSpeed:8,
    lives:3,
    score:0,
    auto:false,
    ndx:0,
    ndy:0,
    move:false,
    init:function(){
        this.playerSpeed = Math.ceil(this.playerSpeed *= scaleX);
        var keyDown = false, old_direction = 0, counter = 0, rate = 10;
        this.requires("2d,Canvas,fighter,SpriteAnimation,Multiway,Keyboard,Collision,Mouse")
        .multiway(this.playerSpeed, {
                UP_ARROW: -90,
                DOWN_ARROW: 90,
                RIGHT_ARROW: 0,
                LEFT_ARROW: 180,
                W: -90,
                S: 90,
                D: 0,
                A: 180
            })
        .bind('Moved', function(from){
                console.log(from.x, " ", from.y, " ", this.x, " ", this.y);
                if(this.x + this.w > Crafty.viewport.width ||
                    this.x+this.w < this.w ||
                    this.y+this.h-(35*scaleX) < this.h ||
                    this.y+this.h+(35*scaleX) > Crafty.viewport.height){
                        this.attr({
                            x:from.x,
                            y:from.y
                        });
                }
            })
        .bind("NewDirection", function(direction){
                if(direction.x<0 && old_direction <=0){
                    if(!this.isPlaying("move_left"))
                        this.stop().animate("move_left", 1, 0);
                }
                if(direction.x<0 && old_direction > 0){
                    if(!this.isPlaying("move_right_left"))
                        this.stop().animate("move_right_left", 1, 0);
                }
                if(direction.x>0 && old_direction <=0){
                    if(!this.isPlaying("move_right"))
                        this.stop().animate("move_right", 1, 0);
                }
                if(direction.x>0 && old_direction < 0){
                    if(!this.isPlaying("move_left_right"))
                        this.stop().animate("move_left_right", 1, 0);
                }
                if(direction.x === 0 && old_direction > 0){
                    this.stop().animate("stop_right", 1, 0);
                }
                if(direction.x === 0 && old_direction < 0){
                    this.stop().animate("stop_left", 1, 0);
                }
                old_direction = direction.x;
            })
        .animate("move_left", 3, 0, 0)
        .animate("move_right", 3, 0, 6)
        .animate("move_left_right", 6, 0, 0)
        .animate("move_right_left", 0, 0, 6)
        .animate("stop_left", 0, 0, 3)
        .animate("stop_right", 6, 0, 3)
        .bind("KeyDown", function(e){
                if(e.keyCode === Crafty.keys.SPACE && !this.auto) {
                    //this.fire.counter = 0;
                    keyDown = true;
                }else if (e.keyCode === Crafty.keys.ESC) Crafty.pause();
            })
        .bind("KeyUp", function(e){
                if(e.keyCode === Crafty.keys.SPACE && !this.auto) {
                    //this.fire.counter = 0;
                    keyDown = false;
                }
            })
        .bind("EnterFrame", function(){
                if((keyDown || this.auto) && counter < 1){
                    counter = rate;
                    Crafty.e("2D, Canvas, laser, SpriteAnimation")
                        .attr({x:this._x, y:this._y - 64*scaleX,
                            w:64*scaleX, h:64*scaleX,
                            yspeed:20})
                        .bind("EnterFrame", function() {
                            this.y -= this.yspeed*scaleX;
                            if(this._y < 0) this.destroy();
                        });
                }
                else counter--;
            })
        .bind("Killed", function(points){
                this.score += points;
                Crafty.trigger("UpdateStats");
            })
        .onHit("EnemyBullet", function(ent){
                var bullet = ent[0].obj;
                bullet.destroy();
                this.die();
            })
        .resetScale();
        this.resetPos();
        //console.log("player created");
        return this;
    },
    resetPos:function(){
        //Crafty.trigger("UpdateStats");
        //console.log("reset position");
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-64*scaleX;
    },
    resetScale:function(){
        this.h=64*scaleX;
        this.w=64*scaleX;
    },
    die:function(){
        this.lives--;
        //console.log(this.lives);
        //Crafty.trigger("UpdateStats");
        if(this.lives <= 0){
            this.destroy();
            //Crafty.trigger("GameOver",this.score);
        }else{
            this.resetPos();
        }
    }
});

Crafty.c("TouchSpot", {
    TouchSpot: function(x, y) {
        this.addComponent("2D, Canvas, spot, Tween");
        this.attr({x:x, y:y, w:64 * scaleX, h:64 * scaleX});
        this.tween({alpha:0.0}, 50);

        this.bind("EnterFrame", function(e) {
            if (this._alpha < 0.1) {
                //console.log("destroying TouchSpot");
                this.destroy();
            }
        });
    }
});

