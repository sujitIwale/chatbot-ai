import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { chatbotApi } from "../../lib/api/chatbot";

const CreateChatBot = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agentInstructions: "",
    context: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a name for your chatbot");
      return;
    }

    if (!formData.agentInstructions.trim()) {
      alert("Please enter agent instructions");
      return;
    }

    setIsLoading(true);

    try {
      const chatbot = await chatbotApi.createChatbot({
        name: formData.name,
        description: formData.description || undefined,
        instructions: formData.agentInstructions,
        context: formData.context || undefined,
      });

      // Redirect to the created chatbot
      navigate(`/chatbot/${chatbot.id}`);
    } catch (error) {
      alert("Failed to create chatbot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create New ChatBot
              </h1>
              <p className="text-gray-600">
                Configure your AI agent with a name and specific instructions
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
                  Choose a memorable name for your chatbot
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
                  placeholder="Brief description of what your chatbot does..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[80px]"
                  disabled={isLoading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Optional brief description of your chatbot's purpose
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
                  placeholder="Describe how your chatbot should behave, its role, and any specific guidelines it should follow..."
                  value={formData.agentInstructions}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px]"
                  disabled={isLoading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide detailed instructions on how your agent should respond
                  and behave
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
                  placeholder="Additional context, knowledge base, or background information for your chatbot..."
                  value={formData.context}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px]"
                  disabled={isLoading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Optional context or knowledge that your chatbot should be
                  aware of
                </p>
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
                    })
                  }
                  disabled={isLoading}
                >
                  Clear Form
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create ChatBot"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChatBot;
