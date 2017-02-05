var rp = require('request-promise');
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';
 
export const Compliments = new Mongo.Collection('compliments');
/*
export accountSid = "AC94124af3dfbadc03373c50bbf4f6d54c";
export authToken = "ed97f939e1a1b431390b5e45c0aa9d37";
export twilionumber = "+14159407385";*/

Meteor.methods({
	'compliments.insert' : function(compliment, email){
        check(compliment, String);
        check(email, String);

		var input = {
		 	"documents": [
		 		{
		 			"language": "en",
		 			"id": "1",
		 			"text": compliment
		 		}
		 	]
		 }

		 var options = {
		    method: 'POST',
		    uri: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
		    body: input,
		    headers: {
				'Ocp-Apim-Subscription-Key': '4bd8eb2d6293439ebeec3e6b4f438342',
		 		'Content-Type': 'application/json',
		 		'Accept': 'application/json'
		    },
		    json: true // Automatically stringifies the body to JSON 
		};

			if (Meteor.isServer) {
			rp(options)
		    	.then(Meteor.bindEnvironment(function (parsedBody) {
		        	// POST succeeded... 
		       	 	console.log('succeeded')
		        	var score = parsedBody.documents[0].score;
		        	if (score < 0.7) {
		        		console.log('input was too mean');
		        	} else {
		      			Compliments.insert({
							compliment, 
							email,
							createdAt: new Date(),

						});	
                          Meteor.call('sendEmail',
                        email,
                        'pawsitivity@gmail.com',
                        'Compliment!',
                        compliment + "\n\nSent by Paw-sitivity");

		      			console.log('added to compliments');
		    		}	
				}))
				.catch(function (err) {
		        	console.log(err)
		    	})
		}
	},

    // In your server code: define a method that the client can call
    'sendEmail': function (to, from, subject, text) {
            check([to, from, subject, text], [String]);
            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();
            Email.send({
              to: to,
              from: from,
              subject: subject,
              text: text
            });
          }

	/*sendMessage: function (outgoingMessage) {

    var cur = Compliments.find({});
    cur.forEach(function (post){
    	HTTP.call(
            "POST",
            'https://api.twilio.com/2010-04-01/Accounts/' + 
            process.env.TWILIO_ACCOUNT_SID + '/SMS/Messages.json', {
                params: {
                    From: process.env.TWILIO_NUMBER,
                    To: post.phonenumber,
                    Body: post.compliment
                },
                // Set your credentials as environment variables 
                // so that they are not loaded on the client
                auth:
                    process.env.TWILIO_ACCOUNT_SID + ':' +
                    process.env.TWILIO_AUTH_TOKEN
            },
            // Print error or success to console
            function (error) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('SMS sent successfully.');
                }
            }
        );
    });
	} */
    /*uniquePhoneBook.forEach(function (number) {
        HTTP.call(
            "POST",
            'https://api.twilio.com/2010-04-01/Accounts/' + 
            process.env.TWILIO_ACCOUNT_SID + '/SMS/Messages.json', {
                params: {
                    From: process.env.TWILIO_NUMBER,
                    To: number,
                    Body: outgoingMessage
                },
                // Set your credentials as environment variables 
                // so that they are not loaded on the client
                auth:
                    process.env.TWILIO_ACCOUNT_SID + ':' +
                    process.env.TWILIO_AUTH_TOKEN
            },
            // Print error or success to console
            function (error) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('SMS sent successfully.');
                }
            }
        );*/
    

});