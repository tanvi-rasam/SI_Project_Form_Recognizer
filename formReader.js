const express=require('express');
const app=express();
const port=3000;
const bodyParser = require("body-parser");

const { check, validationResult } = require('express-validator');

const swaggerJsdoc= require('swagger-jsdoc');
const swaggerUi= require('swagger-ui-express');

const options={
	swaggerDefinition:{
	info:{
	title:"SI Project: Form Recognizer ",
	version:"1.0.0",
	description:""
},
//host:'142.93.10.50:3000',
host:'localhost:3000',
basePath:'/'
},
apis:['./formReader.js']
};

const specs= swaggerJsdoc(options);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//const cors=require('cors')
app.use('/docs',swaggerUi.serve,swaggerUi.setup(specs));


const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const { default: Axios } = require('axios');
const { url } = require('inspector');
const { decode } = require('punycode');

const endpoint = "https://formInfo.cognitiveservices.azure.com";
const apiKey = "72dd7a2f8b3941a492b2194081ace7cd";
//const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

//app.use(cors());
let content_type=""
let objPath=""
let readStream=""
global.flag=false;
//image as url

// research swagger
//security- authentication jwt


let headerMiddleware = function (req, res, next) {
objPath = req.body.objPath; //"C:/Users/tv5ra/Desktop/invoice.jpeg";

 readStream = fs.createReadStream(objPath);

 let ext = objPath.split(".")[1];

if(objPath==""|| ext=="" || ext==undefined){
    res.status(501).send("Invalid or no path provided")
}
else{


switch(ext) {
  case 'jpeg':
  case 'jpg':
    content_type = "image/jpeg"
    break;
  case 'png':
    content_type = "image/png"
    break;
  case 'pdf':
    content_type = "application/pdf"
    break;
  default:
    // code block
}
    next()

}




}
        
    


/**
 * @swagger
 * definitions:
 *   InvoiceImage:
 *     properties:
 *       objPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /invoice:
 *    post:
 *     description: Return analyed invoice
 *     produces:
 *        -application/json
 *     responses:
 *         200:
 *             description: Analyed invoice
 *         400:
 *             description: Analysis failed
 *         401:
 *             description: Fail to get the results
 *         500:
 *             description: Invalid path or unsupported Image
 *         501:
 *             description: Invalid or no path provided
 *     parameters:
 *          - name: invoiceObject
 *            description: Invoice object path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/InvoiceImage'
 */


app.post('/invoice',headerMiddleware, async (req,res)=>{


    
let post_url = endpoint + "/formrecognizer/v2.1-preview.2/prebuilt/invoice/analyze"

const headers = {
   
    'Content-Type': content_type,
    'Ocp-Apim-Subscription-Key': apiKey,
}

const params = {
    "includeTextDetails": true,
    "locale": "en-US"
}
try {
const result = await Axios.post(post_url,readStream,{params:params,headers:headers});
try {
const get_BC= result.headers['operation-location']

n_tries = 10
n_try = 0

while (n_try < n_tries){


const result_final = await Axios.get(get_BC,{headers : {"Ocp-Apim-Subscription-Key": apiKey}})

if (result_final.data.status == "succeeded"){
     const decoded= result_final.data.analyzeResult.documentResults[0]
     res.status(200).send(JSON.stringify(decoded,null,3))
    break;}
if (result_final.data.status == "failed"){
    res.status(400).send({msg:"Analysis failed"})
    
    break;}

setTimeout(function(){  }, 3000);
n_try += 1   

}
} catch (error) {
    res.status(401).send('Fail to get the analyzed results');
    return;
}
} catch (error) {
    
res.status(500).send('Invalid path or unsupported Image ');

}


})




/**
 * @swagger
 * definitions:
 *   BusinessCardImage:
 *     properties:
 *       objPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /businessCard:
 *    post:
 *     description: Return analyed Business Card
 *     produces:
 *        -application/json
 *     responses:
 *         200:
 *             description: Analyed Business Card
 *         400:
 *             description: Analysis failed
 *         401:
 *             description: Fail to get the results
 *         500:
 *             description: Invalid path or unsupported Image
 *         501:
 *             description: Invalid or no path provided
 * 
 *     parameters:
 *          - name: BusinessCardObjectPath
 *            description: Business card object path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/BusinessCardImage'
 */


