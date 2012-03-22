/* CS499 Project
 * Author: Stephen Burgin
 */
window.onload = (function() {
  // globals
  var WIDTH = 600, HEIGHT = 800;
  var ASPECT = WIDTH/HEIGHT;
  var IMG_STARBACK = "img/star_back.png",
  IMG_STARMID = "img/star_mid.png",
  IMG_STARFORE = "img/star_fore.png",
  IMG_TEST = "img/star_test.png";
  var FONT_SIZE = 16;

  var gameWidth, gameHeight, scaleX, scaleY, offsetX, offsetY,
      oldviewW, oldviewH;

  // initialize Crafty
  //Crafty.init(WIDTH, HEIGHT)
  Crafty.init()
    .background("#000");

  Crafty.canvas.init();

  Crafty.scene("loading", function() { 
    resizeCanvas();

    // display (centered) 'loading' text centered on (black) background
    Crafty.e("2D, DOM, Text")
      .attr({w:gameWidth, h:gameHeight, y:gameHeight/2})
      .textColor("#FFFFFF")
      .textFont({size:FONT_SIZE * 2 * scaleX + "px"})
      .text("Loading...")
      .css({"text-align":"center", "vertical-align":"middle"});

    Crafty.load([IMG_STARBACK, IMG_STARMID, IMG_STARFORE], function() {
    
      // load the sprites
      Crafty.sprite(64, "img/fighter.png", { fighter:[3, 0] });
      Crafty.sprite(64, "img/laser.png", { laser:[0,0] });
      Crafty.sprite(64, "img/touchspot.png", { spot:[0,0] });
      Crafty.sprite(1, "img/star1.png", { star1:[0,0] });

      // start the 'main' scene      
      Crafty.scene("main");
    });

  });

  // define the 'main' scene
  Crafty.scene("main", function() {
    var lastTouch = 0;

    // define a single layer scrolling starfield entity manipulated via DOM
    Crafty.c("Scroller", {
      init: function() {       

        this._mdImage = Crafty.e("2D, DOM, Image")
          .image(IMG_STARMID, "repeat")
          .attr({x:offsetX, y:offsetY - gameHeight,
                 w:gameWidth, h:gameHeight * 3});

        this.bind("EnterFrame", function() {
          this._mdImage.y += 3 * scaleY;
          if(this._mdImage.y > 0) this._mdImage.y -= HEIGHT;
        });

        this.bind("resizeme", function() {
          this._mdImage.x = offsetX;
          this._mdImage.y = offsetY - gameHeight;
          this._mdImage.w = gameWidth;
          this._mdImage.h = gameHeight * 3;
        });

      }
    });

    //Crafty.e("Scroller");
    
    /* define a three layer parallax scrolling starfield entity manipulated via
       DOM */
    Crafty.c("Scroller3", {
      init: function() {       
        this._bgImage = Crafty.e("2D, DOM, Image")
          .image(IMG_STARBACK, "repeat")
          .attr({x:offsetX, y:offsetY - gameHeight,
                 w:gameWidth, h:gameHeight * 3});        

        this._mdImage = Crafty.e("2D, DOM, Image")
          .image(IMG_STARMID, "repeat")
          .attr({x:offsetX, y:offsetY - gameHeight,
                 w:gameWidth, h:gameHeight * 3});
          //.attr({x:0, y:-gameHeight});
        //console.log(this._mdImage.img);
        //this._mdImage._element.style.width = '50%';
        //console.log(this._mdImage.img.style);
        //this._mdImage.img.style.width = '50%';
        //this._mdImage.img.style.height = 'auto';
        
        this._fgImage = Crafty.e("2D, DOM, Image")
          .image(IMG_STARFORE, "repeat")
          .attr({x:offsetX, y:offsetY-gameHeight, w:gameWidth, h:gameHeight*3});
        
        this.bind("EnterFrame", function() {
          this._bgImage.y += 2 * scaleY;
          this._mdImage.y += 3 * scaleY;
          this._fgImage.y += 5 * scaleY;
          if(this._bgImage.y > offsetY) this._bgImage.y -= HEIGHT;
          if(this._mdImage.y > offsetY) this._mdImage.y -= HEIGHT;
          if(this._fgImage.y > offsetY) this._fgImage.y -= HEIGHT;
        });
        
        this.bind("resizeme", function() {
          this._bgImage.x = offsetX;
          this._bgImage.y = offsetY - gameHeight;
          this._bgImage.w = gameWidth;
          this._bgImage.h = gameHeight * 3;
          this._mdImage.x = offsetX;
          this._mdImage.y = offsetY - gameHeight;
          this._mdImage.w = gameWidth;
          this._mdImage.h = gameHeight * 3;
          this._fgImage.x = offsetX;
          this._fgImage.y = offsetY - gameHeight;
          this._fgImage.w = gameWidth;
          this._fgImage.h = gameHeight * 3;
        });
        
      }
    });

    Crafty.e("Scroller3");

    // Parallax scrolling starfield using Canvas and custom draw methods
    Crafty.c("ScrollerC", {
      ready: false,
      init: function() {
        //this.addComponent("2D, Canvas");
        this.requires("2D, Canvas");
        //this.y = -gameHeight;
        this.attr({Y: this._h, Yspeed:1});
        this.w = gameWidth; this.h = gameHeight;

        this.bind("EnterFrame", function() {
          this.Y -= this.Yspeed;
          if(this.Y < 0) this.Y = gameHeight;
          //this.draw();
          this.trigger("Change");
          //Crafty.DrawManager.draw();
        });
        this.bind("Draw", function(obj) {
          this._draw(obj.ctx, obj.pos);
        });
        return this;
      },
      // draw routine to render the ImageData
      _draw: function(ctx, po) {
        var pos = {_x:po._x, _y:po._y, _w:po._w, _h:po._h};
        /*console.log("x:" + pos._x + ", y:" + pos._y +
                    ", w:" + pos._w + ", h:" + pos._h);*/
        ctx.putImageData(this.imgData,
                         Crafty.viewport._x + pos._x,
                         Crafty.viewport._y  + pos._y - this.Y,
                         0, this.Y,
                         pos._w, pos._h);
      },
      /* component draws image (from parameter) to temp canvas stacked twice
         high and then copies resulting image to an ImageData object. */
      image: function(url) {
        //this.__image = url;
        
        var thatImg = Crafty.assets[url];

        // temp canvas to draw on
        var canvas = document.createElement("canvas");
        canvas.width = gameWidth;
        canvas.height = gameHeight * 2;
        var ctx = canvas.getContext("2d");

        this.imgData = Crafty.canvas.context.createImageData(gameWidth,
                                                             gameHeight);
        var tmpImg = Crafty.assets[url];
        if(!tmpImg) {
          tmpImg = new Image();
          Crafty.assets[url] = this.img;
          tmpImg.src = url;
        }
        
        ctx.drawImage(tmpImg, 0, 0, tmpImg.width, tmpImg.height, 0, 0,
                      gameWidth, gameHeight);
        ctx.drawImage(tmpImg, 0, 0, tmpImg.width, tmpImg.height, 0,
                      gameHeight, gameWidth, gameHeight);
        this.imgData = ctx.getImageData(0, 0, gameWidth, gameHeight * 2);
        

        this.ready = true;
        this.trigger("Change");
        return this; 
      }

    });
    
    /*Crafty.e("ScrollerC")
      .attr({Yspeed:3 * scaleY})
      .image(IMG_STARMID);*/
    
    /* add screen resize event
       warning: this overrides Crafty's built-in resize event handling */
    Crafty.addEvent(this, window, "resize", function () {
      //console.log("resized");
      var old = {_gameWidth:gameWidth, _gameHeight:gameHeight,
                 _scaleX:scaleX, _scaleY:scaleY,
                 _offsetX:offsetX, _offsetY:offsetY,
                 _oldviewW:oldviewW, _oldviewH:oldviewH};
      resizeCanvas();
      Crafty.trigger("resizeme", old);
    });

    // add mouse click events to the canvas
    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
      if(e.mouseButton == Crafty.mouseButtons.LEFT) {
        //console.log("mousedown");
        touchEvent(e.realX, e.realY);
      }
      else if(e.mouseButton == Crafty.mouseButtons.RIGHT) {
        player.fire.auto = !player.fire.auto; // toggle auto fire
      }
    });

    // add touch events to the canvas
    Crafty.addEvent(this, Crafty.stage.elem, "touchstart", function(e) {
      e.preventDefault();
      touchEvent(e.touches[0].pageX, e.touches[0].pageY);
    });
    
    Crafty.addEvent(this, Crafty.stage.elem, "touchend", function(e) {
      e.preventDefault();
      var now = new Date().getTime();
      var lt = lastTouch || now + 1
      var delta = now - lt;
      if(delta < 500 && delta > 0) {
        // double tap
        player.fire.auto = !player.fire.auto;  // toggle auto fire
      }else {
        // single tap
      }
      lastTouch = now;
      
    
    });
    
    Crafty.addEvent(this, Crafty.stage.elem, "touchmove", function(e) {
      e.preventDefault();
    });


    // player entity is defined as a 64x64 sprite entity
    var player = Crafty.e("2D, Canvas, fighter, Tween, SpriteAnimation, Mouse")
      // player specific vars
      .attr({x:offsetX + gameWidth/2 - 64 * scaleX/2,
             y:offsetY + gameHeight/4 - 64 * scaleY/2,
             w:64 * scaleX, h:64 * scaleY,
             move:{left:false, right:false, up:false, down:false, 
                   to:{bool:false, x:0, y:0} },
             speed:{x:5*scaleX, y:5*scaleY, dx:5*scaleX, dy:5*scaleY},
             alpha:0.0, anim:{idx:3},
             fire:{bool:false, auto:false, counter:0, rate:10} })
      .tween({x:offsetX + gameWidth/2 - 64 * scaleX/2,
              y:offsetY + .8 * gameHeight - 64 * scaleY/2,
              alpha: 1.0}, 50)

      // custom resize event handler (needs some old screen state info)
      .bind("resizeme", function(old) {
        //console.log("ship resize");
        // percentage within game viewport
        var hperc = (this._x - old._offsetX) / old._gameWidth,
            vperc = (this._y - old._offsetY) / old._gameHeight;

        this.w = 64 * scaleX; this.h = 64 * scaleY;
        this.x = offsetX + gameWidth * hperc;
        this.y = offsetY + gameHeight * vperc;
        this.move.to.x = offsetX + gameWidth * (this.move.to.x - old._offsetX)
                         / old._gameWidth;
        this.move.to.y = offsetY + gameHeight * (this.move.to.y - old._offsetY)
                         / old._gameHeight;
        this.speed.x = 5 * scaleX;
        this.speed.y = 5 * scaleY;
        var rescaleX = gameWidth / old._gameWidth;
            rescaleY = gameHeight / old._gameHeight;
        /*console.log("rescaleX:"+rescaleX+", rescaleY:"+rescaleY+
                    ", hperc:"+hperc+", vperc:"+vperc);*/
        this.speed.dx = this.speed.dx * rescaleX;
        this.speed.dy = this.speed.dy * rescaleY;

        //console.log(old);
        //console.log(player._x);
      })

      // key press event handler
      .bind("KeyDown", function(e) {      
        //console.log("keydown");
        if(e.keyCode === Crafty.keys.SPACE && !this.fire.auto) {
          this.fire.counter = 0;
          this.fire.bool = true;
        }else {
          if(this.move.to.bool) abortMoveTo(this);
          if(e.keyCode === Crafty.keys.LEFT_ARROW) this.move.left = true;
          else if(e.keyCode === Crafty.keys.RIGHT_ARROW) this.move.right = true;
          else if(e.keyCode === Crafty.keys.UP_ARROW) this.move.up = true;
          else if(e.keyCode === Crafty.keys.DOWN_ARROW) this.move.down = true;
        }
      })
      // key release event handler
      .bind("KeyUp", function(e) {
        //console.log("keyup");
        if(e.keyCode === Crafty.keys.SPACE) {
          this.fire.bool = false; this.fire.auto = false; }
        else if(e.keyCode === Crafty.keys.LEFT_ARROW) this.move.left = false;
        else if(e.keyCode === Crafty.keys.RIGHT_ARROW) this.move.right = false;
        else if(e.keyCode === Crafty.keys.UP_ARROW) this.move.up = false;
        else if(e.keyCode === Crafty.keys.DOWN_ARROW) this.move.down = false;
      })

      // per frame routines for player entity
      .bind("EnterFrame", function() {

        // player 'move to' functionality
        if(this.move.to.bool) {
          var dx = Math.abs(this.move.to.x - this.x);
          var dy = Math.abs(this.move.to.y - this.y);
          if(this.speed.dx != 0) {
            if(dx < 1)
              this.speed.dx = 0;
            else if(dx < this.speed.dx)
              this.speed.dx = dx;
          }
          if(this.speed.dy != 0) {
            if(dy < 1)
              this.speed.dy = 0;
            else if(dy < this.speed.dy)
              this.speed.dy = dy;
          }
          if(dx < 1 && dy < 1)
            abortMoveTo(this);
          else {
            if(dx < 1 && (player.move.right || player.move.left))
              {player.move.left=false; player.move.right=false; this.speed.dx=0}
            if(dy < 1 && (player.move.up || player.move.down))
              {player.move.up=false; player.move.down=false; this.speed.dy=0}
          }
        }
      
        // handle player's fighter movement & banking animation
        if(this.move.left) {
          this.x -= this.speed.dx;
          //this.x = Crafty.math.lerp(this.x, this.move.to.x,
          //         this.speed.dx/Math.abs(this.move.to.x-this.x));
          if (!this.isPlaying("banking") &&
              this.anim.idx > Math.floor(3.5 - 3.5*this.speed.dx/this.speed.x))
          {
            this.anim.idx--;
            this.animate("banking", [[this.anim.idx,0]]);
            this.animate("banking", 1, 0);
          }
        }else if(this.move.right) {
          this.x += this.speed.dx;
          if (!this.isPlaying("banking") &&
              this.anim.idx < Math.ceil(2.5 + 3.5*this.speed.dx/this.speed.x))
          {
            this.anim.idx++;
            this.animate("banking", [[this.anim.idx,0]]);
            this.animate("banking", 1, 0);
          }
        }

        // player's forward & backward movement
        if(this.move.up) this.y -= this.speed.dy;
        else if(this.move.down) this.y += this.speed.dy;

        // player's fighter is not banking, so gradually move animation back to
        // default
        if(this.anim.idx != 3 && !this.isPlaying("banking")) {
          if (!this.move.left && !this.move.right) {
            if (this.anim.idx < 3) this.anim.idx++;
            else this.anim.idx--;
            this.animate("banking", [[this.anim.idx,0]]);
            this.animate("banking", 1, 0);
          }
        }

        // laser fire animation handling
        if(this.fire.bool || this.fire.auto) {
          if(this.fire.counter < 1) {
            this.fire.counter = this.fire.rate;
            Crafty.e("2D, Canvas, laser, SpriteAnimation")
              .attr({x:this._x, y:this._y - 64 * scaleY/2,
                     w:64 * scaleX, h:64 * scaleY,
                     yspeed:20 * scaleY})
              .bind("EnterFrame", function() {
                this.y -= this.yspeed;
                if(this._y < 0) this.destroy();
              });
          }
          else this.fire.counter--;
        } 

        // don't let the player go off screen
        if(this._x < offsetX) {
          this.x = offsetX;
          if(this.move.to.bool) {this.move.left = false; this.speed.dx = 0;}
        }
        else if(this._x > offsetX + gameWidth - this._w) {
          this.x = offsetX + gameWidth - this._w;
          if(this.move.to.bool) {this.move.right = false; this.speed.dx = 0;}
        }
        if(this._y < offsetY) {
          this.y = offsetY;
          if(this.move.to.bool) {this.move.up = false; this.speed.dy = 0;}
        }
        else if(this._y > offsetY + gameHeight - this._h) {
          this.y = offsetY + gameHeight - this._h;
          if(this.move.to.bool) {this.move.down = false; this.speed.dy = 0;}
        }

      });

    // entity for printing text to the Canvas (debugging)
    var debugText = Crafty.e("2D, DOM, Text")
      .attr({x:offsetX + 50 * scaleX, y:offsetY + 50 * scaleY,
             txt: "WxH:" + Math.floor(gameWidth) + "x" + Math.floor(gameHeight)
                  + (hasTouch() ? " touch:yes" : " touch:no"),
             lastframe:0, stamp:new Date().getTime()})
      .text(function() {
        return this.txt;
      })
      .textFont({size:FONT_SIZE * scaleX + "px"})
      .textColor("#FFFFFF")
      .bind("resizeme", function() {
        this.x = offsetX + 50 * scaleX;
        this.y = offsetY + 50 * scaleY;
        this.txt = "WxH:" + Math.floor(gameWidth) + "x" + Math.floor(gameHeight)
                   + (hasTouch() ? " touch:yes" : " touch:no");
        this.text(this.txt);
        this.textFont({size:FONT_SIZE * scaleX + "px"});
      });
      /*
      .bind("EnterFrame", function() {
        // framerate calculation (Crafty's internal fps != browser fps)
        now = new Date().getTime()
        if ((now - this.stamp) > 1000) {
          this.stamp = now;
          this.text(this.txt + " fps:" + (Crafty.frame() - this.lastframe));
          this.lastframe = Crafty.frame();
        }       
        //this.y = this.y;  // trigger a draw event
      })*/;
      
    // call to abort (player) 'move to'
    function abortMoveTo(ent) {
      ent.move.to.bool = false;
      ent.move.left = false;
      ent.move.right = false;
      ent.move.up = false;
      ent.move.down = false;
      ent.speed.dx = ent.speed.x;
      ent.speed.dy = ent.speed.y;
    }

    // returns true if touch device is detected
    function hasTouch() {
      return 'createTouch' in document ? true : false;
    }

    // a 'spot' sprite entity for debugging mouse/touchscreen controls
    Crafty.c("TouchSpot", {
      TouchSpot: function(x, y) {
        this.addComponent("2D, Canvas, spot, Tween");      
        this.attr({x:x, y:y, w:64 * scaleX, h:64 * scaleY});
        this.tween({alpha:0.0}, 50);
        
        this.bind("EnterFrame", function(e) {
          if (this._alpha < 0.1) {
            //console.log("destroying TouchSpot");
            this.destroy();
          }
        });
      }
    });

    // unified mouse & touch event handler
    function touchEvent(x, y) {
      //console.log(e);
      if(player.move.to.bool) {
        player.move.left = false;
        player.move.right = false;
        player.move.up = false;
        player.move.down = false;
      }else
        player.move.to.bool = true;

      player.move.to.x = x - player._w/2;
      player.move.to.y = y - player._h/2;

      var dx = player.move.to.x - player._x;
      var dy = player.move.to.y - player._y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var ndx = player.speed.x * dx / d;
      var ndy = player.speed.y * dy / d;
      if(ndx > 0) {player.speed.dx = ndx; player.move.right = true;}
      else {player.speed.dx = -ndx; player.move.left = true;}
      if(ndy > 0) {player.speed.dy = ndy; player.move.down = true;}
      else {player.speed.dy = -ndy; player.move.up = true;}
                        
      Crafty.e("TouchSpot").TouchSpot(player.move.to.x, player.move.to.y);
    }

  });
  
  // (re)calculate the gameplay area and position
  function resizeCanvas() {
    var newWidth = Crafty.viewport.width;
    var newHeight = Crafty.viewport.height;
    var newAspect = newWidth / newHeight;
    oldviewW = newWidth; oldviewH = newHeight;

    if(newAspect > ASPECT) {
      newWidth = newHeight * ASPECT;
      offsetX = Crafty.viewport.width/2 - newWidth/2;
      offsetY = 0;
    }else {
      newHeight = newWidth / ASPECT;
      offsetX = 0;
      offsetY = Crafty.viewport.height/2 - newHeight/2;
    }

    scaleX = newWidth / WIDTH;
    scaleY = newHeight / HEIGHT;
    gameWidth = newWidth;
    gameHeight = newHeight;

    /*console.log("newWidth:" + newWidth + ", newHeight:" + newHeight +
                ", scaleX:" + scaleX + ", scaleY:" + scaleY);*/
  }
  
  Crafty.scene("loading");

});
