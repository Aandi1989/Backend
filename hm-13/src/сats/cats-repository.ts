import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument, CatModelStatikType } from './cats-schema';

@Injectable()
export class CatsRepository {
  // CatModel is class, not the instance that is why it is written in capital letter
  constructor(
    @InjectModel(Cat.name)
    private CatModel: Model<CatDocument> & CatModelStatikType, //CatModelStatikType is needed only if we use static method of class here
  ) {}

  async create(createCatDto: any): Promise<Cat> {
    // just example how to use static methods
    const superCat = this.CatModel.createSuperCat('abc');
    console.log(superCat);
    // ---------------------------------------
    const createdCat = new this.CatModel(createCatDto);
    return createdCat.save();
  }
  async findAll(): Promise<CatDocument[]> {
    return this.CatModel.find().exec();
  }
  async save(cat: CatDocument) {
    await cat.save();
  }
}
