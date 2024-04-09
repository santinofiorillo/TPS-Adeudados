import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { __dirname } from "./utils.js";

dotenv.config();

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/mail", async (req, res) => {
  let result = await transporter.sendMail({
    from: `Alumno <${process.env.EMAIL}>`,
    to: "santino@santinofiorillo.dev",
    subject: "Prueba con Nodemailer",
    text: "Hola, soy Alumno",
    html: `<div><h1 style='color: red'>Hola, soy Alumno</h1><img src='cid:dog1' /></div>`,
    attachments: [
      {
        filename: "dog1.jpeg",
        path: `${__dirname}/dog1.jpeg`,
        cid: "dog1",
      },
    ],
  });
  res.json({ status: "success", result });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});