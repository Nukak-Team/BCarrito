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

app.get(pathName, 
    (req, res)=>{
        console.log("Se recibe la petición de get");
        //console.log(req);
        res.send(carritoServices.carritoGetExport())
    }
)


app.post(pathName, 
    async (req, res)=>{
        console.log("Se recibe la petición de set");
        console.log(req.body);
        console.log("------ 2 ------");
        let carrito = await carritoServices.carritoSetExport(req.body)
        console.log("------ 3 ------");
        res.send({"mensaje":"Producto guardado","Producto":carrito})
    }
)

//ToDo
/*
app.delete(pathName, 
    (req, res)=>{
        console.log("Se recibe la petición de delete");
        //console.log(req);
        let id = req.query.id
        console.log(id);
        let carrito = carritoServices.carritoDeleteExport(id)
        res.send({"mensaje":"producto eliminado","vuelos":carrito})
    }
)

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

*/

app.listen(port, 
    ()=>{
        console.log("Subio el app en el puerto "+port);
    }
)
