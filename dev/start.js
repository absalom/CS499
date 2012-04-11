Crafty.scene("start", function(){
    //console.log("start");
    Crafty.background("url(img/star_back.png)");

    var enemysIncoming = function(frame){
        if(frame % 30 == 0){
            Crafty.e("BaseEnemy");
        }
    }

    Crafty.bind("EnterFrame", function(frame){
       enemysIncoming(frame.frame);
       Crafty.stage.elem.style.backgroundPosition = "0px "+frame.frame*2+"px";
    });

    var player = Crafty.e("Player")

})

