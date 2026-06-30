# 🧵 ThreadCounty

> **AI-Powered Textile Intelligence Platform**
> 
> Analyze fabric thread density, classify weave patterns, and generate automated quality control reports with industry-grade precision and a state-of-the-art interactive experience.

---

## 🚀 Live Demo & Deployment
Deployed on Vercel: [threadcounty.vercel.app](https://threadcounty.vercel.app) *(Replace with your live URL)*

---

## 🌟 Key Features

*   **Apple-Inspired 3D Scrollytelling**: A highly optimized particle scene that morphs a single fiber into woven fabric, then zooms into microscopic warp/weft structures, and resolves into an AI brain. Offloaded entirely to GPU Custom Shaders (`ShaderMaterial`) to guarantee a locked 60 FPS scrolling experience.
*   **AI-Powered Fabric Classification**: Upload fabric images to run computer vision models measuring thread density and identifying weave types (Cotton, Denim, Twill, Satin, Linen) with precision metrics.
*   **Comprehensive QC Dashboard**: A central interface to track scanned history, compare scans side-by-side, analyze thread count progression graphs, and download detailed PDF quality reports.
*   **Mobile Optimized**: Device-aware rendering completely bypasses heavy WebGL rendering on mobile displays to preserve battery life, falling back to rich CSS animations while preserving a high-performance experience on desktops.
*   **Database & Secure Auth**: Fully structured backend powered by Supabase PostgreSQL and Prisma ORM, utilizing secure Row Level Security (RLS) and persistent session authentication.

---

## 🛠️ Technology Stack

*   **Core Framework**: Next.js 14 (App Router) + React
*   **3D Graphics**: Three.js, React Three Fiber, Custom GLSL Vertex/Fragment Shaders
*   **Animations**: GSAP (GreenSock), Framer Motion, Lenis (Smooth Scroll)
*   **Styling**: Tailwind CSS + Shadcn UI + Vanilla CSS (Glassmorphism)
*   **Database & ORM**: Prisma Client + Supabase (PostgreSQL)
*   **Auth & Storage**: Supabase Auth + Supabase Storage

---

## 💻 Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.x or higher)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A [Supabase](https://supabase.com/) Account (Free tier is perfect)

### ⚙️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/threadcounty.git
    cd threadcounty
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and populate it with your Supabase credentials:
    ```env
    # Supabase Connection (Prisma)
    DATABASE_URL="your-supabase-postgres-connection-string"
    DIRECT_URL="your-supabase-postgres-direct-connection-string"

    # Supabase Client Authentication
    NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```

4.  **Sync your Database Schema**:
    Push the Prisma schema to your Supabase instance:
    ```bash
    npx prisma db push
    ```

5.  **Run the local development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🏗️ Production Deployment

This project is fully ready for deployment on **Vercel**:

1.  Connect your GitHub repository to Vercel.
2.  Import your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`) under the Project Settings.
3.  Vercel will build and deploy the app automatically!
