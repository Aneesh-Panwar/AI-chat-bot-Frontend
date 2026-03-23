import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});


const MODE = "test";       // "test" | "prod"
const TEST_TYPE = "slow"; // delay | error | slow | large | stream | multi |

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