import jwt from 'jsonwebtoken';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;

        // Check if the token is not provided
        if (!atoken) {
            return res.json({ success: false, message: "Not Authorized. Please Login Again." });
        }

        // Verify the token
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        console.log(token_decode)

        // Verify the token payload (you should store email in the token during login)
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not Authorized. Invalid token." });
        }

        // Move to the next middleware if verification succeeds
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;
