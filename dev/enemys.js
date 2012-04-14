Crafty.c("Enemy", {
    playerID:null,
    init:function(){
        //console.log("Enemy");

        this.requires("2d, Canvas, Collision")
        .bind("EnterFrame", function(frame){
                if(this.x > Crafty.viewport.width + this.w ||
                    this.x < -this.w ||
                    this.y < -this.h ||
                    this.y > Crafty.viewport.height +this.h){
                    this.destroy();
                }
            })
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

Crafty.c("SpaceBug",{
    hp:2,
    points:5,
    init:function(){
        var speed = Crafty.math.randomInt(Math.ceil(3*scaleX),Math.ceil(7*scaleX));
        var direction = Crafty.math.randomInt(-speed, speed);
        var counter = 0;

        this.requires("Enemy,spaceBug")
        .bind("EnterFrame", function(frame){
            if(counter % 30 == 0){
                speed = Crafty.math.randomInt(Math.ceil(4*scaleX),Math.ceil(9*scaleX));
                direction = Crafty.math.randomInt(-speed, speed);
            }
            this.y += speed;
            this.x += direction;
            counter++;
        })
    }
});

Crafty.c("EnemyShip",{
    hp:5,
    points:15,
    init:function(){
        //console.log("Enemy Ship");
        var player = Crafty("Player");
        this.requires("Enemy,enemySpaceShip")
        .bind("EnterFrame", function(frame){
            player = Crafty(player[0]);
            x = Math.abs((this.x+this._w/2)-player.x);
            if((x<40)&& this._y < player.y && frame.frame % 20 == 0){
                this.trigger("Shoot");
            }
            this.y += 1.5;
        })
        .bind("Shoot", function(){
                var bullet = Crafty.e("2d,Canvas,Collision,enemySpaceFire")
                bullet.attr({
                    x: this._x+this._w/2-bullet.w/2,
                    y: this._y+this._h-bullet.h/2
                })
                .bind("EnterFrame", function(){
                    this.y += 8;
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