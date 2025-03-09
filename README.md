# Branch - Your Link Hub Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-20.10-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

Branch is a modern LinkTree alternative that allows users to create customized link pages to share their online presence through a single, sleek URL. Built with Next.js for the frontend and FastAPI for the backend, Branch offers a powerful and user-friendly experience.

## 🌟 Features

- **Customizable Link Pages**: Create a personalized hub for all your important links
- **Beautiful Themes**: Choose from various themes or create your own custom design
- **Responsive Design**: Looks great on all devices - mobile, tablet, and desktop
- **User Authentication**: Secure login and registration system
- **Real-time Preview**: See changes as you make them
- **Custom Profiles**: Upload profile pictures, add a bio, and personalize your page
- **Analytics**: Track visitor counts and engagement (Pro feature)

## 🏗️ Project Structure

The project is divided into two main parts:

- `client/`: Next.js frontend application
- `server/`: FastAPI backend server

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- pnpm (for frontend dependencies)
- Docker and Docker Compose (for backend)
- pip (for local backend development)

### Running the Frontend

```bash
# Navigate to the frontend directory
cd client

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The frontend will be available at http://localhost:3000

### Running the Backend with Docker

```bash
# Navigate to the backend directory
cd server

# Build and start the Docker containers
docker-compose up --build

# Run in detached mode (optional)
docker-compose up -d
```

The backend API will be available at http://localhost:8000

### Running the Backend Locally (Alternative)

```bash
# Navigate to the backend directory
cd server

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app:app --reload
```

The backend API will be available at http://localhost:8000

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Axios](https://axios-http.com/) - HTTP client

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation
- [Docker](https://www.docker.com/) - Containerization platform


## 🐳 Docker Configuration

The backend uses Docker Compose to manage containers for:
- FastAPI application
- MongoDB database

Key Docker files:
- `branch_backend/Dockerfile`: Configures the FastAPI application container
- `branch_backend/docker-compose.yml`: Orchestrates the services

## 📝 Environment Variables

### Frontend (.env.local)

## 📱 Features by Page

### Landing Page
- Hero section with call-to-action
- Feature highlights
- Testimonials
- Pricing information
- FAQ section

### Dashboard
- Link management (add, edit, delete)
- Profile customization
- Theme settings
- Analytics overview (Pro)

### Public Profile Page
- Responsive link display
- Custom styling based on user preferences
- Social media previews

## 🔐 Authentication Flow

1. User registers with email/username and password
2. Backend validates and stores credentials securely
3. JWT token issued for authenticated sessions
4. Protected routes require valid token

## 🎨 Customization Options

- **Page Background**: Choose from presets or upload a custom background
- **Button Styles**: Solid, outline, or gradient options
- **Font Selection**: Multiple font families to match your brand
- **Theme Colors**: Customize the color scheme of your page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)