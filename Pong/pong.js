// 60fps animation a setTimeout funkciót hívja 60/mp
var animate=window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame   ||
    window.mozRequestAnimationFrame      ||
    function(callback) {
        window.setTimeout(callback,1000/60);
    };
// canvas létrehozása
var canvas=document.createElement('canvas');
var width=400;
var height=600;
canvas.width=width;
canvas.height=height;
var context=canvas.getContext('2d');
// Játékosok,labda
var player=new Player();
var computer= new Computer();
var ball= new Ball(200,300);


var render=function(){
    context.fillStyle="#33CC33";
    context.fillRect(0,0,width,height);
    player.render();
    computer.render();
    ball.render();
};

var update=function(){
    player.update(); 
    computer.update(ball); 
    ball.update(player.keeper,computer.keeper);
};

var keysDown={};

// Kapus kialakítása

function Keeper(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
};

Keeper.prototype.render=function(){
    context.fillStyle="#0000FF";
    context.fillRect(this.x,this.y,
        this.width,this.height);
};
// Kapusok mozgása
Keeper.prototype.move= function(x,y){
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) { // Teljesen balra
    this.x = 0;
    this.x_speed = 0;
    } 
    else if (this.x + this.width > 400) { // Teljesen jobbra
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}

// játékosok 
function Player(){
    this.keeper=new Keeper(175,580,50,10);
}

Player.prototype.render=function()
{
    this.keeper.render();
};
// játékos mozgás
Player.prototype.update= function(){
    for(var key in keysDown){
        var value=Number(key);
        if(value==37){
            this.keeper.move(-4,0);
        }
        else if(value==39){
            this.keeper.move(4,0);
        }
        else{this.keeper.move(0,0);
        }
    }
}


function Computer(){
    this.keeper=new Keeper(175,10,50,10);
}

Computer.prototype.render=function()
{
    this.keeper.render();
};

Computer.prototype.update=function(ball){
    var x_pos=ball.x;
    // pozició a labdához képest
    var diff=-((this.keeper.x+(this.keeper.width/2))-x_pos);
    // mozgás balra
    if(diff<0 && diff<-4){
        diff=-5;
    }
    // mozgás jobbra
    else if(diff>0 && diff>4){
        diff=5;
    }

    this.keeper.move(diff,0);
    // Balra maximum mozgás
        if(this.keeper.x<0){
            this.keeper=0;
        }
    // Jobbra maximum mozgás
        else if(this.keeper.x+this.keeper.width>400){
            this.keeper.x=400-this.keeper.width;
        }
};

// Labda
function Ball(x,y) {
    this.x=x;
    this.y=y;
    this.x_speed=0;
    this.y_speed=3;
}

Ball.prototype.render=function(){
    context.beginPath();
    context.arc(this.x,this.y,7,2*Math.PI,false);
    context.fillStyle="#000000";
    context.fill();
};
// Labda mozgás
Ball.prototype.update=function(keeper1,keeper2){
    this.x+=this.x_speed;
    this.y+=this.y_speed;
    var top_x=this.x-5;
    var top_y=this.y-5;
    var bottom_x=this.x+5;
    var bottom_y=this.y+5;
    // fal érintése
    if(this.x-5<0){
        // bal oldalról visszapattan
        this.x=5;
        // ugyanazzal a sebességgel csak ellenkező irányba
        this.x_speed=-this.x_speed;
    }
    else if(this.x+5>400){
        // jobb oldalról visszapattan
        this.x=395;
        this.x_speed=-this.x_speed;
    }

    if(this.y < 0 || this.y > 600) { // Gól és középkezdés
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
      }

    if(top_y>300){
        if(top_y<(keeper1.y+keeper1.height) &&
            bottom_y>keeper1.y && top_x<
            (keeper1.x+keeper1.width) &&
            bottom_x>keeper1.x){
                // játékos hozzáér a labdához
                // labda  y iránya megváltozik
                this.y_speed=-3;
                // labda x iránya megváltozik és más szögben pattan vissza
                this.x_speed+=(keeper1.x_speed/2);
                this.y+=this.y_speed;
            }
    }
    else{
        if(top_y<(keeper2.y+keeper2.height) &&
            bottom_y>keeper2.y && top_x<
            (keeper2.x+keeper2.width) &&
            bottom_x>keeper2.x){
                // computer hozzáér a labdához
                // labda  y iránya megváltozik
                this.y_speed=3;
                // labda x iránya megváltozik és más szögben pattan vissza
                this.x_speed+=(keeper2.x_speed/2);
                this.y+=this.y_speed;
            }
    }
};

var step=function () {
    update();
    render();
    animate(step);
};

// onload
window.onload=function(){
    document.body.appendChild(canvas);
    animate(step);
};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });
  
window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });

