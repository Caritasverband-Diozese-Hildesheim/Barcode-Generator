const express = require("express");
const winston = require("winston");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const path = require("path");
const generateHTMLTagBarcode = require("./generateBarcode.js");
const yup = require("yup");
const fs = require('fs');


// init logger
const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.splat(),
		winston.format.simple()
	),
	transports: [new winston.transports.Console(),],
});

const portScheme = yup.number().positive().integer().min(1024).max(65534);
const praefixScheme = yup.string().min(3).max(8);

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

// init App
const app = express();

// init view engine
app.engine("handlebars", exphbs({ defaultLayout: "main", }));
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
	res.render("homepage", { greeting: "bla!", });
});

app.get("/a3666/generate/:praefix", (req, res) => {
	if (praefixScheme.isValidSync(req.params.praefix)) {
		generateHTMLTagBarcode.generate(req.params.praefix, res);
	}
	else {
		generateHTMLTagBarcode.generate("invalid", res);
	}
});

app.get("/a3666/generate/:praefix/reset", (req, res) => {
	if (praefixScheme.isValidSync(req.params.praefix)) {
		fs.unlink(`log_${req.params.praefix}_data.json`, (err => {
			if (err) res.status('500').send('Could not reset data, check data.');
			else {
				res.status('500').send('Done!');
			}
		}));
	}
	else {
		res.status('500').send('preafix is invalid. Must be: minimum 3 characters and maximal 8 characters');
	}
});

app.listen(PORT, () => logger.log("info", "Webservice startet on Port: %d", PORT));

/** Test doku automation
 * @returns {int} 0 
*/
const testIt = () => 0;
testIt();

// init browser-sync

