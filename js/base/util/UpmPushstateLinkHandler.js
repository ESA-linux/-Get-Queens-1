/**
 * This is responsible for handling clicks to elements with the class "push-state".
 *
 * If the browser supports pushState, then we get the href attribute and
 * navigate to it using pushState. This generic listener reduces the need
 * for specific click handlers throughout the application.
 */
UPM.require(["jquery", "backbone"], function($, Backbone) {

    $(document).on("click", "a.push-state", function(e) {
        if (e.isDefaultPrevented()) {
            return;
        }
        e.preventDefault();
        var href = $(e.target).closest("a.push-state").attr("href");
        var root = Backbone.history.options.root;
        var fragment = href.substr(href.indexOf(root) + root.length);
        Backbone.history.navigate(fragment, {
            trigger: true,
            replace: false
        });
    });
});