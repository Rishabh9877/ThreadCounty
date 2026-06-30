# 🗄️ Database Schema

ThreadCounty uses a PostgreSQL database hosted on **Supabase** with the **Prisma ORM** for schema definition and migrations.

## 📊 Entity-Relationship Overview

The database is built around a centralized `User` model, with relational ties to their profile, uploads, generated AI reports, subscriptions, notifications, and security logs.

---

### `User`
Core authentication and identity model.
- `id` (String): Primary Key, UUID
- `name` (String?): Optional display name
- `email` (String?): Unique email address
- `image` (String?): Avatar URL
- `role` (Role): `USER` or `ADMIN`
- `createdAt` / `updatedAt` (DateTime)

### `Profile`
Extended user information.
- `id` (String): Primary Key, CUID
- `userId` (String): Foreign Key, Unique (1-to-1 with User)
- `bio` (String?): User biography
- `company` (String?): Company name
- `jobTitle` (String?): Job title
- `phone` (String?): Contact number

### `Upload`
Records of images uploaded for fabric analysis.
- `id` (String): Primary Key, CUID
- `userId` (String): Foreign Key (1-to-many with User)
- `fileName` (String): Original file name
- `fileUrl` (String): Supabase Storage URL
- `fileSize` (Int): File size in bytes
- `fileType` (String): MIME type
- `createdAt` (DateTime)

### `Report`
AI-generated analysis results linked to an upload.
- `id` (String): Primary Key, CUID
- `userId` (String): Foreign Key
- `uploadId` (String): Foreign Key, Unique (1-to-1 with Upload)
- `threadDensity` (String?): Calculated density
- `warpCount` (Int?): Count of warp threads
- `weftCount` (Int?): Count of weft threads
- `fabricType` (String?): Detected fabric material/weave (e.g., Cotton, Denim)
- `confidence` (Float?): AI confidence score
- `aiSuggestions` (String?): Textual suggestions and insights

### `Subscription`
Billing and subscription status.
- `id` (String): Primary Key, CUID
- `userId` (String): Foreign Key
- `planId` (String): Identifier (e.g., "free", "student", "professional")
- `status` (String): "active" or "canceled"
- `currentPeriodEnd` (DateTime?)

### `ContactMessage`
Support and contact form submissions.
- `id` (String): Primary Key, CUID
- `name` (String): Sender name
- `email` (String): Sender email
- `message` (String): Message content
- `status` (String): "UNREAD", "READ", or "RESOLVED"

### `Notification`
In-app notifications for users.
- `id` (String): Primary Key, CUID
- `userId` (String): Foreign Key
- `title` (String): Notification title
- `message` (String): Notification body
- `read` (Boolean): Read status

### `SecurityLog`
Audit trails for security events.
- `id` (String): Primary Key, CUID
- `userId` (String): Foreign Key
- `action` (String): Action performed
- `ipAddress` (String?): Origin IP
- `userAgent` (String?): Origin User Agent
