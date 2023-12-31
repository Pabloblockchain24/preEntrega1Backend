const express = require("express")
const fs = require("fs");
const router = express.Router()

function crearId(){
    const timestamp = Date.now();
    const uniqueID = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
    return uniqueID
}

router.get("/api/products", (req,res) => {
        const products = JSON.parse(fs.readFileSync("productos.json", "utf-8"));
        let limit = parseInt(req.query.limit)
        !limit ? res.json(products): res.json((products.slice(0,limit)))
})

router.get("/api/products/:pid",(req,res) =>{
    const products = JSON.parse(fs.readFileSync("productos.json", "utf-8"));
    const producto = products.find(producto => producto.id.toString() === (req.params.pid))
    !producto ? res.send("Producto no existe") : res.send(producto)
})

router.post("/api/products", (req,res) => {
    let products = JSON.parse(fs.readFileSync("productos.json", "utf-8"));
    const newProduct = req.body

    if ( 
    !newProduct.title ||
    !newProduct.description ||
    !newProduct.code ||
    !newProduct.price ||
    !newProduct.status ||
    !newProduct.stock ||
    !newProduct.category
    ){
        return res.send("Faltan datos por ingresar")
    }

    newProduct.id = crearId()
    products.push(newProduct)
    fs.writeFileSync("productos.json", JSON.stringify(products));
    res.json({products})
})

router.put("/api/products/:pid", (req,res) => {
    let products = JSON.parse(fs.readFileSync("productos.json", "utf-8"));
    let idEdit = products.findIndex( producto => producto.id.toString() === req.params.pid)
    if (idEdit !== -1){
        const productoEditado = req.body
        if ( 
            !productoEditado.title ||
            !productoEditado.description ||
            !productoEditado.code ||
            !productoEditado.price ||
            !productoEditado.status ||
            !productoEditado.stock ||
            !productoEditado.category
            ){
                return res.send("Faltan datos por ingresar")
            }
        productoEditado.id = req.params.pid
        products[idEdit] = productoEditado
        fs.writeFileSync("productos.json", JSON.stringify(products));
        res.json({products})
    }else{
        res.send("Producto no existe")
    }
})

router.delete("/api/products/:pid", (req,res) => {
    let products = JSON.parse(fs.readFileSync("productos.json", "utf-8"));
    const productoEncontrado = products.find((producto) => producto.id.toString() === req.params.pid)
    if (productoEncontrado){
        products = products.filter((producto) => producto.id.toString() !== req.params.pid)
        fs.writeFileSync("productos.json", JSON.stringify(products));
        res.json({products})
    }else{
        res.send("Producto no existe")
    }
})

module.exports = router