const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry when we display the end menu
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score-display');
const dashDisplay = document.getElementById("dash-display");
const control = document.getElementById("control");

const background = new Image();
background.src = 'imgs/sea.jpg';
let backgroundX = 0;
let backgroundY = 0;
const flappyImg = new Image();
flappyImg.src = 'imgs/birdWingUp.png';
const flappyWingImg = new Image();
flappyWingImg.src = 'imgs/birdWingDown.png';
const flappyDash = new Image();
flappyDash.src = 'imgs/birder.png';

const dashItemRed = new Image();
dashItemRed.src = 'imgs/redPearl.png';
const dashItemGreen = new Image();
dashItemGreen.src = 'imgs/greenPearl.png';
const dashItemBlue = new Image();
dashItemBlue.src = 'imgs/bluePearl.png';
const dashItemYellow = new Image();
dashItemYellow.src = 'imgs/yellowPearl.png';

const pipeUp = new Image();
pipeUp.src = 'imgs/tropicalTree.png';
const pipeDown = new Image();
pipeDown.src = 'imgs/tropicalTreeDown.png';


//game constants
const FLAP_SPEED =  -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;
const dashItem_WIDTH = 25;
const dashItem_HEIGHT = 25;

//Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

let dashItemX = 400;
let dashItemY = Math.floor(Math.random() * 600 + 1);

let dashItemShowX = 250;
let dashItemShowY = 50;

// score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let score2 = 0;
let highScore = 0;
let rounds = 0;
let dash = 0;

let bird;
let birdFlap;

let flyer = "up";

let itemStop = true;

let pauseGame = false;

let initX = 0;
let initY = 0;


document.onkeyup = function(e){
    if(e.code == 'Space'){
        flyer = "up";
        birdVelocity = FLAP_SPEED; 
    } 
}

document.onkeydown = function(e){
    if(e.code === 'Space'){
        flyer = "down";
         
    } 
}

document.addEventListener('keydown', function(e){
    if(e.key === 'd' && dash > 0){
        flyer = "down";
        dashDisplay.style.color = "red";
    }
    
 })

 document.addEventListener('keyup', function(e){
    if(e.key === 'd' && dash > 0){
        flyer = "dash";
        pipeX -= 160;
        birdVelocity = -1;
        backgroundX -= 16;
        if(rounds > 4 && dashItemX < 400){
            dashItemX -= 160;
        }
        dash--;
        
    }
    dashDisplay.style.color = "white";
    dashDisplay.innerHTML = dash;
 })

control.onclick = (() => {
    if(pauseGame == false){
        pauseGame = true;
        pauseIcon.classList.add("fa-play-circle");
        pauseIcon.classList.remove("fa-pause-circle");
    }
    else if(pauseGame == true){
        pauseGame = false;
        pauseIcon.classList.remove("fa-play-circle");
        pauseIcon.classList.add("fa-pause-circle");
        loop();
    }
})

function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        console.log("enter");
        return false;
    }
}
//pauseGame
document.body.onkeydown = function(e){
    if(e.code == 'Enter' && pauseGame == false){
        pauseGame = true;
        pauseIcon.classList.add("fa-play-circle");
        pauseIcon.classList.remove("fa-pause-circle"); 
    }
    else if(e.code == 'Enter' && pauseGame == true){
        pauseGame = false;
        pauseIcon.classList.remove("fa-play-circle");
        pauseIcon.classList.add("fa-pause-circle");
        loop();
    }
}

document.getElementById('restart-button').addEventListener('click',function() {
    control.style.display = "block";
    hideEndMenu();
    resetGame();
    loop();
})

document.getElementById('start-button').onclick = function(){
    hideStartMenu();
    control.style.display = "block";
    loop();
}



function increaseScore(){
    if(birdX > PIPE_WIDTH 
        && (birdY < pipeY + PIPE_GAP 
            || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP)){
                score++;
                scoreDiv.innerHTML = score;
            }
}
function getDashItem(){
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const dashItemLocate = {
        x: dashItemX,
        y: dashItemY,
        width: dashItemX+dashItem_WIDTH,
        height: dashItemY+dashItem_HEIGHT
    }

    if(birdBox.x+birdBox.width > dashItemLocate.x &&
        birdBox.x < dashItemLocate.x+dashItemLocate.width &&
        birdBox.y+birdBox.height > dashItemLocate.y &&
        birdBox.y < dashItemLocate.y+dashItemLocate.height){
            return true;
        }
    return false;
}

function collisionCheck(){
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width : PIPE_WIDTH,
        height : pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y : pipeY + PIPE_GAP + BIRD_HEIGHT,
        width : PIPE_WIDTH,
        height : canvas.height - pipeY - PIPE_GAP
    }

    if(birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
        }
    if(birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y+birdBox.height*2 > bottomPipeBox.y){
            return true;
        }

    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }

    return false;
}

