const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path')
const cors = require('cors');
const _dirname = path.dirname(__filename)
const buildPath = path.join(_dirname, "../client/build")
const app = express();

app.use(cors({
  origin: 'http://localhost:5001',
}));
app.options('*', cors());


app.use(express.static(buildPath));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5001');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.use('/static', express.static(path.join(_dirname, 'client/src/components'));

// app.get("/",function(req,res){
//   res.sendFile(
//     path.join(__dirname, "../client/build/index.html"),
//     function(err){
//       if(err){
//         res.status(500).send(err);
//       }
//     }
//   );
// })


const pool = new Pool({
  host: process.env.PSQL_HOST,
  user: process.env.PSQL_USER,
  port: process.env.PSQL_PORT,
  password: process.env.PSQL_PASSWORD,
  database: process.env.PSQL_DATABASE
});

process.on('SIGINT', function(){
  pool.end();
  console.log('Application closed');
  process.exit(0);
});

app.get('/menudata', (req, res) => {
  menuitemsnames = []
  pool.query('SELECT tea_name FROM teaorders;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              menuitemsnames.push(query_res.rows[i]);
          }
          const data = {menuitemsnames: menuitemsnames};
          res.json(data);
      });
});

app.get('/menudata/teaorders', (req, res) => {
  menuitemsingredients = []
  pool.query('SELECT ingredients FROM teaorders;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              menuitemsingredients.push(query_res.rows[i]);
          }
          const data = {menuitemsingredients: menuitemsingredients};
          res.json(data);
      });
});

app.get('/menudata/descriptions', (req, res) => {
  menuitemsdescriptions = []
  pool.query('SELECT descriptions FROM teaorders;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              menuitemsdescriptions.push(query_res.rows[i]);
          }
          const data = {menuitemsdescriptions: menuitemsdescriptions};
          res.json(data);
      });
});

app.get('/inventory/itemid', (req, res) => {
  inventoryids = []
  pool.query('SELECT itemid FROM inventory;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              inventoryids.push(query_res.rows[i]);
          }
          const data = {inventoryids: inventoryids};
          res.json(data);
      });
});

app.get('/inventory/quantity', (req, res) => {
  inventoryquantity = []
  pool.query('SELECT quantity FROM inventory;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              inventoryquantity.push(query_res.rows[i]);
          }
          const data = {inventoryquantity: inventoryquantity};
          res.json(data);
      });
});

app.get('/inventory/itemcategory', (req, res) => {
  inventorycategories = []
  pool.query('SELECT itemcategory FROM inventory;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              inventorycategories.push(query_res.rows[i]);
          }
          const data = {inventorycategories: inventorycategories};
          res.json(data);
      });
});

app.get('/inventory/minimumamount', (req, res) => {
  inventoryminimum = []
  pool.query('SELECT minimumamount FROM inventory;').then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              inventoryminimum.push(query_res.rows[i]);
          }
          const data = {inventoryminimum: inventoryminimum};
          res.json(data);
      });
});

//get all of the orders data
app.get('/ordersdata', (req, res) => {
  pool.query('SELECT * FROM orders;').then(query_res => {
    res.json(query_res.rows);
  }).catch(err => {
    res.status(500).json({error: err.message});
  });
});

//get all of the employees data
app.get('/employeesdata', (req, res) => {
  pool.query('SELECT * FROM employees;').then(query_res => {
    res.json(query_res.rows);
  }).catch(err => {
    res.status(500).json({error: err.message});
  });
});

app.get('*', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});



app.listen(5001, () => {console.log("Server started on port 5001")})

