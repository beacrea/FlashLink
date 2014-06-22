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

// Runs when the viewer has authenticated
function onLinkedInAuth(par) {
    console.log(par);
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
                "<p class='member' card='" + i + "'>" +
                "<img class='member_profilePic' src='" + cleanConnections[i].photo + "'>" +
                "<span class='member_firstName'>" + cleanConnections[i].firstName + "</span> " +
                "<span class='member_lastName'>" + cleanConnections[i].lastName+ "</span> " +
                "</p>"
        );

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
        IN.User.authorize(onLinkedInAuth);
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

var score_correct = 0;
var score_incorrect = 0;

function chooseCard() {
    $('.card').click(function() {
        if ($(this).hasClass('card-chosen') ) {
            $(this)
                .siblings()
                .css('opacity', '100');
            $(this).css('opacity', '100');
        } else {
            $(this)
                .siblings()
                .css("opacity", "0.5")
                .removeClass('card-chosen')
                .addClass('card-default');
        }
        $(this).toggleClass('card-chosen', 'card-default');
    });
}

function compareMatch() {
    $('.btn-match').click(function() {
        var col_lt = $('.col-lt .card-chosen');
        var col_cntr = $('.col-cntr .card-chosen');
        if (col_lt.attr('data-cardID') === col_cntr.attr('data-cardID')) {
            updateScore('correct');
            alert('Match Found!');
            removeCard(col_lt);
            removeCard(col_cntr);
            $('.card').css('opacity', 100);
        } else {
            updateScore('incorrect');
            alert('Not A Match.');
        }
        checkWinStatus();
    });
}

function updateScore(status) {
    var score_correct_el = $('.col_wins .score_count');
    var score_incorrect_el = $('.col_losses .score_count');
    if (status === 'correct') {
        score_correct++;
        score_correct_el.html(score_correct);
    } else if (status === 'incorrect') {
        score_incorrect++;
        score_incorrect_el.html(score_incorrect);
    }
}

function removeCard(el) {
    // TODO Find out why the animation doesn't work.
    el.slideUp('slow', function(){
        el.remove();
    });
}

function checkWinStatus() {
    if (score_correct > 14) {
        alert('You win!');
    }
    if (score_incorrect > 4) {
        alert('You lose!');
    }
}