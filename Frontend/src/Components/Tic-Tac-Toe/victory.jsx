import { useEffect, useState } from 'react';
import TicTacToe from './tictactoe';
import style from './tictactoe.css';
import OnlinePlayMain from './components/onlinePlayMain';

export default function VictoryModal({winner, winSoundPlayed, doorSound , playDoorSound, player1, player2, mode, setWinner, setUniversalBoard}){

    //STATES
    const [doorOpen, setDoorOpen] = useState(false);
    const [showGame, setShowGame] = useState(false);

    useEffect(()=>{
        if(!doorOpen && winSoundPlayed){
            setTimeout(()=>{
                setDoorOpen(true);
                playDoorSound(doorSound);
            }, 1800);
        }
    },[winSoundPlayed]);

    //FUNCTION TO CLEAR ONLINE DATA IN THE ROOM INCLUDING BOARD, CHANGED, CURRENT PLAYER (IF MODE IS ONLINE ONLY)

    const clearRoomData = async () =>{
        
        const board = Array(3).fill(null).map(()=> Array(3).fill(null));
        const changed = 0;
        const currentPlayer = 'X';

        const res = await fetch('http://localhost:5000/clear-room-data', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({board, changed, currentPlayer})
        });

    }

    return (
        showGame ? <TicTacToe started={false}/>
        :<div className="victory">
            <div className="victory-modal">

                {/* UPPER DIV CONTAINING IMAGE */}
                <div
                className={`upperDiv ${doorOpen ? 'translateUp' : ''}`}></div>

                {/* WHO WON */}
                <h1 className={`h1InGame ${doorOpen ? 'fade' : ''}`} style={{color : 'whitesmoke', marginTop: '0px', fontSize: '45px'}}>{winner === 'X' ? `${player1} is winner` : winner === 'O' ? `${player2} is winner :)` : 'No One Won !!'}</h1>

                {/* BUTTON TO RESTART THE GAME */}
                <button
                className='btnTic'
                onClick={async ()=>{
                    if(mode === 'OnlineMode'){
                        await clearRoomData();
                        setUniversalBoard(Array(3).fill(null).map(()=>Array(3).fill(null)));
                    }
                    else if(mode === 'SelfMode' || mode === 'ComputerMode')
                    {
                        window.location.reload();
                    }
                    
                    setWinner(null);
                }}
                >Play Again :)</button>

                {/* LOWER DIV CONTAINING IMAGE */}
                <div
                className={`lowerDiv ${doorOpen ? 'translateLow' : ''}`}></div>
            </div>
        </div>
    )
}