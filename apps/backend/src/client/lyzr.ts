import lyzrClient from "./axios";

interface AgentConfig {
  name: string;
  system_prompt: string;
  description: string;
  features: Array<{
    type: string;
    config: Record<string, any>;
    priority: number;
  }>;
  tools: Array<string>;
  llm_credential_id: string;
  provider_id: string;
  model: string;
  top_p: number;
  temperature: number;
  response_format?: Record<string, any>;
}

interface ChatRequest {
  user_id: string;
  agent_id: string;
  message: string;
  session_id: string;
}

interface LyzrAgent {
  agent_id: string;
  message: string;
}

interface ChatResponse {
  response: string;
  agent_id: string;
  session_id: string;
  confidence?: number;
  can_handle?: boolean;
}

class LyzrClient {
  async createAgent(config: AgentConfig): Promise<LyzrAgent> {
    try {
      const response = await lyzrClient.post("/v3/agents/", config);
      return response.data;
    } catch (error) {
      console.error("Error creating agent:", error);
      throw new Error("Failed to create agent");
    }
  }

  async chatWithAgent(chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await lyzrClient.post("/v3/inference/chat/", chatRequest);
      return response.data;
    } catch (error) {
      console.error("Error chatting with agent:", error);
      throw new Error("Failed to send message to agent");
    }
  }

  async getAgent(agentId: string): Promise<LyzrAgent> {
    try {
      const response = await lyzrClient.get(`/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting agent:", error);
      throw new Error("Failed to get agent");
    }
  }
}

// Customer Support Agent Manager
class CustomerSupportAgent {
  private lyzr: LyzrClient;
  private agentId?: string;

  constructor() {
    this.lyzr = new LyzrClient();
  }

  async initialize(chatbot: {
    id: string;
    name: string;
    description?: string;
    instructions: string;
    context?: string;
  }) {
    try {
      // Create customer support agent directly without environment
      const agentConfig: AgentConfig = {
        name: chatbot.name, // Use user-provided chatbot name
        system_prompt: `You are a helpful Customer Support Agent for ${
          chatbot.name
        }. 

${chatbot.context ? `CONTEXT: ${chatbot.context}` : ""}

INSTRUCTIONS: ${chatbot.instructions}

Your role is to:
1. Handle complaints professionally and empathetically  
2. Provide troubleshooting guidance and solutions
3. Be friendly, professional, and helpful at all times
4. If you cannot resolve an issue or don't have enough information, politely indicate that you need to switch to a human agent

IMPORTANT: If you cannot provide a satisfactory answer or resolve the customer's issue, respond with exactly this phrase at the end of your message: "[SWITCH_TO_HUMAN]"

Always try your best to help first, but don't hesitate to escalate when needed.`,
        description:
          chatbot.description ||
          `AI-powered customer support agent for ${chatbot.name} that handles customer queries`,
        features: [
          {
            type: "SHORT_TERM_MEMORY",
            config: {},
            priority: 0,
          },
        ],
        tools: [],
        provider_id: "openai",
        model: "gpt-4o-mini",
        top_p: 0.9,
        temperature: 0.7,
        llm_credential_id: "lyzr_openai",
        response_format: {},
      };

      const agent = await this.lyzr.createAgent(agentConfig);
      console.log("this is agent", { agent });
      this.agentId = agent.agent_id;

      return { agentId: agent.agent_id };
    } catch (error) {
      console.error("Error initializing customer support agent:", error);
      throw error;
    }
  }

  async sendMessage(
    message: string,
    sessionId: string,
    userId: string,
    agentId: string
  ): Promise<ChatResponse> {
    // if (!this.agentId) {
    //   throw new Error("Agent not initialized");
    // }

    console.log({message, sessionId, userId,agentId:agentId})

    const chatRequest: ChatRequest = {
      user_id: userId,
      agent_id: agentId,
      message: message,
      session_id: sessionId,
    };

    console.log({chatRequest})

    const response = await this.lyzr.chatWithAgent(chatRequest);

    // Check if agent indicates escalation is needed
    const needsEscalation = response.response.includes("[SWITCH_TO_HUMAN]");

    return {
      ...response,
      can_handle: !needsEscalation,
      response: response.response.replace("[SWITCH_TO_HUMAN]", "").trim(),
    };
  }
}

// Export singleton instance and classes
const lyzrManagerAgent = new CustomerSupportAgent();

export { lyzrManagerAgent, CustomerSupportAgent, LyzrClient };
export default { lyzrManagerAgent };
