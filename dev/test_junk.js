Crafty.c("Circle", {
  init: function() {
    this.addComponent("2D, Canvas, Color, Tween");
    
    this.tween({alpha: 0.0}, 50);

    this.bind("Draw", function(obj) {
      this._draw(obj.ctx, obj.pos);
    });
    this.bind("EnterFrame", function(e) {
      if (this._alpha < 0.1) {
        console.log("destroying circle");
        this.destroy();
      }           
    });
  },
  _draw: function(ctx, po) {
    var pos = {_x:po._x+Math.floor(po._w/2), _y:po._y+Math.floor(po._h/2),
               _r:Math.floor(po._w/2)};
    // define clipping region
    
    ctx.save();
    ctx.gobalalpha = 0.0;
    ctx.beginPath();
    ctx.arc(pos._x, pos._y, pos._r, 0, 2*Math.PI, false);
    ctx.clip();
    // fill clipping region
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    // restore canvas
    ctx.restore();
    /*
    ctx.beginPath();
    ctx.arc(pos._x, pos._y, pos._r, 0, 2*Math.PI, false);
    ctx.strokeColor = "#000000";
    ctx.stroke();
    */
  },
  makeCircle: function(x, y, r, color) {
    this.attr({x:x-r, y:y-r, h:2*r, w:2*r, color:color});
    console.log("x: " + this.x + ", y: " + this.y);
  }
});
    
//Crafty.e("Circle").makeCircle(200, 200, 32, "#FFFFFF");


    Crafty.c("Scroller2", {
      init: function() {
          Crafty.sprite(800, IMG_STARBACK, { bgSprite:[0,0] });
          Crafty.sprite(800, IMG_STARMID, { mdSprite:[0,0] });
          Crafty.sprite(800, IMG_STARFORE, { fgSprite:[0,0] });
          //Crafty.sprite(800, "img/star_test.png", { testSprite:[0,0] });
          
          this._bgImage = Crafty.e("2D, Canvas, bgSprite")
            .crop(0, 0, 600, 800)
            .attr({x:0, y:0, w:gameWidth, h:gameHeight});
          this._mdImage = Crafty.e("2D, Canvas, mdSprite")
            .crop(0, 0, 600, 800)
            .attr({x:0, y:0, w:gameWidth, h:gameHeight});
          this._fgImage = Crafty.e("2D, Canvas, fgSprite")
            .crop(0, 0, 600, 800)
            .attr({x:0, y:0, w:gameWidth, h:gameHeight});
          /*
          this._fgImage = Crafty.e("2D, Canvas, testSprite")
            .crop(0, 0, 600, 800)
            .attr({x:0, y:0, w:gameWidth, h:gameHeight-8});
          */
          
          this.bind("EnterFrame", function() {
            this._bgImage.y += 2 * scaleY;
            this._mdImage.y += 3 * scaleY;
            this._fgImage.y += 5 * scaleY;
            if(this._bgImage.y > 0) this._bgImage.y -= gameHeight;
            if(this._mdImage.y > 0) this._mdImage.y -= gameHeight;
            if(this._fgImage.y > 0) this._fgImage.y -= gameHeight;
          }); 
      }
    });
    
    //Crafty.e("Scroller2");

    Crafty.c("Scroller3", {
      init: function() {

        this.bind("EnterFrame", function() {
          if(Math.random() < .05) {
            Crafty.e("2D, Canvas, star3")
              .attr({x:Crafty.math.randomInt(0, gameWidth - 4), y:0,
                     alpha:Crafty.math.randomNumber(0,1),
                     speed:Crafty.math.randomInt(1, 5)})
              .bind("EnterFrame", function() {
                this.y += this.speed;
                if(this._y > gameHeight) this.destroy();
              });
          }
        });
      }
    });
    
    //Crafty.e("Scroller3");
    
  //returns a function that calculates lanczos weight
  function lanczosCreate(lobes){
    return function(x){
      if (x > lobes) 
        return 0;
      x *= Math.PI;
      if (Math.abs(x) < 1e-16) 
        return 1
      var xx = x / lobes;
      return Math.sin(x) * Math.sin(xx) / x / xx;
    }
  }

  //elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
  function thumbnailer(elem, img, sx, lobes){ 
      this.canvas = elem;
      elem.width = img.width;
      elem.height = img.height;
      elem.style.display = "none";
      this.ctx = elem.getContext("2d");
      this.ctx.drawImage(img, 0, 0);
      this.img = img;
      this.src = this.ctx.getImageData(0, 0, img.width, img.height);
      this.dest = {
          width: sx,
          height: Math.round(img.height * sx / img.width),
      };
      this.dest.data = new Array(this.dest.width * this.dest.height * 3);
      this.lanczos = lanczosCreate(lobes);
      this.ratio = img.width / sx;
      this.rcp_ratio = 2 / this.ratio;
      this.range2 = Math.ceil(this.ratio * lobes / 2);
      this.cacheLanc = {};
      this.center = {};
      this.icenter = {};
      setTimeout(this.process1, 0, this, 0);
  }

  thumbnailer.prototype.process1 = function(self, u){
      self.center.x = (u + 0.5) * self.ratio;
      self.icenter.x = Math.floor(self.center.x);
      for (var v = 0; v < self.dest.height; v++) {
          self.center.y = (v + 0.5) * self.ratio;
          self.icenter.y = Math.floor(self.center.y);
          var a, r, g, b;
          a = r = g = b = 0;
          for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
              if (i < 0 || i >= self.src.width) 
                  continue;
              var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
              if (!self.cacheLanc[f_x]) 
                  self.cacheLanc[f_x] = {};
              for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
                  if (j < 0 || j >= self.src.height) 
                      continue;
                  var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
                  if (self.cacheLanc[f_x][f_y] == undefined) 
                      self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
                  weight = self.cacheLanc[f_x][f_y];
                  if (weight > 0) {
                      var idx = (j * self.src.width + i) * 4;
                      a += weight;
                      r += weight * self.src.data[idx];
                      g += weight * self.src.data[idx + 1];
                      b += weight * self.src.data[idx + 2];
                  }
              }
          }
          var idx = (v * self.dest.width + u) * 3;
          self.dest.data[idx] = r / a;
          self.dest.data[idx + 1] = g / a;
          self.dest.data[idx + 2] = b / a;
      }

      if (++u < self.dest.width) 
          setTimeout(self.process1, 0, self, u);
      else 
          setTimeout(self.process2, 0, self);
  };
  thumbnailer.prototype.process2 = function(self){
      self.canvas.width = self.dest.width;
      self.canvas.height = self.dest.height;
      self.ctx.drawImage(self.img, 0, 0);
      self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
      var idx, idx2;
      for (var i = 0; i < self.dest.width; i++) {
          for (var j = 0; j < self.dest.height; j++) {
              idx = (j * self.dest.width + i) * 3;
              idx2 = (j * self.dest.width + i) * 4;
              self.src.data[idx2] = self.dest.data[idx];
              self.src.data[idx2 + 1] = self.dest.data[idx + 1];
              self.src.data[idx2 + 2] = self.dest.data[idx + 2];
          }
      }
      self.ctx.putImageData(self.src, 0, 0);
      self.canvas.style.display = "block";
  }  
    
    