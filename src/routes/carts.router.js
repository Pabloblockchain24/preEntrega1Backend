const express = require("express")
const router = express.Router()
const fs = require("fs");

function crearId(){
    const timestamp = Date.now();
    const uniqueID = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
    return uniqueID
}

router.post("/api/carts", (req,res) => {
    let carts = JSON.parse(fs.readFileSync("carrito.json", "utf-8"));
    const newCart = {
        id:crearId(),
        products:[]
    }
    carts.push(newCart)
    fs.writeFileSync("carrito.json", JSON.stringify(carts));
    res.json({message: "Carrito agregado"})
})

router.get("/api/carts/:cid", (req,res) =>{
    let carts = JSON.parse(fs.readFileSync("carrito.json", "utf-8"));
    const cart = carts.find(car => car.id.toString() == (req.params.cid))
    !cart ?  res.send("Id ingresado no existe") : res.json(cart.productosCarrito)
})

router.post("/api/carts/:cid/products/:pid", (req,res) =>{
    let carts = JSON.parse(fs.readFileSync("carrito.json", "utf-8"));

    const carritoEncontrado = carts.find(carrito => carrito.id.toString() === (req.params.cid))
    if (!carritoEncontrado){
        return res.send("Carrito ingresado no existe")
        
    }
    const productoEncontrado = carritoEncontrado.products.find( producto => producto.id === req.params.pid )
    productoEncontrado ? productoEncontrado.quantity++ : carritoEncontrado.products.push( {id:req.params.pid, quantity:1})
    fs.writeFileSync("carrito.json", JSON.stringify(carts));
    res.json(carts)
})


router.get("/api/carts", (req,res) => {
    let carts = JSON.parse(fs.readFileSync("carrito.json", "utf-8"));
    res.json(carts)
})

module.exports = router