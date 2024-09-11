    
    //FUNCTIONS
    export function handleCellClick(row, col, board, currentPlayer, setBoard, setCurrentPlayer, setChanged){
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        console.log(board);
        setCurrentPlayer(currentPlayer=> currentPlayer === 'X' ? 'O' : 'X');
        setChanged(changed => changed + 1);
    }

    const syncBoardWithBackend = async (row, col, actualChance, changed) => {
        try{
            const res = await fetch(`http://localhost:5000/info-about-player-status`, {
                method : 'POST',
                credentials : 'include',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({row, col, actualChance, changed})
            });
        }
        catch(err){
            console.error(err);
        }
    }

    export function handleCellClickForOnlinePlay(row, col, universalBoard, actualChance, changed , setUniversalBoard, setActualChance, setChanged){
        
        //UPDATE THE BOARD STATE LOCALLY
        if(universalBoard[row][col] !== null){
            console.error('Cell already occupied');
            return;
        }
        
        const newBoard = [...universalBoard];
        newBoard[row][col] = actualChance;

        // const nextChanged = changed + 1;
        
        //UPDATE STATES
        setUniversalBoard(newBoard);
        setActualChance(actualChance => actualChance === 'X' ? 'O' : 'X');
        console.log(universalBoard);

        setChanged(changed => changed + 1);
        
        //SEND UPDATED STATE TO BACKEND THROUGH SYNC FUNCTION
        syncBoardWithBackend(row, col, actualChance, changed);
    }

    export function playHoverSound(hoverSound, hoverSuppressed){
        if(!hoverSuppressed){
            const audio = new Audio(hoverSound);
            audio.play();
        }
    }

    export function playTapSound(tapSound, setHoverSuppressed){
        const tapAudio = new Audio(tapSound);
        tapAudio.play();
        setHoverSuppressed(true);
        setTimeout(() => setHoverSuppressed(false), 300);
    }

    export function playWinSound(winSound){
        const winaudio = new Audio(winSound);
        winaudio.play();
    }

    export function playDoorSound(doorSound){
        const audio = new Audio(doorSound);
        audio.play();
    }

    export function playUniversalMusic(universalMusic){
        const audio = new Audio(universalMusic);
        audio.loop = true;
        audio.play();
    }

    export function checkForWinner(board, winner ,setWinner, setIsGameOver){

        //CHECKING IN ROWS
        for(let j=0; j<3; j++){
            if(board[j][0] === board[j][1] && board[j][1] === board[j][2] && board[j][0] !== null){
                setWinner(board[j][0]);
                break;
            }
        }

        //CHECKING FOR COLUMNS
        if(!winner){
            for(let i=0; i<3; i++){
                if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== null){
                    setWinner(board[0][i]);
                    break;
                }
            }
        }

        //CHECKS FOR DIAGONALS
        if(!winner){
            if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== null){
                setWinner(board[0][0]);
            }
            else if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== null){
                setWinner(board[0][2]);
            }
        }

        if(winner) setIsGameOver(true);
    }