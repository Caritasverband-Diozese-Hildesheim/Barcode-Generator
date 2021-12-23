const  jsbarcode = require(  "jsbarcode");
const fs = require( 'fs');
const { DOMImplementation, XMLSerializer } = require( 'xmldom');
const praefix = process.env.BCGEN_PRAEFIX || "100";

const generateHTMLTagBarcode = (data, res) => {
    let counter={actual: 1}
    let barcode = {}
    let index = 1
    fs.readFile('data.json', 'utf-8', (err, data) => {
        if(!err){
            counter = JSON.parse(data);
        }
        let end = counter.actual+65
        for (counter.actual; counter.actual<end; counter.actual++)
        {
            barcode[index] = generateHelper(counter.actual.toString().padStart(8,'0'));
            index++
        }
        
        fs.writeFile('data.json', JSON.stringify(counter), (err) => {
            if (err) {
                throw err;
            }
        });
        res.render("a3666", {barcode: barcode,layout: "a3666_layout"});
    });


    
};

const generateHelper = (data) => {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    jsbarcode(svgNode,  `${praefix}_${data}`, {
        xmlDocument: document,
        width: 0.90,
        height: 44,
        fontSize: 12
    });
    
    return xmlSerializer.serializeToString(svgNode);
    
}

module.exports= {
    generate : generateHTMLTagBarcode
}