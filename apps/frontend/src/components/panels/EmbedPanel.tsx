import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Code,
  Copy,
  ExternalLink,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Check,
  Download,
  Eye,
} from "lucide-react";

interface EmbedPanelProps {
  chatbotId: string;
  chatbotName: string;
}

const EmbedPanel: React.FC<EmbedPanelProps> = ({ chatbotId, chatbotName }) => {
  const [selectedTab, setSelectedTab] = useState<"embed" | "api" | "sdk">(
    "embed"
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [embedSettings, setEmbedSettings] = useState({
    theme: "light",
    position: "bottom-right",
    primaryColor: "#3B82F6",
    showBranding: true,
    initialMessage: "Hello! How can I help you today?",
  });

  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/chat/${chatbotId}`;

  const embedCode = `<!-- Chatbot Embed Code -->
<script>
  (function() {
    var chatbot = document.createElement('div');
    chatbot.id = 'chatbot-${chatbotId}';
    chatbot.style.cssText = 'position:fixed;${
      embedSettings.position.includes("bottom") ? "bottom:20px;" : "top:20px;"
    }${
    embedSettings.position.includes("right") ? "right:20px;" : "left:20px;"
  }z-index:9999;';
    document.body.appendChild(chatbot);
    
    var iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}?embed=true&theme=${
    embedSettings.theme
  }&color=${encodeURIComponent(embedSettings.primaryColor)}';
    iframe.width = '400';
    iframe.height = '600';
    iframe.frameBorder = '0';
    iframe.style.cssText = 'border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.15);';
    chatbot.appendChild(iframe);
  })();
</script>`;

  const apiCode = `// API Integration Example
const response = await fetch('${baseUrl}/api/chatbot/${chatbotId}/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Hello, how can you help me?',
    sessionId: 'unique-session-id'
  })
});

const data = await response.json();
console.log(data.response);`;

  const sdkCode = `// JavaScript SDK
import { ChatbotSDK } from '@your-org/chatbot-sdk';

const chatbot = new ChatbotSDK({
  chatbotId: '${chatbotId}',
  apiKey: 'YOUR_API_KEY',
  baseUrl: '${baseUrl}'
});

// Send a message
const response = await chatbot.sendMessage('Hello!');
console.log(response);

// Listen to events
chatbot.on('message', (message) => {
  console.log('New message:', message);
});`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const integrationOptions = [
    {
      title: "Website Widget",
      description: "Add a floating chat widget to your website",
      icon: Globe,
      color: "blue",
    },
    {
      title: "Mobile App",
      description: "Integrate into iOS and Android applications",
      icon: Smartphone,
      color: "green",
    },
    {
      title: "Desktop App",
      description: "Embed in desktop applications",
      icon: Monitor,
      color: "purple",
    },
  ];

  const tabs = [
    { key: "embed", label: "Embed Code", icon: Code },
    { key: "api", label: "REST API", icon: Settings },
    { key: "sdk", label: "SDK", icon: Download },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Embed & Integrate
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add {chatbotName} to your website, mobile app, or any platform using
            our flexible integration options.
          </p>
        </div>

        {/* Integration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`p-3 bg-${option.color}-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 text-${option.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            );
          })}
        </div>

        {/* Embed Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customization Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={embedSettings.theme}
                  onChange={(e) =>
                    setEmbedSettings({
                      ...embedSettings,
                      theme: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={embedSettings.position}
                  onChange={(e) =>
                    setEmbedSettings({
                      ...embedSettings,
                      position: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <Input
                  type="color"
                  value={embedSettings.primaryColor}
                  onChange={(e) =>
                    setEmbedSettings({
                      ...embedSettings,
                      primaryColor: e.target.value,
                    })
                  }
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      selectedTab === tab.key
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Code Display */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTab === "embed" && "Website Embed Code"}
                {selectedTab === "api" && "REST API Example"}
                {selectedTab === "sdk" && "JavaScript SDK"}
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
                  onClick={() =>
                    copyToClipboard(
                      selectedTab === "embed"
                        ? embedCode
                        : selectedTab === "api"
                        ? apiCode
                        : sdkCode,
                      selectedTab
                    )
                  }
                >
                  {copiedCode === selectedTab ? (
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
                <code>
                  {selectedTab === "embed" && embedCode}
                  {selectedTab === "api" && apiCode}
                  {selectedTab === "sdk" && sdkCode}
                </code>
              </pre>
            </div>

            {selectedTab === "embed" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Quick Setup Instructions:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Copy the embed code above</li>
                  <li>
                    2. Paste it before the closing &lt;/body&gt; tag on your
                    website
                  </li>
                  <li>3. Customize the settings above to match your brand</li>
                  <li>4. Your chatbot will appear on your website!</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Documentation Links */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center space-x-3 text-orange-600 hover:text-orange-700"
            >
              <ExternalLink className="w-5 h-5" />
              <span>View Documentation</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 text-orange-600 hover:text-orange-700"
            >
              <ExternalLink className="w-5 h-5" />
              <span>API Reference</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 text-orange-600 hover:text-orange-700"
            >
              <ExternalLink className="w-5 h-5" />
              <span>SDK Downloads</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 text-orange-600 hover:text-orange-700"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Integration Examples</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedPanel;
