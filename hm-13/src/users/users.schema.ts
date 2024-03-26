import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AccountData, CodeRecoveryInfo, EmailConfirmation } from './types/types';


@Schema({ collection: 'accounts' })
export class User extends Document {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Object, required: true })
  accountData: AccountData;

  @Prop({ type: Object })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: Object })
  codeRecoveryInfo: CodeRecoveryInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
