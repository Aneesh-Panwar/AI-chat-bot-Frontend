import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});


const MODE = "test";       // "test" | "prod"
const TEST_TYPE = "error"; // delay | error | slow | large | multi |

// Response Normalizer
function normalizeResponse(data) {
  if (data.reply) {
    return { text: data.reply };
  }

  if (data.replies) {
    return { text: data.replies.join("\n") };
  }

  return { text: "Unexpected response format" };
}

// Main function
export async function sendChat(message) {
  try {
    let endpoint = "/chat";

    if (MODE === "test") {
      endpoint = `/test/${TEST_TYPE}`;
    }

    const res = await API.post(endpoint, { message });

    return normalizeResponse(res.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function streamChat({message, signal, onChunk}) {

  const res = await fetch("http://localhost:3000/api/chat/stream", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  
  if (!res.ok){
    const errorData = await res.json();
    throw new Error(errorData.error,"request failed");
  }
  
  
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  
  let done = false;
  
  try {
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      
      if(value){
        const chunk = decoder.decode(value);
        if (chunk) {
          onChunk(chunk); 
        }
      }
    }
  } catch (error) {
    throw error;
  }

}