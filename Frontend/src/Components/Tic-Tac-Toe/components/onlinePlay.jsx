import OnlinePlayMain from "./onlinePlayMain";
import { useEffect, useState } from "react"

export default function OnlinePlay(){

    //STATES
    const [nameValue, setNameValue] = useState('');
    const [keyValue, setKeyValue] = useState('');

    const [clickedCreateRoom, setClickedCreateRoom] = useState(false);
    const [clickedJoinRoom, setClickedJoinRoom] = useState(false);

    const [createdRoom, setCreatedRoom] = useState(false);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [areReady, setAreReady] = useState(false);

    const [responseMess, setResponseMess] = useState('');

    const [issue, setIssue] = useState('');
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');

    //FUNCTIONS

    const getButtonClass = () => {
        if(clickedCreateRoom || clickedJoinRoom){
            return 'btnTic hide';
        }
        else if(clickedCreateRoom === null && clickedJoinRoom === null){
            return 'btnTic hide'
        }

        else
        return 'btnTic';
    }

    const handleCreateRoom = async (e) => {
        if(keyValue.length < 8){
            e.preventDefault();
            alert('Please ensure the key entered is minimum 8 letters long !');
            return;
        }
        
        e.preventDefault();

        //Form Data
        const data = {
            name : nameValue,
            key : keyValue,
        }

        try {
            const response = await fetch(`http://localhost:5000/create-room`, {
                method : 'POST',
                credentials: 'include',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(data)
                });

            
            const result = await response.json();

            if(result.issue && result.issue.length ){
                setIssue(result.issue);
                alert(issue);
                return;
            }

            setResponseMess(result);
            setCreatedRoom(true);

            setClickedCreateRoom(null);
            setClickedJoinRoom(null);
        }

        catch (error) {
            console.error(error);
            setResponseMess('Error creating room at frontend !');
        }
    }

    const handleJoinRoom = async (e) => {
        if(keyValue.length < 8){
            e.preventDefault();
            alert('Please ensure the key entered is minimum 8 letters long !');
            return;
        }

        e.preventDefault();

        //RETRIEVING FORM DATA USING STATES

        const data = {
            name : nameValue,
            key : keyValue,
        }

        try {

            const res = await fetch(`http://localhost:5000/join-room`, {
                method : 'POST',
                credentials : 'include',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(data),
            })

            const result = await res.json();
            if(result.issue && result.issue.length ){
                setIssue(result.issue);
                alert(issue);
                return;
            }

            setResponseMess(result);
            setJoinedRoom(true);

            setClickedCreateRoom(null);
            setClickedJoinRoom(null);

            
        } catch (error) {
            console.error(error);
            setResponseMess("Error in Joining at Frontend !");
            return;
        }

    }
    
    const generateRandomKey = async() =>{
        const arr = [1,2,3,4,5,6,7,8,9,0,'!','@','#','$','%','^','&','*'];
        let key='';

        for(let i=0; i<8; i++){
            key += arr[Math.floor(Math.random()* arr.length)];
        }
        console.log(key);
        setKeyValue(key);
    }

    //FUNCTION TO POLL ROOM STATUS
    const checkRoomStatus = async () => {
        try {
            const response = await fetch(`http://localhost:5000/room-status`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json',
                },
            });

            const data  = await response.json();

            if(data.issue && data.issue.length){
                setIssue(data.issue);
                alert(issue);
                return;
            }

            if(data.Ready){
                setAreReady(true);
                setPlayer1(data.creator);
                setPlayer2(data.joiner);
            }
        } catch (error) {
            console.error("Error fetching room status",error);
        }
    }

    //polling every few seconds 
    useEffect(()=>{
        
        let intervalID;
        if(createdRoom || joinedRoom){
            intervalID = setInterval(checkRoomStatus, 1000);
        }
        return ()=> clearInterval(intervalID);
    }, [createdRoom, joinedRoom]);

    useEffect(()=>{
        console.log(responseMess);
    }, [responseMess]);

    return(
        <>
            <button
            onClick={()=> setClickedCreateRoom(true)}
            className={getButtonClass()}
            >Create Room</button>
            <button
            onClick={()=> setClickedJoinRoom(true)}
            className={getButtonClass()}
            >Join Room</button>
            
            {
                (clickedCreateRoom || clickedJoinRoom) && (
                    <form
                    className="formTic"
                    onSubmit={clickedCreateRoom ? handleCreateRoom : handleJoinRoom}
                    method="POST">

                        {/* NAME FIELD */}
                        <input
                        type="text"
                        name="name"
                        placeholder="Enter Your Name"
                        
                        value={nameValue}
                        onChange={(e)=> {setNameValue(e.target.value)}}
                        
                        className="roomInput"
                        required={true}
                        />
                        
                        {/* KEY FIELD */}
                        <div className="keyfield">
                            <input
                            type="text"
                            name="key"
                            placeholder={clickedJoinRoom ? "Enter Key your friend shared" : "Enter Any 8 letter Key"}
    
                            value={keyValue}
                            onChange={(e)=> {setKeyValue(e.target.value)}}

                            className="roomInput"
                            required={true}
                            />

                            {
                                clickedCreateRoom ? <button
                                className="generateRandomKey"
                                onClick={(e)=>{
                                    e.preventDefault();
                                    generateRandomKey();
                                }}
                                >Or Generate</button> : null
                            }
                        </div>

                        <button
                        type="submit"
                        className="btnTic"
                        >{clickedCreateRoom ? "Create Room" : "Join Room"}</button>

                        {
                            clickedCreateRoom ? <h3 style={{color: "red", marginTop: "14px"}}>Send the key to your friend before submititng!!</h3> : null
                        }

                    </form>
                )
            }

            {
                (createdRoom || joinedRoom) && !areReady ? <h1 style={{marginTop : "15px"}}>Pls Wait while other Player Join...</h1> : (createdRoom || joinedRoom) && areReady ? <OnlinePlayMain player1 = {player1} player2 = {player2} side = {createdRoom ? 'X' : 'O'}/> : null
            }
            
        </>
    )
}