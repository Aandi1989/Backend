import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface AccountData {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface EmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface CodeRecoveryInfo {
  recoveryCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

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
