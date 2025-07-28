// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/users.models.js'; // Corrected import path to User model

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check if Authorization header exists and is well-formed
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or malformed." });
        }

        const token = authHeader.split(" ")[1];

        // 2. Ensure a token actually exists after "Bearer "
        if (!token) {
            return res.status(401).json({ message: "Token not found after 'Bearer ' prefix." });
        }

        const isCustomAuth = token.length < 500; // Heuristic to differentiate custom vs. Google JWT
        let decodedData;
        let userFromDb; // To hold user object fetched from DB

        if (token && isCustomAuth) {
            // For your custom JWT (e.g., from local signup/signin)
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
            // Assuming your custom JWT already includes the 'role'
            // If not, you'll fetch it from DB below
            req.userRole = decodedData?.role;
            userFromDb = await User.findById(req.userId);

        } else {
            // For Google OAuth JWT
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub; // Google's unique user ID (sub)
            // For Google users, you need to find them in your DB to get their role
            // Assume you store Google users using their email, or map 'sub' to your _id
            userFromDb = await User.findOne({ email: decodedData?.email });
        }

        // 3. Fetch user from DB if not already fetched or if role is missing from token
        if (!userFromDb && req.userId) { // If userFromDb is null but we have a req.userId
             userFromDb = await User.findById(req.userId);
        }

        // 4. Attach user details (userId, userName, userProfilePhoto, userRole) to the request
        if (userFromDb) {
            req.userId = userFromDb._id; // Ensure consistent userId from DB
            req.userName = userFromDb.name;
            req.userProfilePhoto = userFromDb.profilePhoto;
            req.userRole = userFromDb.role; // This is the most reliable source for the user's role
        } else {
            // If user is not found in DB after decoding token, they are not authorized
            return res.status(401).json({ message: "User associated with token not found in database." });
        }

        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        // This catch block handles expired tokens, malformed tokens, or verification failures
        console.error("Authentication error:", error);

        // Specific message for JWT errors for better debugging/user feedback
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }

        // Generic fallback for other errors
        return res.status(500).json({ message: "Authentication failed due to a server error." });
    }
};

// --- NEW: Authorization Middleware for Role-Based Access ---
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.userRole should have been set by the 'auth' middleware
        if (!req.userRole || !roles.includes(req.userRole)) {
            // Log for debugging: console.log(`Access denied for role: ${req.userRole}. Required roles: ${roles.join(', ')}`);
            return res.status(403).json({ message: `Forbidden: Your role (${req.userRole || 'none'}) is not authorized to access this resource.` });
        }
        next(); // User has the required role, proceed
    };
};

export { auth, authorizeRoles };