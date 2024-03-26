import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { likeType } from './types/types';

@Schema({ collection: 'comments'})
export class Comment extends Document {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    postId: string;

    @Prop({ required: true, type: Object })
    commentatorInfo: {
        userId: string;
        userLogin: string;
    }

    @Prop({ required: true })
    createdAt: string;

    @Prop({ type: Object, required: true })
    likes: likeType;

    @Prop({ type: Object, required: true })
    dislikes: likeType;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);