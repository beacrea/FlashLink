/*
 *
 *  FlashLink Interactions
 *  Original Author: Coty Beasley
 *  Twitter: @beacrea
 *
 */






'use strict';

/* ==========================================================================
 ANGULAR STUFF

 Self explanatory, amirite?
 ========================================================================== */

angular.module('flashlinkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/testAPI.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });





/* - - - - - - - - - - - - - - - - * // * - - - - - - - - - - - - - - - - -  */





/* ==========================================================================
 LINKEDIN API

 These are related to interacting with Linkedin.
 ========================================================================== */


/* --------------------------------------------------------------------------
 Authentication
 -------------------------------------------------------------------------- */

// Runs when the JavaScript framework is loaded
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

// 2. Runs when the viewer has authenticated
function onLinkedInAuth() {
    IN.API.Connections("me")
        .fields("firstName", "lastName", "pictureUrl", "industry")
        .params({"start": 0, "count": 50}) // start begins at 0
        .result(setConnections);
}


/* --------------------------------------------------------------------------
 Data Cleaning
 -------------------------------------------------------------------------- */

function checkValidName(name) {
    var invalidChars = ['(', ')', ',', 'private', 'Private', '@', '.com'];
    for (var i=0; i < invalidChars.length; i++) {

        // Checks if any invalid characters are found
        if (name.indexOf(invalidChars[i]) > -1){
            return false;
        }
    }
    // Returns true value for no errors found
    return true;
}


/* --------------------------------------------------------------------------
 Print Connections
 -------------------------------------------------------------------------- */

function setConnections(connections) {
    var profileDiv = $("#connections");

    var start = connections._start;
    var range = connections._start + connections._count;
    profileDiv.html("<p>Displaying " + start + "-" + range + " of " + connections._total + " connections.</p>");

    var members = connections.values;
    for (var member in members) {
        var firstName = members[member].firstName;
        var lastName = members[member].lastName;
        var avatar = members[member].pictureUrl;

        // Only Prints Clean Users
        if (checkValidName(firstName) === true && checkValidName(lastName) && avatar !== undefined) {
            profileDiv.append(
                "<p class='member'>" +
                "<img class='member_profilePic' src='" + members[member].pictureUrl + "'>" +
                "<span class='member_firstName'>" + members[member].firstName + "</span> " +
                "<span class='member_lastName'>" + members[member].lastName+ "</span> " +
                "<span class='member_industry'>works in the " + members[member].industry + " industry.</span>" +
                "</p>");
        }

    }
}





/* - - - - - - - - - - - - - - - - * // * - - - - - - - - - - - - - - - - -  */
