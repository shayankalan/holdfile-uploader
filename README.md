# HoldFile - Full-Stack Dockerized File Uploader

HoldFile is a high-performance web solution designed for seamless file uploading, downloading, and tracking. The project highlights a clean separation of concerns with a decoupled client-server architecture, fully optimized for modern containerization workflows.

## 🚀 Tech Stack & Architecture

- **Backend:** Node.js, Express.js, and Multer for efficient multipart/form-data routing and disk storage management.
- **Frontend:** Responsive, modern dark-themed UI built with dynamic Vanilla JavaScript, interactive Drag & Drop APIs, and CSS3.
- **DevOps/Infrastructure:** Dockerized service layers orchestrated through Docker Compose for standardized deployment environments.

## 🛠️ Infrastructure Configuration (Docker Settings)

The network services are separated into distinct automated environments:
- **Backend Service:** Runs isolated via Node-Alpine environments on internal Port `3000`.
- **Frontend Service:** Bound to static Web Server distribution mapping standard client access over Port `8087`.

## 📦 Local Deployment Strategy

To run this entire infrastructure with a single execution command, ensure you have **Docker** installed, clone this workspace, and run:

```bash
docker-compose up --build
Client App Interface: http://localhost:8087
API Engine Server: http://localhost:3000
