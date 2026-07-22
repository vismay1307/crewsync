import { Types } from "mongoose";
import { Project } from "../models/project.models.js";
import { Workspace } from "../models/workspace.model.js";
import  ApiError from "../utils/ApiError.js";
import { CreateProjectInput } from "../validators/project.validators.js";

export const createProject = async (
    workspaceId: Types.ObjectId,
    ownerId: Types.ObjectId,
    data: CreateProjectInput
) => {

    // Step 1 - Check Workspace exists and belongs to current user
    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: ownerId,
        isDeleted: false,
    });

    if (!workspace) {
        throw new ApiError(
            404,
            "Workspace not found"
        );
    }

    // Step 2 - Check duplicate project inside same workspace
    const existingProject = await Project.findOne({
        workspace: workspaceId,
        name: data.name,
        isDeleted: false,
    });

    if (existingProject) {
        throw new ApiError(
            409,
            "Project with this name already exists"
        );
    }

    // Step 3 - Create project
    const project = await Project.create({
        ...data,
        workspace: workspaceId,
        owner: ownerId,
    });

    return project;
};