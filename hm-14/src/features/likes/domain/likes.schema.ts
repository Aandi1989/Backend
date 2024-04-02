import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { myStatus } from '../../posts/types/types';

@Schema({ collection: 'likes'})
export class Like extends Document {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    status: myStatus;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    parentId: string;

    @Prop({ required: true })
    createdAt: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
