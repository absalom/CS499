Crafty.scene("start", function(){
    var startButton = Crafty.e("2D, DOM, Image, Mouse")
        .image("img/start.png", "no-repeat")
        .attr({
            x:Crafty.viewport.width/2 - 201/2*scaleX,
            y:Crafty.viewport.height/2 - 89/2*scaleX,
            w:201*scaleX,
            h:80*scaleX})
        .bind("Click", function(){
            Crafty.scene("gamelevel");
        });
})