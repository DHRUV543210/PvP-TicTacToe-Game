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
import { playDoorSound } from '../utils/tictactoeFunctions.js';

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

    //FUNCTION DEDICATED FOR COMPUTER - PLAY
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

    function handleComputerMove(index){

        //COMPUTER PLAYING LOGIC

        //UPDATING INDEXES STATE
        let newIndexes = [...indexes];
        
        //CALCULATING RANDOM MOVE
        const randomIndex = newIndexes[Math.floor(Math.random()* newIndexes.length)];
        const randomMoveRow = Math.floor(randomIndex/3);
        const randomMoveColumn = randomIndex % 3;

        const newBoard = [...board];

        if(newBoard[randomMoveRow][randomMoveColumn] === null){
            newBoard[randomMoveRow][randomMoveColumn] = 'O';
            setBoard(newBoard);

            newIndexes = newIndexes.filter(num => num !== randomIndex);
            setIndexes(newIndexes);
            setChanged(changed => changed+1);
            setCurrentPlayer('X');
        }
        
    }

    //USE EFFECT RUNS AFTER EVERYCHANGE IN CURRENTPLAYER ONLY IF IT IS 'O'
    useEffect(()=>{
        if(currentPlayer === 'O' && indexes.length > 0){
            const timer = setTimeout(()=>{
                handleComputerMove();
            }, 1400);

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