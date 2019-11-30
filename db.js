const MongoClient = require("mongodb").MongoClient;
const url =  "mongodb+srv://tester1:test1@kc2019-db7fy.azure.mongodb.net/test?retryWrites=true&w=majority";
const dbName =  "projectDB";
const ObjectId = require('mongodb').ObjectID;

module.exports = class DB{
    constructor(){
        let database = null;
        let isConnected = false; 

        MongoClient.connect(url, {useNewUrlParser: true,useUnifiedTopology: true}, (err, db) => {
            if(err){
                console.log("MongoClient connect err! ", err);
            }else{
                console.log("MongoClient connect Success! ");
                isConnected = true;
                database = db.db(dbName);
            }
        })

        this.register = (userid, password, callback) => {
            if(isConnected){
                let user = {
                    userid : userid,
                    password : password,
                }
                database.collection("userAccount").insertOne(user, (err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.login = (userid, password, callback) => {
            if(isConnected){
                let user = {
                    userid : userid,
                    password : password,
                }
                database.collection("userAccount").findOne(user, (err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.createRestaurant = (restaurantObj, callback) => {
            if(isConnected){
                database.collection("restaurant").insertOne(restaurantObj, (err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.getRestaurant = (restaurantObjId, callback) => {
            if(isConnected){
                let restaurant = {
                    restaurant_id : new ObjectId(restaurantObjId),
                }
                database.collection("restaurant").findOne(restaurant, (err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.getRestaurantList = (callback) => {
            let project = {
                projection: {
                    restaurant_id : 1,
                    name : 1
                }
            }
            if(isConnected){
                database.collection("restaurant").find({}, project).toArray((err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.updateRestaurant = (restaurantObjId, restaurantUpdate, callback) => {
            if(isConnected){
                let checkid = {
                    restaurant_id: new ObjectId(restaurantObjId)
                };
                database.collection("restaurant").updateOne(checkid, restaurantUpdate, (err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.deleteRestaurant = (restaurantObjId, callback) => {
            if(isConnected){
                let deleteid = {
                    restaurant_id: new ObjectId(restaurantObjId)
                };
                database.collection("restaurant").deleteOne(deleteid, (err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }

        this.searchRestaurant = (keyword, callback) => {
            if(isConnected){
                database.collection("restaurant").find({$text: {$search: keyword}}).toArray((err, res) => {
                    callback(err, res);
                })
            }else{
                callback(true, "DB is disconnected");
            }
        }
    }
}