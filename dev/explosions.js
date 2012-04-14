/*This module creates the explosion component that is used whenever an enemy or the player
 *is destroyed.  There are 3 explosions that are defined by the explosion1, explosion2,
 *and explosion3 sprites.
 *
 *Authors: Zaid Mullins, Stephen Burgin, and Clint Woodson
 */

Crafty.c("RandomExplosion",{
    init:function(){
        //console.log("explosion");
        //Use a random explosion sprite and then animate it and destroy when animation complete
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