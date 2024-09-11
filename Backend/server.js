import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();

//MIDDLEWARES
app.use(cors({
    origin: 'https://pv-p-tic-tac-toe-game-frontend.vercel.app',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

//USING SESSION MIDDLEWARE
app.use(session({
    secret : 'wonderland', //A Secret Key for signing the session ID
    resave : false, 
    saveUninitialized : false,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24,
        secure : false,
        httpOnly : true,
    }
}));

const port = 5000;

const arrOfKeys = [];
const gameRooms = {};
const boardAtBackend = [];

app.get('/', (req, res)=>{
    try {
        res.status(200).json({message_receive : "Hi"});
    } catch (error) {
        console.error(error);
    }
})

app.post('/create-room', (req, res)=>{
    try {

        //DESTRUCTURING THE RECEIVED CREATEROOM DATA
        const {key, name} = req.body;
        
        //CHECK IF KEY, NAME ARE STABLE AND IF ROOM ALREADY EXISTS
        
        if(!key || !name){
            return res.status(400).json({issue : 'Key and name are required to create the room !'});
        }

        //OTHERWISE
        if(gameRooms[key]){
            return res.status(400).json({issue : 'Room already exists !'});
        }

        gameRooms[key] = { created : true, paired : false, creator: name, joiner: null};

        req.session.name = name;
        req.session.room = key;
        req.session.created = true;
        
        res.status(200).json({message: 'Room Created', sessionID: req.sessionID});
    }
    catch (error) {
        console.error("Creating Room Error, ", error);
        return res.status(500).json({error: "caught error while creating a room."});
    }
});

app.post('/join-room', (req, res) => {
    try {
        //DESTRUCTURING INCOMING BODY DATA
        const {key, name} = req.body;

        //CHECK IF KEY, NAME ARE STABLE AND IF ROOM EXISTS
        
        if(!key || !name){
            return res.status(400).json({issue : 'Key and name are required to join the room !'});
        }

        if(gameRooms[key]){
            gameRooms[key].paired = true; // NOW THE ROOM IS PAIRED
            gameRooms[key].joiner = name;
            
            req.session.name = name;
            req.session.room = key;
            req.session.paired = true;

            res.status(200).json({message : "Room Joined", sessionID : req.sessionID});
        }
        
        else {
            return res.status(404).json({issue : "Room does not exist !"});
        }

    } catch (error) {
        console.error("Joining Room Error,", error);
        return res.status(500).json({error: 'An error occured while trying to join the the room.'});
    }
});

app.get('/room-status', (req, res) => {
    try {
        const room = req.session.room;
        const name = req.session.name;

        //CHECKING IF THE SESSION HAS A VALID ROOM AND NAME 
        if(!room || !name){
            return res.status(400).json({issue : 'Session does not contain a valid room or name.'});
        }

        //CHECK IF BOTH PLAYER ARE IN THE ROOM
        if(room && gameRooms[room]){

            const gameReady = gameRooms[room].paired && gameRooms[room].created;

            res.json({creator: gameRooms[room].creator, joiner: gameRooms[room].joiner, Ready: gameReady});
        }
        else{
            response.status(400).json({issue : 'No Room found in session'});
        }
    }
    catch (error) {
        console.error(error);
    }
})

app.post('/info-about-player-status', (req, res) => {
    try {
        
        const {row, col, actualChance, changed} = req.body;

        const room = req.session.room;

        if(!room)
        return res.status(400).json({issue : "No Room found in the session"});

        if(!gameRooms[room].board){
            gameRooms[room].board = Array(3).fill(null).map(()=>Array(3).fill(null));
        }

        const board = gameRooms[room].board;

        //If the cell is already occupied
        if(board[row][col] !== null){
            return res.status(400).json({issue : "Cell already occupied"});
        }

        board[row][col] = actualChance;
        const nextPlayer = actualChance === 'X' ? 'O': 'X';

        if(!gameRooms[room].changed){
            gameRooms[room].changed = 0;
        }

        const newChanged = gameRooms[room].changed + 1;

        gameRooms[room].changed = newChanged;
        gameRooms[room].board = board;
        gameRooms[room].currentPlayer = nextPlayer;

        return res.status(200).json({actualChance : nextPlayer, board : board});

        // const {row, col, currentPlayer, universalBoard} = req.body;
        // const room = req.session.room;

        // if(!room) return res.status(400).json({issue : 'No room found in the session'});

        
        // if(row === null || col === null || row === undefined || col === undefined)
        //     return res.status(400).json({issue : 'Row and column not provided'});
        
        // //MAKE THE COPY ON BOARD
        // const newBoard = [...universalBoard];

        // //CHECKING IF THE CELL IS ALREADY IS EMPTY
        // if(newBoard[row][col] === null)
        //     newBoard[row][col] = currentPlayer;

        // //SWITCH TO NEXT PLAYER
        // const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // //RESPOND WITH UPDATED UPDATED BOARD AND PLAYER'S TURN
        // return res.status(200).json({actualChance : nextPlayer, board : newBoard});
 
    }
    catch (error) {
        console.error('Error while getting info about player and updating board and player status', error);
    }
})

app.get('/get-board-status', (req, res)=>{
    const room = req.session.room;

    if(!room) return res.status(404).json({issue: 'Room not found in the session'});

    const board = gameRooms[room].board;
    const currentPlayer = gameRooms[room].currentPlayer;
    const changed = gameRooms[room].changed;

    //Send the current board and player status
    res.status(200).json({currentPlayer, board, changed});
})

app.post('/clear-room-data', (req, res)=>{
    try {
        
        const {board, changed, currentPlayer} = req.body;

        const room = req.session.room;

        if(!room) return res.status(400).json({issue : "Room not found in the session !"});

        gameRooms[room].board = board;
        gameRooms[room].changed = changed;
        gameRooms[room].currentPlayer = currentPlayer;

        return res.status(200).json({message : "Data cleared Successfully!"});

    } catch (error) {
        console.error(error);
    }
})

app.listen(port, ()=>{
    console.log(`server is listening on http://localhost:${port}`);
})
