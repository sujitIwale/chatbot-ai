import lyzrClient from "./axios";
import axios from "axios"; // Added for RAG functionality
import FormData from "form-data";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

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

// New interfaces for RAG functionality
interface RAGConfig {
  user_id: string;
  llm_credential_id: string;
  embedding_credential_id: string;
  vector_db_credential_id: string;
  description: string;
  collection_name: string;
  llm_model: string;
  embedding_model: string;
  vector_store_provider: string;
  semantic_data_model: boolean;
  meta_data: Record<string, any>;
}

interface RAGResponse {
  id: string;
  collection_name: string;
  status: string;
}

interface TextTrainingResponse {
  status: string;
  message: string;
  task_id?: string;
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

  // New RAG functionality methods
  async createRAGConfiguration(config: RAGConfig): Promise<RAGResponse> {
    try {
      // Use the rag-prod.studio.lyzr.ai URL for RAG operations
      const ragClient = axios.create({
        baseURL: 'https://rag-prod.studio.lyzr.ai',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.LYZR_API_KEY
        }
      });

      const response = await ragClient.post("/v3/rag/", config);
      return response.data;
    } catch (error) {
      console.error("Error creating RAG configuration:", error);
      throw new Error("Failed to create RAG configuration");
    }
  }

  async uploadTextTraining(ragId: string, textContent: string, fileName: string = "context.txt"): Promise<TextTrainingResponse> {
    let tempFilePath: string | null = null;

    console.log({textContent, ragId})
    
    try {
      // Create a temporary file
      const tempDir = os.tmpdir();
      tempFilePath = path.join(tempDir, `temp_${Date.now()}_${fileName}`);
      
      // Write the text content to the temporary file
      fs.writeFileSync(tempFilePath, textContent, 'utf-8');
      
      const formData = new FormData();
      
      // Add form fields exactly as in the working curl command
      formData.append('data_parser', 'txt_parser');
      formData.append('extra_info', '{}');
      
      // Upload the actual file from disk
      formData.append('file', fs.createReadStream(tempFilePath), {
        filename: fileName,
        contentType: 'text/plain'
      });

      console.log(`Uploading file: ${tempFilePath} for RAG ID: ${ragId}`);

      // Make the request with proper headers
      const response = await axios.post(
        `https://rag-prod.studio.lyzr.ai/v3/train/txt/?rag_id=${ragId}`,
        formData,
        {
          headers: {
            'x-api-key': process.env.LYZR_API_KEY,
            'accept': 'application/json, text/plain, */*',
            ...formData.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error("Error uploading text training:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }
      throw new Error(`Failed to upload text training data: ${error.message || 'Unknown error'}`);
    } finally {
      // Clean up the temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
          console.log(`Cleaned up temporary file: ${tempFilePath}`);
        } catch (cleanupError) {
          console.warn(`Failed to cleanup temporary file: ${tempFilePath}`, cleanupError);
        }
      }
    }
  }
}

// Customer Support Agent Manager
class CustomerSupportAgent {
  private lyzr: LyzrClient;
  private agentId?: string;
  private ragId?: string;

  constructor() {
    this.lyzr = new LyzrClient();
  }

  async initialize(chatbot: {
    id: string;
    name: string;
    description?: string;
    instructions: string;
    context: string;
  }) {
    let ragId: string | undefined;
    let ragCreationError: string | undefined;

    // Try to create knowledge base if context is provided, but don't block agent creation if it fails
    let knowledgeBaseCreated = false;
    if (chatbot.context) {
      try {
        console.log("Creating knowledge base with provided context...");
        
        // Create RAG configuration
        const ragConfig: RAGConfig = {
          user_id: `user_${chatbot.id}`,
          llm_credential_id: "lyzr_openai",
          embedding_credential_id: "lyzr_openai", 
          vector_db_credential_id: "lyzr_qdrant",
          description: `Knowledge base for ${chatbot.name} chatbot`,
          collection_name: `kb_${chatbot.id}_${Date.now()}`,
          llm_model: "gpt-4o-mini",
          embedding_model: "text-embedding-3-small",
          vector_store_provider: "qdrant",
          semantic_data_model: false,
          meta_data: {
            chatbot_id: chatbot.id,
            chatbot_name: chatbot.name
          }
        };

        const ragResponse = await this.lyzr.createRAGConfiguration(ragConfig);
        console.log('rag is created', {ragResponse});
        ragId = ragResponse.id;
        this.ragId = ragId;
        
        console.log("RAG configuration created:", ragResponse);

        // Upload context as training data
        await this.lyzr.uploadTextTraining(ragId, chatbot.context, `${chatbot.name}_context.txt`);
        console.log("Context uploaded to knowledge base successfully");
        knowledgeBaseCreated = true
      } catch (error: any) {
        console.error("Failed to create knowledge base, but continuing with agent creation:", error);
        ragCreationError = error.message || 'Unknown error during knowledge base creation';
        ragId = undefined;
        this.ragId = undefined;
      }
    }

    try {
      // Create customer support agent (with or without RAG integration)
      const agentConfig: AgentConfig = {
        name: chatbot.name,
        system_prompt: `You are a helpful Customer Support Agent for ${chatbot.name}. 

${ragId ? `You have access to a knowledge base containing relevant information about ${chatbot.name}. Use this knowledge base to provide accurate and contextual responses.` : chatbot.context ? `Note: A knowledge base was intended to be created for this chatbot but is currently unavailable. Please provide general support based on your training.` : ""}

INSTRUCTIONS: ${chatbot.instructions}

Your role is to:
1. Handle complaints professionally and empathetically  
2. Provide troubleshooting guidance and solutions based on available knowledge
3. Be friendly, professional, and helpful at all times
${ragId ? '4. Use the knowledge base to provide accurate information when available' : '4. Provide general support based on your training'}
5. If you cannot resolve an issue or don't have enough information, politely indicate that you need to switch to a human agent

IMPORTANT: If you cannot provide a satisfactory answer or resolve the customer's issue, respond with exactly this phrase at the end of your message: "[SWITCH_TO_HUMAN]"

Always try your best to help first using available knowledge, but don't hesitate to escalate when needed.`,
        description:
          chatbot.description ||
          `AI-powered customer support agent for ${chatbot.name} that handles customer queries${ragId ? ' with knowledge base support' : ''}`,
        features: [
          {
            type: "SHORT_TERM_MEMORY",
            config: {},
            priority: 0,
          },
          // Add RAG feature only if knowledge base was successfully created
          ...(ragId ? [{
            type: "KNOWLEDGE_BASE",
            config: {
              kb_id: knowledgeBaseCreated ? ragId : "688512f932989c453d15d6a7"
            },
            priority: 1,
          }] : [])
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
      console.log("Agent created successfully:", { 
        agent_id: agent.agent_id, 
        rag_id: ragId,
        knowledge_base_status: ragId ? 'created' : (ragCreationError ? 'failed' : 'not_requested')
      });
      
      this.agentId = agent.agent_id;

      return { 
        agentId: agent.agent_id, 
        ragId: ragId,
        knowledgeBaseError: ragCreationError
      };
    } catch (error) {
      console.error("Error creating customer support agent:", error);
      throw error;
    }
  }

  async sendMessage(
    message: string,
    sessionId: string,
    userId: string,
    agentId: string
  ): Promise<ChatResponse> {
    console.log({message, sessionId, userId, agentId, ragId: this.ragId});

    const chatRequest: ChatRequest = {
      user_id: userId,
      agent_id: agentId,
      message: message,
      session_id: sessionId,
    };

    console.log({chatRequest});

    const response = await this.lyzr.chatWithAgent(chatRequest);

    // Check if agent indicates escalation is needed
    const needsEscalation = response.response.includes("[SWITCH_TO_HUMAN]");

    return {
      ...response,
      can_handle: !needsEscalation,
      response: response.response.replace("[SWITCH_TO_HUMAN]", "").trim(),
    };
  }

  // Getter for RAG ID
  getRagId(): string | undefined {
    return this.ragId;
  }
}

// Export singleton instance and classes
const lyzrManagerAgent = new CustomerSupportAgent();

export { lyzrManagerAgent, CustomerSupportAgent, LyzrClient };
export default { lyzrManagerAgent };
