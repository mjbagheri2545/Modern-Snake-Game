let cvs = document.querySelector('canvas');
let c = cvs.getContext('2d');

cvs.height = '510';
cvs.width = '600';

const UNIT_SIZE = 30;
let bodyParts = 0;

for(let i = 0;i<cvs.height/UNIT_SIZE;i++){
    c.beginPath();
    c.moveTo(0,i*UNIT_SIZE);
    c.lineTo(cvs.width,i*UNIT_SIZE);
    c.strokeStyle = 'rgba(0, 0, 0, 1)';
    c.lineWidth = 1;
    c.stroke();
}
for(let i = 0;i<cvs.width/UNIT_SIZE;i++){
    c.beginPath();
    c.moveTo(i*UNIT_SIZE,0);
    c.lineTo(i*UNIT_SIZE,cvs.height);
    c.strokeStyle = 'rgba(0, 0, 0, 1)';
    c.lineWidth = 1;
    c.stroke();
}

class Vector{
    constructor(x = 0,y = 0){
    this.x = x;
    this.y = y;
    }
}
class Snake{
    constructor(position = new Vector()){
    this.position = position;
    }
    draw(){
    c.beginPath();
    c.rect(this.position.x,this.position.y,UNIT_SIZE,UNIT_SIZE);
    c.fillStyle = 'rgb(1, 41, 1)';
    c.fill();
    }
    update(){

    }
}

let s = new Snake(new Vector(Math.floor(Math.random() * 17)* UNIT_SIZE,Math.floor(Math.random() * 20)* UNIT_SIZE));
s.draw();
