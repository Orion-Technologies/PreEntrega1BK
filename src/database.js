import mongoose from "mongoose";

mongoose.connect("mongodb+srv://abelarchila:BlackBelt7008@backend.j4hzu56.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=BackEnd")
.then(() => console.log("Conectados a la DB"))
.catch((error) => console.log("Error al conectar ", error))