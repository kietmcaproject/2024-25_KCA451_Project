import jwt from 'jsonwebtoken';

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;

        // Check if the token is not provided
        if (!dtoken) {
            return res.json({ success: false, message: "Not Authorized. Please Login Again." });
        }

        // Verify the dtoken
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.body.docId = token_decode.id

        // Move to the next middleware if verification succeeds
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authDoctor;