function showStartMenu(){
    document.getElementById('start-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
}

function hideStartMenu(){
    document.getElementById('start-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu(){
    control.style.display = "none";
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    score2 = highScore;
    if(highScore < score){
        highScore = score;
        document.getElementById('best-score').style.color = "green";
        
    }
    else if(highScore > score){
        document.getElementById('best-score').style.color = "red";
    }
    else if(highScore == score){
        document.getElementById('best-score').style.color = "black";
    }

    document.getElementById('best-score').innerHTML = highScore;
}


function resetGame()  {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
    rounds = 0;
    dash = 0;
    document.getElementById("dash-display").innerHTML = dash;
    dashItemX = 400;
    backgroundX = 0;
    document.getElementById('score-display').innerHTML = score;
}

function endGame(){
    showEndMenu(); 
}

function flyerMotion(){
    if(flyer == "up"){
        bird = ctx.drawImage(flappyImg,birdX,birdY,BIRD_WIDTH,BIRD_HEIGHT);
    }
    else if(flyer == "down"){
        bird = ctx.drawImage(flappyWingImg,birdX,birdY,BIRD_WIDTH,BIRD_HEIGHT);
    }
    else if(flyer == "dash"){
        bird = ctx.drawImage(flappyDash,birdX,birdY,BIRD_WIDTH,BIRD_HEIGHT);
    }
}

function dashItemMotion(){
    if(dashItemX % 2){
        ctx.drawImage(dashItemRed,dashItemX,dashItemY,dashItem_WIDTH,dashItem_HEIGHT);
    }
    else if(dashItemX % 3){
        ctx.drawImage(dashItemGreen,dashItemX,dashItemY,dashItem_WIDTH,dashItem_HEIGHT);
    }
    else if(dashItemX % 5){
        ctx.drawImage(dashItemBlue,dashItemX,dashItemY,dashItem_WIDTH,dashItem_HEIGHT);
    }
    else if(dashItemX % 7){
        ctx.drawImage(dashItemYellow,dashItemX,dashItemY,dashItem_WIDTH,dashItem_HEIGHT);
    }
    
}

async function loop(){
    //reset the ctx after every loop iteration
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(background,backgroundX,backgroundY,800,600);
    if(backgroundX < -200){
        backgroundX = 0;
    }
    
    //draw flappy bird
    //bird = ctx.drawImage(flappyImg,birdX,birdY,BIRD_WIDTH,BIRD_HEIGHT);
    dashItemMotion();

    flyerMotion();
    //draw pipe
    // ctx.fillStyle = '#333'; 
    // ctx.fillRect(pipeX,-100,PIPE_WIDTH,pipeY);
    // ctx.fillRect(pipeX,pipeY+PIPE_GAP,PIPE_WIDTH,canvas.height-pipeY);
    ctx.drawImage(pipeDown,pipeX,-100,PIPE_WIDTH,pipeY);
    ctx.drawImage(pipeUp,pipeX,pipeY+PIPE_GAP,PIPE_WIDTH,canvas.height-pipeY);
    //collision
    if(collisionCheck()){
        endGame();
        return;
    }

    if(pauseGame){
        return;
    }
    //dashItem
    dashDisplay.style.color = "white";
    dashDisplay.innerHTML = dash;
    if(getDashItem()){
        dashItemX = -40;
        dash += 2;
        dashDisplay.style.color = "green";
        dashDisplay.innerHTML = dash;
    }

    //move pipe
    if(rounds < 15){
        pipeX -= 1.5; 
        backgroundX -= 0.1;
    }
    else if(rounds >= 15 && rounds < 40){
        pipeX -= rounds / 10;
        backgroundX -= rounds/100;
    }
    else if(rounds >= 40){
        pipeX -= 4;
        backgroundX -= 0.4;
    }

    if(pipeX <= -45){
        rounds++;
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
        score = rounds;
        scoreDisplay.innerHTML = score;
    }
    
    if(pipeX <= 7 && rounds == score){
        scoreDisplay.style.color = "blue";
        scoreDisplay.style.fontSize = 1.5+"em"; 
        score++;
        document.getElementById("score-display").innerHTML = score;
    }
    if(pipeX <= -15 && score - rounds >= 0){
        // scoreDisplay.style.margin = 20+"px";
        scoreDisplay.style.color = "white";
        scoreDisplay.style.fontSize = 1.5+"em";
        scoreDisplay.innerHTML = score;
    }

    //dashItem
    if(itemStop == false){
        dashItemX -= 1;
    }
    else if(itemStop == true){
        dashItemX = 400;
        dashItemY = Math.floor(Math.random() * 500 + 100);
        if(rounds%5 == 0 && rounds > 2){
            itemStop = false;
        }
    }
    if(dashItemX < -20){
        itemStop = true;
        dashItemX = -40;
    }
    
    //gravity
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore()
    requestAnimationFrame(loop);
}
//34.30


//loop();