import { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import Messages from "./Messages";
import { sendChat, streamChat } from "../api/chatApi";

export default function ChatBot() {
  const chatEndRef = useRef(null);
  const controllerRef = useRef(null);

  const [chatState,setchatState] = useState({
    messages: [],
    status: "idle",
    error: null                 
  });

  
  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages]);

  //
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);
  
  const sendMessage = async (message) => {
    if(chatState.status === "loading" || chatState.status === "streaming") return;
    
    
    setchatState((prev)=>({
      ...prev,
      messages: [
        ...prev.messages,{ message, sender: "user" },{ message: "", sender: "bot" }
      ],
      status: "loading",
      error: null
    }));

    try {
      const USE_STREAM = true;

      if (USE_STREAM) {

        let botText = "";

        controllerRef.current?.abort(); // to delete previous refrence of abort 

        const controller = new AbortController(); //create new abort ref
        controllerRef.current = controller;

        // Start the streaming
        await streamChat({
          message,
          signal:controller.signal,
          onChunk:(chunk) => {

            botText += chunk;

            setchatState(prev=>{
              const updated = [...prev.messages];
              updated[updated.length-1].message = botText;

              return({
                ...prev,
                status: "streaming",
                messages: updated
              })
            })
          }
        });  
      } else {

        const result = await sendChat(message);
        setchatState(prev=>{
          const updated = [...prev.messages];
          updated[updated.length-1].message = result.text;
          return({
            ...prev,
            messages: updated
          })
        })
      }

    }catch (err) {
      if(err.name === "AbortError") {
        console.log("Aborted");
      }else {
        console.error(err);
        setchatState(prev=>({
          ...prev,
          status: "error",
          error: err.status == "500"?"Server not responding":"Couldn,t connect... Please check your connection"
        }))
      }
    }finally {
      setchatState(prev=>(prev.status === "error"? {...prev}:{...prev,status:"idle",error:null}));
    }
  };

  return(
    <div className="relative h-screen flex flex-col justify-between bg-gray-900 text-white">

      {!chatState.messages.length && (
        <h1 className="font-bold text-4xl text-center text-gray-500 flex justify-center items-center h-full">
          Hey there...!! <br /> How can I help you?
        </h1>
      )}

      <div className="flex-1 overflow-y-auto px-6 md:px-[18%] space-y-2">
        {chatState.messages.map((msg, i) => (
          <Messages key={i} msg={msg} />
        ))}

        {(chatState.status === "loading" || chatState.status === "streaming") && (
          <div className="text-gray-400">{chatState.status === "streaming"?"Typing...":"Thinking..."}</div>
        )}

        {(chatState.status === "error") && (
          <div className="text-red-500">{chatState.error || "Something went wrong..!"}</div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className={`relative ${chatState.messages.length?"":"top-[-40%]"}`}>
      <InputBox 
      sendMessage={sendMessage} 
      loading={chatState.status === "loading" || chatState.status === "streaming"} 
      onStop={() => controllerRef.current?.abort()} />
      </div>
    </div>
  );
}