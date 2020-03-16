UPM.define('TaskProgressModel',
    [
        'brace'
    ],
    function(Brace) {

    // Model used by TaskProgressDialog.

    return Brace.Model.extend({
        namedAttributes: [
            'progressPercent',
            'showProgressBar',
            'startedTime',
            'statusProperties'
        ]
    });
});
