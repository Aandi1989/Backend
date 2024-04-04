import { ObjectId } from "mongodb";
import { myStatus } from "../../comments/types/types";


export class LikeStatus {
    id: ObjectId;
    createdAt: string;
    constructor(public userId: string,
                public parentId: string,
                public status: myStatus) {
                    this.id = new ObjectId(),
                    this.createdAt = new Date().toISOString()
    }
}