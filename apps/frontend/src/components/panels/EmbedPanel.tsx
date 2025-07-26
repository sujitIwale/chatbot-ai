import React, { useState } from "react";
import { Button } from "../ui/button";
import { Code, Copy, Eye, Check, Globe } from "lucide-react";

interface EmbedPanelProps {
  chatbotId: string;
  chatbotName: string;
}

const EmbedPanel: React.FC<EmbedPanelProps> = ({ chatbotId, chatbotName }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/chat/${chatbotId}`;

  const embedCode = `<!-- ${chatbotName} Chatbot Embed Code -->
<script>
  (function() {
    var chatbot = document.createElement('div');
    chatbot.id = 'chatbot-${chatbotId}';
    chatbot.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;';
    document.body.appendChild(chatbot);
    
    var iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}?embed=true&theme=light&color=%233B82F6';
    iframe.width = '400';
    iframe.height = '600';
    iframe.frameBorder = '0';
    iframe.style.cssText = 'border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.15);';
    chatbot.appendChild(iframe);
  })();
</script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
            Add {chatbotName} to your website with a simple script tag. Copy the
            code below and paste it into your website.
          </p>
        </div>

        {/* Website Integration Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Website Widget
              </h3>
              <p className="text-sm text-gray-600">
                Add a floating chat widget to your website
              </p>
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
                  onClick={() => window.open(embedUrl, "_blank")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(embedCode)}
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
                  3. Your chatbot will appear as a floating widget on your
                  website
                </li>
                <li>4. Visitors can click the widget to start chatting</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedPanel;
