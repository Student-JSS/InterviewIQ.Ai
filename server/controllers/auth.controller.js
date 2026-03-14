import getToken from '../config/token.js';
import User from '../models/user.model.js';


export const googleAuth = async (req, res) => {
    try {
        const {name, email} = req.body;
        // Check if user exists in the database
        let user = await User.findOne({ email });
        if(!user){
            user = await User.create({ name, email });
        }

        let token = await getToken(user._id);
        res.cookie("token", token , {
            http: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        return res.status(200).json(user);

    }catch(error){
        return res.status(500).json({message:`Google auth error ${error.message}`});
    }
}

export const logOut = async (req, res) => {
    try{
        await res.clearCookie("token");
        return res.status(200).json({message: "Logged out successfully"});

    }catch(error){
        return res.status(500).json({message:`Logout error ${error.message}`});
    }
}