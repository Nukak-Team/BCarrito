//let Carrito = require("./carrito.json")
const getMongo = require("./mongodb.js")
const ObjectId = require('mongodb').ObjectId;
let request = require("axios")


async function getConexiones() {
    const nameDb = "FerreteriaNukak"
    const client = await getMongo.getClientExport(nameDb)
    const collection = await getMongo.getCollectionExport(client, nameDb)
    return { collection, client }
}

// get
const carritoGet = async () => {
    const { collection, client } = await getConexiones()
    const carrito = collection.find({"idcliente":idCliente})
    const carritoList = await carrito.toArray()
    await getMongo.closeClientExport(client)
    return carritoList
}

const carritoGetId = (id) => {
    console.log("----------------------- ID get --------------------------------");
    console.log(id);
    let carrit = carrito.find(
        (elemento)=>(elemento.id == id)
    )
    return carrit
}

const carritoPendienteIdGet = async (idCliente)=>{
    const { collection, client } = await getConexiones()
    const carritoCliente = collection.find({"estadoPago":"Pendiente","idcliente":idCliente})
    const carritoClienteList = carritoCliente.toArray()
    await getMongo.closeClientExport(client)
    return carritoClienteList
}

// Set
const carritoSet = async (carrito) => {
    const {collection, client} = await getConexiones()
    console.log("llama a carrito a guardar")
    const carrit = collection.find({"idCliente":carrito.idCliente,"estadoPago":"Pendiente"}).toArray()
    
    if(carrito.length > 0){
        let Stock = carrit[0].Stock
        Stock.push(carrito.Stock)
        collection.updateOne({"idCliente":carrito.idCliente,"estadoPago":"Pendiente"},{"$set":{
            "sillas":productos
        }})
    }else{
            
        const producto = request.get(
            "http://localhost:8085/productos/id?id="+carrito.idProducto
        )

        const cliente = request.get(
            "http://localhost:8087/cliente/id?id="+carrito.idCliente
        )

        const stockProducto = request.patch(
            "http://localhost:8085/productos/nombre?id="+carrito.idProducto,
            carrito.Stock
        )
        
        await request.all([producto,cliente,stockProducto])
        .then(
            async (res)=>{
                console.log("Recibimos llamada de producto y cliente.")
                carrito.idProducto= res[0].data
                carrito.Cliente= res[1].data
                carrito.Mensaje= res[2].data

                for(let i = 0 ; i < carrito.Stock.length; i++ ){
                    carrito.Stock[i].cancelada = true
                }
                console.log("*************** carrito *************");
                console.log(carrito)
            
                await collection.insertOne(carrito).then(
                    (resultado)=>{
                        console.log("*************** Resultado *************");
                        console.log(resultado)
                    }
                )
                .catch(
                    (resultado)=>{
                        console.log("Error reservando el prodcuto en el Stock");
                    }
                )
            }
        )
        .catch(
            (res)=>{
                console.log("Error reservando el prodcuto en el Stock");
            }
        )
    }
    await getMongo.closeClientExport(client)
    return carrito
}

const setEstadoCarrito = async (carritoPago) => {
    const { collection, client } = await getConexiones()
    console.log({"_id":new ObjectId(carritoPago.idCarrito)})
    await collection.updateOne({"_id":new ObjectId(carritoPago.idCarrito)},{"$set":{"estadoPago":carritoPago.estadoCarrito}})
    await getMongo.closeClientExport(client)
    return "Carrito con pago confirmado"
}


// Delete

const carritoDelete = (id) => {
    let carrit = carrito.filter(
        (delCarrito)=>{
            return delCarrito.id != id
        }
    )
    console.log(carrit);
    return carrit
}

//

//

const carritoACancelar = async ()=>{
    const { collection, client } = await getConexiones()
    const carritoCancelado = collection.find({"estadoPago":"Pendiente"})
    const carritoCanceladolist = await carritoCancelado.toArray()
    for (let i = 0 ; i < carritoCanceladolist.length; i++) {
        let Carrito = carritoCanceladolist[i]
        await request.patch(
                "http://localhost:8085/productos/nombre?id="+carrito.idProducto,
                carrito.Stock
        ).then(
            async()=> {
                await collection.updateOne({"_id":Carrito._id},{"$set":{"estadoPago":"Cancelada"}})
            }
        )
    };
    await getMongo.closeClientExport(client)
    return "Reservas Canceladas"
}


module.exports.carritoGetExport = carritoGet;
module.exports.carritoSetExport = carritoSet;
module.exports.carritoDeleteExport = carritoDelete;
module.exports.carritoGetIdExport = carritoGetId;
module.exports.carritoPendienteIdGetExport = carritoPendienteIdGet;
module.exports.carritoACancelarExportar = carritoACancelar;
module.exports.setEstadoCarritoExport = setEstadoCarrito;