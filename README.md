# Smart Study Assistant

Smart Study Assistant is an advanced learning platform built with Next.js and modern web technologies that helps students optimize their study process through intelligent document management, AI-powered flashcard generation, and personalized study sessions.

## Core Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI/Components**: Shadcn UI, Radix UI primitives, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with email/password and provider integrations
- **File Management**: UploadThing for document storage
- **AI Integration**: OpenAI API for intelligent content processing

## Key Features

### 1. Document Management

- **Document Upload**: Users can upload study materials (PDFs, text files) to their personal library
- **Organization**: Documents can be categorized into courses for better organization
- **Content Viewing**: Integrated document viewer for seamless reading experience
- **Intelligent Processing**: Documents are processed to extract key information for study aids

### 2. AI-Powered Flashcard System

- **Automated Generation**: AI automatically generates relevant flashcards from uploaded documents
- **Spaced Repetition**: Flashcards follow a learning algorithm (new → learning → reviewing → mastered)
- **Difficulty Tracking**: Cards are categorized by difficulty (easy, medium, hard)
- **Confidence Rating**: Users rate their confidence during review sessions

### 3. Personalized Study Sessions

- **Session Tracking**: The system tracks study duration and performance
- **Progress Analytics**: Users can monitor their learning progress over time
- **Question Generation**: AI creates relevant practice questions from study materials
- **Performance Feedback**: Detailed feedback on question responses and flashcard reviews

### 4. User Management

- **Secure Authentication**: Email/password authentication with NextAuth.js
- **User Profiles**: Personalized profiles with study statistics
- **Data Privacy**: Secure handling of user data and study materials

## Architecture

### Database Schema

- **User-centric Design**: All content (documents, courses, flashcards) is linked to individual users
- **Relational Structure**: Well-defined relationships between documents, flashcards, questions, and study sessions
- **Performance Optimized**: Efficient queries for quick access to study materials

### UI/UX Design

- **Responsive Interface**: Mobile-first design approach using Tailwind CSS
- **Modern Components**: Shadcn UI and Radix primitives for accessible, consistent UI
- **Dashboard Overview**: At-a-glance view of study progress, recent documents, and key metrics

### API Structure

- **RESTful Endpoints**: Clean API structure for document, flashcard, and auth operations
- **Server Components**: Leveraging Next.js RSC for improved performance
- **Optimized Data Flow**: Minimal client-side state with server-focused architecture

## Target Audience

- **Students**: High school and university students managing course materials
- **Self-learners**: Individuals pursuing independent study in any field
- **Educators**: Teachers who want to create and share optimized study materials

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Make sure to set up the following environment variables in your `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_study_assistant?schema=public"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
OPENAI_API_KEY="your-openai-api-key"
```

## Database Setup

Run the following commands to set up your database:

```bash
npx prisma migrate dev
npx prisma generate
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
