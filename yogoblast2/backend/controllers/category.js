import pool from '../controllers/dbConnect'

const cate=async (req,res) => {
    const {catePlaceholder}=req.body
    const sql=`select productDetails.product_id,products.product_name,products.weight_ml,products.price
    FROM products INNER JOIN category ON products.category_id=category.category_id WHERE category_name=$1`;
    try {
        const results=await pool.query(sql,catePlaceholder);

        res.status(201).json(results.rows);
    } catch (error) {
        
    }
}