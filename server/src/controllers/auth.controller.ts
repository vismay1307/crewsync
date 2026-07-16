import {Request , Response} from "express";
import ApiResponse from "../utils/ApiResponse.js";

export const signup = async(
    req:Request,
    res:Response

):Promise<void>=>{
     res.status(201).json(
        new ApiResponse(
            201,
            "Sign Up Is Working",
            req.body
        )
    );
}