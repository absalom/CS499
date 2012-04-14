/*This module declares the player component.  It relies on the Crafty.js engine
 *to create a component that uses the fighter sprite.  It relies on various
 *Crafty components.
 *
 *Authors: Zaid Mullins, Stephen Burgin, and Clint Woodson
 */

Crafty.c("Player",{
    playerSpeed:8,
    lives:3,
    score:0,
    auto:false,
    target_x:0,
    target_y:0,
    move:false,
    playerReady:false,
    init:function(){
        //Adjust the speed based on the scaling factor
        this.playerSpeed = Math.ceil(this.playerSpeed *= scaleX);

        //Variables to aid in the movement of the shp
        var keyDown = false, old_direction = 0, counter = 0, rate = 12;

        //Requirements for the Crafty component
        this.requires("2d,Canvas,fighter,SpriteAnimation,Multiway,Keyboard,Collision,Mouse,Tween")
        .multiway(this.playerSpeed, { //defines movement for the arrow keys and WSAD
                UP_ARROW: -90,
                DOWN_ARROW: 90,
                RIGHT_ARROW: 0,
                LEFT_ARROW: 180,
                W: -90,
                S: 90,
                D: 0,
                A: 180
            })
        .bind('Moved', function(from){  //Part of the Crafty system
                //console.log(from.x, " ", from.y, " ", this.x, " ", this.y);
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
        .bind("NewDirection", function(direction){  //Used to call animations on the ship
                //console.log(direction.x, " ", old_direction);
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

        //Create ship animations using the sprite map
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
                //Creates the lasers that the ship fires
                if((keyDown || this.auto) && counter < 1){
                    counter = rate;
                    Crafty.e("2D, Canvas, laser, SpriteAnimation")
                        .attr({x:this._x, y:this._y - LASER_SIZE*scaleX,
                            w:LASER_SIZE*scaleX, h:LASER_SIZE*scaleX,
                            yspeed:20, playerID:this[0]})
                        .crop(0,0,LASER_SIZE/4,LASER_SIZE)
                        .bind("EnterFrame", function() {
                            this.y -= this.yspeed*scaleX;
                            if(this._y < 0) this.destroy();
                        });
                    Crafty.e("2D, Canvas, laser, SpriteAnimation")
                        .attr({x:this._x+44*scaleX, y:this._y - LASER_SIZE*scaleX,
                            w:LASER_SIZE*scaleX, h:LASER_SIZE*scaleX,
                            yspeed:20, playerID:this[0]})
                        .crop(49,0,15,LASER_SIZE)
                        .bind("EnterFrame", function() {
                            this.y -= this.yspeed*scaleX;
                            if(this._y < 0) this.destroy();
                        });
                    Crafty.audio.play("laserSound");
                }
                else counter--;
            })

         //Used whenever the player kills an enemy
        .bind("Killed", function(points){
                //console.log(this.score);
                this.score += points;
                Crafty.trigger("UpdateStats");
            })

        //Used when an enemy bullet hits the player
        .onHit("EnemyBullet", function(ent){
                if(player.playerReady){
                    var bullet = ent[0].obj;
                    bullet.destroy();
                    this.die();
                }
            })
        .resetScale();  //make sure the scale is good and reset the position
        this.resetPos();
        //console.log("player created");
        return this;
    },

    //This function resets the position of the player to middle of the screen
    //at the bottom with an animated action
    resetPos:function(){
        //Crafty.trigger("UpdateStats");
        //console.log("reset position");
        this.playerReady = false;
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height/4-this.h-FIGHTER_SIZE*scaleX;
        this.alpha=0;
        this.tween({
            y:Crafty.viewport.height-this.h-FIGHTER_SIZE*scaleX,
            alpha:1.0},
            50);
    },
    resetScale:function(){
        this.h=FIGHTER_SIZE*scaleX;
        this.w=FIGHTER_SIZE*scaleX;
    },

    //The die function creates an explosion, resets the position
    //of the player if he has lives left or presents the
    //game over dialogue if there are no lives left
    die:function(){
        //console.log(this.lives);
        //Crafty.trigger("UpdateStats");
        var expl = Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        this.playerReady = false;
        this.lives--;
        this.auto = false;
        if(this.lives < 0){
            this.destroy();
            Crafty.trigger("GameOver");
        }else{
            Crafty.trigger("UpdateStats");
            this.stopPlayerMove();
            this.resetPos();
        }
    },

    //This function is used in conjunction with touch or mouse input to move
    //the player to a specified point.  It uses the movePlayerTo functions to aid
    //in the process and also the stopPlayerMove function.
    //The function takes as input an x and y coordinate to move the ship towards.
    movePlayer:function(moveTo){
        //console.log(moveTo.x);
        this.stopPlayerMove();
        this.target_x=moveTo.x;
        this.target_y=moveTo.y;
        if(moveTo.x < this.x){
            this.trigger("NewDirection", {x:-8, y:0});
        }else if(moveTo.x > this.x){
            this.trigger("NewDirection", {x:8, y:0});
        }
        this.bind("EnterFrame", this.movePlayerTo);
    },
    //Calculates the variables used to move the player and executes them until the
    //player is moved to the correction position
    movePlayerTo:function(){
        //console.log(this.target_x, " ", this.target_y);
        if (Math.abs(this.target_x - this.x) < this.playerSpeed && Math.abs(this.target_y - this.y) < this.playerSpeed){
            var prev_pos = {
                x: this.x,
                y: this.y
            };
            this.x = this.target_x;
            this.y = this.target_y;
            this.stopPlayerMove();

            this.trigger('Moved', prev_pos);
            this.trigger("NewDirection", {x:0, y:0});
            return;
        }
        var dx = this.target_x - this.x, dy = this.target_y - this.y, oldx = this.x, oldy = this.y;
        var d = Math.sqrt(dx * dx + dy * dy)

        this.x += (dx * this.playerSpeed)/d;
        this.trigger('Moved',{x: oldx, y: this.y});
        this.y += (dy * this.playerSpeed)/d;
        this.trigger('Moved',{x:this.x, y:oldy});
    },
    //unbinds the movePlayerTo function
    stopPlayerMove:function(){
        this.unbind("EnterFrame", this.movePlayerTo);
    }
});


//This component was used in debugging to see where the clicks were registering to
//It can be used by uncommenting here and in the gamelevel.js module
/*
Crafty.c("TouchSpot", {
    TouchSpot: function(x, y) {
        this.addComponent("2D, Canvas, spot, Tween");
        this.attr({x:x, y:y, w:FIGHTER_SIZE * scaleX, h:FIGHTER_SIZE * scaleX});
        this.tween({alpha:0.0}, 50);

        this.bind("EnterFrame", function(e) {
            if (this._alpha < 0.1) {
                //console.log("destroying TouchSpot");
                this.destroy();
            }
        });
    }
});
*/
