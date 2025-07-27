# Lyzr Chatbot Platform

AI-powered customer support chatbot platform. Create intelligent support agents in minutes with zero coding required.

**Live Demo**: [https://lyzr-chatbot.netlify.app/](https://lyzr-chatbot.netlify.app/)

## Features

- Create AI chatbots powered by Lyzr agent in under 5 minutes
- Embed anywhere with a simple JavaScript snippet
- Automatic ticket creation from complex queries
- Smart agent assignment to support team
- Knowledge base integration with RAG
- Google OAuth authentication

## Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS  
**Backend**: Node.js, Express, Prisma, PostgreSQL  
**AI**: Lyzr AI platform with GPT-4o-mini  
**Auth**: Google OAuth 2.0

## Quick Start

### Prerequisites
- Node.js >= 18, PNPM >= 8, PostgreSQL
- Google OAuth credentials, Lyzr AI API credentials

### Setup
```bash
git clone <repository-url>
cd agentic-chat
pnpm install
```

### Environment Variables
Create `apps/backend/.env`:
```env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret" 
JWT_SECRET="your-jwt-secret"
LYZR_API_KEY="your-lyzr-api-key"
```

### Run
```bash
# Setup database
cd apps/backend && pnpm db:migrate

# Start development
pnpm dev
```

## Widget Integration

Embed chatbots with:
```html
<script 
  id="chatbot-embed-script"
  data-chatbot-id="your-chatbot-id"
  src="https://lyzr-chatbot.netlify.app/embed.js">
</script>
```

## Author
**Sujit Iwale** 