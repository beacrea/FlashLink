/* ==========================================================================
 $_VIEW CONTROLLER ----------------------------------------------------------
 ========================================================================== */

// Set Application Wrapper
var appContainer = $('.appContainer');

// Changes View Based on Button Rel Attribute
function changeView() {
    $('.btn').click(function() {
        var target = $(this).attr('rel');
        var view = './views/' + target + '.html';
        appContainer.hide().load(view, function() {
            changeView();
            // TODO For Demo Purposes Only, Remove for PROD
            if (target === 'accessLoad') {
                appContainer.delay(600).fadeOut(300, function(){
                    $(this).load('./views/main.html', function() {
                        changeView();
                    }).fadeIn(300);
                    getUserInfo();
                });
            }
        }).fadeIn(800);
    });
}

// Initial View Load
function initialView(fadeTime) {
    appContainer.load('views/gameplay.html', function() {
        changeView();
    }).fadeIn(fadeTime);
}
initialView(1000);
