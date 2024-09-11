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

export default function OnlinePlayMain({player1, player2, side}){

    //DESTRUCTURING THE REQUIRED ONES
    const {
        board,
        setBoard,
        setWinner,
        setCurrentPlayer,
        setIsGameOver,
        setChanged,
        playTapSound,
        handleCellClick,
        handleCellClickForOnlinePlay,
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
        checkForWinner

    } = useContext(GameContext);

    const [universalBoard, setUniversalBoard] = useState(Array(3).fill(null).map(()=> Array(3).fill(null)));
    const [actualChance, setActualChance] = useState('X');

    //FUNCTION TO FETCH THE CURRENT BOARD STATUS FROM THE SERVER
    const fetchBoardStatus = async () => {
        const res = await fetch('https://pv-p-tic-tac-toe-game-server.vercel.app/get-board-status', {
            method: 'GET',
            credentials: 'include',
        })

        const data = await res.json();
        // console.log(data.board);

        if(data.currentPlayer && data.board && data.changed){
            // console.log(data.currentPlayer)
            // if(data.board !== universalBoard) console.log(data.board); 
            setUniversalBoard(data.board);
            setActualChance(data.currentPlayer);
            setChanged(data.changed);
        }
    }

    //USE EFFECT FOR DRAW
    useEffect(()=>{
        if(!winner && changed === 9){
            setWinner("NoOne");
        }
    },[changed]);

    //POLL THE SERVER EVERY 300MS TO GET THE LATEST BOARD STATUS (POLLING)
    useEffect(()=>{
        const interval = setInterval(()=>{
            fetchBoardStatus();
        }, 300);

        return () => clearInterval(interval);
    },[])

    // CHECKING FOR WINNER
    useEffect(()=>{
        if(changed){
            checkForWinner(universalBoard, winner, setWinner, setIsGameOver);
        }
    },[changed]);

    // useEffect for !winner
    useEffect(()=>{
        if(!winner){
            fetchBoardStatus();
        }
    },[winner])

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
                                            if(universalBoard[row][col] === null && actualChance === side){
                                                handleCellClickForOnlinePlay(row, col, universalBoard, actualChance, changed, setUniversalBoard , setActualChance, setChanged);
                                            }
                                        }}
                                        onMouseOver={()=>playHoverSound(hoverSound, hoverSuppressed)} >
                                            <h1>
                                                {
                                                    universalBoard[row][col] === 'X' ? 'X' : universalBoard[row][col] === 'O' ? 'O' : ''
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
                            >{actualChance === 'X' ? `${player1}\'s Chance` : `${player2}\'s Chance`}</h1>
                            
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
                                    player1={player1}
                                    player2={player2}
                                    mode = {'OnlineMode'}
                                    setWinner = {setWinner}
                                    setUniversalBoard={setUniversalBoard}
                                    />
                                )}
                            </>
                        )
                    }
                    </>
    )
}