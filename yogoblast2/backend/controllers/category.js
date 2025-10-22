import pool from '../controllers/dbConnect'

const cate=async (req,res) => {
    const {catePlaceholder}=body.req
    const sql=`select productDetails.product_id,products.product_name,products.weight_ml,products.price
    FROM products INNNER JOIN category ON products.category_id=category.category_id WHERE category_name=?`;
    try {
        const [results]=pool.query(sql,catePlaceholder);
        res.status(201).json(results);
    } catch (error) {
        
    }
}