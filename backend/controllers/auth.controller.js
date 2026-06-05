import userModel from "../models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../models/sessions.model.js";

export const register = async (req, res) => {
    const { username, email, password, accountType, address } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isAlreadyRegistered) {
        res.status(409).json({
            message: "Username or Email already exists!"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        accountType,
        address
    })


    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    // Fix incomplete digest method call to properly hash refresh token
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip, // Added spacing for readability
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId:session._id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7d
    })

    res.status(201).json({
        message: "User register successfully",
        user: {
            username: user.username,
            email: user.email,
            accountType: user.accountType,
            address: user.address
        },
        accessToken
    });

}


export const getUser = async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const decoded = jwt.verify(accessToken, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id)
    res.status(200).json({
        message: "User found",
        user: {
            username: user.username,
            email: user.email,
            accountType: user.accountType,
            address: user.address
        }
    })
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke: false
    });
    if(!session){
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id,

    }, config.JWT_SECRET, {
        expiresIn: "15m"
    }
    );

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken
    })
}

export const logout = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke: false
    });
    if(!session){
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }
    session.revoke = true;
    await session.save();
    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "User logout successfully"
    })
}

export const logoutAll = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.updateMany({
        refreshTokenHash,
        revoke: false
    },{
        revoke: true
    });
    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "User logout from all devices successfully"
    });
}

export const login = async(req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(401).json({
            message: "User not found"
        })
    }

    // Hash input password same way as stored password and compare digests
    const inputPasswordHash = crypto.createHash("sha256").update(password).digest("hex");
    const hashedPassword = inputPasswordHash === user.password;
    if(!hashedPassword){
        return res.status(401).json({
            message: "Password is incorrect"
        })
    }

    // Create session first to get session ID
    const tempToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
    const tempTokenHash = crypto.createHash("sha256").update(tempToken).digest("hex");
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: tempTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });

    // Now create real tokens with session ID
    const refreshToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    });
    
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    session.refreshTokenHash = refreshTokenHash;
    await session.save();

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7d
    })
    res.status(200).json({
        message: "User login successfully",
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
    })
}
