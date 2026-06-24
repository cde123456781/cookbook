import { db } from "../db";
import { categories } from "../db/schema";



export async function getCategories() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .orderBy(categories.name);
}