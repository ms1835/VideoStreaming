# 🎬 AI-Powered Video Streaming Platform

An AI-enabled full-stack video streaming platform built using React, Node.js, MongoDB Atlas Vector Search, AWS Bedrock, and cloud-native deployment architecture.

This project goes beyond a traditional CRUD-based video platform by integrating:

- Semantic video search
- AI-generated metadata
- Vector-based recommendation engine
- Cloud-native deployment
- Scalable media handling

---

# 🚀 System Architecture

```text
Frontend (React + Vite + AWS S3)
        ↓
Backend API (Node.js + Express + EC2 + PM2)
        ↓
MongoDB Atlas (Database + Vector Search)
        ↓
AWS Bedrock (Embeddings + AI Metadata)
        ↓
Cloudinary (Video Storage & Delivery)
```

---

# ✨ Features

## 🎥 Video Upload & Streaming

- Upload short-form videos
- Cloud-based video storage using Cloudinary
- Optimized media delivery
- Multi-channel support
- Genre-based content organization

---

## 🔐 Authentication & Session Management

- User signup/login system
- Session-based authentication
- Persistent login sessions using MongoDB session store
- Protected APIs and middleware authorization

---

## ❤️ Engagement Features

- Like / dislike videos
- Subscribe to creators
- Playlist management
- User-channel relationships

---

## 🧠 AI Metadata Generation

Integrated AWS Bedrock LLMs to automatically generate:

- Video descriptions
- Video tags
- AI-enriched metadata

This improves:

- Content discoverability
- Search quality
- Recommendation relevance

---

## 🔎 Semantic Search (AI Search Engine)

Traditional keyword search was replaced with vector-based semantic search.

### Example

Searching for:

```text
comedy
```

can intelligently retrieve:

- funny dog videos
- prank clips
- humorous content

even if the exact keyword is not present.

### Powered By

- AWS Bedrock Embeddings
- MongoDB Atlas Vector Search

---

## 🎯 AI Recommendation Engine

Implemented a content-based recommendation system using vector similarity search.

### Recommendation Flow

1. Generate embeddings from:
   - title
   - description
   - tags

2. Store embeddings in MongoDB Atlas

3. Perform nearest-neighbor vector similarity search

4. Recommend semantically related videos

### Example

Watching:

```text
Beginner Home Workout
```

can recommend:

- cardio videos
- gym clips
- exercise content

instead of unrelated videos.

---

# ☁️ Cloud-Native Deployment

## Frontend

- Hosted on AWS S3 Static Hosting
- Automated deployment using GitHub Actions CI/CD

## Backend

- Hosted on AWS EC2
- Managed using PM2
- Production environment configuration using environment variables

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Context API
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## AI / ML

- AWS Bedrock
- Titan Embeddings
- Semantic Vector Search
- AI Metadata Generation

## Cloud & DevOps

- AWS EC2
- AWS S3
- GitHub Actions
- PM2
- Cloudinary

---

# 🧠 AI Architecture

## Embedding Generation Flow

```text
Video Upload
    ↓
Generate Metadata
    ↓
Create Embedding
    ↓
Store Embedding in MongoDB Atlas
    ↓
Enable Semantic Search & Recommendations
```

---

## 🔍 Semantic Search Pipeline

```text
Search Query
    ↓
Convert Query → Embedding
    ↓
MongoDB Atlas Vector Search
    ↓
Return Most Similar Videos
```

---

## 🎯 Recommendation Pipeline

```text
Current Video
    ↓
Fetch Embedding
    ↓
Vector Similarity Search
    ↓
Return Related Videos
```

---

# 📦 Project Structure

```text
project-root/
│
├── client/                 # React Frontend
│
├── server/                 # Node.js Backend
│
├── .github/
│   └── workflows/          # CI/CD Pipelines
│
└── README.md
```

---
<!--
# ⚙️ Environment Variables

## Frontend (`client/.env`)

```env
VITE_SERVER_URI=your_backend_url
```

---

## Backend (`server/.env`)

```env
PORT=

DB_URL=

SESSION_SECRET=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

BEDROCK_MODEL_ID=

CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

---
-->
# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repo_url>
cd project
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

## 3️⃣ Run Frontend

```bash
npm run dev
```

---

## 4️⃣ Run Backend

```bash
npm start
```

---

# ☁️ Deployment

## Frontend Deployment

- AWS S3 Static Hosting
- Automated using GitHub Actions CI/CD

## Backend Deployment

- AWS EC2
- PM2 Process Manager

---

# 📈 Key Engineering Highlights

- Built scalable vector-search architecture using embeddings
- Integrated AI-powered metadata generation pipeline
- Implemented semantic retrieval instead of traditional keyword matching
- Designed recommendation engine using vector similarity
- Deployed cloud-native full-stack architecture on AWS
- Automated frontend deployment using CI/CD pipelines

---
<!--
# 🧪 Future Improvements

- AI-generated captions using speech-to-text
- Personalized recommendations
- Watch history tracking
- Trending algorithm
- Hybrid recommendation ranking
- Video moderation pipeline
- Real-time notifications

---

# 🏆 Resume-Worthy Highlights

- Built AI-powered semantic video discovery system using vector embeddings
- Implemented recommendation engine using MongoDB Atlas Vector Search
- Integrated AWS Bedrock for embeddings and metadata generation
- Designed scalable cloud deployment using AWS EC2, S3, and CI/CD workflows

---

# 📜 License

This project is built for educational and portfolio purposes. -->
