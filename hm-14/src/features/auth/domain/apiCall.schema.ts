import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ collection: 'apiCalls'})
export class ApiCall extends Document {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    date: Date;
}

export const AliCallSchema = SchemaFactory.createForClass(ApiCall);