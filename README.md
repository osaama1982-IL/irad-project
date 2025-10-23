# Weather App

A full-stack weather application with user authentication built with React and Node.js.

## Features

- 🌤️ Weather status display
- 🔐 User registration and login
- 🔑 JWT-based authentication
- 📱 Responsive design
- 🚀 Single-command deployment

## Technologies

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express 5
- **Database**: PostgreSQL
- **Authentication**: JWT tokens with blacklisting

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup database**
   - Create a PostgreSQL database
   - Run the SQL commands from `backend/database-setup.sql`

4. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` with your database credentials and JWT secret.

5. **Start the application**

   **Development mode (separate servers):**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

   **Production mode (unified server):**
   ```bash
   npm start
   ```
   - Application: http://localhost:5000

## Project Structure

```
weather-app/
├── backend/                 # Node.js/Express API
│   ├── routes/             # API routes
│   ├── .env.example        # Environment template
│   └── database-setup.sql  # Database schema
├── frontend/               # React application
│   └── src/               # React components
└── package.json           # Root package with scripts
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/weather` - Get weather data

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | 24h |
| `PORT` | Server port | 5000 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
│       ├── main.jsx          # React entry point
│       └── index.css         # Global styles
└── tools/
    └── removeArabic.js       # Utility script
```

## Technologies Used

### Backend
- Node.js
- Express.js
- PostgreSQL
- bcryptjs (password hashing)
- JSON Web Tokens (JWT)
- CORS
- dotenv

### Frontend
- React 19
- React Router DOM
- Vite (build tool)
- Tailwind CSS
- ESLint

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Osma main project"
```

### 2. Database Setup

1. Install and start PostgreSQL
2. Create a database named `osamadb`
3. Run the SQL script to create the users table:

```bash
psql -U postgres -d osamadb -f backend/database-setup.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables in `backend/.env`:
```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=osamadb
PGUSER=postgres
PGPASSWORD=your_password_here
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

### 5. Install Root Dependencies

```bash
cd ..
npm install
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Weather
- `GET /api/weather` - Get current weather data

## Features

- User registration and authentication
- Password hashing with bcryptjs
- Weather status display
- Responsive design with Tailwind CSS
- Route protection and navigation
- Real-time weather data fetching

## Environment Variables

### Backend (.env)
```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=osamadb
PGUSER=postgres
PGPASSWORD=your_password
```

## Security Features

- Password hashing using bcryptjs
- Email validation
- Duplicate email prevention
- Protected routes
- CORS configuration

## Development Tools

- ESLint for code linting
- Vite for fast development and building
- Nodemon for backend auto-restart
- Concurrently for running multiple processes

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Port Already in Use**
   - Change the PORT in backend or kill the process using the port

3. **Frontend Build Errors**
   - Run `npm run lint` to check for code issues
   - Ensure all dependencies are installed

### Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run lint` - Run ESLint on frontend code
- `npm run build` - Build frontend for production

## License

ISC License

## Contributors

This project was created as a graduation project.