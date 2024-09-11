import React, {createContext, useState} from 'react';

//FUNCTIONS
import {
    handleCellClick,
    handleCellClickForOnlinePlay,
    playHoverSound,
    playTapSound,
    playWinSound,
    playDoorSound,
    playUniversalMusic,
    checkForWinner,
} from './tictactoeFunctions.js';

//CREATE THE CONTEXT
export const GameContext = createContext();

export const GameProvider = ({children}) =>{

    //STATES
    const [board, setBoard] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [getStarted, setStarted] = useState(false);
    const [changed, setChanged] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [showModal, setShowModal] = useState(false);

    //STATE FOR SOUND SUPPRESSION (AND OTHER SOUNDS PLAYED OR NOT)
    const [hoverSuppressed, setHoverSuppressed] = useState(false);
    const [winSoundPlayed, setWinSoundPlayed] = useState(false);
    const [doorSoundPlayed, setDoorSoundPlayed] = useState(false);

    return(
        <GameContext.Provider 
        value={
            {
                board,
                setBoard,
                isGameOver,
                setIsGameOver,
                getStarted,
                setStarted,
                changed,
                setChanged,
                currentPlayer,
                setCurrentPlayer,
                winner,
                setWinner,
                showModal,
                setShowModal,

                //Sound
                hoverSuppressed,
                setHoverSuppressed,
                winSoundPlayed,
                setWinSoundPlayed,
                doorSoundPlayed,
                setDoorSoundPlayed,
                
                //Functions
                handleCellClick,
                handleCellClickForOnlinePlay,
                playHoverSound,
                playTapSound,
                playWinSound,
                playDoorSound,
                playUniversalMusic,
                checkForWinner,

            }}
           
        > {children}</GameContext.Provider>
    )
}