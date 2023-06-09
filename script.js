const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry when we display the end menu
const gameContainer = document.getElementById('game-container');



const flappyImg = new Image();
flappyImg.src = 'imgs/logo.jfif';


//game constants
const FLAP_SPEED =  -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

document.body.onkeyup = function(e){
    if(e.code == 'Space'){
        birdVelocity = FLAP_SPEED;
    }
}

document.getElementById('restart-button').addEventListener('click',function() {
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore(){
    if(birdX > PIPE_WIDTH 
        && (birdY < pipeY + PIPE_GAP 
            || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP)){
                score++;
                scoreDiv.innerHTML = score;
            }
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

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    if(highScore < score){
        highScore = score;
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
    document.getElementById('score-display').innerHTML = score;
}

function endGame(){
    showEndMenu(); 
}



function loop(){
    //reset the ctx after every loop iteration
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //draw flappy bird
    ctx.drawImage(flappyImg,birdX,birdY,BIRD_WIDTH,BIRD_HEIGHT);

    //draw pipe
    ctx.fillStyle = '#333'; 
    ctx.fillRect(pipeX,-100,PIPE_WIDTH,pipeY);
    ctx.fillStyle = 'red';
    ctx.fillRect(pipeX,pipeY+PIPE_GAP,PIPE_WIDTH,canvas.height-pipeY);

    //collision
    if(collisionCheck()){
        endGame();
        return;
    }

    //move pipe
    pipeX -= 1.5; 
    
    if(pipeX <= -50){
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }
    console.log(pipeX);
    if(pipeX == 7){
        score++;
        document.getElementById("score-display").innerHTML = score;
    }

    //gravity
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore()
    requestAnimationFrame(loop);
    

    
}
//34.30


loop();