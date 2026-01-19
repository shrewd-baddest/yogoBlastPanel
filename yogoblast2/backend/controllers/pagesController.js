import db from './dbConnect.js';
import dotenv from 'dotenv';
import {writeFile, writeFileSync} from 'fs';
dotenv.config();



const cartegory=async(req,res)=>{
const {categ}=req.body;
try{
const sql = `SELECT 
products.products_id,
 products.image_url,
  products.products_name,
  products.price,
  products.weight_ml
FROM products
INNER JOIN category 
  ON products.category_id = category.category_id
WHERE category.category_name = $1`;
    const categoryRows = await db.query(sql, [categ]);
    res.status(200).json(categoryRows.rows);

}
catch(error){

     console.error("Error handling category:", error);
    res.status(500).json({ message: "Internal server error" });

}

}
const search=async(req,res)=>{
const {search:searchTerm}=req.body;
try{
const sql= `select 
products.products_id,
 products.products_name,
    products.weight_ml,
    products.price,
    products.image_url
    FROM products
    INNER JOIN category
    ON products.category_id=category.category_id
    where products.products_name LIKE $1 OR
    products.weight_ml LIKE $2 OR products.price LIKE $3
    OR category.category_name LIKE $4`;
const like=`%${searchTerm}%`;
const results=await db.query(sql,[like,like,like,like]);
console.log(results.rows);
      res.status(201).json(results.rows);
}
catch(error){
  console.error("Error handling cart:", error);
    res.status(500).json({ message: "Internal server error" });
}
}


const callback=async(req,res)=>{
const {Body}=req.body;
writeFileSync('storage.txt',Body,'a');
 
 if (Object.keys(req.body).length === 0){
    // handle invalid callback
   return res.status(404).json({status: "error", message:"Invalid callback data."});
 }
try{

const resultCode=Body.stkCallback.ResultCode;
const resultDesc=Body.stkCallback.resultDesc;
 

if (resultCode == 0) {
  let amount=null;
 let receipt=null;
let phone= null;
let date=null;
    const metadata =  Body['stkCallback']['CallbackMetadata']['Item'] ;
    const checkId=Body.stkCallback.CheckoutRequestID;
   metadata .forEach(item => {
        if ( item['Name'] == 'Amount')   amount =  item['Value'];
        if ( item['Name'] == 'MpesaReceiptNumber')  receipt =  item['Value'];
        if ( item['Name'] == 'TransactionDate')  date =  item['Value'];
        if ( item['Name'] == 'PhoneNumber')  phone =  item['Value'];
  }); 
  const user=`SELECT * FROM mpesa_request WHERE checkout_id=$1 LIMIT 1`;
  const results=await db.query(user,[checkId]);
   const user_id=results.rows[0].user
const  insertOrderSql = "INSERT INTO orders (user_id,phoneNumber,receipt,total_price,order_date,statuz) VALUES ($1, $2, $3, $4, $5, $6)";
  await db.query(insertOrderSql, [user_id, phone, receipt, amount, date, resultCode]);
  return res.status(201).json({status: "success", message: "Order made successfully"});
} else {
  return res.status(400).json({status: "error", message: resultDesc});
}
}

catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {cartegory,search,callback};