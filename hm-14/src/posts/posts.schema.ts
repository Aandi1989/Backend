import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { myStatus, newestLikeType } from './types/types';


@Schema({ collection: 'posts' })
export class Post extends Document {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    shortDescription: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    blogId: string;

    @Prop({ required: false })
    blogName: string;

    @Prop({ required: true })
    createdAt: string;

    @Prop({ required: true, type: Object })
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: myStatus;
        newestLikes: newestLikeType[];
  };
}

export const PostSchema = SchemaFactory.createForClass(Post);