const { ObjectID } = require('bson');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

// const { DevisModel } = require('/Users/Duresa/Desktop/Site web/Finance/UTBM-Module-finances/Models/DevisModel');
const { DevisModel } = require('../Models/DevisModel');
const { FactureModel } = require('../Models/DevisModel');

const path = require('path');
const DLPath = path.join(__dirname, '/../Telechargements/');

//----------------MAIL----------------------------------------------------
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'noreply.finances.ta70',
        pass: '8@9KVzbb'
    }
});

//pajazitiduresa@hotmail.com,matthieu.hirth.68@gmail.com,hugo.laurent@utbm.fr

// let mailContent={
//     from: 'noreply.finances.ta70',
//     to: 'antoine.mure.am@gmail.com',
//     subject: 'First Node.js email',
//     text: 'Hi,This is a test mail sent using Nodemailer',
//     html: '<h1>COUCOU ! Voici un test</h1>',
//     attachments: [
//         {
//             filename: 'image1.jpg',
//             path: __dirname + '/image1.jpg'
//         }
//     ]
// };

// transporter.sendMail(mailContent, function(error, data){
//     if(err){
//         console.log('Unable to send mail');
//     }else{
//         console.log('Email send successfully');
//     }
// });
//------------------FIN MAIL----------------------------------------------

// const devis = new DevisModel({ client: 'Hugo', TVA: 20 });
// console.log(devis.name); // 'Silence'

// const middlewares = [
//     // ...
// bodyParser.urlencoded({ extended: true })
//
// ];

app.use(bodyParser.urlencoded({ extended: true }));

router.get('/new', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("newDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/view', (req, res) => {
    DevisModel.find((err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("viewDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});

router.get('/email', (req, res) => {
    res.render("sendDevis");
});

router.post('/send', (req, res) => {
    console.log([DLPath + req.body.fichierDevis]);
    let mailContent={
        from: '"noreply" <noreply.finances.ta70>',
        to: req.body.emailDestinataire,
        subject: req.body.emailObjet,
        text: req.body.emailMessage,
        attachments: [
            {
                filename: req.body.fichierDevis,
                path: DLPath + req.body.fichierDevis
            }
        ]
    };
    
    transporter.sendMail(mailContent, function(error, data){
        if(error){
            console.log('Unable to send mail');
        }else{
            console.log('Email send successfully');
        }
    });
    
    res.redirect("/view");
});
// add
router.post('/add', (req, res) => {
    console.log([req.body.description]);
    console.log("Test id devisController :",req.body.selectClient)
    const newRecord = new DevisModel({
        client: req.body.selectClient,
        quantite: req.body.quantite,
        prix: req.body.prix,
        tva: req.body.tva,
        reduction: req.body.reduction,
        totalHT: req.body.total_ht,
        totalTTC: req.body.total_ttc,
        description: req.body.description,
        date: req.body.date_val
    });
    // res.send(newRecord);
    newRecord.save((err, devi) => {
        if (!err) res.render("apercuDevis", { devi: devi });
        else console.log('Erreur création nouvelles données :' + err);
    });
});

// router.post('/factures', (req, res) => {
//     console.log("Test id devisController :",req.body.nomClient);
//     const newRecord = new FactureModel({
//         client2: req.body.nomClient,
//         TVA2: 30
//     });
//     newRecord.save((err, docs) => {
//         if (!err) res.send(docs);
//         else console.log('Erreur création nouvelles données :' + err);
//     });
// });


router.get('/apercu/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

    DevisModel.findById(req.params.id, (err, devis) => {
        if (!err) {
            // res.send(docs);
            res.render("updateDevis", { devis: devis });
            //console.log(devis[0].client);
        }
        else console.log("Error to get data : " + err);
    })
});


//update
router.post('/update/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

        const updateRecord = {
            client: req.body.selectClient,
            quantite: req.body.quantite,
            prix: req.body.prix,
            tva: req.body.tva,
            reduction: req.body.reduction,
            totalHT: req.body.total_ht,
            totalTTC: req.body.total_ttc,
            description: req.body.description,
            date: req.body.date_val
        };
        
        DevisModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true },
            (err, devi) => {
                if (!err) res.render("apercuDevis", { devi: devi });
                else console.log("Update error :" + err);
            }
        )
});

router.get('/download/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
        
        DevisModel.findById(
            req.params.id,
            (err, devi) => {
                if (!err) res.render("apercuDevis", { devi: devi });
                else console.log("Update error :" + err);
            }
        )
});

router.get('/delete/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
    console.log(req.params.id);
    DevisModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.redirect("/devis/view");
            else console.log("Delete error : " + err);
        })
});


module.exports = router;