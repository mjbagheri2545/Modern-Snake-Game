const UNIT_SIZE = 40;
const TIME_INTERVAL = 170;;
let bodyParts = 0;
let direction = 'right';
let pos;
let frame = 0;
class Vector{
    constructor(x = 0,y = 0){
        this.x = x;
        this.y = y;
    }
    add(vector){
        this.x += vector.x;
        this.y += vector.y;
    }
}
class Canvas{
    constructor(){
        this.cvs = document.querySelector('canvas');
        this.ctx = this.cvs.getContext('2d');
        this.cvs.height = '600';
        this.cvs.width = '800';
        this.h = 600;
        this.w = 800;
    }
    draw(
        position = new Vector(),
        color = 'rgb(1, 70, 1)'
    ){
        this.ctx.beginPath();
        this.ctx.rect(position.x,position.y,UNIT_SIZE,UNIT_SIZE);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
        
    }
}

let c = new Canvas();

class Snake{
    constructor(position){
    this.position = position || new Vector(randomNumber(c.w/UNIT_SIZE),randomNumber(c.h/UNIT_SIZE));
    this.rotation = 0;
    this.velocity = new Vector(UNIT_SIZE,0);
    }
    draw(){
    c.draw(this.position);
    }
    update(){
        this.move();
        pos = new Vector(this.position.x,this.position.y);
        pos.add(this.velocity);
    }
    move(){
        if(direction == 'right'){
            this.velocity.x = UNIT_SIZE;
            this.velocity.y = 0;
        }else if(direction == 'left'){
            this.velocity.x = -UNIT_SIZE;
            this.velocity.y = 0;
        }else if(direction == 'up'){
            this.velocity.y = -UNIT_SIZE;
            this.velocity.x = 0;
        }else if(direction == 'down'){
            this.velocity.y = UNIT_SIZE;
            this.velocity.x = 0;
        }
    }
}

let snakes = [];

snakes.unshift(new Snake(new Vector(200,160)));
bodyParts+=1;

class Apple{
    constructor(position){
    this.position = position || new Vector(randomNumber(c.w/UNIT_SIZE),randomNumber(c.h/UNIT_SIZE));
    }
    draw(){
    c.draw(this.position);
    }
    update(){
        if(snakes[0].position.x != this.position.x || snakes[0].position.y != this.position.y){
            snakes.pop();
        }else{
            this.position = new Vector(randomNumber(c.w/UNIT_SIZE),randomNumber(c.h/UNIT_SIZE));
            bodyParts+=1;
        }
    }
}

let food = new Apple();

function lineDrawing(){
    for(let i = 0;i<c.h/UNIT_SIZE;i++){
        c.ctx.beginPath();
        c.ctx.moveTo(0,i*UNIT_SIZE);
        c.ctx.lineTo(c.w,i*UNIT_SIZE);
        c.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        c.ctx.lineWidth = 1;
        c.ctx.stroke();
    }
    for(let i = 0;i<c.w/UNIT_SIZE;i++){
        c.ctx.beginPath();
        c.ctx.moveTo(i*UNIT_SIZE,0);
        c.ctx.lineTo(i*UNIT_SIZE,c.h);
        c.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        c.ctx.lineWidth = 1;
        c.ctx.stroke();
    }
}

lineDrawing();

function animation(){
    c.ctx.clearRect(0,0,c.w,c.h);
    snakes.forEach((snake)=>{
        snake.draw();
    })
    bodyHit();
    edgeHit();
    food.draw();
    snakes[0].update();
    food.update();
    snakes.unshift(new Snake(pos));
    lineDrawing();
}

let game = setInterval(animation,TIME_INTERVAL);

function randomNumber(number){
    let rand = Math.floor(Math.random() * (number)) * UNIT_SIZE;
    return rand;
}

function bodyHit(){
    if(bodyParts>=2){
        for(let i =1;i<bodyParts;i++){
            if(snakes[i].position.x == snakes[0].position.x && snakes[i].position.y == snakes[0].position.y){
                gameOver();
            }
        }
    }
}

function edgeHit(){
    if(snakes[0].position.x >= c.w || snakes[0].position.x <= -UNIT_SIZE){
        gameOver();
    }
    if(snakes[0].position.y >= c.h || snakes[0].position.y <= -UNIT_SIZE){
        gameOver();
    }
}

function gameOver(){
    clearInterval(game);
    let span = document.createElement('span');
    span.innerHTML = 'You Hit Something . </br> Sorry, GameOver :(';
    span.classList.add('gameover');
    document.body.appendChild(span);
}

document.addEventListener('keydown',(e)=>{
    if(e.which == 87 && direction != 'down'){
        direction = 'up';
    }else if(e.which == 83 && direction != 'up'){
        direction = 'down';
    }else if(e.which == 68 && direction != 'left'){
        direction = 'right';
    }else if(e.which == 65 && direction != 'right'){
        direction = 'left';
    }
})