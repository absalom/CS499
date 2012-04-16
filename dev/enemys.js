/*This module is used to create the enemy components of the game.  It defines a base
 *enemy that is then extended by the SpaceBug and EnemyShip components.  Each of them
 *uses the base enemy functions and then customizes it for different appearances and
 *functions.
 *
 *Authors: Zaid Mullins, Stephen Burgin, and Clint Woodson
 */

Crafty.c("Enemy", {
    playerID:null,
    init:function(){
        //console.log("Enemy");
        //The base enemy, if it leaves the canvas then it is destroyed
        this.requires("2d, Canvas, Collision")
        .bind("EnterFrame", function(frame){
                if(this.x > Crafty.viewport.width + this.w ||
                    this.x < -this.w ||
                    this.y < -this.h ||
                    this.y > Crafty.viewport.height +this.h){
                    this.destroy();
                }
            })

         //Define base collision with the player and the player's laser
        .onHit("laser", function(ent){
                var bullet = ent[0].obj;
                this.playerID = bullet.playerID;
                bullet.destroy();
                this.hp--;
                this.y -= 16;
                if(this.hp == 0){
                    Crafty(this.playerID).trigger("Killed",this.points);
                    this.destroy();
                    Crafty.e("RandomExplosion").attr({
                        x:this.x,
                        y:this.y
                    });
                }
            })
        .onHit("Player", function(ent){
                var player = ent[0].obj;
                if(player.playerReady){
                    player.die();
                    this.destroy();
                }
            })
    },
    resetScale:function(){
        this.h=ENEMY_SIZE*scaleX;
        this.w=ENEMY_SIZE*scaleX;
    }
});

//The SpaceBug enemy uses the spaceBug sprite to create an enemy that flies in a random
//path and changes directions randomly to create a moving target
Crafty.c("SpaceBug",{
    hp:2,
    points:5,
    init:function(){
        //random speed and direction
        var speed = Crafty.math.randomInt(Math.ceil(3*scaleX),Math.ceil(7*scaleX));
        var direction = Crafty.math.randomInt(-speed, speed);
        var counter = 0;

        this.requires("Enemy,spaceBug")
        .bind("EnterFrame", function(frame){
            if(counter % 30 == 0){
                //change random movement every 30 frames
                speed = Crafty.math.randomInt(Math.ceil(4*scaleX),Math.ceil(9*scaleX));
                direction = Crafty.math.randomInt(-speed, speed);
            }
            this.y += speed;
            this.x += direction;
            counter++;
        })
    }
});

//EnemyShip units fly down the screen and fire bullets at the player when the player
//is in the line of sight.  It uses the enemySpaceShip sprite and
//enemySpaceFire sprites for art.
Crafty.c("EnemyShip",{
    hp:5,
    points:15,
    init:function(){
        //console.log("Enemy Ship");
        var player = Crafty("Player");
        this.requires("Enemy,enemySpaceShip")
        .bind("EnterFrame", function(frame){
            //find the player location and fire if hes close!
            //uses the shoot function defined below
            player = Crafty(player[0]);
            x = Math.abs((this.x+this._w*scaleX/2)-player.x);
            if((x<40)&& this._y < player.y && frame.frame % 20 == 0 && player.playerReady){
                this.trigger("Shoot");
            }
            this.y += 1.5*scaleX;
        })
        //Creates an enemy laser that is shot towards the player
        .bind("Shoot", function(){
                var bullet = Crafty.e("2d,Canvas,Collision,enemySpaceFire")
                bullet.attr({
                    h: ENEMY_SIZE * scaleX,
                    w: ENEMY_SIZE * scaleX,
                    x: this._x+this._w/2-ENEMY_SIZE * scaleX/2,
                    y: this._y+this._h-ENEMY_SIZE * scaleX/2
                })
                .bind("EnterFrame", function(){
                    this.y += 8*scaleX;
                })
                .onHit("Player", function(ent){
                        var player = ent[0].obj;
                        if(player.playerReady){
                            player.die();
                            this.destroy();
                        }
                    })
                Crafty.audio.play("enemySound");
            })
    }
})