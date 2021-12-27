const jsbarcode = require("jsbarcode");
const fs = require('fs');
const { DOMImplementation, XMLSerializer } = require('xmldom');

const generateHTMLTagBarcode = (praefix, res) => {
    let counter = { actual: 1 }
    let barcode = {}
    let index = 1
    if (praefix == 'invalid') {
        res.status('500').send('preafix is invalid. Must be: minimum 3 characters and maximal 8 characters');
    }
    else {
        fs.readFile(`log_${praefix}_data.json`, 'utf-8', (err, data) => {
            if (!err) {
                counter = JSON.parse(data);
            }
            let end = counter.actual + 65
            for (counter.actual; counter.actual < end; counter.actual++) {
                barcode[index] = generateHelper(praefix, counter.actual.toString().padStart(8, '0'));
                index++
            }

            fs.writeFile(`log_${praefix}_data.json`, JSON.stringify(counter), (err) => {
                if (err) {
                    throw err;
                }
            });
            res.render("a3666", { barcode: barcode, layout: "a3666_layout" });
        });

    }

};

const generateHelper = (praefix, data) => {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    jsbarcode(svgNode, `${praefix || "100"}_${data}`, {
        xmlDocument: document,
        width: 0.80,
        height: 75,
        fontSize: 14
    });

    return xmlSerializer.serializeToString(svgNode);

}

module.exports = {
    generate: generateHTMLTagBarcode
}