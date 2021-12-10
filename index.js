import express from "express";
import  { createLogger, format, transports, } from "winston";
import exphbs from "express-handlebars";
import methodOverride from "method-override";
import browserSync  from "browser-sync";
import path from "path";
import generateHTMLTagBarcode from "./generateBarcode"

// init logger
const logger = createLogger({
	format: format.combine(
		format.splat(),
		format.simple()
	),
	transports: [new transports.Console(),],
});

// Get Port
const PORT = process.env.PORT || 5000;
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

app.get("/a3422/generate", (req, res) => {
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
