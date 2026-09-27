import { MongoClient, Db, Collection } from "mongodb";
import type { Libro } from "./types.js";

const MONGO_URI = "mongodb+srv://cortezvalentinet36_db_user:rDBG2qFFm3F2NLrC@cluster0.supbybg.mongodb.net/biblioteca?retryWrites=true&w=majority&appName=Cluster0";//Lo pongo con Atlas porque con MongoDB normal no me deja por un problema que tengo con la direccion IPV4

const DB_NAME = "biblioteca";
const COLLECTION_NAME = "libros";

const client = new MongoClient(MONGO_URI);


export async function getCollection(): Promise<{
  collection: Collection<Libro>;
  closeConnection: () => Promise<void>;
}> {
  // Se conecta al server de MongoDB
  await client.connect();

  // Accede a la base de datos 'biblioteca'
  const db: Db = client.db(DB_NAME);

  // Accede a la coleccion 'libros'
  const collection: Collection<Libro> = db.collection<Libro>(COLLECTION_NAME);

  // Devuelve la coleccion y cierra la conexion
  return {
    collection,
    closeConnection: async () => await client.close(),
  };
}