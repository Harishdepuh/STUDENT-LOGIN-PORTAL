# Student Login/Registration System

A simple full-stack web application for student registration and login, built with  MySQL, and vanilla HTML/CSS/JavaScript on the frontend.

 Features
- User registration with name, email, and password
- Passwords are hashed using bcrypt before being stored (never stored in plain text)
- Duplicate email check during registration
- Login with email/password validation against the database
- Simple, clean UI with real-time success/error messages (no page reload, using the Fetch API)

 Tech Stack
- Frontend: HTML5, CSS3, JavaScript (Fetch API)
- Backend: Node.js, Express.js
- Database: MySQL
- Security: bcrypt for password hashing

 Setup Instructions

1. Install dependencies
   ```
   npm install
   ```

2. Set up the database
   - Open MySQL (or phpMyAdmin) and run the commands in schema.sql.

3. Configure database credentials
   - Open server.js and update the password field in the db connection with your local MySQL password.

4. Run the server**
 
   npm start

5. Open the app
   - Visit "http://localhost:3000/register.html" to create an account.
   - Visit "http://localhost:3000/login.html" to log in.

 Project Structure

student-login-app/
├── server.js          # Express server, routes, database logic
├── schema.sql          # Database schema
├── package.json
└── public/
    ├── register.html
    ├── login.html
    └── style.css


 How It Works
1. The frontend form collects user input and sends it to the backend via a fetch() POST request as JSON.
2. The Express server receives the request, validates the input, and interacts with the MySQL database using parameterized queries (to prevent SQL injection).
3. On registration, the password is hashed with bcrypt before being saved.
4. On login, the entered password is compared against the stored hash using bcrypt, and a response is sent back indicating success or failure.
5. The frontend displays the response message without reloading the page.
