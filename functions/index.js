const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var batch = admin.firestore().batch();
const promises = []


 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });
 
 
 exports.addUnregisteredUsers = functions.firestore
  .document('activities/{activity_id}')
  .onCreate((event,context) => {


	var activity = event.data();
    var activity_id = context.params.activity_id;
	var userArray = JSON.parse(activity.users);
	console.log(activity_id);
	
	userArray.forEach(function(user){
	    user.activities_id = activity_id;
	    //check if user already exist in pending_list
	    var reference =   admin.firestore().collection('pending_reg_users').doc(user.user_phone)
			   reference.get()
					.then((docSnapshot) => {
		    			if (docSnapshot.exists) {
		    				reference.onSnapshot((doc) => {
		    					console.log("he has already an item:" + doc.get("activities_id"));
		    				  promises.push(reference.update(reference,{'activities_id':doc.get("activities_id")+","+activity_id}));
		        		
		    				});
						} else {
						
							console.log("item doesnt exist");	
		    				promises.push(batch.set(reference,user)); // create the document
		    			}
					});
		   
			});
	
        return Promise.all(promises);;
});



