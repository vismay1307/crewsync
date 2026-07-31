import { IUser } from "../models/user.model.js";
import { IWorkspace } from "../models/workspace.model.js";
import { IWorkspaceMember } from "../models/workspace-member.model.js";


declare global {
  namespace Express {
    interface Request {
      user?: IUser;

      workspace?: IWorkspace;

      workspaceMember?: IWorkspaceMember;
    }
  }
}

export {};

export {};