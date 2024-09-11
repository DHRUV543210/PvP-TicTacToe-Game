import { useEffect, useState, useContext } from 'react';

//IMPORTING GAME - CONTEXT
import { GameContext } from './utils/GameContext.js';

//PLAY - MODES
import SelfPlay from './components/selfplay.jsx'
import ComputerPlay from './components/computerPlay.jsx';
import OnlinePlay from './components/onlinePlay.jsx';

//SOUNDS

import universalMusic from './Sounds/stranger-things.mp3'

//CSS
import './tictactoe.css'

export default function TicTacToe({started}){

    //DESTRUCTURING THE REQUIRED ONES
    const {
        getStarted,
        setStarted,
        checkForWinner,
        playUniversalMusic,
        setBoard,
        changed,
        board,
        winner,
        setWinner,
        setIsGameOver,
    } = useContext(GameContext);
    
    //STATES
    const [startedSelf, setStartedSelf] = useState(false);
    const [startedComputer, setStartedComputer] = useState(false);
    const [started1V1, setStarted1V1] = useState(false);

    //USE EFFECT FOR CHECKING WINNER
    useEffect(()=>{
        if(changed >=5) checkForWinner(board, winner, setWinner, setIsGameOver);
    },
    [changed]);

    // USE EFFECT FOR UNIVERSAL MUSIC
    useEffect(()=>{
        if(getStarted) playUniversalMusic(universalMusic);
    }, [getStarted]);
    
    return (
        <div className="tictactoeContainer">
            <div className="heading">
                <h1>Tic-Tac-Toe</h1>
            </div>
            {
                !getStarted
                ?<>
                <button
                onClick={()=> {
                    setBoard([
                        [null, null, null],
                        [null, null, null],
                        [null, null, null],
                    ])
                    setStarted(true);
                    setStartedSelf(true);
                }}
                className='btnTic'>Start Game Now !</button>
                <button
                onClick={()=> {
                    setBoard([
                        [null, null, null],
                        [null, null, null],
                        [null, null, null],
                    ])
                    setStarted(true);
                    setStartedComputer(true);
                }}
                className='btnTic'>Play Computer !</button>
                <button
                onClick={()=> {
                    setBoard([
                        [null, null, null],
                        [null, null, null],
                        [null, null, null],
                    ])
                    setStarted(true);
                    setStarted1V1(true);
                }}
                className='btnTic'>Play 1 V/s 1 !</button>
                </>
                : (
                    <>
                        {getStarted && startedSelf && <SelfPlay/>}
                        {getStarted && startedComputer && <ComputerPlay/>}
                        {getStarted && started1V1 && <OnlinePlay/>}
                    </>
                )
            }
        </div>
    )
}