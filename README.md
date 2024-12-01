# Free-Time-Finder

Free-Time-Finder is a web application designed to simplify group scheduling by helping teams find the most convenient meeting times based on everyone's availability.

## Features

- **Schedule Creation**: Create and share schedules with team members
- **Interactive Calendar**: Input availability through an easy-to-use calendar interface
- **Visual Availability**: View aggregated availability with color gradients
- **Smart Suggestions**: Get recommended meeting times based on group availability
- **Shareable Links**: Easily distribute schedules to team members

## Tech Stack

### Frontend
- React (Vite-based)
- Modern UI/UX design
- Interactive calendar component

### Backend
- Django REST API
- PostgreSQL database
- RESTful endpoints for schedule management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- pip (Python package manager)
- npm (Node package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mwmcclure7/Free-Time-Finder.git
cd Free-Time-Finder
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Development

The application is structured into two main parts:

- `/frontend`: Contains the React application built with Vite
- `/backend`: Contains the Django REST API

### Running the Development Servers

1. Backend server:
```bash
cd backend
python manage.py runserver
```

2. Frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## Database Setup

1. Create a PostgreSQL database
2. Update the database configuration in `backend/settings.py`
3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Calendar visualization libraries
- Django REST Framework
- React and Vite communities
