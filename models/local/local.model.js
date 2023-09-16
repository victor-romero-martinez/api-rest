import { randomUUID } from "crypto";
import { data } from "../../data.js";

export class ProductModel {
  static async getAll({ search, offset, limit }) {
    // si temgo search query, buscar por nombre
    if (search) {
      const reg = new RegExp(search, "i");
      return data.filter((item) => reg.test(item.name)); // return if true or []
    } else if (limit && offset) {
      // solo si cumple los dos casos
      return data.slice(offset, limit);
    }
    return data;
  }

  static async getById({ id }) {
    const result = data.find((item) => item._id == id);
    return result; // ok or undefined
  }

  static async create(body) {
    const date = new Date();
    let id = randomUUID();
    let object = {
      _id: id,
      createAt: date,
      updateAt: date,
    };

    const input = Object.assign(object, body); // se combinan los datos
    data.push(input);
    const index = data.length - 1;
    return data[index];
  }

  static async update({ id, body }) {
    const { data } = body; // extraer data
    const date = new Date();
    let object = { updateAt: date };

    // si existe el id se optiene updateData de lo contrario sera undefined
    const updateData = await this.getById({ id });
    if (updateData) {
      const result = Object.assign(updateData, object, data);
      return result; // ok
    }
    return null;
  }

  static async partialUpdate({ id, body }) {
    const { data } = body; // extraer data
    const date = new Date();
    let object = { updateAt: date };

    // si existe el id el dato a actualizar de lo contrario sera undefined
    const partialUdateData = await this.getById({ id });
    if (partialUdateData) {
      const result = Object.assign(partialUdateData, object, data);
      return result; // ok
    }
    return null;
  }

  static async delete({ id }) {
    const findData = data.findIndex((item) => item._id == id);
    if (findData >= 0) {
      const itemDeleted = data.splice(findData, 1);
      return itemDeleted; // mayor o igual a 0
    }
    return null;
  }
}
