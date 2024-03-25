import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Model } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class CatToy {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;
}

export const CatToySchema = SchemaFactory.createForClass(CatToy);

@Schema()
export class Cat {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  breed: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: [], type: [CatToySchema] })
  toys: CatToy[];

  setAge(newage: number) {
    if (newage < 0) throw new Error('Bad age value. Should be more than 0');
    this.age = newage;
  }

  static createSuperCat(
    dto: any,
    CatModel: Model<CatDocument> & CatModelStatikType,
  ): CatDocument {
    const createdCat = new CatModel(dto);
    createdCat.setAge(100);
    return createdCat;
  }
}

export type CatModelStatikType = {
  createSuperCat: (
    name: string,
    CatModel: Model<CatDocument> & CatModelStatikType,
  ) => CatDocument;
};

export const CatSchema = SchemaFactory.createForClass(Cat);

const catStaticMethods: CatModelStatikType = {
  createSuperCat: Cat.createSuperCat,
};

CatSchema.methods = {
  setAge: Cat.prototype.setAge,
};
CatSchema.statics = catStaticMethods;
