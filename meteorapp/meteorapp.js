if (Meteor.isClient) {
  FB.init({
    appId: 237887209716147,
    status: true
  });

  Template.hello.greeting = function () {
    return "Welcome to meteorapp.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
