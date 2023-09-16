import z from "zod";

const categorias = [
  "hogar",
  "jardin",
  "juguetes",
  "electronicos",
  "herramientas",
  "mascotas",
];

const curren = ["usd", "pyg", "br"];

const porductSchema = z.object({
  name: z.string().trim(),
  price: z.number().positive(),
  currency: z.enum(curren),
  category: z.array(z.enum(categorias)),
  picture: z.string().url(),
  description: z.string().max(255).trim(),
  stock: z.number().positive(),
});

export function validateProduct(input) {
  return porductSchema.safeParse(input);
}

export function partialValidatePorduct(input) {
  return porductSchema.partial().safeParse(input);
}