app.post('/businessCard',headerMiddleware, async (req,res)=>{

    
let post_url = endpoint + "/formrecognizer/v2.1-preview.2/prebuilt/businessCard/analyze"
//"C:/Users/tv5ra/Desktop/BC.jpg";

const headers = {
   
    'Content-Type': content_type,
    'Ocp-Apim-Subscription-Key': apiKey,
}

const params = {
    "includeTextDetails": true 
}
try {
const result = await Axios.post(post_url,readStream,{params:params,headers:headers});
try {
const get_BC= result.headers['operation-location']

n_tries = 10
n_try = 0

while (n_try < n_tries){

const result_final = await Axios.get(get_BC,{headers : {"Ocp-Apim-Subscription-Key": apiKey}})

if (result_final.data.status == "succeeded"){
     const decoded= result_final.data.analyzeResult.documentResults[0]
     res.status(200).send(JSON.stringify(decoded,null,3))
    break;}
if (result_final.data.status == "failed"){
    res.status(400).send({msg:"Analysis failed"})
    
    break;}

setTimeout(function(){  }, 3000);
n_try += 1   

}
} catch (error) {
    res.status(401).send('Fail to get the analyzed results');
    return;
}
} catch (error) {
    
res.status(500).send('Invalid path or unsupported Image ');

}

})



/**
 * @swagger
 * definitions:
 *   TableImage:
 *     properties:
 *       objPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /tableInfo:
 *    post:
 *     description: Return analyed Table
 *     produces:
 *        -application/json
 *     responses:
 *         200:
 *             description: Analyed Table/Layout
 *         400:
 *             description: Analysis failed
 *         401:
 *             description: Fail to get the results
 *         500:
 *             description: Invalid path or unsupported Image
 *         501:
 *             description: Invalid or no path provided
 * 
 *     parameters:
 *          - name: TableObjectPath
 *            description: Table/Layout object path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/TableImage'
 */


app.post('/tableInfo',headerMiddleware, async (req,res)=>{

    
let post_url = endpoint + "/formrecognizer/v2.0/Layout/analyze"
//"C:/Users/tv5ra/Desktop/tableinfo.jpeg";

const headers = {
   
    'Content-Type': content_type,
    'Ocp-Apim-Subscription-Key': apiKey,
}

const params = {
    "includeTextDetails": true 
}
try {
const result = await Axios.post(post_url,readStream,{params:params,headers:headers});

try {
const get_table= result.headers['operation-location']

n_tries = 10
n_try = 0

while (n_try < n_tries){

const result_final = await Axios.get(get_table,{headers : {"Ocp-Apim-Subscription-Key": apiKey}})

if (result_final.data.status == "succeeded"){
     const decoded= result_final.data.analyzeResult.readResults[0]
     res.status(200).send(JSON.stringify(decoded,null,3))
    break;}
if (result_final.data.status == "failed"){
    res.status(400).send({msg:"Analysis failed"})
    
    break;}

setTimeout(function(){  }, 3000);
n_try += 1   

}
} catch (error) {
    res.status(401).send('Fail to get the analyzed results');
    return;
}
} catch (error) {
    
res.status(500).send('Invalid path or unsupported Image ');

}

})



/**
 * @swagger
 * definitions:
 *   ReceiptImage:
 *     properties:
 *       objPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /receipt:
 *    post:
 *     description: Return analyed receipt/bill
 *     produces:
 *        -application/json
 *     responses:
 *         200:
 *             description: Analyed Receipt
 *         400:
 *             description: Analysis failed
 *         401:
 *             description: Fail to get the results
 *         500:
 *             description: Invalid path or unsupported Image
 *         501:
 *             description: Invalid or no path provided
 *                   
 *     parameters:
 *          - name: ReceiptObjectPath
 *            description: Receipt object path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/ReceiptImage'
 */


