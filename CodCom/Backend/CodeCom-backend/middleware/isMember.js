// isMember middleware
import Community from '../models/communityModel.js';

export const isMember = async (req, res, next) => {
    const { communityId } = req.params; 

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        
        if (!community.members.includes(req.user._id)) {
            return res.status(403).json({ message: "Access denied, you are not a member of this community" });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
