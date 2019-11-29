const express = require('express');
const app = express();
const fs = require('fs');
const formidable = require('formidable');
const DB = new (require('../db.js'))();
const ObjectId = require('mongodb').ObjectID;


app.get('/create', (req,res) => {
    res.render('restaurant_create');
})

app.post('/create', (req,res) => {
    const form = new formidable.IncomingForm();
    let userid = req.session.userid;

    form.parse(req, (err, fields, files) => {
        let restaurantObj = {
            restaurant_id : new ObjectId(),
            name : fields['name'],
            borough : fields['borough'],
            cuisine : fields['cuisine'],
            photo : null,
            mimetype : files.restaurant_photo.type, // TODO
            address : {
                street : fields['street'],
                building : fields['building'],
                coord : {
                    latitude: fields['lat'],
                    longitude: fields['lon'],
                    zipcode: fields['zipcode'],
                },
            },
            owner : userid // TODO
        }

        fs.readFile(files.restaurant_photo.path, (err, data) => {
            if (!err) {
                if(data != ""){
                    restaurantObj.photo = new Buffer(data).toString("base64");
                }
                
                DB.createRestaurant(restaurantObj, (err, response) => {
                    if(err){
                        console.log("ERR!", err);
                    }else{
                        if(response){
                            console.log("Create restaurant success");
                            res.redirect(`/restaurant/show?_id=${restaurantObj.restaurant_id}`);
                        }else{
                            console.log("Create restaurant failed", err);
                            res.redirect(`/restaurant/create`);
                        }
                    }
                })
            }else {
                console.log("/Create/restaurant: read photo failed");
            }
        })
    })
})

app.get('/show', (req,res) => {
    let restaurantObjectId = req.query._id;
    
    DB.getRestaurant(restaurantObjectId, (err, response) => {
        if(err){
            console.log("ERR!", err);
        }else{
            if(response){
                console.log("Show success");
                res.render('restaurant_show', {restaurant : response});
            }else{
                console.log("Show failed", response);
            }
        }
    })

})

app.get('/edit', (req,res) => {
    let restaurantObjectId = req.query._id;
    console.log(req.query);
    
    DB.getRestaurant(restaurantObjectId, (err, response) => {
        if(err){
            console.log("ERR!", err);
        }else{
            if(response){
                console.log("Edition show success", response);
                res.render('restaurant_edit', {restaurant : response});
            }else{
                console.log("Edition show failed", response);
            }
        }
    })
})

app.post('/edit', (req,res) => {
    const form = new formidable.IncomingForm();
    let restaurantObjectId = req.query._id;

    form.parse(req, (err, fields, files) => {
        
        let restaurantUpdate = { $set: {
            name: fields['name'],
            borough : fields['borough'],
            cuisine : fields['cuisine'],
            photo : null,
            mimetype : files.restaurant_photo.type, // TODO
            address : {
                street : fields['street'],
                building : fields['building'],
                coord : {
                    latitude: fields['lon'],
                    longitude: fields['lat'],
                },
            }
        }}
        
        DB.editRestaurant(restaurantObjectId, restaurantUpdate, (err, response) => {
            if(err){
                console.log("ERR!", err);
            }else{
                if(response){
                    console.log("Edit restaurant success");
                    res.redirect(`/restaurant/show?_id=${restaurant.restaurantObjectId}`);
                }else{
                    console.log("Edit restaurant failed", err);
                    res.redirect(`/restaurant/edit`);
                }
            }
        })
    })
})
    
app.get('/map', (req, res) => {
    let location = {
        latitude: req.query.lat,
        longitude: req.query.lon
    }
    res.render('restaurant_map', {location: location}); 
});

module.exports = app;