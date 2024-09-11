import { useContext, useEffect, useState } from 'react';
import style from '../tictactoe.css';
import { GameContext } from '../utils/GameContext.js';

//MODAL
import VictoryModal from '../victory.jsx'

//SOUNDS
import hoverSound from '../Sounds/scifi-hover.wav'
import tapSound from '../Sounds/scifi-tap.wav'
import winSound from '../Sounds/Win.wav'
import doorSound from '../Sounds/door-open.mp3'
import { checkForWinner, playDoorSound } from '../utils/tictactoeFunctions.js';

export default function ComputerPlay(){

    //DESTRUCTURING THE REQUIRED ONES
    const {
        board,
        setWinner,
        setBoard,
        setCurrentPlayer,
        setChanged,
        playTapSound,
        handleCellClick,
        playHoverSound,
        changed,
        currentPlayer,
        winner,
        winSoundPlayed,
        playWinSound,
        setWinSoundPlayed,
        setShowModal,
        showModal,
        hoverSuppressed,
        setHoverSuppressed,

    } = useContext(GameContext);

    //STATE FOR INDEXES
    const [indexes, setIndexes] = useState([0,1,2,3,4,5,6,7,8]);
    const [humanPlayer, setHumanPlayer] = useState('X');
    const [computerSymbol, setComputerSymbol] = useState('O');
    
    function handleCellClickHuman(row, col, index){
        const newBoard = [...board];
        newBoard[row][col] = 'X';
        setBoard(newBoard);
    
        let newIndexes = [...indexes];
        newIndexes = newIndexes.filter(num => num !== index);
        setIndexes(newIndexes);
    
        setChanged(changed=> changed+1);
        
        console.log(board);
    
        //SWITCH TO COMPUTER'S TURN
        setCurrentPlayer('O');
    
    }

// _________________________________________________________________________________________________
//FUNCTIONs DEDICATED FOR COMPUTER - PLAY

    function bestMove(){

        let bestScore = -Infinity;
        let move;

        //AI to make its turn
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(board[i][j] === ''){
                    let depth0Board = [...board];
                    depth0Board[i][j] = 'O';

                    let currentChanged = changed;
                    let score = minimax(depth0Board, 0, false, currentChanged);

                    if(score > bestScore){
                        bestScore = score;
                        move = {i, j};
                    }
                }
            }
        }

        if(move){
            const newBoard = [...board];
            newBoard[move.i][move.j] = 'O';
            setBoard(newBoard);
            setChanged(changed => changed + 1);
            setCurrentPlayer('X');
        }
        else{
            console.log("move", move);
            console.log(board);
            console.log(changed);
            console.log("winner", winner);
            console.log("current player", currentPlayer);
        }
    }

    function checkTempWinner(board, occupied){

        let winner;
        //CHECKING IN ROWS
        for(let j=0; j<3; j++){
            if(board[j][0] === board[j][1] && board[j][1] === board[j][2] && board[j][0] !== null){
                winner = board[j][0];
                return winner;
            }
        }

        //CHECKING FOR COLUMNS
        if(!winner){
            for(let i=0; i<3; i++){
                if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== null){
                    winner = board[0][i];
                    return winner;
                }
            }
        }

        //CHECKS FOR DIAGONALS
        if(!winner){
            if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== null){
                winner = board[0][0];
                return winner;
            }
            else if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== null){
                winner = board[0][2];
                return winner;
            }
        }
        if(winner == null && occupied === 9) return 'DRAW';
        else return winner;
    }

    let scores ={
        'X' : -1,
        'O' : 1,
        'DRAW' : 0,
    }

    function minimax(board, depth, isMaximizing, currentChanged){

        let occupied = currentChanged;

        let result = checkTempWinner(board, occupied);
        if(result in scores){
            console.log(result);
            let score = scores[result];
            return score;
        }
        else{
            console.error("Unexpected result value " + result);
        }

        if(isMaximizing){

            let bestScore = -Infinity;

            for(let i=0; i<3; i++){
                for(let j=0; j<3; j++){
                    if(board[i][j] === ''){
                        board[i][j] = 'O';
                        let score = minimax(board, depth+1, false, occupied+1);
                        board[i][j] = '';

                        if(score > bestScore) bestScore = score;
                    }
                }
            }

            return bestScore;
        }

        else{

            let bestScore = Infinity;

            for(let i=0; i<3; i++){
                for(let j=0; j<3; j++){
                    if(board[i][j] === ''){
                        board[i][j] = 'X';
                        
                        let score = minimax(board, depth + 1, true, occupied + 1);

                        board[i][j] = '';

                        if(score < bestScore){
                            bestScore = score;
                        }
                    }
                }
            }

            return bestScore;
        }

    }

// ________________________________________________________________________________________________

    //USE EFFECT RUNS AFTER EVERYCHANGE IN CURRENTPLAYER ONLY IF IT IS 'O'
    useEffect(()=>{
        if(currentPlayer === 'O'){
            const timer = setTimeout(()=>{
                bestMove();
            }, 300);

            return ()=> clearTimeout(timer); //CLEANUP TIMER
        }
    }, [currentPlayer, indexes]); //RUN WHEN CURRENTPLAYER OR INDEXES CHANGES

    //USE EFFFECT TO CHECK DRAW
    useEffect(()=>{
        if(!winner && changed === 9){
            setWinner('NoOne');
        }
    },[changed])

    return(
        <>
                    <div className="game">
                        <div className="boxTic">
                            {
                                Array(9).fill(0).map((_,index)=>{
                                    const row = Math.floor(index/3);
                                    const col = index % 3;

                                    return(
                                        <div 
                                        key={`${row}-${col}`}
                                        className="smallBoxes"
                                        onClick={()=>{
                                            playTapSound(tapSound,setHoverSuppressed);
                                            if(board[row][col] === null && currentPlayer === 'X'){
                                                handleCellClickHuman(row, col, index);
                                            }
                                        }}
                                        onMouseOver={()=>playHoverSound(hoverSound, hoverSuppressed)} >
                                            <h1>
                                                {
                                                    board[row][col] === 'X' ? 'X' : board[row][col] === 'O' ? 'O' : ''
                                                }
                                            </h1>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            <h1
                            key={changed}
                            className={
                                `h1InGame ${changed ? 'fade' : ''}`
                            }
                            >{currentPlayer === 'X' ? 'Your Chance' : 'Computer\'s Chance'}</h1>
                            
                        }
                    </div>
                    {
                        winner && (
                            <>
                                {!winSoundPlayed && setTimeout(()=> {
                                    playWinSound(winSound);
                                    setWinSoundPlayed(true);
                                    setShowModal(true);
                                }, 0)}

                                
                                {showModal && (
                                    <VictoryModal
                                    winner = {winner}
                                    winSoundPlayed = {winSoundPlayed}
                                    doorSound = {doorSound}
                                    playDoorSound = {playDoorSound}
                                    player1={"You"}
                                    player2={"Computer"}
                                    mode={'ComputerMode'}
                                    setBoard = {setBoard}
                                    setWinner={setWinner}
                                    setChanged = {setChanged}
                                    setCurrentPlayer = {setCurrentPlayer}
                                    />
                                )}
                            </>
                        )
                    }
                    </>
    )
}