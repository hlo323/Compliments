
import { Template } from 'meteor/templating';

import { Compliments } from '../api/compliments.js';

 
import './body.html';
 
/*Template.body.helpers({
  compliments() {
  	return Compliments.find({});
  },
});*/



Template.body.events({
  'submit .new-compliment': function(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const phonenumber = target.phonenumber.value;
    const compliment = target.compliment.value;
 	
 	Meteor.call('compliments.insert', compliment, phonenumber);
 
    // Clear form
    target.phonenumber.value = '';
    target.compliment.value = '';
  },
});