const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const apiRouter = require("./routes/api");

// middlewares
//acceso docente
const secured = async (req, res, next) => {
  try {
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.log(error);
  }
};
//acceso solo admin
const adminSecured = async (req, res, next) => {
  try {
    if (req.session.permiso == "admin") {
      next();
    } else {
      res.redirect("/admin/panelPrincipal");
    }
  } catch (error) {
    console.log(error);
  }
};
//fin middlewares
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/admin/login");
const proximamenteRouter = require("./routes/proximamente");
const panelPrincipalRouter = require("./routes/admin/components/panelPrincipal");
const panelUsuariosRouter = require("./routes/admin/components/panelUsuario");
const panelAlumnosRouter = require("./routes/admin/components/panelAlumnos");
const panelDocentesRouter = require("./routes/admin/components/panelDocentes");
const panelHorariosRouter = require("./routes/admin/components/panelHorarios");
const panelRutinasRouter = require("./routes/admin/components/panelRutinas");
const perfilPersonalRouter = require("./routes/admin/components/perfilPersonal");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//el use de session siempre antes de las rutas
app.use(
  session({
    secret: "dadjalkklsd",
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempfileDir: "/tmp/",
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin/login", loginRouter);
app.use("/admin/proximamente", secured, proximamenteRouter);
app.use("/admin/panelPrincipal", secured, panelPrincipalRouter);
app.use("/admin/panelUsuario", secured, panelUsuariosRouter);
app.use("/admin/alumnos", secured, panelAlumnosRouter);
app.use("/admin/docentes", secured, adminSecured, panelDocentesRouter);
app.use("/admin/horarios", secured, panelHorariosRouter);
app.use("/admin/rutinas", secured, panelRutinasRouter);
app.use("/admin/alumnos/perfilPersonal", secured, perfilPersonalRouter);
app.use("/api", cors(), apiRouter);

app.get("/admin/login", function (req, res) {
  var conocido = Boolean(req.session.nombre);

  res.render("admin/login", {
    layout: "admin/layout",
    title: "Panel de administracion",
    conocido: conocido,
    nombre: req.session.nombre,
    id: req.session.id_usuario,
    permiso: req.session.permiso,
  });
});
app.post("/ingresar", function (req, res) {
  if (req.body.nombre) {
    req.session.nombre = req.body.nombre;
  }
  res.redirect("/admin/login");
});

app.get("/salir", function (req, res) {
  req.session.destroy();
  res.redirect("/admin/login");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
