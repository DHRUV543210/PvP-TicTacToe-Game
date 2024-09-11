import './App.css';

//Contexts
import { GameProvider } from './Components/Tic-Tac-Toe/utils/GameContext.js';

//Component

import TicTacToe from './Components/Tic-Tac-Toe/tictactoe.jsx';

function App() {
  return (
    <div className="App">

      {/* Tic-Tac-Toe */}
      <GameProvider>

      <TicTacToe started = {false}/>
      
      </GameProvider>

    </div>
  )
}

export default App;
