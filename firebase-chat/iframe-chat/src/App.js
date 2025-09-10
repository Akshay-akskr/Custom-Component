import React, { useEffect, useState } from "react";
import "./App.css";
import ChatBox from "./components/ChatBox";
import ChatRoomBox from "./components/groupchat/ChatRoomBox";

function App() {

  const [errMsg, setError] = useState("");
  const [roomVal, setRoom] = useState("");
  const [userRecord, setUser] = useState(null);

  useEffect(() => {

    //?email=mobiloustesting10@gmail.com&room=default
    const queryparams = new URL(window.location.toString()).searchParams;
    if(queryparams.size > 0){
      const _room = queryparams.get("room");
      if(!_room){
        setRoom("default");
      }else{
        setRoom(_room);
      }

      const _email = queryparams.get("email");
      if(_email && _email.length > 0){
        const apiUrl = 'http://localhost:5000/firebase/user/getUserbyEmail';
        const rawbody = JSON.stringify({
          "email": _email
        });
        const headerVal = new Headers();
        headerVal.append("Content-Type", "application/json");
        fetch(apiUrl, {method:'POST', body:rawbody, headers:headerVal})
          .then(response => response.json())
          .then(data => {
            console.log("data >>>>>>.", data);
            if(data['status']){
              if(data['status'] === "ACK"){
                setUser(data['result']);
                console.log(_email, "success >>>>>>.", _room, data['result']);
              }else {
                setError(data['error']);
              }            
            }
          })
          .catch(error => {
            console.error(error);
            setError("Something went wrong. Please try again.");
          });
      }else{
        setError("No user-identifier given");
      }      
    }
    
  }, []);


  return (
    <div className="App">
      {!userRecord ? (
        <span style={{color:'rgba(255,255,255,0.1)'}} >{errMsg}</span>
      ) : (
        <>          
          {roomVal === 'default' ? (<ChatBox />) : (<ChatRoomBox room={roomVal}/>)}
        </>
      )}
    </div>
  );
}

export default App;
