
import { Template } from 'meteor/templating';

import { Compliments } from '../api/compliments.js';

 
import './body.html';
Meteor.startup(function() {
  process.env.MAIL_URL="smtp://postmaster%40sandbox67b14d8333444a3a99adf66e857264f7.mailgun.org:182452a9613fea1e3dd8c4350d545b5f@smtp.mailgun.org:587";
})



/*Template.body.helpers({
  compliments() {
  	return Compliments.find({});
  },
});*/



Template.home.events({
  'submit .new-compliment': function(event) {
    console.log("submitted");
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const email = target.email.value;
    const compliment = target.compliment.value;
 	
 	Meteor.call('compliments.insert', compliment, email);


 
    // Clear form
    target.email.value = '';
    target.compliment.value = '';
  },
});