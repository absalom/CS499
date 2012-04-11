Crafty.c("Enemy", {
    init:function(){
        //console.log("Enemy");
        this.requires("2d, Canvas, Collision")
        .bind("EnterFrame", function(){
                if(this.x > Crafty.viewport.width + this.w ||
                    this.x < -this.w ||
                    this.y < -this.h ||
                    this.y > Crafty.viewport.height +this.h){
                    this.destroy();
                }
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
    }
});

Crafty.c("BaseEnemy",{
    points:5,
    init:function(){
        //console.log("BaseEnemy");
        var speed = Crafty.math.randomInt(3,7);
        var direction = Crafty.math.randomInt(-speed, speed);

        this.requires("Enemy, baseEnemy")
        .origin("center")
        .bind("EnterFrame",function(){
                this.y += speed;
                this.x += direction;
            })
        .attr({
                y:-this.h,
                x:Crafty.math.randomInt(this.w,Crafty.viewport.width-this.w)
            })
    }
})