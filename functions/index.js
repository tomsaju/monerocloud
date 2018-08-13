const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var batch = admin.firestore().batch();

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
	    var reference =   admin.firestore().collection('pending_reg_users').doc(user.user_phone)
	    
	    batch.set(reference,user);
	});
	
	
	
/*	var loanType = loanInfo.loanType;
	var loanAmt = loanInfo.loanAmt;
	var recUserId = loanInfo.userId;
        console.log(`loan amout ${loanAmt}`);
        console.log(`user id ${recUserId}`);

	var loansRef = admin.firestore().collection('loans')

	var loanReqCount;
	loansRef.where('userId', '==', recUserId).get()
    		.then(snapshot => {
		  loanReqCount = snapshot.size;
		  console.log(`no of loan requests ${snapshot.size}`);
    	})
    	.catch(err => {
           console.log('Error getting total request loans', err);
       });

	var statusVal;
	if (loanReqCount > 6){
	  statusVal = 'Loan is rejected due to limit on no of loans';
	}else if(loanAmt < 100000 && loanReqCount < 3){
	   statusVal = 'Loan is accepted for further processing';
	}else if(loanAmt < 50000 && loanReqCount < 4){
	   statusVal = 'Loan is approved, loan office will contact you';
	}else if(loanAmt < 20000 && loanReqCount < 2 && loanType == 'auto'){
	   statusVal = 'Ready to issue disbursment check to auto retailer';
	}else{
	   statusVal = 'Contact loan office at your nearest branch';
	}
*/
        return batch.commit();
});



