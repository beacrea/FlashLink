/*
 *
 *  FlashLink Interactions
 *  Original Author: Coty Beasley
 *  Twitter: @beacrea
 *
 */

'use strict';

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
    $('.btn_login, .wrapper-auth').hide();
    initSplashAni();
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
                /*
                THESE ARE FOR TESTING
                "<p class='member' card='" + i + "'>" +
                "<img class='member_profilePic' src='" + cleanConnections[i].photo + "'>" +
                "<span class='member_firstName'>" + cleanConnections[i].firstName + "</span> " +
                "<span class='member_lastName'>" + cleanConnections[i].lastName+ "</span> " +
                "</p>");
                */
    }
    animateConnections();
}

function animateConnections() {
    $(document).ready(function() {
        endSplashAni();
        $('.view-test').css("background", "none");
        $('body, html').css("background", "#8FC6E1");
        $("[card]").each(function (i) {
            // store the item around for use in the 'timeout' function
            var $item = $(this);
            // execute this function sometime later:
            setTimeout(function() {
                $item.animate({"opacity": 100}, 10000);
                $item.css({"background": "rgba(240,240,240,0.9)"}, 10000);
            }, 250*i);
            // each element should animate half a second after the last one.
        });
    });
}





/* - - - - - - - - - - - - - - - - * // * - - - - - - - - - - - - - - - - -  */





/* ==========================================================================
 COMMON APP

 These are interactions that are commonly found in the app.
 ========================================================================== */

// Loader Animation
var loader = $('.loader, .loader:after');
function initSplashAni() {
    loader.show();
}
function endSplashAni() {
    loader.hide();
}

function initLogIn() {
    $('.btn_login').click(function() {
        IN.User.authorize(function(){
            onLinkedInAuth();
        });
    });
}





/* - - - - - - - - - - - - - - - - * // * - - - - - - - - - - - - - - - - -  */





/* ==========================================================================
 VIEW SPECIFICS

 These are functions and interactions for various views.
 ========================================================================== */

/* --------------------------------------------------------------------------
 Gameplay
 -------------------------------------------------------------------------- */

function chooseCard() {
    $('.card').click(function() {
        $(this).siblings().css("opacity", "0.5").removeClass('card-chosen').addClass('card-default');
        $(this).toggleClass('card-chosen', 'card-default');
    });
}

function compareMatch() {
    // TODO Finish The Comparison Engine
    $('.btn-match').click(function() {
        var col_lt = $('.col-lt .card-chosen');
        var col_rt = $('.col-cntr .card-chosen');
    });
}