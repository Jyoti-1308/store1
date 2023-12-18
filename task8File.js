var express = require("express");
var app = express();
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,OPTIONS,PATCH,PUT,DELETE,HEAD,POST"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
var port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node App listening on port ${port}!`));

let fs = require("fs");
let fname = "task8.txt";
app.get("/resetData", function (req, res) {
    let { data } = require("./task8Data.js");
    let data1 = JSON.stringify(data);
    fs.writeFile(fname, data1, function (err) {
        if (err) res.status(404).send(err);
        else res.send("Data in file is reset");
    })
})
app.get("/shops", function (req, res) {
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { shops } = data;
            res.send(shops);
        }
    })
})
app.post("/shops", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { shops } = data;
            let max = shops.reduce((acc, curr) => acc > curr.shopId ? acc : curr.shopId, 0);
            let newData = { shopId: max + 1, ...body };
            shops.push(newData);
            let data2 = JSON.stringify(data);
            fs.writeFile(fname, data2, function (err) {
                if (err) res.status(404).send(err);
                else res.send(data2);
            })
        }
    })
})
app.get("/products", function (req, res) {
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { products } = data;
            res.send(products);
        }
    })
})
app.get("/products/:id", function (req, res) {
    let id = (+req.params.id);
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { products } = data;
            let product=products.find(ele=>ele.productId===id);
            res.send(product);
        }
    })
})
app.post("/products", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { products } = data;
            let max = products.reduce((acc, curr) => acc > curr.productId ? acc : curr.productId, 0);
            let newData = { productId: max + 1, ...body };
            products.push(newData);
            let data2 = JSON.stringify(data);
            fs.writeFile(fname, data2, function (err) {
                if (err) res.status(404).send(err);
                else res.send(data2);
            })
        }
    })
})
app.put("/products/:id", function (req, res) {
    let body = req.body;
    let id = (+req.params.id);
    console.log(body,id);
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { products } = data;
            let prod = products.find(ele => ele.productId === id);
            console.log(prod);
            prod.category = body.category;
            prod.description = body.description;
            console.log(data);
            let data2 = JSON.stringify(data);
            fs.writeFile(fname, data2, function (err) {
                if (err) res.status(404).send(err);
                else res.send(data2);
            })
        }
    })
})

app.get("/purchases", function (req, res) {
    let { shop, products, sortBy } = req.query;
    let arr=products?products.split(","):[];
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { purchases } = data;
            console.log(products,arr);
            let newarr = shop ? purchases.filter(ele => ele.shopId === (+shop)) : purchases;
            newarr = products ? newarr.filter(ele => arr.find(pid=>+pid===ele.productid)) : newarr;
            
            if (sortBy) {
                if (sortBy === 'QtyAsc')
                    newarr.sort((ele1, ele2) => ele1.quantity - ele2.quantity);
                if (sortBy === 'QtyDesc')
                    newarr.sort((ele1, ele2) => -1 * (ele1.quantity - ele2.quantity));
                if (sortBy === 'ValueDesc')
                    newarr.sort((ele1, ele2) => -1 * (ele1.quantity * ele1.price - ele2.quantity * ele2.price));
                if (sortBy === 'ValueAsc')
                    newarr.sort((ele1, ele2) => ele1.quantity * ele1.price - ele2.quantity * ele2.price);
            }
            res.send(newarr);
        }
    })
})

app.get("/purchases/shops/:id", function (req, res) {
    let id = (+req.params.id);
    let sortBy=req.query.sortBy;
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { purchases } = data;
            let newarr = purchases.filter(ele => ele.shopId === id);
            if (sortBy) {
                if (sortBy === 'QtyAsc')
                    newarr.sort((ele1, ele2) => ele1.quantity - ele2.quantity);
                if (sortBy === 'QtyDesc')
                    newarr.sort((ele1, ele2) => -1 * (ele1.quantity - ele2.quantity));
                if (sortBy === 'ValueDesc')
                    newarr.sort((ele1, ele2) => -1 * (ele1.quantity * ele1.price - ele2.quantity * ele2.price));
                if (sortBy === 'ValueAsc')
                    newarr.sort((ele1, ele2) => ele1.quantity * ele1.price - ele2.quantity * ele2.price);
            }
            res.send(newarr);
        }
    })
})
app.get("/purchases/products/:id", function (req, res) {
    let id = (+req.params.id);
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { purchases } = data;
            let newarr = purchases.filter(ele => ele.productid === id);
            res.send(newarr);
        }
    })
})
app.post("/purchases", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { purchases } = data;
            let max = purchases.reduce((acc, curr) => acc > curr.purchaseId ? acc : curr.purchaseId, 0);
            let newData = { purchaseId: max + 1, ...body };
            purchases.push(newData);
            let data2 = JSON.stringify(data);
            fs.writeFile(fname, data2, function (err) {
                if (err) res.status(404).send(err);
                else res.send(data2);
            })
        }
    })
})
app.get("/totalPurchase/shop/:shopId", function (req, res) {
    let shopId = (+req.params.shopId);
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { purchases } = data;

            let newarr = purchases.filter(ele => ele.shopId === shopId);
            let arr = newarr.reduce((acc, curr) => {
                let pur = acc.find(ele => ele.productid === curr.productid);
                if (pur) {
                    pur.quantity = pur.quantity + curr.quantity;
                }
                else {
                    acc.push({ shopId:curr.shopId,productid: curr.productid, quantity: curr.quantity,price:curr.price });
                }
                return acc;
            }, []);
            console.log(arr);
            if (arr.length > 0) res.send(arr);
            else res.sendStatus(404).send("no Data");
        }
    })
})
app.get("/totalPurchase/product/:prodId2", function (req, res) {
    let prodId2 = (+req.params.prodId2);
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            let { purchases } = data;

            let newarr = purchases.filter(ele => ele.productid === prodId2);
            let arr = newarr.reduce((acc, curr) => {
                let pur = acc.find(ele => ele.shopId === curr.shopId);
                if (pur) {
                    pur.quantity = pur.quantity + curr.quantity;
                }
                else {
                    acc.push({ shopId:curr.shopId,productid: curr.productid, quantity: curr.quantity,price:curr.price});
                }
                return acc;
            }, []);
            console.log(arr);
            if (arr.length > 0) res.send(arr);
            else res.send([]);
        }
    })
})
app.get("/data", function (req, res) {
    fs.readFile(fname, "utf8", function (err, content) {
        if (err) res.status(404).send(err);
        else {
            let data = JSON.parse(content);
            
            res.send(data);
        }
    })
})



