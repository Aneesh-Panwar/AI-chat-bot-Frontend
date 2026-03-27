import { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import Messages from "./Messages";
import { sendChat, streamChat } from "../api/chatApi";

export default function ChatBot() {
  const chatEndRef = useRef(null);
  const controllerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const sendMessage = async (text) => {
  if (loading) return;

  setError(false);
  setLoading(true);

  const userMsg = { text, sender: "user" };
  setMessages((prev) => [...prev, userMsg]);

  try {
    const USE_STREAM = true;

    if (USE_STREAM) {

    // Initialize the empty bot message in the UI
    let botIndex;  // index using to avoid bugs
    setMessages((prev) => {
      botIndex = prev.length;
      return [...prev, { text: "", sender: "bot" }];
    });

    let botText = ""; //keeps adding chunk

    controllerRef.current?.abort(); // to delete previous refrence of abort 

    const controller = new AbortController(); //create new abort ref
    controllerRef.current = controller;

    // Start the streaming
    await streamChat({
      text,
      signal:controller.signal,
      onChunk:(chunk) => {

      
        botText += chunk;

        setMessages((prev) => {
            const updated = [...prev];
            if (updated[botIndex]) {
              updated[botIndex].text = botText;
            }
            return updated;
        });
      }
    });  
    } else {
      const result = await sendChat(text);
      const botMsg = { text: result.text, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }
    setError(false);

  }catch (err) {
    if(err.name === "AbortError") {
      console.log("Aborted");
    }else {
      console.error(err);
      setError(true);
    }
  }finally {
      setLoading(false);
  }
};

return(
    <div className="h-screen flex flex-col justify-between bg-gray-900 text-white">

      {!messages.length && (
        <h1 className="font-bold text-4xl text-center text-gray-500 flex justify-center items-center h-full">
          Hey there...!! <br /> How can I help you?
        </h1>
      )}

      <div className="flex-1 overflow-y-auto px-6 md:px-[18%] space-y-2">
        {messages.map((msg, i) => (
          <Messages key={i} msg={msg} />
        ))}

        {loading && (
          <div className="text-gray-400">Typing...</div>
        )}

        {error && !loading && (
          <div className="text-red-500">Something went wrong. Try again.</div>
        )}

        <div ref={chatEndRef} />
      </div>

      <InputBox sendMessage={sendMessage} loading={loading} onStop={() => controllerRef.current?.abort()} />
    </div>
  );
}