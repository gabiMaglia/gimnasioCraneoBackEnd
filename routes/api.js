const expreess = require("express");
const router = expreess.Router();
const docentesModel = require("./../models/docentesModel");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const userModel = require("./../models/userModel");

router.get("/userAuth", async function (req, res, next) {
  let users = await userModel.getAll();

  res.json(users);
});

router.get("/docentes", async function (req, res, next) {
  try {
    let docentes = await docentesModel.getDocentes();

    docentes = docentes.map((docentes) => {
      return {
        ...docentes,
        foto: "https://res.cloudinary.com/atlasair/image/upload/v1661037957/craneo_black_igfvsz.png",
      };
    });

    res.json(docentes);
  } catch (error) {
    console.log(error);
  }
});

router.post("/contacto", async (req, res) => {
  const mail = {
    to: "gab.maglia@gmail.com",
    subject: "Contacto Web",
    html: `${req.body.nombre} ${req.body.apellido} se contacto a travez de la web y quiere mas informacion a este correo: 
    ${req.body.mail} <br> Ademas, hizo el siguiente comentario:
    ${req.body.mensaje} <br>`,
  };

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transport.sendMail(mail);

  res.status(201).json({
    error: false,
    MessageChannel: "Mensaje enviado",
  });
});

module.exports = router;
