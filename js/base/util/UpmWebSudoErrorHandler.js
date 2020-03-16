UPM.require(["jquery"], function($) {

    $(document).ajaxError(reloadIfUnauthorised);

    /**
     * If an ajax request responds with a 401, or with the error string that indicates a WebSudo error, reload the page.
     *
     * This can most likely be handled better but it replicates existing behaviour for now.
     *
     * @param event
     * @param response The response in error
     */
    function reloadIfUnauthorised(event, request) {
        var response, subCode;
        if (request.status === 401) {
            window.location.reload();
        }
        try {
            response = request.responseText ? JSON.parse(request.responseText) : {};
            subCode = response.subCode;
            if (subcode === "upm.websudo.error") {
                window.location.reload(true);
            }
        } catch (e) {
        }
    }
});
