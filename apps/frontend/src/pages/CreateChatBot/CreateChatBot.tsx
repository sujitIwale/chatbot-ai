import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { chatbotApi } from "../../lib/api/chatbot";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";

const CreateChatBot = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agentInstructions: "",
    context: "",
    useKnowledgeBase: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const createChatbot = async () => {
    if (!formData.name.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a name for your chatbot",
      });
      return;
    }

    if (!formData.agentInstructions.trim()) {
      toast.error("Validation Error", {
        description: "Please enter agent instructions",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await chatbotApi.createChatbot({
        name: formData.name,
        description: formData.description || undefined,
        instructions: formData.agentInstructions,
        context: formData.context || undefined,
        useKnowledgeBase: formData.useKnowledgeBase,
      });

      if (response.id) {
        toast.success("ChatBot created successfully!", {
          description: "Your AI-powered customer support agent is ready.",
        });
        navigate(`/chatbot/${response.id}`);
      }
    } catch (error) {
      console.error("Error creating chatbot:", error);
      toast.error("Failed to create ChatBot", {
        description:
          "There was an error creating your chatbot. Please try again.",
        action: {
          label: "Retry",
          onClick: () => createChatbot(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createChatbot();
  };

  return (
    <>
      <Toaster position="top-left" richColors closeButton />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create New ChatBot
                </h1>
                <p className="text-gray-600">
                  Configure your AI-powered customer support agent with context
                  and instructions
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ChatBot Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your chatbot's name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a memorable name for your customer support chatbot
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of your chatbot's purpose..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full min-h-[80px]"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Optional description of your chatbot's main purpose
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="agentInstructions"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Agent Instructions <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="agentInstructions"
                    name="agentInstructions"
                    placeholder="Describe how your customer support agent should behave, what it should help with, and any specific guidelines..."
                    value={formData.agentInstructions}
                    onChange={handleInputChange}
                    className="w-full min-h-[120px]"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Provide detailed instructions on how your AI agent should
                    handle customer inquiries
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="context"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Context Information
                  </label>
                  <Textarea
                    id="context"
                    name="context"
                    placeholder="Company information, product details, policies, or any knowledge your chatbot should be aware of..."
                    value={formData.context}
                    onChange={handleInputChange}
                    className="w-full min-h-[100px]"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Background information and knowledge base for your AI agent
                  </p>

                  {/* Knowledge Base Checkbox */}
                  <div className="mt-3 flex items-start space-x-3">
                    <input
                      id="useKnowledgeBase"
                      name="useKnowledgeBase"
                      type="checkbox"
                      checked={formData.useKnowledgeBase}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="useKnowledgeBase"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Create Knowledge Base
                      </label>
                      <p className="text-sm text-gray-500">
                        Enable this to create a knowledge base from the context
                        information.
                        <span className="text-amber-600 font-medium">
                          {" "}
                          Note: I am not sure if knowledge base is getting
                          connected properly.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        name: "",
                        description: "",
                        agentInstructions: "",
                        context: "",
                        useKnowledgeBase: false,
                      })
                    }
                    disabled={isLoading}
                  >
                    Clear Form
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating & Setting up AI Agent...
                      </>
                    ) : (
                      "Create ChatBot"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateChatBot;
