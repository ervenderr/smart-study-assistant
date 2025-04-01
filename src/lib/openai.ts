import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false, // Ensure this is only used server-side
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  defaultQuery: {
    // Add any default query parameters here if needed
  },
  maxRetries: 3, // Add retry behavior
});

// Validate that the API key is set
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
  console.warn("WARNING: OPENAI_API_KEY is not set or is empty!");
}

export default openai;
