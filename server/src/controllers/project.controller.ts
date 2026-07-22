import { Request, Response } from "express";
import { Types } from "mongoose";

import  asyncHandler  from "../utils/asyncHandler.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import { createProject,getProjects } from "../services/project.service.js";

export const createProjectController = asyncHandler(
    async (req: Request, res: Response) => {

        const ownerId = req.user!._id;

        const workspaceId =
            req.params.workspaceId as string;

        const project = await createProject(
            new Types.ObjectId(workspaceId),
            ownerId,
            req.body
        );

        res.status(201).json(
            new ApiResponse(
                201,
                "Project created successfully",
                project
            )
        );

    }
);

export const getProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user!._id;

    const workspaceId =
      req.params.workspaceId as string;

    const projects = await getProjects(
      new Types.ObjectId(workspaceId),
      ownerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Projects fetched successfully",
        projects
      )
    );
  }
);