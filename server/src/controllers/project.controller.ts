import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../services/project.service.js";

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

export const getProjectController =
  asyncHandler(

    async (req: Request, res: Response) => {

      const ownerId = req.user!._id;

      const projectId =
        req.params.projectId as string;

      const project =
        await getProjectById(

          new Types.ObjectId(projectId),

          ownerId

        );

      res.status(200).json(

        new ApiResponse(

          200,

          "Project fetched successfully",

          project

        )

      );

    });

export const updateProjectController =
  asyncHandler(

    async (req: Request, res: Response) => {

      const ownerId = req.user!._id;

      const workspaceId =
        req.params.workspaceId as string;

      const projectId =
        req.params.projectId as string;

      const project =
        await updateProject(

          new Types.ObjectId(workspaceId),

          new Types.ObjectId(projectId),

          ownerId,

          req.body

        );

      res.status(200).json(

        new ApiResponse(

          200,

          "Project updated successfully",

          project

        )

      );

    });

export const deleteProjectController =
  asyncHandler(

    async (req: Request, res: Response) => {

      const ownerId = req.user!._id;

      const workspaceId =
        req.params.workspaceId as string;

      const projectId =
        req.params.projectId as string;

      await deleteProject(

        new Types.ObjectId(workspaceId),

        new Types.ObjectId(projectId),

        ownerId

      );

      res.status(200).json(

        new ApiResponse(

          200,

          "Project deleted successfully",

          null

        )

      );

    });