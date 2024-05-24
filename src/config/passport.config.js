//importación
import passport from "passport";
//importar estrategia a usar
import local from "passport-local";
//Traemos el modelo y las funciones bcryp
//nuevo
import jwt from "passport-jwt";
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

import UsersModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/hashbcryp.js";
import GitHubStrategy from "passport-github2";

//Creamos una instancia
const LocalStrategy = local.Strategy;

// Necesitamos crear esta function donde estaran todas las estrategias a usar
const initializePassport = () => {

    //nuevo
    const cookieExtractor = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
      }
      return token;
    };

    //nuevo
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"
    }, async (jwt_payLoad, done) => {
        try {
            return done(null, jwt_payLoad);
        } catch (error) {
            return done(error) 
        }
    }
))

    passport.use("register", new LocalStrategy({
        //Le digo que quiero acceder al objeto request
        passReqToCallback: true,
        //estoy indicando que el username será el email
        usernameField: "email"
    }, async (req, username, password, done) => {
        //datos que levanto del body del form register
        const { first_name, last_name, email, age } = req.body;

        try {
            let usuario = await UsersModel.findOne({email});
            if (usuario) {
                return done(null, false);
            }

            //Si no existe voy a crear un registro de usuario nuevo: 

            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let resultado = await UsersModel.create(nuevoUsuario);
            return done(null, resultado);
            //Si todo resulta bien, podemos mandar done con el usuario generado. 
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia para el "Login".
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            //verifico si exite usuario con este email
            let usuario = await UsersModel.findOne({email});

            if (!usuario) {
                console.log("Este usuario no existe");
                return done(null, false);
            }

            //Si existe verifico la contraseña: 
            if (!isValidPassword(password, usuario)) {
                return done(null, false);
            }

            return done(null, usuario);

        } catch (error) {
            return done(error);
        }
    }))


    //serializar y deserealizar
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UsersModel.findById({_id: id});
        done(null, user)
    });

    //generamos la nueva estrategia con github
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23lif47VYblpPOxn64",
        clientSecret: "a382d0034ce636cd62de193f80e1e009127e7eb0",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Veo los datos del perfil
        console.log("Profile:", profile);

        try {
            let usuario = await UsersModel.findOne({ email: profile._json.email });

            if (!usuario) {
                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 35,
                    email: profile._json.email,
                    password: ""
                }

                let resultado = await UsersModel.create(nuevoUsuario);
                done(null, resultado);
            } else {
                done(null, usuario);
            }
        } catch (error) {
            return done(error);
        }
    }))

};

export default initializePassport;