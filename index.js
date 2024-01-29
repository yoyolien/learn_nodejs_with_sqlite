const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
// const pug = require('pug');
const port = 3000; // 設定伺服器監聽的埠號
app.use(express.static("./"))
app.use(express.json());
const database = new sqlite3.Database("mydatabase.db", function (err) {
    if (err) throw err;

    // 建立 products 資料表
    database.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL)');
});
app.get('/', (req, res) => {
    console.log("home");
    res.sendFile(path.join(__dirname, 'index.html')); // 使用 path 模組拼接檔案路徑
});

// GET 請求：獲取所有商品
app.get('/products', (req, res) => {
    console.log(req.body);
    database.all('SELECT * FROM products', (err,rows) => {
        if (err) throw err;
        res.json(rows);
        console.log("suc",rows,res.body);
    });

});
app.delete('/products',(req,res)=>{
    const name = req.body.name;
    const price = req.body.price;
    database.run('DELETE FROM products WHERE name=?,price=?',[name,price],(err)=>{
        if (err)console.log(err);
    });
});
// POST 請求：新增商品
app.post('/products', (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const price = req.body.price;
    if (name && price) {
        database.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err) => {
            if (err) {
                // 如果有錯誤，可能是唯一性約束或其他錯誤，需要進一步處理
                console.error(err);
                res.status(500).json({error: '商品新增失敗'});
            } else {
                res.json({message: '商品新增成功'});
            }
        });
    } else {
        // 如果 name 或 price 為空，返回錯誤訊息
        res.status(400).json({error: '請提供有效的商品名稱和價格'});
    }
});


app.listen(port, () => {
    console.log(`伺服器啟動於 http://localhost:${port}`);
});
