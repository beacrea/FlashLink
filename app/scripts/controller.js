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
    $('.btn').click(function() {
        var target = $(this).attr('rel');
        var view = 'views/' + target + '.html';
        appContainer.hide().load(view, function() {
            changeView();
            // Specific Views
            if (target === 'gameplay') {
                appContainer.delay(600).fadeOut(300, function(){
                    $(this).load('views/gameplay.html', function() {
                        changeView();
                    }).fadeIn(300);
                });
            } else if (target === 'test') {
                initSplashAni();
                changeView();
            }
        }).fadeIn(800);
    });
}

// Initial View Load
function initialView(fadeTime) {
    appContainer.load('views/test.html', function() {
        initSplashAni();
        changeView();
    }).fadeIn(fadeTime);
}
initialView(1000);
