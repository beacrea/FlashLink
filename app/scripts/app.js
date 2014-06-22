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
        .fields("firstName", "lastName", "pictureUrl", "industry", "id")
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
    cleanConnections = _.chain(connections.values)
                        .filter(validFirstAndLast)
                        .first(15)
                        .map(addPhotoAndFullName)
                        .value();

    function validFirstAndLast(member){
        return member.pictureUrl && checkValidName(member.firstName) && checkValidName(member.lastName);
    }

    function addPhotoAndFullName(member){
        member.photo = member.pictureUrl;
        member.fullName = member.firstName + ' ' + member.lastName;
        return member;
    }

    renderConnections();
}

Array.prototype.shuffle = function(){
  return this.sort(function(){ return .5 - Math.random() });
};

function renderConnections() {
    var profilePhotoDiv = $(".col-lt");
    var profileNameDiv = $(".col-cntr");
    var photoHtml = $('#card_profilePic').html();
    var photoTmp = _.template(photoHtml);
    var photoCards = _.map(cleanConnections, photoTmp).shuffle().join('');
    var nameHtml = $('#card_profileName').html();
    var nameTmp = _.template(nameHtml);
    var nameCards = _.map(cleanConnections, nameTmp).join('');

    $(profilePhotoDiv).append(photoCards);
    $(profileNameDiv).append(nameCards);


    animateGameInit();
    $('.view-game, .btn_match').fadeIn();
}

function animateConnections() {
    $(function(){
        endSplashAni();
        $('.view-test').css("background", "none");
        $('body, html').css("background", "#8FC6E1");
        $("[card]").each(function (i) {
            // store the item around for use in the 'timeout' function
            var $item = $(this);
            // execute this function sometime later:
            setTimeout(function() {
                $item.animate({"opacity": 100}, 10000);
                $item.css("background", "rgba(240,240,240,0.9)");
            }, 250*i);
            // each element should animate half a second after the last one.
        });
    });
}

function animateGameInit() {
    $(function(){
        endSplashAni();
        $('.view-auth').remove();
        $("[card]").each(function (i) {
            // store the item around for use in the 'timeout' function
            var $item = $(this);
            // execute this function sometime later:
            setTimeout(function() {
                $item.animate({"opacity": 100}, 10000);
                $item.css("background", "rgba(240,240,240,0.9)");
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

$(document).on('click', '.card', function() {
    console.log('card clicked');
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

function compareMatch() {
    $('.btn_match').click(function() {
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