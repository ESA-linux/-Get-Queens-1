UPM.require(
    [
        'jquery',
        'UpmDialog',
        'DeveloperNewsletterDialogTemplate',
        'DeveloperNewsletterResultDialogTemplate'
    ], function($,
                UpmDialog,
                DeveloperNewsletterDialogTemplate,
                DeveloperNewsletterResultDialogTemplate) {

    function showNewsletterSignUpDialog() {
        new UpmDialog({ template: DeveloperNewsletterDialogTemplate })
            .getResult()
            .done(function(params) {
                signUpForNewsletter(params['newsletter-email']);
            });
    }

    function signUpForNewsletter(email) {
        function showResult(success) {
            new UpmDialog({ template: DeveloperNewsletterResultDialogTemplate, data: { success: success } });
        }
        if (email && email.trim()) {
            $.ajax({
                url: 'https://hamlet.atlassian.com/1.0/public/email/' + email + '/subscribe?mailingListId=1243499',
                type: 'post',
                success: function() {
                    showResult(true);
                },
                error: function(e) {
                    showResult(false);
                }
            });
        }
    }

    $(function() {
        $('.developer-newsletter').click(showNewsletterSignUpDialog);
    });
});
