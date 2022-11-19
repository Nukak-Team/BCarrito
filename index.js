const express = require("express")
const cors = require("cors")
const body_parser = require("body-parser")
const path = require("path")

const carritoServices = require("./carritoServices.js")
const app=express()
const port = 8093
const pathName ="/carrito"

app.use(cors())
app.use(body_parser.json())

// Función get
app.get(pathName, 
    async (req, res)=>{
        console.log("Se recibe la petición de get");
        //console.log(req);
        res.send(await carritoServices.carritoGetExport())
    }
)

app.get(pathName+"/pendientes/idCliente",
    async (req, res)=>{
        console.log("Recibimos peticion")
        id = req.query.id
        estado = req.query.estado
        res.send(await carritoServices.carritoPendienteIdGetExport(id,estado))
    }
)

app.get(pathName+"/carritoCanceladas",
    async (req, res)=>{
        console.log("Recibimos peticion")
        res.send(await carritoServices.carritoACancelarExportar())
    }
)

// Función post
app.post(pathName, 
    async (req, res)=>{
        console.log("Se recibe la petición de set");
        console.log(req.body);
        let carrito = await carritoServices.carritoSetExport(req.body)
        res.send({"mensaje":"Producto guardado","Producto":carrito})
    }
)

// Función delete
app.delete(pathName, 
    (req, res)=>{
        console.log("Se recibe la petición de delete");
        //console.log(req);
        let id = req.query.id
        console.log(id);
        let carrito = carritoServices.carritoDeleteExport(id)
        res.send({"mensaje":"producto eliminado","Producto":carrito})
    }
)

// Función put
app.put(pathName, 
    (req, res)=>{
        console.log("Se recibe la petición");
        //console.log(req);

        res.send("Finaliza")
    }
)

// Función patch
app.patch(pathName, 
    (req, res)=>{
        console.log("Se recibe la petición");
        //console.log(req);

        res.send("Finaliza")
    }
)

app.patch(pathName+"/estado",
    async (req, res)=>{
        console.log("Recibimos peticion")
        //console.log(req.body)
        res.send(await carritoServices.setEstadoCarritoExport(req.body))
    }
)

app.listen(port, 
    ()=>{
        console.log("Subio el app en el puerto "+port);
    }
)
