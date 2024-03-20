import { ObjectId } from "mongodb";
import { myStatus } from "../../../types/types";

export class Like {
    id: ObjectId;
    createdAt: string;
    constructor(public userId: string,
                public parentId: string,
                public status: myStatus) {
                    this.id = new ObjectId(),
                    this.createdAt = new Date().toISOString()
    }
}