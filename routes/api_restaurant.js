const express = require('express');
const router = express.Router();
const DB = new (require('../db.js'))();
const ObjectId = require('mongodb').ObjectID;

router
    .route('/restaurant/:selectKey/:selectValue')
    .get((req, res) => {
        res.setHeader('Content-Type', 'application/json');

        DB.getRestaurantAPI(req.params.selectKey, req.params.selectValue, (err, response) => {
            if(err){
                console.log("ERR!")
                res.sendStatus(500);
            }else{
                if(response.length){
                    res.send(JSON.stringify(response, null, 2));
                }else{
                    res.send({});
                }
            }
        })
    })

router
    .route('/restaurant')
    .get((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        DB.getRestaurantListAPI((err, response) => {
            if(err){
                console.log("ERR!")
                res.sendStatus(500);
            }else{
                res.send(JSON.stringify(response, null, 2));
            }
        })
    })
    .post((req, res) => {
        let restaurantObj = {
            restaurant_id : new ObjectId(),
            name : req.body['name'],
            borough : (req.body['borough'] ? req.body['borough'] : null),
            cuisine : (req.body['cuisine'] ? req.body['cuisine'] : null),
            photo : null,
            mimetype : null, 
            address : {
                street : (req.body['street'] ? req.body['street'] : null),
                building : (req.body['building'] ? req.body['building'] : null),
                zipcode: (req.body['zipcode'] ? req.body['zipcode'] : null),
                coord : {
                    latitude: (req.body['lat'] ? req.body['lat'] : null),
                    longitude: (req.body['lon'] ? req.body['lon'] : null),
                },
            },
            grades: [],
            owner : (req.session.userid ? req.session.userid : "creat by post api")
        }

        res.setHeader('Content-Type', 'application/json');
        DB.postRestaurantAPI(restaurantObj, (err, response) => {
            if(err){
                res.send(JSON.stringify({status: "failed"}))
            }else{
                res.send(JSON.stringify({
                    status: "ok",
                    _id: response.insertedId
                }))
            }
        })
    });

module.exports = router;