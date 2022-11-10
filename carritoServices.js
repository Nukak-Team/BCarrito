let Carrito = require("./carrito.json")
let request = require("axios")

//get
const carritoGet = () => {
    return Carrito
}

const carritoSet = async (carrito) => {
    console.log("llama a carrito a guardar")
    const producto = request.get(
        "http://localhost:8085/productos/id?id="+carrito.idProducto
    )

    // const cliente = request.get(
    //     "http://localhost:8080/cliente/id?id="+carrito.idCliente
    // )

    const stockProducto = request.patch(
        "http://localhost:8085/productos/nombre?id="+carrito.idProducto,
        carrito.Stock
    )
    
    
    await request.all([producto,stockProducto])
    .then(
        (res)=>{
            console.log("Recibimos llamada de producto y cliente.")
            console.log(res[0].data);
            console.log(res[1].data);
            carrito.vuelo= res[0].data
            carrito.mensaje= res[1].data
        }
    )
    .catch(
        (res)=>{
            console.log("Error reservando el prodcuto en el Stock");
        }
    )

    await Carrito.push(carrito)
    return Carrito
}




module.exports.carritoGetExport = carritoGet;
module.exports.carritoSetExport = carritoSet;/*
module.exports.carritoDeleteExport = carritoDelete;
module.exports.carritoGetIdExport = carritoGetId;
module.exports.carritoPendienteIdGetExport = carritoPendienteIdGet;*/