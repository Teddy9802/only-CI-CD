import { CreateInput } from '../dto/createProduct.input';

export interface ICreateInput {
  createInput: CreateInput;
}
export interface IProductsServiceFindOne {
  id: string;
}
export interface IProductsServiceDelete {
  id: string;
}
