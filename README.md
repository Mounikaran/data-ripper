# Xebo Excel Splitter

A Next.js web application that allows users to upload Excel (.xlsx) files, split them into smaller chunks, and download the results as a ZIP archive. This tool is particularly useful for handling large Excel files that may be difficult to work with due to their size.

## Features

- **User-friendly Interface**: Simple step-by-step process for uploading and splitting files
- **Multiple File Format Support**: Handles both Excel (.xlsx, .xls) and CSV files
- **Configurable Headers**: Supports different header row configurations based on file type
  - Source File (1 header row)
  - Response Template (2 header rows)
  - Custom (user-defined number of header rows)
- **Customizable Chunk Size**: Users can specify how many rows they want in each split file
- **Real-time Progress Updates**: Shows detailed progress during file processing
- **Large File Support**: Optimized to handle files up to 200MB+
- **Instant Download**: Split files are automatically packaged into a ZIP archive for easy download
- **Responsive Design**: Works well on both desktop and mobile devices
- **Docker Support**: Easy deployment with Docker

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/xebo-excel-splitter.git
cd xebo-excel-splitter
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to use the application

## How It Works

1. **Upload**: User uploads an Excel (.xlsx) file
2. **Configure**: User specifies how many rows they want in each split file
3. **Process**: The application splits the file, preserving the first two rows in each split file
4. **Download**: A ZIP archive containing all split files is automatically downloaded

## Technologies Used

- **Next.js**: React framework for building the web application
- **TailwindCSS**: For styling the user interface
- **xlsx**: For reading and writing Excel files
- **jszip**: For creating ZIP archives

## Deployment

### Standard Deployment

This application can be deployed to Vercel or any other Next.js hosting platform:

```bash
npm run build
# or
yarn build
```

Then deploy the built application to your preferred hosting platform.

### Docker Deployment

The application is dockerized for easy deployment in any environment that supports Docker.

#### Building the Docker Image

```bash
docker build -t xebo-response-upload-helper .
```

#### Running the Docker Container

```bash
docker run -p 3000:3000 xebo-response-upload-helper
```

The application will be available at http://localhost:3000

#### Using Docker Compose

Alternatively, you can use Docker Compose for a more streamlined setup:

```bash
docker-compose up -d
```

This will build the image and start the container in detached mode. The application will be available at http://localhost:3000

#### Health Check

The Docker container includes a health check endpoint at `/api/health` that can be used to monitor the application's status.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
