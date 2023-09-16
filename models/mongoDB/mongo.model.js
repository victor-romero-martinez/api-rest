import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";

const DB_URL = process.env.MONGO_URL;

const client = new MongoClient(DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    await client.connect();
    const db = client.db("Products");
    return db.collection("products");
  } catch (error) {
    await client.close();
  }
}

// fetch db
export class ProductModel {
  // crear un producto
  static async create(body) {
    const db = await connect();
    const timestamp = new Date();

    body["createAt"] = timestamp;
    body["updateAt"] = timestamp;
    await db.insertOne(body);
    return {
      ...body,
    };
  }

  // traer tos productos
  static async getAll({ search, offset, limit, hostname, port }) {
    //TODO paginacion offset-limit
    const db = await connect();
    // Obtener el número total de productos
    const totalProducts = await db.countDocuments(); //

    // buscar por nombre
    if (search) {
      return db
        .find({
          name: {
            $regex: search,
            $options: "i",
          },
        })
        .toArray();
    } else if (offset && limit) {
      // los link de la paginacion no funciona correctamente
      //
      const off = parseInt(offset);
      const lim = parseInt(limit);
      const dir = `http://${hostname}:${process.env.PORT ?? 5555}`;
      const netxDir = `${dir}/api/products?offset=${off + 1}&limit=${limit}`; //
      const prevDir = `${dir}/api/products?offset=${off - 1}&limit=${lim}`; //

      const res = await db.find({}).skip(off).limit(lim).toArray();

      return {
        total: totalProducts,
        next: netxDir,
        prev: prevDir,
        result: res,
      };
    }
    const res = await db.find({}).toArray();
    return { count: totalProducts, result: res };
  }

  // consultar pot id
  static async getById({ id }) {
    const db = await connect();
    const objectId = new ObjectId(id);
    return db.findOne({ _id: objectId });
  }

  // borrar un producto
  static async delete({ id }) {
    const db = await connect();
    const objectId = new ObjectId(id);
    const { deletedCount } = await db.deleteOne({ _id: objectId });
    return deletedCount > 0;
  }

  // actualiazar un producto
  static async update({ id, body }) {
    const db = await connect();
    const { data } = body;
    const objectId = new ObjectId(id);
    const timestamp = new Date();

    data["updateAt"] = timestamp;
    const res = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: data },
      { returnDocument: "after" }
    );

    return res;
  }

  // actualozar un producto parcialmete --> considerar suprimir
  static async partialUpdate({ id, body }) {
    const db = await connect();
    const { data } = body;
    const objectId = new ObjectId(id);
    const timestamp = new Date();

    data.updateAt = timestamp;
    const res = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: data },
      { returnDocument: "after" }
    );

    return res;
  }
}
