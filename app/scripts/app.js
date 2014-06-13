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
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/testApi.html',
        controller: 'MainCtrl'
      })
      .when('/load', {
        templateUrl: 'views/loading.html',
        controller: 'MainCtrl'
      })
     .when('/test', {
        templateUrl: 'views/testApi.html',
        controller: 'MainCtrl'
     })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
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
    var members = connections.values;

    profileDiv.html("<p>Displaying " + start + "-" + range + " of " + connections._total + " connections.</p>");

    for (var member in members) {
        var member_firstName = members[member].firstName;
        var member_lastName = members[member].lastName;
        var member_avatar = members[member].pictureUrl;
        var member_industry = members[member].industry;

        // Only Prints Clean Users
        if (checkValidName(member_firstName) === true && checkValidName(member_lastName) && member_avatar !== undefined) {
            profileDiv.append(
                "<p class='member'>" +
                "<img class='member_profilePic' src='" + member_avatar + "'>" +
                "<span class='member_firstName'>" + member_firstName + "</span> " +
                "<span class='member_lastName'>" + member_lastName+ "</span> " +
                //"<span class='member_industry'>works in the " + member_industry + " industry.</span>" +
                "</p>");
        }

    }
}





/* - - - - - - - - - - - - - - - - * // * - - - - - - - - - - - - - - - - -  */
