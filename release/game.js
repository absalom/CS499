/* CS499 Project
 * Author: Stephen Burgin
 */
window.onload = (function() {
  // globals
  var WIDTH = 600, HEIGHT = 800;
  var IMG_STARBACK = "img/star_back.png",
  IMG_STARMID = "img/star_mid.png",
  IMG_STARFORE = "img/star_fore.png";

  // Initialize Crafty
  Crafty.init(WIDTH, HEIGHT).background("#000");
 
  // load the sprites
  Crafty.sprite(64, "img/fighter.png", { fighter:[3, 0] });
  Crafty.sprite(64, "img/laser.png", { laser:[0,0] });

  Crafty.load([IMG_STARBACK, IMG_STARMID, IMG_STARFORE], function() {

  /* define the parallax scrolling starfield entity
     for some reason we have to use DOM here or the parallax effect does not work */
  Crafty.c("Scroller", {
    init: function() {
      this._bgImage = Crafty.e("2D, DOM, Image").image(IMG_STARBACK, "repeat")
        .attr({x:0, y:-HEIGHT, w:WIDTH, h:HEIGHT*3});
      this._mdImage = Crafty.e("2D, DOM, Image").image(IMG_STARMID, "repeat")
        .attr({x:0, y:-HEIGHT, w:WIDTH, h:HEIGHT*3});
      this._fgImage = Crafty.e("2D, DOM, Image").image(IMG_STARFORE, "repeat")
        .attr({x:0, y:-HEIGHT, w:WIDTH, h:HEIGHT*3});

      this.bind("EnterFrame", function() {
        this._bgImage.y += 2;
        this._mdImage.y += 3;
        this._fgImage.y += 5;
        if (this._bgImage.y > 0) this._bgImage.y -= HEIGHT;
        if (this._mdImage.y > 0) this._mdImage.y -= HEIGHT;
        if (this._fgImage.y > 0) this._fgImage.y -= HEIGHT;
      });
    }
  });
  // create the starfield
  Crafty.e("Scroller");

  // player entity is defined as a 64x64 sprite entity
  var player = Crafty.e("2D, Canvas, fighter, Tween, SpriteAnimation")
    // player specific vars
    .attr({ alpha:0.0, x:WIDTH/2-32, y:HEIGHT/4, w:64, h:64, 
            move:{left:false, right:false, up:false, down:false},
            anim:{idx:3}, speed:{x:5, y:5}, 
            fire:{bool:false, counter:0, rate:10} })
    .tween({alpha: 1.0, x:WIDTH/2-32, y:.8*HEIGHT}, 60)

    // key press event handler
    .bind("KeyDown", function(e) {      
      //console.log("keydown");
      if(e.keyCode === Crafty.keys.LEFT_ARROW) this.move.left = true;
      if(e.keyCode === Crafty.keys.RIGHT_ARROW) this.move.right = true;
      if(e.keyCode === Crafty.keys.UP_ARROW) this.move.up = true;
      if(e.keyCode === Crafty.keys.DOWN_ARROW) this.move.down = true;
      if(e.keyCode == Crafty.keys.SPACE) {
        this.fire.counter = 0;
        this.fire.bool = true;
      }
    })
    // key release event handler
    .bind("KeyUp", function(e) {
      //console.log("keyup");
      if(e.keyCode === Crafty.keys.LEFT_ARROW) this.move.left = false;
      if(e.keyCode === Crafty.keys.RIGHT_ARROW) this.move.right = false;
      if(e.keyCode === Crafty.keys.UP_ARROW) this.move.up = false;
      if(e.keyCode === Crafty.keys.DOWN_ARROW) this.move.down = false;
      if(e.keyCode == Crafty.keys.SPACE) this.fire.bool = false;
    })

    // per frame routines for player entity
    .bind("EnterFrame", function() {
      // handle player's fighter movement & banking animation
      if(this.move.left) {
        this.x -= this.speed.x;
        if (!this.isPlaying("banking") && this.anim.idx > 0) {
          this.anim.idx--;
          this.animate("banking", [[this.anim.idx,0]]);
          this.animate("banking", 1, 0);
        }
      }
      else if(this.move.right) {
        this.x += this.speed.x;
        if (!this.isPlaying("banking") && this.anim.idx < 6) {
          this.anim.idx++;
          this.animate("banking", [[this.anim.idx,0]]);
          this.animate("banking", 1, 0);
        }
      }
      // player's forward & backward movement
      if(this.move.up) {
        this.y -= this.speed.y;
      }
      else if(this.move.down) {
        this.y += this.speed.y;
      }
      // player's fighter is not banking, so gradually move animation back to default
      if(this.anim.idx != 3 && !this.isPlaying("banking")) {
        if (!this.move.left && !this.move.right) {
          if (this.anim.idx < 3)
            this.anim.idx++;
          else
            this.anim.idx--;
          this.animate("banking", [[this.anim.idx,0]]);
          this.animate("banking", 1, 0);
        }
      }
      // laser fire animation handling
      if(this.fire.bool) {
        if(this.fire.counter < 1) {
          this.fire.counter = this.fire.rate;
          that = this;
          Crafty.e("2D, Canvas, laser, SpriteAnimation")
            .attr({ x:this._x, y:this._y-16, yspeed: 20 })
            .bind("EnterFrame", function() {
              this.y -= this.yspeed;
              if(this._y < 0)
                this.destroy();
            });
        }
        else this.fire.counter--;
      } 
      
      // don't let the player go off screen
      if(this._x < 0)
        this.x = 0;
      else if(this._x > WIDTH-64)
        this.x = WIDTH-64;
      if(this._y < 0)
        this.y = 0;
      else if(this._y > HEIGHT-64)
        this.y = HEIGHT-64;

    });
    
    /*
    .bind("NewDirection", function (direction) {
      console.log(direction.x);
    })
    */

   // log the created entity to the JS console
   //console.log(pl);
  });
});
