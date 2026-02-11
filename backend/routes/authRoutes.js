import express from 'express';
import { registration, login, logOut, googleLogin, adminLogin } from '../controller/authcontroller.js';

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/registration:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name:
 * type: string
 * example: John Doe
 * email:
 * type: string
 * format: email
 * example: john@example.com
 * password:
 * type: string
 * format: password
 * example: StrongPassword123!
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Bad request
 * 500:
 * description: Internal server error
 */
authRoutes.post("/registration", registration);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Log in a user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * example: john@example.com
 * password:
 * type: string
 * format: password
 * example: StrongPassword123!
 * responses:
 * 200:
 * description: Login successful, returns an auth token
 * 400:
 * description: Invalid credentials
 * 500:
 * description: Internal server error
 */
authRoutes.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 * get:
 * summary: Log out a user
 * tags: [Auth]
 * responses:
 * 200:
 * description: Logged out successfully
 * 500:
 * description: Internal server error
 */
authRoutes.get("/logout", logOut);

/**
 * @swagger
 * /api/auth/googlelogin:
 * post:
 * summary: Log in using Google OAuth
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - token
 * properties:
 * token:
 * type: string
 * description: Google ID token provided by the frontend
 * example: eyJhbGciOiJSUzI1NiIs...
 * responses:
 * 200:
 * description: Google login successful
 * 400:
 * description: Invalid Google token
 * 500:
 * description: Internal server error
 */
authRoutes.post("/googlelogin", googleLogin);

/**
 * @swagger
 * /api/auth/adminlogin:
 * post:
 * summary: Log in an administrator
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * example: admin@riveto.com
 * password:
 * type: string
 * format: password
 * example: AdminSecret123!
 * responses:
 * 200:
 * description: Admin login successful
 * 403:
 * description: Forbidden - User does not have admin privileges
 * 500:
 * description: Internal server error
 */
authRoutes.post("/adminlogin", adminLogin);

export default authRoutes;