import db from '../controllers/dbConnect.js';


export const unpaidProducts = async (req, res) => {
    const userId = req.user.id;
  try {
    const sql1=`SELECT p.products_name, p.image_url, sc.quantity, p.price
        FROM shoping_cart sc
      INNER JOIN products p ON sc.product_id = p.products_id
      WHERE  sc.user_id=? 
`;
    const [rows] = await db.execute(sql1, [userId]);
    res.status(200).json(rows
    )}
    catch (error) {
    console.error("Error fetching unpaid products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const toBeShippedProducts = async (req, res) => {
    const userId = req.user.id;
     try {
     const sql2=`SELECT p.products_name, p.image_url, o.total_price, o.statuz
        FROM order_items ot   
      INNER JOIN products p ON ot.product_id = p.products_id
        INNER JOIN orders o ON ot.order_id = o.id
      WHERE o.user_id=? AND o.statuz='paid';
`;
    const [rows] = await db.execute(sql2, [userId]);
    res.status(200).json(rows
    )}
    catch (error) {
    console.error("Error fetching to be shipped products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const completeShip = async (req, res) => {
    const userId = req.user.id;
     try {
     const sql3=`SELECT p.products_name, p.image_url, si.total
       FROM sale_items
       INNER JOIN products p ON sale_items.product_id = p.products_id
       INNER JOIN sales si ON sale_items.sale_id = si.id
       WHERE si.user_id=? `;
    var [rows] = await db.execute(sql3, [userId]);
     rows=rows.push({status:"completed"});
    res.status(200).json(rows
    )}
    catch (error) {
    console.error("Error fetching completed shipments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};