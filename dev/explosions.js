Crafty.c("RandomExplosion",{
    init:function(){
        console.log("explosion");
        var rand = Crafty.math.randomInt(1,3);
        this.addComponent("2D","Canvas","explosion"+rand,"SpriteAnimation")
        .animate("explode1",0,0,16)
        .animate("explode2",0,1,16)
        .animate("explode3",0,2,16)

        .animate("explode"+rand,10,0)
        .bind("AnimationEnd",function(){
                this.destroy();
            });

        Crafty.audio.play("exploding");
    }
})