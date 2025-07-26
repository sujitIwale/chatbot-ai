import { lyzrManagerClient } from "./axios";


export const lyzrManagerAgent = {
    sendMessage: async ({chatbotId, message}: {chatbotId: string, message: string}) => {
        const response = await lyzrManagerClient.post(`/api/agent-tool/${chatbotId}/send-message`, {
            message
        });
        return response.data;
    }
}