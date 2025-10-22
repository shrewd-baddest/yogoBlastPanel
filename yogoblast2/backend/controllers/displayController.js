import db from "../controllers/dbConnect.js";

const display=async(req,res)=>{
try {
     
    const {product_id}=req.body;
    const sql=`SELECT 
products.products_id,
 products.image_url,
  products.products_name,
  products.price,
  products.weight_ml,
  category.description
FROM products
INNER JOIN category 
  ON products.category_id = category.category_id
WHERE products.products_id=?`;
    const [store]=await db.execute(sql,[product_id]);
    res.status(201).json(store);
    console.log(store);
} catch (error) {
     console.error("Error fetching products:", error);
       res.status(500).json({ message: "Internal server error" });
}


}
export default display;