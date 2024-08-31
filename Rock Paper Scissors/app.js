let userScore = 0;
let compScore = 0;
let resultPara = document.getElementById("msg");
let botScore = document.getElementById("comp-score")
let playerScore = document.getElementById("user-score")

const choices = ['rock', 'paper', 'scissor'];

//function to play game
function playGame(playerChoise){

    //generate com choice
    const comChoice = Math.floor(Math.random()*choices.length);
    const bot = choices[comChoice]
    //calculate result
    let result = '';
    if(playerChoise===bot){
        result = "It's a tie!";
        resultPara.style.backgroundColor = "gray";
    }else if((playerChoise==='rock' && bot==='scissor') 
            || (playerChoise==='paper' && bot==='rock') 
            || (playerChoise==='scissor' && bot==='paper'))
            {
              result = "You Win !";
              userScore++;
              playerScore.innerText = userScore;
              resultPara.style.backgroundColor = "green";
    }else{
        result = "You lose";
        compScore++;
        botScore.innerText = compScore;
        resultPara.style.backgroundColor = "red";
    }

    //display

document.getElementById("msg").innerText = `you chose ${playerChoise}, computer chose ${choices[comChoice]}, ${result}`;
}

function resetGame(){
    document.getElementById("msg").innerText = "Play your move !";
    botScore.innerHTML = 0;
    playerScore.innerHTML = 0;
    userScore = 0;
    compScore = 0;
    resultPara.style.backgroundColor = "#081b31";
}
