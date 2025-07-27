import { lyzrClient, ragClient } from "./axios";
import FormData from "form-data";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { agentInstructions, escalationPhrase } from "../constants/agent";
import { Chatbot } from "@prisma/client";

interface AgentConfig {
  name: string;
  description: string;
  agent_role: string;
  agent_instructions: string;
  agent_goal: string;
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
  version: number;
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

const lyzrApis = {
  createAgent: async (config: AgentConfig): Promise<LyzrAgent> => {
    try {
      const response = await lyzrClient.post("/v3/agents/", config);
      return response.data;
    } catch (error) {
      console.error("Error creating agent:", error);
      throw new Error("Failed to create agent");
    }
  },
  chatWithAgent: async (chatRequest: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await lyzrClient.post(
        "/v3/inference/chat/",
        chatRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error chatting with agent:", error);
      throw new Error("Failed to send message to agent");
    }
  },
  createRAGConfiguration: async (chatbot: Chatbot): Promise<RAGResponse> => {
    try {
      const config: RAGConfig = {
        user_id: `user_${chatbot.id}`,
        llm_credential_id: "lyzr_openai",
        embedding_credential_id: "lyzr_openai",
        vector_db_credential_id: "lyzr_qdrant",
        description: `Knowledge base for ${chatbot.name} chatbot`,
        collection_name: `kb_${chatbot.id}}`,
        llm_model: "gpt-4o-mini",
        embedding_model: "text-embedding-3-small",
        vector_store_provider: "qdrant",
        semantic_data_model: false,
        meta_data: {
          chatbot_id: chatbot.id,
          chatbot_name: chatbot.name,
        },
      };
      const response = await ragClient.post("/v3/rag/", config);
      return response.data;
    } catch (error) {
      console.error("Error creating RAG configuration:", error);
      throw new Error("Failed to create RAG configuration");
    }
  },
  uploadTextTraining: async (
    chatbot: Chatbot,
    ragId: string
  ): Promise<TextTrainingResponse> => {
    let tempFilePath: string | null = null;

    try {
      let fileName = `temp_${Date.now()}_${chatbot.name}_context.txt`;
      // Create a temporary file
      const tempDir = os.tmpdir();
      tempFilePath = path.join(tempDir, fileName);

      // Write the text content to the temporary file
      fs.writeFileSync(tempFilePath, chatbot.context, "utf-8");

      const formData = new FormData();

      // Add form fields exactly as in the working curl command
      formData.append("data_parser", "txt_parser");
      formData.append("extra_info", "{}");

      // Upload the actual file from disk
      formData.append("file", fs.createReadStream(tempFilePath), {
        filename: fileName,
        contentType: "text/plain",
      });

      console.log(
        `Uploading file: ${tempFilePath} for RAG ID: ${ragId}`
      );

      // Make the request with proper headers

      const response = await ragClient.post(
        `/v3/train/txt/?rag_id=${ragId}`,
        formData,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error uploading text training:", error);
      throw new Error(
        `Failed to upload text training data: ${
          error.message || "Unknown error"
        }`
      );
    } finally {
      // Clean up the temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
          console.log(`Cleaned up temporary file: ${tempFilePath}`);
        } catch (cleanupError) {
          console.warn(
            `Failed to cleanup temporary file: ${tempFilePath}`,
            cleanupError
          );
        }
      }
    }
  },
};

const customerSupportAgent = {
  initialize: async (chatbot: Chatbot) => {
    let ragId = chatbot.lyzrRagId;
    let knowledgeBaseStatus: Chatbot["knowledgeBaseStatus"] =
      chatbot.knowledgeBaseStatus;

    try {
      if (!ragId) {
        const ragResponse = await lyzrApis.createRAGConfiguration(chatbot);
        console.log("rag is created", { ragResponse });
        ragId = ragResponse.id;
        console.log("RAG configuration created:", ragResponse);
      }

      if (ragId && chatbot.knowledgeBaseStatus === "NOT_CREATED") {
        await lyzrApis.uploadTextTraining(chatbot,ragId);
        knowledgeBaseStatus = "CREATED";
      }

      console.log("Context uploaded to knowledge base successfully");
    } catch (error: any) {
      console.error(
        "Failed to create knowledge base, but continuing with agent creation:",
        error
      );
    }

    try {
      const agentConfig: AgentConfig = {
        name: chatbot.name,
        description:
          chatbot.description ||
          `AI-powered customer support agent for ${
            chatbot.name
          } that handles customer queries${
            ragId ? " with knowledge base support" : ""
          }`,
        agent_role: `You are an Expert Customer Support Agent for ${chatbot.name}.`,
        agent_instructions: `${chatbot.instructions}
        ${agentInstructions}
        `,
        agent_goal: `Your goal is to resolve customer queries for ${chatbot.name} and provide exceptional customer support.`,
        features: [
          {
            type: "SHORT_TERM_MEMORY",
            config: {},
            priority: 0,
          },
          // Add RAG feature only if knowledge base was successfully created
          ...(ragId
            ? [
                {
                  type: "KNOWLEDGE_BASE",
                  config: {
                    lyzr_rag: {
                      base_url: "https://rag-prod.studio.lyzr.ai",
                      rag_id: ragId,
                      rag_name: `kb_${chatbot.id}`,
                      params: {
                        top_k: 5,
                        retrieval_type: "basic",
                        score_threshold: 0,
                      },
                    },
                    agentic_rag: [],
                  },
                  priority: 0,
                },
              ]
            : []),
        ],
        tools: [],
        provider_id: "openai",
        model: "gpt-4o-mini",
        top_p: 0.9,
        temperature: 0.7,
        version: 3,
        llm_credential_id: "lyzr_openai",
        response_format: {},
      };

      const agent = await lyzrApis.createAgent(agentConfig);
      console.log("Agent created successfully:", {
        agent_id: agent.agent_id,
        rag_id: ragId,
        knowledge_base_status: ragId ? "created" : "not_requested",
      });

      return {
        agentId: agent.agent_id,
        ragId: ragId,
        knowledgeBaseStatus,
      };
    } catch (error) {
      console.error("Error creating customer support agent:", error);
      throw error;
    }
  },
  sendMessage: async ({
    lyzrAgentId,
    message,
    sessionId,
    userId,
  }: {
    lyzrAgentId: string;
    message: string;
    sessionId: string;
    userId: string;
  }) => {
    if (!lyzrAgentId) {
      throw new Error("Agent ID is not set");
    }

    const chatRequest: ChatRequest = {
      user_id: userId,
      agent_id: lyzrAgentId,
      message: message,
      session_id: sessionId,
    };

    console.log({ chatRequest });

    const response = await lyzrApis.chatWithAgent(chatRequest);

    // Check if agent indicates escalation is needed
    const needsEscalation = response.response.includes(escalationPhrase);

    return {
      ...response,
      can_handle: !needsEscalation,
      response: response.response.replace(escalationPhrase, "").trim(),
    };
  },
};

export { customerSupportAgent, lyzrApis };
