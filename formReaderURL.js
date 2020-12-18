const express=require('express');
const app=express();
const port=3000;
const bodyParser = require("body-parser");
const cors=require('cors')
const swaggerJsdoc= require('swagger-jsdoc');
const swaggerUi= require('swagger-ui-express');
const { check, validationResult } = require('express-validator');
const options={
	swaggerDefinition:{
	info:{
	title:"SI Project: Form Recognizer",
	version:"1.0.0",
	description:"This Project consumes Azure Form Recognizer which is a cognitive service that uses machine learning technology to identify and extract key-value pairs and table data from form documents. \r\n It then outputs structured data that includes the relationships in the original file. \r\n  \r\n Supported image extentions- jpeg,jpg,png,pdf "
},
//host:'142.93.10.50:3000',
host:'localhost:3000',
basePath:'/'
},
apis:['./formReaderURL.js']
};

const specs= swaggerJsdoc(options);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/docs',swaggerUi.serve,swaggerUi.setup(specs));


const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const { default: Axios } = require('axios');


const endpoint = "https://formInfo.cognitiveservices.azure.com";
const apiKey = "72dd7a2f8b3941a492b2194081ace7cd";

//const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

app.use(cors());

let content_type=""

let readStream=""

const headers = {
   
    'Content-Type': "application/json",
    'Ocp-Apim-Subscription-Key': apiKey,
}

      
    


/**
 * @swagger
 * definitions:
 *   InvoiceImage:
 *     properties:
 *       urlPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /invoice:
 *    post:
 *     description: This endpoint can analyze and extract information from sales invoices using its prebuilt invoice models. <br>The Invoice API enables customers to take invoices in a variety of formats and return structured data to automate the invoice processing. <br> It extracts the text, tables, and information such as customer, vendor, invoice ID, invoice due date, total, invoice amount due, tax amount, ship to, bill to, and more.
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
 *             description:no path provided
 *     parameters:
 *          - name: invoicePath
 *            description: Invoice  path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/InvoiceImage'
 */


app.post('/invoice',[check('urlPath','Image URL is required').not().isEmpty().trim()], async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(501).json({errors:errors.array()});
    }

  data={
    "source":req.body.urlPath
}
let post_url = endpoint + "/formrecognizer/v2.1-preview.2/prebuilt/invoice/analyze"



const params = {
    "includeTextDetails": true,
    "locale": "en-US"
}
try {
const result = await Axios.post(post_url,data,{params:params,headers:headers}); // post the image to the model url for analyzing
try {                                                                                 // result holds the url for get method
const get_invoice= result.headers['operation-location']

n_tries = 10
n_try = 0

while (n_try < n_tries){        


const result_final = await Axios.get(get_invoice,{headers : {"Ocp-Apim-Subscription-Key": apiKey}}) // to get the analyzed results of the provided image

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
 *       urlPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /businessCard:
 *    post:
 *     description: This endpoint can analyze and extract contact information from business cards using one of its prebuilt models. <br> It extracts personal contact info, company name, job title, and more.
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
 *             description: no path provided
 * 
 *     parameters:
 *          - name: BusinessCardPath
 *            description: Business card path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/BusinessCardImage'
 */


app.post('/businessCard',[check('urlPath','Image URL is required').not().isEmpty().trim()], async (req,res)=>{
const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(501).json({errors:errors.array()});
    }

  data={
    source:req.body.urlPath
}
    
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
const result = await Axios.post(post_url,data,{params:params,headers:headers});
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
 *       urlPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /tableInfo:
 *    post:
 *     description: This endpoint can extract text, tables, selection marks, and structure information from documents using its Layout service. <br> It combines our powerful Optical Character Recognition (OCR) capabilities with document understanding deep learning models to extract text, tables, selection marks, and structure of documents.
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
 *             description: no path provided
 * 
 *     parameters:
 *          - name: TablePath
 *            description: Table/Layout path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/TableImage'
 */


app.post('/tableInfo',[check('urlPath','Image URL is required').not().isEmpty().trim()], async (req,res)=>{
const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(501).json({errors:errors.array()});
    }

  data={
    "source":req.body.urlPath
}
    
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
const result = await Axios.post(post_url,data,{params:params,headers:headers});

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
 *       urlPath:
 *         type: string
 *      
 */
/**
 /**
 * @swagger
 * /receipt:
 *    post:
 *     description: This endpoint can analyze receipts using one of its prebuilt models. <br> The Receipt API extracts key information from sales receipts in English, such as merchant name, transaction date, transaction total, line items, and more.
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
 *             description: no path provided
 *                   
 *     parameters:
 *          - name: ReceiptPath
 *            description: Receipt path
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/ReceiptImage'
 */


app.post('/receipt',[check('urlPath','Image URL is required').not().isEmpty().trim()], async (req,res)=>{
const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(501).json({errors:errors.array()});
    }

  data={
    'source':req.body.urlPath
}
    
let post_url = endpoint + "/formrecognizer/v2.0/prebuilt/receipt/analyze"


// const headers = {
   
//     'Content-Type': "application/json" ,
//     'Ocp-Apim-Subscription-Key': apiKey,
// }

const params = {
    "includeTextDetails": true 
}
try {
    const result = await Axios.post(post_url,data,{params:params,headers:headers});


try {

const get_receipt= result.headers['operation-location']

n_tries = 10
n_try = 0

while (n_try < n_tries){

const result_final = await Axios.get(get_receipt,{headers : {"Ocp-Apim-Subscription-Key": apiKey}})

if (result_final.data.status == "succeeded"){
     const decoded= result_final.data.analyzeResult.readResults[0]
     res.status(200).send(JSON.stringify(decoded,null,3))
     return;
    }
if (result_final.data.status == "failed"){
    res.status(400).send({msg:"Analysis failed"})
    return;
    }

setTimeout(function(){  }, 1000);
n_try += 1   

}
} catch (error) {
    console.log(error)
    res.status(401).send('Fail to get the analyzed results');
    return;
}
} catch (error) {
     console.log(error)
res.status(500).send('Invalid path or unsupported Image ');

}


})




app.listen(port,()=>{
	console.log(`Exapmle app listening at http://localhost:${port}`)
})
