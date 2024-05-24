//user.router.js

import express, { Router } from "express";
import UsersModel from "../models/users.model.js";
import { createHash } from "../utils/hashbcryp.js";
import passport from "passport";

//nuevo
import jwt from "jsonwebtoken";

const router = express.Router();

//ruta post para generar un usuario y alacenarlo en mongo db
/*
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        // Verificar si el correo electrónico ya está registrado
        const userExists = await UsersModel.findOne({ email: email });
        if (userExists) {
            return res.status(400).send({ error: "El correo electrónico ya está registrado" });
        }

        // Definir el rol del usuario
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

        // Crear un nuevo usuario
        const newUser = await UsersModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role
         });

        // Almacenar información del usuario
        req.session.login = true;
        req.session.user = { ...newUser._doc };

        //res.status(200).send({ message: "Usuario creado con éxito" });
        res.redirect("/login");

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});
*/

//VERSION PARA PASSPORT:
//estrategia local

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) {
        return res.status(400).send("Credenciales invalidas"); 
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");

})


router.get("/failedregister", (req, res) => {
    res.send("Registro Fallido!");
})

//JWT
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        //verificamos usuario y le hecamos la culpa al cliente
        const existeUsuario = await UsersModel.findOne({email});
        if(existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }
        const nuevoUsuario = new UsersModel({
          first_name,
          last_name,
          email,
          password: createHash(password),
          age,
          role,
        });
        await nuevoUsuario.save()
        const token = jwt.sign({usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol}, "coderhouse", {expiresIn: "1h"})

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, // 1 hora
            httpOnly: true // Solo se puede acceder mediente http
        });
        res.redirect("/home");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const usuarioEncontrado = await UsersModel.findOne({email:email});
        if(!usuarioEncontrado) {
            return res.status(401).send("Usuario no encontrado");
        }

             if (password !== usuarioEncontrado.password) {
               return res
                 .status(401)
                 .send("Contraseña incorrecta!");
             }

             //Generamos el token:
             const token = jwt.sign(
               {
                 usuario: usuarioEncontrado.usuario,
                 rol: usuarioEncontrado.rol,
               },
               "coderhouse",
               { expiresIn: "1h" }
             );

             //Establecer el token como Cookie:
             res.cookie("coderCookieToken", token, {
               maxAge: 3600000, //1 hora de vida
               httpOnly: true, //La cookie solo se puede acceder mediante HTTP
             });

             res.redirect("/home"); 


    } catch(error) {
        res.status(500).send("Error interno del servidor")
    }
})

//Home: 
router.get("/home", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.render("home", {usuario: req.user.usuario});
})

//Logout: 
router.post("/logout", (req, res) => {
    //Voy a limpiar la cookie del Token
    res.clearCookie("coderCookieToken"); 
    //Redirigir a la pagina del Login. 
    res.redirect("/login");
})

//Ruta Admin: 

router.get("/admin", passport.authenticate("jwt", {session: false}), (req, res) => {
    console.log(req.user);
    if ( req.user.rol !== "admin") {
        return res.status(403).send("Acceso Denegado");
    }
    //Si el usuario es admin, mostrar el panel correspondiente: 
    res.render("admin");
})


export default router;