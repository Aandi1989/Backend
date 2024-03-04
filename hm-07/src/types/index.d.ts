import { UserOutputType } from "./types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserOutputType | null
        }
    }
}