//importar modulos
const { Router } = require("express");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

//router
const router = Router();

//configuraciones
router.use(express.json({}));
router.use(express.static("public"))
router.use(bodyParser.json());

//direcciones
router.get("/", (req,res)=>{
    res.send("<h1>It works!</h1>")
});

module.exports = router;