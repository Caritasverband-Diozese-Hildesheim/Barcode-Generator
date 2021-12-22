const express = require( "express");
const winston  = require( "winston");
const exphbs = require( "express-handlebars");
const methodOverride = require( "method-override");
const browserSync  = require( "browser-sync");
const path = require( "path");
const generateHTMLTagBarcode = require( "./generateBarcode.js");
const yup = require("yup");


// init logger
const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.splat(),
		winston.format.simple()
	),
	transports: [new winston.transports.Console(),],
});

const portScheme = yup.number().positive().integer().min(1024).max(65534);

if (!portScheme.isValidSync(process.env.BCGEN_PORT)) {
	portScheme.validate(process.env.BCGEN_PORT).catch((err) => {
	  logger.log({
		level: "error",
		message: "App Configuration failure:\r\n" + err.errors + "\r\nExiting.\r\n",
	  });
	  process.exit(1);
	});
  }
const PORT = process.env.BCGEN_PORT || 5000;
const ENV = process.env.APP_ENV || "dev";



// init App
const app = express();

// init view engine
app.engine("handlebars", exphbs({defaultLayout: "main",}));
app.set("view engine", "handlebars");

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

// Method-Override
app.use(methodOverride("_method"));

// publish public folder
app.use(express.static(path.join(__dirname, "/public")));

// default route 
app.get("/", (req, res) => {
	res.render("homepage", {greeting: "bla!",});
});

app.get("/a3666/generate", (req, res) => {
	generateHTMLTagBarcode.generate("hallo", res);
});

app.listen(PORT, () => logger.log("info", "Webservice startet on Port: %d", PORT));

/** Test doku automation
 * @returns {int} 0 
*/
const testIt = () => 0;
testIt();

// init browser-sync
logger.log("info", "ENV ist: %s", ENV);
if (ENV==="dev"){
	const bs = browserSync.create();
	bs.init({
		open: false,
		port: PORT+1,
		proxy: {
			target: "localhost:" + PORT,
		},
	});
}
