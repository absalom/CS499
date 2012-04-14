Crafty.scene("start", function(){
    var startButton = Crafty.e("2D, DOM, Image, Mouse")
        .image("img/start.png", "no-repeat")
        .attr({
            x:Crafty.viewport.width/2 - 201/2,
            y:Crafty.viewport.height/2 - 89/2
        })
        .bind("Click", function(){
            Crafty.scene("gamelevel");
        });
    startButton.h = 89 * scaleX;
    startButton.w = 201 * scaleX;
})