import React, { useState } from "react";
import { Button } from "../ui/button";
import { Code, Copy, Eye, Check, Hash } from "lucide-react";
import { API_URL } from "@/constants/api";

interface EmbedPanelProps {
  chatbotId: string;
  chatbotName: string;
}

const EmbedPanel: React.FC<EmbedPanelProps> = ({ chatbotId, chatbotName }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const baseUrl = window.location.origin;
  const apiBaseUrl = API_URL;

  const embedCode = `<!-- ${chatbotName} Chat Widget -->
<script 
  id="chatbot-embed-script"
  src="${baseUrl}/embed.js"
  data-chatbot-id="${chatbotId}"
  data-api-base-url="${apiBaseUrl}"
  data-chatbot-name="${chatbotName}"
  data-primary-color="#3B82F6"
  data-initial-message="Hello! How can I help you today?"
></script>`;

  const copyToClipboard = (text: string, type: "code" | "id") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Website Embed
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add {chatbotName} to your website with a simple script tag. The chat
            widget will appear at the bottom-right corner.
          </p>
        </div>

        {/* Chatbot ID Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Hash className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chatbot ID
                </h3>
                <p className="text-sm text-gray-600">
                  Use this ID to integrate your chatbot
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-800">
                {chatbotId}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(chatbotId, "id")}
              >
                {copiedId ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy ID
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Website Embed Code
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `${baseUrl}/widget-demo.html?chatbotId=${chatbotId}&name=${encodeURIComponent(
                        chatbotName
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(embedCode, "code")}
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                <code>{embedCode}</code>
              </pre>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Setup Instructions:
              </h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Copy the embed code above</li>
                <li>
                  2. Paste it before the closing &lt;/body&gt; tag on your
                  website
                </li>
                <li>
                  3. A floating chat button will appear at the bottom-right
                  corner
                </li>
                <li>
                  4. Visitors can click the button to open the chat widget
                  (380px × 500px)
                </li>
                <li>
                  5. Conversations are automatically saved in localStorage
                </li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">
                Customization Options:
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>
                  • <code>data-chatbot-name</code>: Display name for your bot
                </li>
                <li>
                  • <code>data-primary-color</code>: Theme color (hex code)
                </li>
                <li>
                  • <code>data-initial-message</code>: Welcome message
                </li>
                <li>• Works on any domain without CORS issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedPanel;
