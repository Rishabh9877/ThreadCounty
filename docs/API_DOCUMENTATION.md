# 🔌 API Documentation

ThreadCounty utilizes Next.js Server Actions and standard REST API routes for interacting with external services and handling client-side requests.

## 🤖 AI Endpoints

### `POST /api/chat`
**Description**: Handles conversations with the ThreadCounty AI Assistant using Google's Gemini 2.5 Flash model.
**Headers**:
- `Content-Type: application/json`

**Request Body (JSON)**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Can you explain how fabric analysis works?"
    }
  ]
}
```

**Response (200 OK)**:
```json
{
  "text": "Fabric analysis works by analyzing high-resolution images..."
}
```

**Response (500 Error)**:
```json
{
  "error": "Failed to generate response: [Error message]"
}
```

---

## ⚡ Server Actions (RPC)

All database and storage operations are handled securely via Next.js Server Actions, preventing direct exposure of the database to the client.

### `uploadFabricImage(formData: FormData)`
- **Path**: `src/app/actions/upload.ts`
- **Description**: Uploads a fabric image to Supabase Storage.
- **Returns**: `{ fileUrl: string, error?: string }`

### `analyzeFabricImage(fileUrl: string)`
- **Path**: `src/app/actions/upload.ts`
- **Description**: Sends the uploaded image URL to Gemini 2.5 Flash for computer vision analysis, extracting thread density, warp/weft counts, and fabric type.
- **Returns**: `{ threadDensity: string, warpCount: number, weftCount: number, fabricType: string, confidence: number, aiSuggestions: string }`

### `getDashboardStats()`
- **Path**: `src/app/actions/dashboard.ts`
- **Description**: Retrieves aggregate statistics for the current user (total scans, average confidence, recent trends).
- **Returns**: `{ totalScans: number, ... }`

### `getRecentScans(limit?: number)`
- **Path**: `src/app/actions/dashboard.ts`
- **Description**: Fetches the user's latest fabric analysis reports.

### `getScanById(id: string)`
- **Path**: `src/app/actions/results.ts`
- **Description**: Fetches a detailed report for a specific scan ID.

### `compareScans(id1: string, id2: string)`
- **Path**: `src/app/actions/compare.ts`
- **Description**: Retrieves two scans side-by-side for comparison.

---

## 🔐 Authentication
Authentication is managed entirely by Supabase Auth (SSR). API routes and Server Actions extract the user's session from secure HttpOnly cookies via `@supabase/ssr`.

No manual API Keys or JWTs are required in client-side headers.
