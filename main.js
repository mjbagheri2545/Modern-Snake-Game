const UNIT_SIZE = 40;
let allowStart = false;
let bodyParts = 0;
let direction = 'right';
let pos;
let speedInput = document.querySelector('#gamespeed');
let speedValue = document.querySelector('.speedValue');
let timeInterval = 1100 - speedInput.value;
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
        color
    ){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(position.x,position.y,UNIT_SIZE,UNIT_SIZE);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
        
    }
}

let c = new Canvas();

class Score{
    constructor(){
        this.scoreTag = document.querySelector('.score');
        this.bestScoreTag = document.querySelector('.best-score');
        this.score = parseInt(this.scoreTag.innerText);
        this.bestScoreTag.innerText = parseInt(localStorage.getItem('bestscore'));
        this.bestScore = parseInt(localStorage.getItem('bestscore'))> 0 ? parseInt(localStorage.getItem('bestscore')) : parseInt(this.bestScoreTag.innerText);
    }
    update(){
        this.score += Math.floor(speedInput.value/50);
        this.scoreTag.innerText = this.score;
    }
    gameover(){
        this.bestScore = this.score;
        this.bestScoreTag.innerText = this.bestScore;
        localStorage.setItem('bestscore',this.bestScore);
    }
}

let score = new Score();
class Snake{
    constructor(position,color){
    this.position = position;
    this.rotation = 0;
    this.velocity = new Vector(UNIT_SIZE,0);
    this.color = color;
    }
    draw(){
    c.draw(this.position,this.color);
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

snakes.unshift(new Snake(new Vector(200,160),'rgb(1, 70, 1)'));
bodyParts+=1;

class Apple{
    constructor(position){
    this.position = position || new Vector(randomNumber(c.w/UNIT_SIZE),randomNumber(c.h/UNIT_SIZE));
    this.color = 'rgb(150, 8, 8)';
    this.radius = UNIT_SIZE/2;
    }
    draw(){
    c.ctx.beginPath();
    c.ctx.save();
    c.ctx.arc(this.position.x + UNIT_SIZE/2,this.position.y + UNIT_SIZE/2,this.radius,0,2*Math.PI);
    c.ctx.fillStyle = this.color;
    c.ctx.fill();
    c.ctx.restore();
    }
    update(){
        if(snakes[0].position.x != this.position.x || snakes[0].position.y != this.position.y){
            snakes.pop();
        }else{
            this.position = new Vector(randomNumber(c.w/UNIT_SIZE),randomNumber(c.h/UNIT_SIZE));
            bodyParts+=1;
            score.update();
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
    bodyHit();
    edgeHit();
    food.draw();
    snakes.forEach((snake)=>{
        snake.draw();
    })
    if(allowStart){
        snakes[0].update();
        food.update();
        snakes.unshift(new Snake(pos,'rgb(1, 70, 1)'));
    }
    lineDrawing();
}

let game = setInterval(animation,timeInterval);

function randomNumber(number){
    let rand = Math.floor(Math.random() * (number)) * UNIT_SIZE;
    return rand;
}

function bodyHit(){
    if(bodyParts>=2){
        for(let i =1;i<bodyParts;i++){
            if(snakes[i].position.x == snakes[0].position.x && snakes[i].position.y == snakes[0].position.y){
                snakes[i].color = 'rgb(255, 165, 0)';
                snakes[0].color = 'rgb(255, 165, 0)';
                snakes[i].draw();
                snakes[0].draw();
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
    if(score.score > score.bestScore){
        score.gameover();
    }
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
    if(e.which == 32){
        allowStart = true;
    }
})
speedInput.addEventListener('input',speedChanger);
function speedChanger(){
    speedInput.style.setProperty('--progressBarWidth',(speedInput.value - 100)/(90/25)+'px');
    speedValue.innerText = speedInput.value;
    clearInterval(game);
    timeInterval = 1100 - speedInput.value;
    game = setInterval(animation,timeInterval);
}