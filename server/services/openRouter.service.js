import axios from "axios";

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages must be a non-empty array");
    }
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "InterviewIQ",
          },
        },
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;
    if (!content || !content.trim()) {
      throw new Error("No content received from AI");
    }
    return content;
  } catch (error) {
    console.error(
      "OpenRouter API error:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to get response from OpenRouter API");
  }
};
