Crafty.c("Enemy", {
    points:5,
    init:function(){
        //console.log("Enemy");
        var speed = Crafty.math.randomInt(Math.ceil(3*scaleX),Math.ceil(7*scaleX));
        var direction = Crafty.math.randomInt(-speed, speed);

        this.requires("2d, Canvas, Collision, baseEnemy")
        .bind("EnterFrame", function(){
                if(this.x > Crafty.viewport.width + this.w ||
                    this.x < -this.w ||
                    this.y < -this.h ||
                    this.y > Crafty.viewport.height +this.h){
                    this.destroy();
                }
                this.y += speed;
                this.x += direction;
            })
        .onHit("laser", function(ent){
                var bullet = ent[0].obj;
                bullet.destroy();
                this.destroy();
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