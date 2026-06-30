# 🧵 ThreadCounty AI Platform

> **AI-Powered Textile Intelligence Platform**
> 
> Analyze fabric thread density, classify weave patterns, and generate automated quality control reports with industry-grade precision and a state-of-the-art interactive experience.

---

## 🚀 Live Demo & Repository
- **Live Hosted Website**: [thread-county-seven.vercel.app](https://thread-county-seven.vercel.app/)
- **GitHub Repository**: [Rishabh9877/ThreadCounty](https://github.com/Rishabh9877/ThreadCounty)

---

## 🌟 Comprehensive Feature List

ThreadCounty is packed with modern, production-grade features designed for both desktop and mobile web experiences:

1. **Apple-Inspired 3D Scrollytelling (Landing Page)**
   - Custom WebGL/Three.js particle shaders.
   - Cinematic camera transitions synchronized with GSAP scroll triggers.
   - GPU-accelerated rendering locked at 60 FPS.

2. **AI Computer Vision Fabric Analysis**
   - Direct integration with Google Gemini 2.5 Flash for high-speed multi-modal analysis.
   - Calculates Thread Density (Threads per square inch).
   - Identifies Warp and Weft counts from microscopic imagery.
   - Classifies fabric patterns (e.g., Twill, Denim, Cotton, Satin, Linen).
   - Generates confidence scores and detailed AI-driven quality insights.

3. **Intelligent AI Chatbot**
   - Real-time chatbot utilizing Gemini 2.5 Flash.
   - Context-aware support for questions regarding fabric analysis, platform pricing, and best practices.
   - Native auto-scrolling with custom UI scrollbar mapping.

4. **Progressive Web App (PWA) Support**
   - Offline support via Service Workers.
   - Installable on iOS/Android homescreens for a native app-like experience.

5. **Comprehensive QC Dashboard**
   - Grid-based history view of all previous scans with infinite scrolling & lazy loading.
   - Side-by-side Fabric Comparison Tool to analyze two scans simultaneously.
   - Secure PDF Generation for downloading detailed QC reports.
   - Account Profile management and Statistics aggregation.

6. **Authentication & Role Management**
   - Supabase secure Email/Password authentication.
   - Role-based Access Control (RBAC): Differentiates between standard `USER` and `ADMIN` roles.
   - Server-Side Rendering (SSR) session validation via secure HttpOnly cookies.

7. **Bonus System Features**
   - Multi-language Support routing structures.
   - Real-time Notifications system (Database schemas ready for WebSocket broadcast).
   - Dynamic Pricing pages and interactive Contact Forms.
   - Glassmorphism UI with framer-motion micro-animations.

---

## 🛠️ Technology Stack

This project strictly adheres to a modern, high-performance tech stack:

### Frontend
*   **React.js & Next.js 14** (App Router architecture)
*   **TypeScript** (Strict Type Safety)
*   **Tailwind CSS** (Utility-first Styling)
*   **Framer Motion & GSAP** (Micro-interactions & Layout Animations)
*   **ShadCN UI** (Accessible Component Primitives)
*   **Three.js & React Three Fiber** (3D WebGL scenes)

### Backend & AI
*   **Node.js / Vercel Edge** (Next API Routes & Server Actions)
*   **Python** (AI Model structural equivalents)
*   **Google Gemini 2.5 Flash** (Computer Vision & NLP AI processing)

### Database & Auth
*   **Supabase** (PostgreSQL)
*   **Supabase Auth** (SSR & Middleware integration)
*   **Prisma ORM** (Database schema definition, queries, and migrations)

### Deployment & Version Control
*   **Vercel** (Primary Edge Deployment, officially recommended)
*   *Compatible with Netlify, Render, and Railway*
*   **Git & GitHub** (Version Control)

---

## 🏗️ Architecture Overview

The architecture follows a strictly decoupled Server-less model:

- **Client Layer**: Next.js React Server Components (RSC) pass data down to Client Components. Heavy 3D rendering is conditionally disabled on mobile devices to save battery, falling back to CSS animations.
- **API / RPC Layer**: Direct database queries are executed entirely server-side via Next.js Server Actions (Remote Procedure Calls). Client-side components never expose SQL or database credentials.
- **AI Processing Layer**: Image URLs uploaded to Supabase Storage are securely piped from the backend to the Google Gemini API. The AI model returns heavily structured JSON data which is then parsed, validated, and saved into the PostgreSQL database using Prisma.
- **Security Layer**: All routes nested under `/dashboard` are protected by a Next.js Edge Middleware that intercepts requests and validates the Supabase Auth session token before rendering.

---

## 🗄️ Database Schema

ThreadCounty uses a PostgreSQL database with Prisma ORM. Below is the Entity-Relationship breakdown:

### `User`
Core authentication and identity model.
- `id` (String, UUID)
- `name` (String?), `email` (String?, Unique), `image` (String?)
- `role` (Role Enum: `USER`, `ADMIN`)
- `createdAt` / `updatedAt` (DateTime)

### `Profile`
Extended user information.
- `id` (String, CUID), `userId` (String, Unique, FK to User)
- `bio`, `company`, `jobTitle`, `phone` (String?)

### `Upload`
Records of images uploaded for fabric analysis.
- `id` (String, CUID), `userId` (String, FK to User)
- `fileName` (String), `fileUrl` (String, Supabase Storage)
- `fileSize` (Int), `fileType` (String)

### `Report`
AI-generated analysis results linked to an upload.
- `id` (String, CUID), `uploadId` (String, Unique, FK to Upload), `userId` (String)
- `threadDensity`, `fabricType`, `aiSuggestions` (String?)
- `warpCount`, `weftCount` (Int?)
- `confidence` (Float?)

### `Subscription`
Billing and subscription status.
- `id` (String, CUID), `userId` (String, FK to User)
- `planId` (String), `status` (String), `currentPeriodEnd` (DateTime?)

### `ContactMessage`
Support and contact form submissions.
- `id` (String, CUID), `name`, `email`, `message` (String)
- `status` (String: "UNREAD", "READ", "RESOLVED")

### `Notification` & `SecurityLog`
- **Notification**: `id`, `userId`, `title`, `message`, `read` (Boolean)
- **SecurityLog**: `id`, `userId`, `action`, `ipAddress`, `userAgent`

---

## 🔌 API Documentation

### 🤖 AI Endpoints

#### `POST /api/chat`
**Description**: Handles conversations with the ThreadCounty AI Assistant using Google's Gemini 2.5 Flash model.
**Headers**: `Content-Type: application/json`
**Request Body**:
```json
{
  "messages": [
    { "role": "user", "content": "How does fabric analysis work?" }
  ]
}
```
**Response (200 OK)**:
```json
{
  "text": "Fabric analysis works by analyzing high-resolution images..."
}
```

### ⚡ Server Actions (Internal API)
All database and storage operations are handled securely via Next.js Server Actions, preventing direct exposure of the database to the client.

- **`uploadFabricImage(formData: FormData)`**: Uploads a fabric image to Supabase Storage. Returns the secure `fileUrl`.
- **`analyzeFabricImage(fileUrl: string)`**: Sends the image URL to Gemini 2.5 Flash for computer vision analysis, extracting thread density, warp/weft counts, and fabric type. Returns the structured JSON payload.
- **`getDashboardStats()`**: Retrieves aggregate statistics for the current user (total scans, average confidence, recent trends).
- **`getRecentScans(limit?: number)`**: Fetches the user's latest fabric analysis reports.
- **`getScanById(id: string)`**: Fetches a detailed report for a specific scan ID.
- **`compareScans(id1: string, id2: string)`**: Retrieves two scans side-by-side for comparison.

---

## 💻 Getting Started (Local Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rishabh9877/ThreadCounty.git
   cd ThreadCounty
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables (`.env.local`)**:
   ```env
   # Supabase DB
   DATABASE_URL="your-supabase-postgres-connection-string"
   DIRECT_URL="your-supabase-postgres-direct-connection-string"
   # Supabase Auth
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   # AI
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```
4. **Sync Database Schema**:
   ```bash
   npx prisma db push
   ```
5. **Run the server**:
   ```bash
   npm run dev
   ```
