import { JwtPayload } from "src/auth/jwt-payload.interface";

export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
  }