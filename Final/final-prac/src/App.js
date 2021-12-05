import React, { useEffect } from 'react';

const Game = () => {
  const choices = ["paper", "scissors", "rock"];
  const [computer, setComputer] = React.useState("");
  const [player, setPlayer] = React.useState("");
  const [result, setResult] = React.useState("");
  const [score, setScore] = React.useState(0);


  const getComputer = () => {
    const index = Math.floor(Math.random() * 3);
    setComputer(choices[index]);
  }

  const getResult = () => {
    console.log(player, " ", computer)
    if (player === "scissors" && computer === "scissors") {
      setResult("draw");
    }
    else if (player === "rock" && computer === "rock") {
      setResult("draw");
    }
    else if (player === "paper" && computer === "paper") {
      setResult("draw");
    }
    else if (player === "scissors" && computer === "rock") {
      setResult("computer won");
      setScore(score - 1);
    }
    else if (player === "scissors" && computer === "paper") {
      setResult("player won");
      setScore(score + 1);
    }
    else if (player === "paper" && computer === "scissors") {
      setResult("computer won");
      setScore(score - 1);
    }
    else if (player === "paper" && computer === "rock") {
      setResult("player won");
      setScore(score + 1);
    }
    else if (player === "rock" && computer === "scissors") {
      setResult("player won");
      setScore(score + 1);
    }
    else if (player === "rock" && computer === "paper") {
      setResult("computer won");
      setScore(score - 1);
    }
  }

  useEffect(() => {
    getResult()
  }, [player, computer])

  const playAgain = () => {
    setPlayer("")
    setComputer("");
    setResult("");
    setScore(0);
  }


  return (
    <div className="Game">


      <div className="player">
        Please choose your choice:
        <button className="choice" onClick={() => {
          setPlayer("paper")
          if (result !== "") {
            getComputer()
            getResult()
          }
        }}>
          Paper
        </button>
        <button className="choice" onClick={() => {
          setPlayer("scissors")
          if (result !== "") {
            getComputer()
            getResult()
          }
        }}>
          Scissors
        </button>
        <button className="choice" onClick={() => {
          setPlayer("rock")
          if (result !== "") {
            getComputer()
            getResult()
          }
        }}>
          Rock
        </button>
      </div>

      <button onClick={getComputer}> Run the game</button>
      <div className="Player">
        Your choice: {player}
      </div>
      <div className="computer">
        Computer's choice: {computer}
      </div>
      <div className="result" >
        The result is : {result}
      </div>
      <div className="score" >
        Your score is : {score}
      </div>
      <button onClick={playAgain}> Play again</button>

    </div>
  );
}



function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
