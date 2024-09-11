import { useContext, useEffect } from 'react';
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

export default function SelfPlay(){

    //DESTRUCTURING THE REQUIRED ONES
    const {
        board,
        setBoard,
        setWinner,
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

    //USE EFFECT FOR DRAW
    useEffect(()=>{
        if(!winner && changed === 9){
            setWinner("NoOne");
        }
    },[changed]);

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
                                            if(board[row][col] === null){
                                                handleCellClick(row, col, board, currentPlayer, setBoard, setCurrentPlayer, setChanged);
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
                            >{currentPlayer === 'X' ? 'Player 1\'s Chance' : 'Player 2\'s Chance'}</h1>
                            
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
                                    player1={"player1"}
                                    player2={"player2"}
                                    mode={'SelfMode'}
                                    setBoard={setBoard}
                                    setWinner={setWinner}
                                    setChanged = {setChanged}
                                    setCurrentPlayer={setCurrentPlayer}
                                    />
                                )}
                            </>
                        )
                    }
                    </>
    )
}