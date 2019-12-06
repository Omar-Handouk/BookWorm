'use strict';


let admin = require('firebase-admin');

class BuyerService {
    constructor(app, firebase) {
      this.app = app;
      this.firebase = firebase;
      this.db = this.firebase.firestore();
    }
    

    saveCar(Id, userId, save, callback){
        let dbQuery = this.db.collection("Cars").doc(Id);
    dbQuery
      .get()
      .then((doc) => {
        if (doc.exists) {
            let id = userId.toString(2);
            let dbUser = this.db.collection("Users").doc(id); 
            dbUser
           .get()
           .then((document) => {
               if(document.exists){
                 if(save == true){ //saving the car
                    dbUser.update({
                      "Favourite Cars" : admin.firestore.FieldValue.arrayUnion(doc.data())
                    }).then((document) => {
                      callback({Info: "Document SAVE successfully updated!"});
                    });    
                 }else { //unsaving the car
                    dbUser.update({
                      "Favourite Cars" : admin.firestore.FieldValue.arrayRemove(doc.data())
                    }).then((document) => {
                      callback({Info: "Document UNSAVE successfully updated!"});
                    })
                 }
                  
               }else {
                callback({ Error: "Document User ID does not exist" });
              }
           })
           .catch((err) => console.error(err));
            
        } else {
          callback({ Error: "Document Car ID does not exist" });
        }
      })
      .catch((err) => console.error(err));
       
    } 
}  
module.exports = (app, firebase, serviceManager) => {
    let buyerService = new BuyerService(app, firebase);
    serviceManager.set("buyerService", buyerService);
  };

