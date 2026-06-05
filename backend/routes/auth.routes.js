import { Router } from "express";
import { register, getUser, refreshToken, logout, login } from "../controllers/auth.controller.js";

const authRouter = Router();

// Register route POST api/auth/register
authRouter.post("/register", register);

// Signin route GET api/auth/signin

authRouter.get("/get-user", getUser)

// Refresh token GET api/auth/refresh-token

authRouter.get("/refresh-token", refreshToken)

// Logout GET api/auth/logout
authRouter.get("/logout", logout)

// Logout from all devices GET api/auth/logout-all
authRouter.get("/logout-all", logout)

// Login POST api/auth/login
authRouter.post("/login", login)

export default authRouter;