# Express Auth App

A Node.js Express application with a complete authentication system using Sequelize (PostgreSQL), JWT, and Express Sessions.

## Features

- **Authentication**: Secure user authentication using JWT and Sessions.
- **Database**: PostgreSQL integration via Sequelize ORM.
- **Security**: Password hashing with `bcryptjs`, secure HTTP-only cookies.
- **Session Management**: Persistent sessions stored in the database using `connect-session-sequelize`.
- **CORS**: Configured for Cross-Origin Resource Sharing.
- **Real-time Communication**: Integrated Socket.IO for real-time bidirectional event-based communication.
- **Robust Database Operations**: Standardized query execution with automatic transaction management and error logging.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd express-auth-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory with the following variables:
    ```env
    PORT=3000
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_HOST=localhost
    SESSION_SECRET=your_super_secret_session_key
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  Create the database:
    ```bash
    # You can use the provided script if you have one, or create it manually in psql
    createdb your_db_name
    ```
    *Note: The application will attempt to sync models and create tables automatically on start.*

## Usage

### Development
Run the application in development mode with `nodemon` for hot-reloading:
```bash
npm run dev
```

### Production
Start the application in production mode:
```bash
npm start
```

### Verify Setup
Run the verification script to check database connection and model syncing:
```bash
npm run verify
```

### Verify Socket.IO
Run the socket verification script to test real-time connection:
```bash
node verify-socket.js
```

## API Endpoints

-   `GET /`: Welcome message.
-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Login a user.
-   `POST /api/auth/logout`: Logout a user.
-   *(Add other endpoints as you implement them)*

## Project Structure

-   `src/server.js`: Application entry point.
-   `src/app.js`: Express app configuration and middleware.
-   `src/config/`: Database configuration.
-   `src/controllers/`: Request handlers.
-   `src/models/`: Sequelize models.
-   `src/routes/`: API route definitions.
-   `src/middleware/`: Custom middleware.
-   `src/utils/`: Utility functions (e.g., database helper).
-   `src/sockets/`: Socket.IO event handlers.

## License

ISC
