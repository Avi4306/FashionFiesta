import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import User from '../models/users.models.js';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check if the Authorization header exists and has the correct format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or malformed." });
        }

        const token = authHeader.split(" ")[1];

        // Check if the token exists (in case the header was just "Bearer")
        if (!token) {
            return res.status(401).json({ message: "Token not found." });
        }

        const isCustomAuth = token.length < 500;
        let decodedData;

        if (token && isCustomAuth) {
            // Use the secret from your .env file
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        // NEW: Fetch the user from the database using the decoded userId
        if (req.userId) {
            const user = await User.findById(req.userId);
            if (user) {
                // NEW: Attach the user's name and profile photo to the request object
                req.userName = user.name;
                req.userProfilePhoto = user.profilePhoto;
            }
        }

        next();
    } catch (error) {
        // This catch block handles expired tokens or other JWT-related errors
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

=======

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
export default auth;