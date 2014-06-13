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

// Runs when the viewer has authenticated
function onLinkedInAuth() {
    IN.API.Connections("me")
        // Initial Load for Total Connection Info
        .params({"start": 0, "count": 1})
        .result(randomizeRange);
    console.log('Getting total connections...');
}

/* --------------------------------------------------------------------------
 Calculate Total Connections, Randomize
 -------------------------------------------------------------------------- */

function randomizeRange(connections) {
    // Processes If User Has More Than 100 Connections
    if (connections._total > 100) {
        console.log('User successfully has over 100 connections.');
        var randomMax = Math.floor((Math.random() * connections._total) + 100);
        console.log('Choosing random range of 100...');
        console.log('The range chosen was ' + (randomMax - 100) + ' - ' + randomMax + '.');
        getConnectionData(randomMax);
        console.log('Fetching the chosen range of connections...');
    }
    console.log('User does not have more than 100. Aborted.');
}

/* --------------------------------------------------------------------------
 Get Connection Data
 -------------------------------------------------------------------------- */

function getConnectionData(total) {
    var start = total - 100;
    IN.API.Connections("me")
        .fields("firstName", "lastName", "pictureUrl", "industry")
        .params({"start": start, "count": 100})
        .result(setConnections);
    console.log('Successfully retrieved connection info.');
    console.log('Dumping users with invalid characters...');
}


/* --------------------------------------------------------------------------
 Data Cleaning
 -------------------------------------------------------------------------- */

function checkValidName(name) {
    var invalidChars = ['(', ')', ',', 'private', 'Private', '@', '.'];
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
 Display Connections
 -------------------------------------------------------------------------- */

function setConnections(connections) {
    var profileDiv = $("#connections");
    var start = connections._start;
    var range = connections._start + connections._count;
    var members = connections.values;

    console.log('Rendering remaining users...');

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
