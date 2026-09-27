import { ObjectId } from "mongodb";

export interface Libro {
  _id?: ObjectId;
  titulo: string;
  autor: string;
  precio: number;
  stock: number;
}