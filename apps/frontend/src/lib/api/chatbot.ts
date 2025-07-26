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
  getCustomerSupportUsers: async (chatbotId: string) => {
    const response = await client.get(`/api/chatbot/${chatbotId}/users`);
    return response.data;
  },
  createCustomerSupportUser: async (chatbotId: string, data: {
    name: string;
    email: string;
  }) => {
    const response = await client.post(`/api/chatbot/${chatbotId}/create-user`, {
      ...data,
      chatbotId
    });
    return response.data;
  },
};