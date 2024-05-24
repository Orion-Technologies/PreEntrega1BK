//session.router.js

import express from "express";
import UsersModel from "../models/users.model.js";
import { isValidPassword } from "../utils/hashbcryp.js";
import passport from "passport";

const router = express.Router();

/*
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await UsersModel.findOne({ email: email });
        if (usuario) {
            //uso isValidPassword para verificar el pass: 
            
            if (isValidPassword(password, usuario)) {
                req.session.login = true;
                req.session.user = {
                    email: usuario.email,
                    first_name: usuario.first_name,
                    age: usuario.age,
                    last_name: usuario.last_name,
                    role: usuario.role
                };

                res.redirect("/products");
            } else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
});
*/

//Logout: 

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
});

//VERSION PARA PASSPORT

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
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

router.get("/faillogin", async (req, res) => {
    res.send("Fallo todo, vamos a morir");
})

//VERSION PARA GITHUB
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    //La estrategia de github nos retornara el usuario, entonces los agrego a mi objeto session
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/profile");
})

export default router;