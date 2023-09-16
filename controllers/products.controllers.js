import {
  validateProduct,
  partialValidatePorduct,
} from "../schema/product.schema.js";

export class ProductController {
  constructor({ productModel }) {
    this.productModel = productModel;
  }

  // all - search - limit
  getAll = async (req, res) => {
    const { search, offset, limit } = req.query;
    const { hostname } = req;

    const data = await this.productModel.getAll({
      search,
      offset,
      limit,
      hostname,
    });

    if (Object.entries(data) == []) {
      return res.status(400).json({ message: "could not be found" });
    }
    res.json(data);
  };

  // by id
  getById = async (req, res) => {
    const { id } = req.params;
    const result = await this.productModel.getById({ id });
    if (result) {
      return res.json({ result: result });
    }
    res.status(404).json({ message: "could not be found" });
  };

  // craete
  create = async (req, res) => {
    const result = validateProduct(req.body);

    if (result.success) {
      const newProduct = await this.productModel.create(result.data);
      return res.status(201).json({ message: "OK", result: newProduct });
    }
    res.status(400).json({ error: JSON.parse(result.error.message) });
  };

  // update
  update = async (req, res) => {
    const { id } = req.params;
    const body = validateProduct(req.body);

    // validar los datos
    if (body.success) {
      const result = await this.productModel.update({ id, body });

      // si se optiene result OK, de lo contrario se optendra null
      if (result) {
        return res.json({ message: "OK", data: result });
      }
      return res.status(404).json({ message: "could not be found" });
    }
    res.status(400).json({ error: JSON.parse(body.error.message) });
  };

  // considerar suprimir
  partialUpdate = async (req, res) => {
    const { id } = req.params;
    const body = partialValidatePorduct(req.body);

    if (body.success) {
      const result = await this.productModel.partialUpdate({ id, body });
      // result or null
      if (result) {
        return res.json({ message: "OK", data: result });
      }
      return res.status(404).json({ message: "could not be found" });
    }
    res.status(400).json({ error: JSON.parse(body.error.message) });
  };

  // delete
  delete = async (req, res) => {
    const { id } = req.params;

    const result = await this.productModel.delete({ id }); // data o null
    if (result) {
      return res
        .status(200)
        .json({ message: "OK", message: `deleted item _id: ${id}` });
    }
    res.status(404).json({ message: "could not be found" });
  };
}
