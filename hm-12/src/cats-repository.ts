import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument, CatModelStatikType } from './cats-schema';

@Injectable()
export class CatsRepository {
  // CatModel is class, not the instance that is why it is written in capital letter
  constructor(
    @InjectModel(Cat.name)
    private CatModel: Model<CatDocument> & CatModelStatikType,
  ) {}

  async create(createCatDto: any): Promise<Cat> {
    // const superCat = this.CatModel.createSuperCat(createCatDto, this.CatModel);
    // return superCat.save();
    const newCat = await this.CatModel.create(createCatDto);
    return newCat;
  }
  async findAll(): Promise<CatDocument[]> {
    return this.CatModel.find().exec();
  }
  async save(cat: CatDocument) {
    await cat.save();
  }
}
