import { ObjectId } from "mongodb";
import { getCollection } from "./db.js";
async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);
    const { collection, closeConnection } = await getCollection();
    try {
        switch (command) {
            case "create": {
                const [titulo, autor, precioStr, stockStr] = args;
                if (!titulo || !autor || !precioStr || !stockStr) {
                    console.log("Uso: npx tsx src/index.ts create <titulo> <autor> <precio> <stock>");
                    break;
                }
                const precio = parseFloat(precioStr);
                const stock = parseInt(stockStr, 10);
                const result = await collection.insertOne({
                    titulo,
                    autor,
                    precio,
                    stock,
                });
                console.log("✅ Libro creado exitosamente con ID:", result.insertedId);
                break;
            }
            case "read": {
                const libros = await collection.find({}).toArray();
                console.log("📚 Lista de libros:");
                console.table(libros);
                break;
            }
            case "update": {
                const [id, titulo, autor, precioStr, stockStr] = args;
                if (!id || !titulo || !autor || !precioStr || !stockStr) {
                    console.log("Uso: npx tsx src/index.ts update <ID> <titulo> <autor> <precio> <stock>");
                    break;
                }
                const precio = parseFloat(precioStr);
                const stock = parseInt(stockStr, 10);
                const updatedLibro = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { titulo, autor, precio, stock } }, { returnDocument: "after" });
                if (updatedLibro) {
                    console.log("✅ Libro actualizado:");
                    console.log(updatedLibro);
                }
                else {
                    console.log("❌ No se encontró ningún libro con ese ID.");
                }
                break;
            }
            case "delete": {
                const [id] = args;
                if (!id) {
                    console.log("Uso: npx tsx src/index.ts delete <ID>");
                    break;
                }
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount > 0) {
                    console.log(`✅ Libro con ID ${id} eliminado correctamente.`);
                }
                else {
                    console.log("❌ No se encontró ningún libro con ese ID.");
                }
                break;
            }
            default:
                console.log("Comando no reconocido.");
                console.log("Comandos disponibles: create, read, update, delete");
                break;
        }
    }
    catch (error) {
        console.error("Error al ejecutar la operación:", error);
    }
    finally {
        await closeConnection();
    }
}
main();
