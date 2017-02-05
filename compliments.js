var rp = require('request-promise');
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
export const Compliments = new Mongo.Collection('compliments');

Meteor.methods({
	'compliments.insert' : function(compliment, phonenumber){

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
		
		//Fiber(function(){

			if (Meteor.isServer) {
			rp(options)
		    	.then(Meteor.bindEnvironment(function (parsedBody) {
		        	// POST succeeded... 
		       	 	console.log('succeeded')
		        	var score = parsedBody.documents[0].score;
		        	if (score < 0.5) {
		        		console.log('input was too mean');
		        	} else {
		      			Compliments.insert({
							compliment, 
							phonenumber,
							createdAt: new Date(),

						});	

		      			console.log('added to compliments');
		    		}	
				}))
				.catch(function (err) {
		        	console.log(err)
		    	})
		}
	}
});