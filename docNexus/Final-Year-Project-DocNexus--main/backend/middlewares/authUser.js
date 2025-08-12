import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        // Check if the token is not provided
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Please Login Again." });
        }

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id

        // Move to the next middleware if verification succeeds
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
