function addToLog(data) {
   let p = document.getElementById("logging");
   p.textContent += " |:| " + data;
}

const onRegistrationCalled = async function () {
   let config = {};
   
   config.userName = document.getElementById("userName").value;
   config.password = document.getElementById("password").value;
   
   config.appId = "750356d7-315d-4207-9fd9-006d6de63d2d";
   config.callsEventCb = CallManagerNotification;
   
   try {
      await window.ME.init(config);
      addToLog("Initilization success")
      
      let regbtn = document.getElementById("regbtn");
      regbtn.disabled = true;
      
   } catch (err) {
      console.log(err);
      addToLog("Initilization failed")
   }
};

// start call
const onCallBtnPressed = async function (isVideo) {
   
   let uri = document.getElementById("uri").value;
   let config = {
      isVideo: isVideo,
      localVideoElement: document.getElementById("localVideo"),
      remoteVideoElement: document.getElementById("remoteVideo"),
   };
   
   try {
      
      // config is optional..
      let callObj = await window.ME.makeCall(uri, config);
      
      if (callObj != null) {
         // Assigning handler to hangup button..
         let hangupbtn = document.getElementById("hangupbtn");
         hangupbtn.disabled = false;
         hangupbtn.onclick = () => {
            callObj.endCall();
            hangupbtn.disabled = true;
         };
      }
   } catch (err) {
      console.log("Make call failed..", err);
   }
};

// remote side call indications handler..
const CallManagerNotification = function (notificationObj) {
   let callObj = notificationObj.data;
   switch (notificationObj.type) {
      case window.ME.callNotifications.INCOMING_CALL: {
         
         let hangupbtn = document.getElementById("hangupbtn");
         let r = window.confirm("Accept call from : " + notificationObj.remoteUri);
         
         // Incoming call accepted.
         if (r == true) {
            if (callObj.isVideo) {
               let config = {
                  isVideo: true,
                  localVideoElement: document.getElementById("localVideo"),
                  remoteVideoElement: document.getElementById("remoteVideo"),
               };
               callObj.answerCall(config);
            } else {
               callObj.answerCall();
            }
            
            
            hangupbtn.disabled = false;
            hangupbtn.onclick = () => {
               callObj.endCall();
               hangupbtn.disabled = true;
            };
         } else {
            // Incoming call rejected..
            callObj.endCall();
            hangupbtn.disabled = true;
         }
         break;
      }
      
      case window.ME.callNotifications.CALL_PROGRESS: {
         console.log("Call in progress..");
         addToLog("Progress");
         break;
      }
      
      case window.ME.callNotifications.CALL_RINGING: {
         console.log("Ringing at callee..");
         addToLog("Ringing");
         break;
      }
      
      case window.ME.callNotifications.CALL_CONNECTED: {
         addToLog("Connected");
         break;
      }
      
      case window.ME.callNotifications.CALL_ENDED: {
         console.log("Call_Ended");
         
         let hangupbtn = document.getElementById("hangupbtn");
         hangupbtn.disabled = true;
         addToLog("Ended");
         break;
      }
   }
};

function App() {
  return (
    <section>
      <input type="text" required id="userName" placeholder="userName" />
      <input type="text" required id="password" placeholder="password" />
      <button type="button" id="regbtn" onClick={onRegistrationCalled}>
        Register
    </button>
      <input type="text" required id="uri" placeholder="uri" />
      <button type="button" id="acall" onClick={() => onCallBtnPressed(false)}>
        AudioCall
    </button>
      <button type="button" id="vcall" onClick={() => onCallBtnPressed(true)}>
        VideoCall
    </button>
      <button type="button" id="hangupbtn">
        HangUp
    </button>
      <div className="col-sm-6 border localvideo">
        <video id="localVideo" autoPlay playsInline muted></video>
      </div>
      <div className="col-sm-6 remotevideo">
        <video id="remoteVideo" autoPlay playsInline></video>
      </div>
      <p id="logging"></p>
    </section>
  );
}

export default App;
