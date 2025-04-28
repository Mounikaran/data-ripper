# Data Ripper

Data Ripper is a web application for uploading, processing, and splitting large Excel (`.xlsx`, `.xls`) and CSV files. It provides a simple interface to configure how files are split and delivers the output as a ZIP archive. The app is designed for reliability and performance, supporting files up to 200MB+ and providing real-time progress updates.

---

## Features

- **User-friendly Interface:** Step-by-step upload, configuration, and download
- **Excel & CSV Support:** Handles `.xlsx`, `.xls`, and `.csv` files
- **Customizable Headers:** User specifies number of header rows to preserve in each split file
- **Configurable Chunk Size:** Choose how many rows per split file
- **Real-time Progress:** Live updates during processing
- **Efficient Streaming:** Backend streams progress and results efficiently
- **Instant ZIP Download:** All split files are packaged into a single ZIP
- **Responsive Design:** Works on desktop and mobile
- **Docker & Compose Support:** Easy production deployment

---

## Architecture

- **Frontend:** Next.js (React, TailwindCSS)
- **Backend:** FastAPI (Python, Pandas)
- **Communication:** The frontend uploads files and receives progress/events via Server-Sent Events (SSE) from the backend.
- **Deployment:** Docker Compose orchestrates both frontend (`app`) and backend (`backend`) services.

---

## Getting Started (Development)

### Prerequisites
- Node.js 18.x or later
- Python 3.9+
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/yourusername/data-ripper.git
cd data-ripper
```

## Docker & Docker Compose

The project includes a `docker-compose.yml` for production-like local deployment.

### Compose Services
- **app**: Next.js frontend (port 3000)
- **backend**: FastAPI backend (port 8000)

### Environment Variables
- `API_URL` (set in docker-compose.yml): Used by the frontend to communicate with the backend.
- `NODE_ENV=production`

### Build & Run
```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)

### Health Checks
- Frontend: `/api/health` (used by Docker Compose)
- Backend: `/health`

---

## How It Works
1. **Upload:** User uploads an Excel/CSV file.
2. **Configure:** User specifies header rows and rows per split file.
3. **Process:** Backend splits the file, preserving header rows in each part, and streams progress.
4. **Download:** User receives a ZIP archive with all split files.

---

## Technologies Used
- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** FastAPI, Pandas, Uvicorn
- **Packaging:** Docker, Docker Compose

---

## License
MIT License. See `LICENSE` for details.

---

## Contributing
Pull requests and issues are welcome!
