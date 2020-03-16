UPM.define('UpmRequireRestart',
    [
        'jquery',
        'brace',
        'UpmAjax',
        'UpmCommonUi',
        'UpmEnvironment',
        'UpmLongRunningTasks',
        'ChangesRequiringRestartTemplate'
    ],
    function($,
             Brace,
             UpmAjax,
             UpmCommonUi,
             UpmEnvironment,
             UpmLongRunningTasks,
             ChangesRequiringRestartTemplate) {

    var changesRequiringRestart = new Brace.Collection();

    /**
     * UI and Ajax logic to manage the "changes requiring restart" state.
     */
    var UpmRequireRestart = {
        /**
         * Adds an item to the list of changes that require a product restart
         * @method addChangeRequiringRestart
         * @param {Object} change Object containing details of the specified change
         */
        addChangeRequiringRestart: function(change) {
            var existingChange;

            // If an element already exists for this plugin, we want to replace it
            existingChange = changesRequiringRestart.findWhere({ key: change.key });
            if (existingChange) {
                existingChange.set(change);
            } else {
                changesRequiringRestart.add(change);
            }
        },

        checkForChangesRequiringRestart: function() {
            $.ajax({
                url: UpmEnvironment.getResourceUrl('changes-requiring-restart'),
                type: 'get',
                cache: false,
                dataType: 'json',
                success: function(response) {
                    changesRequiringRestart.reset(response.changes);
                },
                error: function(request) {
                    UpmAjax.signalAjaxError(request);
                }
            });
        }
    };

    function buildChangesElement() {
        // TODO: may want to make this into a Backbone view
        var $el = $(ChangesRequiringRestartTemplate({ changes: changesRequiringRestart.toJSON() })),
            $list = $el.find('#upm-requires-restart-list'),
            $toggleLink = $el.find('#upm-requires-restart-show');

        $el.on('click', 'a.upm-requires-restart-cancel', function(e) {
            var $item = $(e.target).closest('li'),
                key = $(e.target).closest('li').attr('data-key'),
                model = changesRequiringRestart.findWhere({ key: key });

            e.preventDefault();
            e.target.blur();
            if (model) {
                cancelActionRequiringRestart(model, $item.attr('data-cancel-message'));
            }
        });

        $toggleLink.click(function(e) {
            e.preventDefault();
            e.target.blur();
            $list.toggleClass('hidden');
            $toggleLink.text($list.hasClass('hidden') ? $toggleLink.attr('data-show-label') : $toggleLink.attr('data-hide-label'));
        });

        return $el;
    }

    function cancelActionRequiringRestart(model, successMessage) {
        if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
            $.ajax({
                type: 'DELETE',
                url: model.get('links').self,
                contentType: UpmEnvironment.getContentType('requires-restart'),
                success: function(response) {
                    UpmCommonUi.showMessage({ type: 'info', message: successMessage });
                    changesRequiringRestart.remove(model);
                },
                error: function(request) {
                    // UPM-986 Lets update the changes since there was some error with what was there.
                    UpmRequireRestart.checkForChangesRequiringRestart();
                    UpmAjax.signalAjaxError(request);
                }
            });
        }
    }

    function showChangesRequiringRestart() {
        var $existingMessage = $('#upm-messages .changes-requiring-restart');
        if (changesRequiringRestart.length) {
            $('#upm-container').addClass('requires-restart');
            if ($existingMessage.length) {
                $existingMessage.replaceWith(buildChangesElement());
            } else {
                $('#upm-messages').append(buildChangesElement());
            }
        } else {
            $('#upm-container').removeClass('requires-restart');
            $existingMessage.remove();
        }
    }

    changesRequiringRestart.on('add change remove reset', showChangesRequiringRestart);

    return UpmRequireRestart;
});
