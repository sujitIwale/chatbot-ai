import client from "./client";

export const chatbotApi = {
  getChatbots: async () => {
    const response = await client.get("/api/chatbot/");
    return response.data;
  },

  getChatbot: async (id: string) => {
    const response = await client.get(`/api/chatbot/${id}`);
    return response.data;
  },
  
  createChatbot: async (data: { 
    name: string; 
    description?: string;
    instructions: string;
    context?: string;
  }) => {
    const response = await client.post("/api/chatbot/create", data);
    return response.data;
  },
};