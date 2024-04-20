import { myStatus } from "../../comments/types/types";
import {v4 as uuidv4} from 'uuid';


export class LikeCommentStatus {
    id: string;
    createdAt: string;
    constructor(public userId: string,
                public commentId: string,
                public status: myStatus) {
                    this.id = uuidv4(),
                    this.createdAt = new Date().toISOString()
    }
}