/*
 *
 *  FlashLink Controller
 *  Original Author: Coty Beasley
 *  Twitter: @beacrea
 *
 */

/* ==========================================================================
 $_VIEW CONTROLLER ----------------------------------------------------------
 ========================================================================== */

// Set Application Wrapper
var appContainer = $('.appContainer');

/* --------------------------------------------------------------------------
 View Router
 -------------------------------------------------------------------------- */

// Changes View Based on Button Rel Attribute
function changeView() {
    $('.btn_nav').click(function() {
        var target = $(this).attr('rel');
        var view = 'views/' + target + '.html';
        // Specific Views
        if (target === 'gameplay') {
            appContainer.fadeOut(300, function(){
                $(this).load('views/gameplay.html', callback_gameplay).fadeIn(300);
            });
        } else if (target === 'test') {
            appContainer.hide(function(){
                $(this).load('views/test.html', callback_test).fadeIn(300);
            });
        } else {
            appContainer.hide().load(view, changeView).fadeIn(800);
        }
    });
}


// View Callbacks
function callback_gameplay() {
    initLogIn();
    changeView();
    chooseCard();
    compareMatch();
    checkWinStatus();
    updateScore();
}

function callback_test() {
    initLogIn();
    changeView();
}

// Initial View Load
function initialView(fadeTime) {
    appContainer.load('views/start.html', function() {
        changeView();
    }).fadeIn(fadeTime);
}
initialView(1000);