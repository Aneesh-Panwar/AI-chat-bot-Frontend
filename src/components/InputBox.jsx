import React, { useRef, useState } from 'react'
import sendArrow from '../assets/k.svg'

export default function InputBox({ sendMessage, loading }) {
    const [msg, setmsg] = useState("");
    const inputRef = useRef(null);

    function handleChange(e){
        setmsg(e.target.value);
        adjustHeight();
    }

    function adjustHeight(){
        const textArea = inputRef.current;

        textArea.style.height = "auto";
        textArea.style.height = textArea.scrollHeight + "px";
    }

    function handleKeyPress(e){
        if(loading) return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }


    function handleSend(){
        if (msg.trim()) {
            sendMessage(msg);
            setmsg("");
            setTimeout(() => adjustHeight(),0);
        }
    }

  return (
    <div className='md:px-[18%] px-10'>
        <div className='relative '>
            <textarea name="userInput" ref={inputRef}
                value={msg} onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask about college, admissions, hostel, fees..."
                className="grow w-full p-4 pr-16 rounded-2xl bg-gray-800 text-white resize-none overflow-hidden max-h-40 shadow-md  shadow-gray-600 outline-none"
            />
            <button onClick={handleSend} className='bg-white h-10 w-10 rounded-full text-black font-bold absolute right-3 bottom-6'><img src={sendArrow} alt="send" className='p-2'/></button>
            <button
                onClick={handleSend}
                disabled={loading}
                className={`h-10 w-10 ${loading?"hidden":""} rounded-full absolute right-3 bottom-6`}></button>
            <button
                disabled={!loading}
                className={`${loading?"":"hidden"} h-10 w-10 rounded-full absolute right-3 bottom-6`}><span className='w-6 h-6 bg-gray-700 rouded-md'></span></button>
        </div>
    </div>
  )
}
