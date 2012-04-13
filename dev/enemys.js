Crafty.c("Enemy", {
    points:5,
    hp:2,
    init:function(){
        //console.log("Enemy");
        var speed = Crafty.math.randomInt(Math.ceil(3*scaleX),Math.ceil(7*scaleX));
        var direction = Crafty.math.randomInt(-speed, speed);
        var counter = 0;

        this.requires("2d, Canvas, Collision, baseEnemy")
        .bind("EnterFrame", function(frame){
                if(this.x > Crafty.viewport.width + this.w ||
                    this.x < -this.w ||
                    this.y < -this.h ||
                    this.y > Crafty.viewport.height +this.h){
                    this.destroy();
                }
                if(counter % 20 == 0){
                    speed = Crafty.math.randomInt(Math.ceil(4*scaleX),Math.ceil(9*scaleX));
                    direction = Crafty.math.randomInt(-speed, speed);
                }
                this.y += speed;
                this.x += direction;
                counter++;
            })
        .onHit("laser", function(ent){
                var bullet = ent[0].obj;
                bullet.destroy();
                this.hp--;
                this.x -= 8;
                if(this.hp == 0){
                    this.destroy();
                }
            })
        .onHit("Player", function(ent){
                var player = ent[0].obj;
                player.die();
                this.destroy();
            })
    },
    resetScale:function(){
        this.h=64*scaleX;
        this.w=64*scaleX;
    }
});