app.post('/receipt',headerMiddleware, async (req,res)=>{

    
let post_url = endpoint + "/formrecognizer/v2.0/prebuilt/receipt/analyze"
//"C:/Users/tv5ra/Desktop/contoso-allinone.jpg";

const headers = {
   
    'Content-Type': content_type,
    'Ocp-Apim-Subscription-Key': apiKey,
}

const params = {
    "includeTextDetails": true 
}
try {
    const result = await Axios.post(post_url,readStream,{params:params,headers:headers});


try {

const get_table= result.headers['operation-location']

n_tries = 10
n_try = 0

while (n_try < n_tries){

const result_final = await Axios.get(get_table,{headers : {"Ocp-Apim-Subscription-Key": apiKey}})

if (result_final.data.status == "succeeded"){
     const decoded= result_final.data.analyzeResult.readResults[0]
     res.status(200).send(JSON.stringify(decoded,null,3))
     return;
    }
if (result_final.data.status == "failed"){
    res.status(400).send({msg:"Analysis failed"})
    return;
    }

setTimeout(function(){  }, 3000);
n_try += 1   

}
} catch (error) {
    res.status(401).send('Fail to get the analyzed results');
    return;
}
} catch (error) {
    
res.status(500).send('Invalid path or unsupported Image ');

}


})




 /**
 * @swagger
 * /students:
 *    get:
 *     description: Return students
 *     produces:
 *        -application/json
 *     responses:
 *         200:
 *             description: Object student
 */

app.get('/tableForm', 
	async function recognizeContent() {
    const path = "C:/Users/tv5ra/Desktop/form4.jpg";
    
const readStream = fs.createReadStream(path);
   
    const poller = await client.beginRecognizeContent(readStream, "image/jpeg", {
  onProgress: (state) => { console.log(`status: ${state.status}`); }
});


// const poller = await client.beginRecognizeReceipts(readStream, "image/jpeg", {
//   onProgress: (state) => { console.log(`status: ${state.status}`); }
// });

    const pages = await poller.pollUntilDone();
    console.log(pages.length)
    if (!pages || pages.length === 0) {
        throw new Error("Expecting non-empty list of pages!");
    }

    for (const page of pages) {
        console.log(
            `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
        );
        for (const table of page.tables) {
            for (const cell of table.cells) {
                console.log(`cell [${cell.rowIndex},${cell.columnIndex}] has text ${cell.text}`);
            }
        }
    }

})




/**
 * @swagger
 * /companies:
 *    get:
 *     description: Return companies
 *     produces:
 *        -application/json
 *     responses:
 *         200:
 *             description: Object companies 
 */
//cacheMiddleware(30)
app.get('/companies', async (req,res)=>{
let conn;
try{
  
  res.setHeader('Content-Type','application/json');
  res.send("hello")
  //res.status(200).send(JSON.stringify(result,null,3));
}
catch(err){
res.status(500).send('Server Error');
}

});



/**
 * @swagger
 * definitions:
 *   Company1:
 *     properties:
 *       COMPANY_ID:
 *         type: string
 *       COMPANY_NAME:
 *         type: string
 *       COMPANY_CITY:
 *         type: string
 */
/**
 * @swagger
 * /addCompany:
 *    post:
 *      description: add record to company table
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Added data to company table
 *          500:
 *              description: Server Error
 *          400:
 *              description: Error from parameters
 *      parameters:
 *          - name: Company
 *            description: Company object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Company1'
 *
 */

 
app.post('/addCompany',[check('COMPANY_ID','Company ID is required').not().isEmpty().trim(),
                  check('COMPANY_ID').isAlphanumeric()
    .withMessage('The Company Id should only be Alphanumeric').isLength({max:5}).withMessage("Company Id should have maximum 6 characters"),
    check('COMPANY_NAME').isAlphanumeric()
    .withMessage('Company NAME should only be Alphanumeric').isLength({max:30}).withMessage("Company Name should have maximum 30 characters"),
    check('COMPANY_CITY').isAlphanumeric()
    .withMessage('COMPANY CITY should only be Alphanumeric').isLength({max:30}).withMessage("COMPANY CITY should have maximum 30 characters")],async (req,res)=>{
    let conn;
   const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {COMPANY_ID,COMPANY_NAME,COMPANY_CITY}=req.body

    try{
	//conn= await pool.getConnection();
	
//const result= await pool.query(`INSERT INTO company (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) VALUES ('${COMPANY_ID}', '${COMPANY_NAME}', '${COMPANY_CITY}')`);
res.status(200).send("done")
	
}
catch(error) {
         console.error(error.message)
        res.status(500).send('Server Error');
    }


});





app.listen(port,()=>{
	console.log(`Exapmle app listening at http://localhost:${port}`)
})
