import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({collection: 'sessions'})
export class Session extends Document {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    deviceId: string;

    @Prop({ required: true })
    iat: string;

    @Prop({ required: true })
    deviceName: string;

    @Prop({ required: true })
    ip: string;

    @Prop({ required: false })
    exp: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);