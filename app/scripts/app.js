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
        // Quick call to get back total connection count
        .params({"start": 0, "count": 1})
        .result(randomizeRange);
}

/* --------------------------------------------------------------------------
 Calculate Total Connections, Randomize
 -------------------------------------------------------------------------- */

function randomizeRange(connections) {
    // Processes if user has more than 50 connections
    if (connections._total > 50) {
        // Selects random range of 50 connections
        var randomMax = Math.floor((Math.random() * connections._total) + 50);
        // Get connection data
        getConnectionData(randomMax);
    } else {
        console.log('User has less than 50 connections. Aborting');
    }
}

/* --------------------------------------------------------------------------
 Get Connection Data
 -------------------------------------------------------------------------- */

function getConnectionData(total) {
    var start = total - 50;
    IN.API.Connections("me")
        .fields("firstName", "lastName", "pictureUrl", "industry")
        .params({"start": start, "count": 50})
        // Sends connections for cleaning and rendering
        .result(setConnections);
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

var cleanConnections = [];

function setConnections(connections) {
    var profileDiv = $("#connections");
    var members = connections.values;

    for (var member in members) {
        var member_firstName = members[member].firstName;
        var member_lastName = members[member].lastName;
        var member_avatar = members[member].pictureUrl;
        var member_industry = members[member].industry;

        // Dumps users with illegal characters and puts them in an object
        if (checkValidName(member_firstName) === true && checkValidName(member_lastName) && member_avatar !== undefined) {
            cleanConnections.push({
                photo: member_avatar,
                firstName: member_firstName,
                lastName: member_lastName,
                fullName: member_firstName + ' ' + member_lastName,
                industry: member_industry
            });
        }
    }

    // Renders the first 15 users from the clean pool of connections
    for (var i=0; i < 15; i++) {
        profileDiv.append(
                "<p class='member' card='" + i + "'>" +
                "<img class='member_profilePic' src='" + cleanConnections[i].photo + "'>" +
                "<span class='member_firstName'>" + cleanConnections[i].firstName + "</span> " +
                "<span class='member_lastName'>" + cleanConnections[i].lastName+ "</span> " +
                "</p>");
    }
    animateConnections();
}

function animateConnections() {
    $(document).ready(function() {
        $("[card]").each(function (i) {
            // store the item around for use in the 'timeout' function
            var $item = $(this);
            // execute this function sometime later:
            setTimeout(function() {
                $item.animate({"opacity": 100}, 10000);
                $item.css({"background": "#eee"}, 10000);
            }, 100*i);
            // each element should animate half a second after the last one.
        });
    });
}





/* - - - - - - - - - - - - - - - - * // * - - - - - - - - - - - - - - - - -  */
