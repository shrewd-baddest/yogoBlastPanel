import db from "../controllers/dbConnect.js";

const home = async (req, res) => {
  try {
    const category = 'fresha';
    const sql = `SELECT 
products.products_id,
 products.image_url,
  products.products_name,
  products.price,
  products.weight_ml
FROM products
INNER JOIN category 
  ON products.category_id = category.category_id
WHERE category.category_name =?`;
    const [categoryRows] = await db.execute(sql, [category]);

    const sql2 = `SELECT * FROM products LIMIT 10`;
    const [limitedRows] = await db.execute(sql2);
    
   res.status(200).json([categoryRows, limitedRows]);
     
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default home;

 