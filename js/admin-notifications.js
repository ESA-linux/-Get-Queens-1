var upm = upm || {};

(function() {
    var notifications,
        upmContentType = 'application/vnd.atl.plugins+json',
        notificationsContainer,
        minMsBeforeFadeIn = 1000,
        hasOperationMenu = false,
        hasActionButtons = false,
        hasAdminPageHeadings = false,
        hasProjectConfigHeading = false;

        // These vars are populated by NotificationWebResourceTransformer when this web resource is loaded
        upm.productId;
        upm.pluginNotificationsTitle;
        upm.noNotificationsText;
        upm.rootNotificationsUrl;
        upm.notificationsUrl;
        upm.analyticsUrl;
        upm.onDemand;

        // Save some info about our product for other upm files to use
        upm.isJira = (upm.productId == 'jira');
        upm.isBamboo = (upm.productId == 'bamboo');
        upm.isConfluence = (upm.productId == 'confluence');
        upm.isFecru = (upm.productId == 'fisheye' || upm.productId == 'crucible');
        upm.isStash = (upm.productId == 'stash');
        upm.isBitbucket = (upm.productId == 'bitbucket');

    /**
     * Dismisses all plugin notifications that have a "post-notifications" link - except if the
     * dismissOnClick flag is set, since those must be dismissed explicitly by the user.
     *
     * This does not yet visually "dismiss" them as that happens upon dropdown focus out.
     *
     * @method dismissAll
     */
    function dismissAll() {
        var notificationElements, element;
        if (notificationsContainer.hasClass('new-notifications')) {
            notificationElements = AJS.$('div.upm-notification', '#upm-notifications');

            for (var i = 0, len = notificationElements.length; i < len; i++) {
                element = AJS.$(notificationElements[i]);

                //dismissOnClick can exist for individually-displayed notifications or notification groups
                if (!element.data('dismissOnClick') || (element.data('group') && !element.data('group').dismissOnClick)) {
                    dismiss(element, false);
                }
            }

            //handles notifications dismissal if the trigger is clicked again rather than losing focus.
            AJS.$('#upm-notifications-trigger').bind('click', visuallyDismissAll);
        }
    }

    /**
     * Dismisses the plugin notification or notification group associated with an element.
     * @method dismiss
     * @param {HTMLElement} notificationElement The element to dismiss
     * @param {Boolean} visualDismissal true if visual dismissal should happen upon successful dismissal
     */
    function dismiss(notificationElement, visualDismissal) {
        var itemToDismiss,
            postUrl;
        if (notificationElement.hasClass('upm-notification-new')) {
            // we may be dismissing an individual notification or a whole group
            itemToDismiss = notificationElement.data('notification') || notificationElement.data('group');
            itemToDismiss.dismissed = true;

            postUrl = itemToDismiss.links['post-notifications'];
            if (postUrl) {
                AJS.$.ajax({
                    type: 'POST',
                    url: postUrl,
                    dataType: 'json',
                    data: JSON.stringify(itemToDismiss),
                    contentType: upmContentType,
                    success: function() {
                        if (visualDismissal) {
                            visuallyDismiss(notificationElement);
                            updateNewNotificationCount();
                        } }
                });
            }
        }
    }

    /**
     * Visually dismisses all notifications which have been dismissed.
     * @method visuallyDismissAll
     */
    function visuallyDismissAll() {
        var notificationElements, element;
        if (notificationsContainer.hasClass('new-notifications')) {
            notificationElements = AJS.$('div.upm-notification', '#upm-notifications');

            for (var i = 0, len = notificationElements.length; i < len; i++) {
                element = AJS.$(notificationElements[i]);
                if ((!element.data('dismissed') || (element.data('group') && !element.data('group').dismissed)) && !element.data('dismissOnClick')) {
                    visuallyDismiss(element);
                }
            }

            updateNewNotificationCount();
        }
        
        AJS.$('#upm-notifications-trigger').unbind('click', visuallyDismissAll);
    }

    /**
     * Visually dismisses the plugin notification or notification group associated with an element.
     * @method visuallyDismiss
     * @param {HTMLElement} notificationElement The element to visually dismiss
     */
    function visuallyDismiss(notificationElement) {
        notificationElement.removeClass('upm-notification-new');
    }

    /**
     * Updates the new notification count, or removes it if no new notifications exist.
     * @method updateNewNotificationCount
     */
    function updateNewNotificationCount() {
        var updatedNewNotificationCount = AJS.$('.upm-notification-new', notificationsContainer).length;
        if (!updatedNewNotificationCount) {
            notificationsContainer.removeClass('new-notifications');
        } else {
            AJS.$('#upm-notifications-count', notificationsContainer).text(updatedNewNotificationCount);
        }
    }
    
    /**
     * Finds and returns an element to append notifications html to, based on the host application
     * @method getMessageContainer
     * @return {HTMLElement} Element to append notifications to, if any
     */
    function getMessageContainer() {
        var $container,
            $notificationContainer = AJS.$('#upm-notifications-container');

        // Ideally there will be a container provided by a web-item for each product/version.
        // This will not exist in existing (older) product versions, however,
        // where we will have to continue injecting notifications in the legacy locations.
        if ($notificationContainer.length) {
            $container = $notificationContainer.removeAttr('href');
        } else if (upm.isJira) {
            // UPM-1803 look for the return to project button, and put it next to the button if found
            if (($container = AJS.$('#proj-config-return-link')).length) {
                hasActionButtons = true;

            // Then try the operations menu page heading (like when viewing a project as admin, there will be action
            // links to avoid)
            } else if (($container = AJS.$('#project-config-header ul.operation-menu')).length) {
                hasOperationMenu = true;

            // or try project config header without action links
            } else if (($container = AJS.$('#project-config-header')).length) {
                hasProjectConfigHeading = true;

            // Or just use the normal page heading
            } else if (($container = AJS.$('#admin-page-heading').parent()).length) {
                hasAdminPageHeadings = true;

            // If the title is gone for some reason, put it in the upm container
            } else {
                $container = AJS.$('#upm-container').find('h2:first');
            }
        } else if (upm.isConfluence) {
            // confluence has a page for just such an occasion, so only show the banner there and on the upm page
            if (window.location.href.indexOf('console.action') != -1
                    || window.location.href.indexOf('editconsolemessages.action') != -1
                    || upm.isUpm) {
                // Conf 4.3 has new layout, uses divs instead of tables
                var $adminArea = AJS.$('#admin-content');
                if (!$adminArea.length) {
                    $adminArea = AJS.$('td.pagebody');
                }
                $container = AJS.$('<div></div>').prependTo($adminArea);
            }
        } else if (upm.isBamboo) {
            if (upm.isUpm) {
                // to the right of the UPM page title
                $container = AJS.$('#upm-title');
            }
        } else if (upm.isFecru) {
            $container = AJS.$('#header-admin');
        } else if (upm.isStash || upm.isBitbucket) {
            $container = AJS.$('#content > .aui-tabs > .tabs-menu');
        }

        return $container;
    }

    /**
     * Creates and returns an element containing the notification text
     * @method buildNotificationMessage
     * @param {String} message Message text
     * @param {String} target (optional) Url to link off to
     * @param {Integer} count the count of notifications represented in this message
     * @return {HTMLElement} Notification message html
     */
    function buildNotificationMessage(message, target) {
        var span = AJS.$('<span class="upm-notification-text"></span>'),
            anchor;
        if (!target) {
            span.text(message);
        } else {
            span.html(message);
            span.find('a').attr('href', target);
        }
        return span;
    }

    /**
     * Creates and returns an element containing the notification count
     * @method buildNotificationsTrigger
     * @param {Number} count Number of displayed notifications
     * @return {HTMLElement} Notification count element
     */
    function buildNotificationsTrigger(count) {
        var trigger = AJS.$('<a id="upm-notifications-trigger" class="aui-dd-trigger" href="#"><span id="upm-notifications-icon"></span></a>')
                        .attr('title', upm.pluginNotificationsTitle);

        trigger.bind('click', dismissAll);
        trigger.bind('click', logBadgeClick);
        trigger.bind('focusout', visuallyDismissAll);

        count = parseInt(count, 10);
        if (count === NaN) {
            count = 0;
        }

        AJS.$('<span id="upm-notifications-count"></span>')
            .text(count)
            .appendTo(trigger);

        return trigger;
    }

    /**
     * Creates and returns a list of elements representing a notification group. The group is
     * represented by a single element unless it has the displayIndividually flag, in which
     * case there is one element per notification in the group.
     * @method buildNotificationElements
     * @param {Object} notificationGroup Details of the notification group
     * @return {Array} List of notification elements
     */
    function buildNotificationGroupElements(notificationGroup) {
        var elements = [];

        if (notificationGroup.notifications.length === 1) {
            elements.push(buildNotificationElement(notificationGroup, notificationGroup.notifications[0]));
        } else {
            if (notificationGroup.displayIndividually) {
                for (var i = 0; i < notificationGroup.notifications.length; i++) {
                    elements.push(buildNotificationElement(notificationGroup, notificationGroup.notifications[i]));
                }
            } else {
                elements.push(buildGroupElement(notificationGroup));
            }
        }
        return elements;
    }

    /**
     * Creates and returns an element representing a single notification.
     * @param {Object} group Details of the notification group
     * @param {Object} notification Details of the notification
     * @returns {HTMLElement} The notification element
     */
    function buildNotificationElement(group, notification) {
        var plugin = notification.plugin,
            iconImage;
        
        if (plugin.links && plugin.links['plugin-icon']) {
            iconImage = AJS.$('<img src="" alt="">')
                .attr('src', plugin.links['plugin-icon'])
                .attr('title', plugin.name);
        }
        return buildNotificationOrGroupElement(notification, group.dismissOnClick, iconImage)
            .data('notification', notification);
    }
    
    /**
     * Creates and returns an element representing all notifications in a notification group.
     * @param {Object} group Details of the notification group
     * @returns {HTMLElement} The notification group element
     */
    function buildGroupElement(group) {
        var iconImage = AJS.$('<img src="" alt="">')
            .attr('src', group.links['default-icon']);
        
        return buildNotificationOrGroupElement(group, group.dismissOnClick, iconImage)
            .data('group', group);
    }
    
    /**
     * Creates and returns an element representing a notification or notification group.  This code
     * is shared because the notification and notification representations have mostly the same
     * properties.
     * @param {Object} notificationOrGroup Details of the notification or notification group
     * @param {boolean} dismissOnClick True if clicking on this element dismisses it
     * @param {HTMLElement} iconImage The icon <img> element, if any
     * @returns {HTMLElement} The notification or notification group element
     */
    function buildNotificationOrGroupElement(notificationOrGroup, dismissOnClick, iconImage)
    {
        var div = AJS.$('<div class="upm-notification"></div>')
                      .attr('id', 'upm-notification-type-' + notificationOrGroup.notificationType),
            icon = AJS.$('<span class="upm-notification-icon"></span>');
        if (iconImage) {
            icon.append(iconImage);
        } else {
            icon.addClass('empty');
        }
        div.append(icon)
            .append(buildNotificationMessage(notificationOrGroup.message,
                notificationOrGroup.links && notificationOrGroup.links.target));
        if (!notificationOrGroup.dismissed) {
            div.addClass('upm-notification-new');
        }
        if (dismissOnClick) {
            div.data('dismissOnClick', true);
            div.bind('click', function() { dismiss(AJS.$(this), true); });
        }
        return div;
    }
    
    /**
     * Creates and returns an element containing the title for the notifications
     * @method buildNotificationsHeader
     * @return {HTMLElement} Title element
     */
    function buildNotificationsHeader() {
        return AJS.$('<h3></h3>').text(upm.pluginNotificationsTitle);
    }

    /**
     * Creates and returns an element containing the text if there are no notifications available
     * @method buildNoNotificationsMessage
     * @return {HTMLElement} No notifications element
     */
    function buildNoNotificationsMessage() {
        return AJS.$('<p id="upm-no-notifications"></p>').text(upm.noNotificationsText);
    }

    /**
     * Creates and returns an element for containing the notifications
     * @method buildNotificationsContainer
     * @return {HTMLElement} Notifications
     */
    function buildNotificationsContainer() {
        notificationsContainer = AJS.$('<div id="upm-notifications" class="aui-dd-parent"></div>')
            .bind('refreshNotifications', refreshNotificationsDropdown)
            // Product / placement specific classes
            .toggleClass('upm-admin-headers', hasAdminPageHeadings)
            .toggleClass('upm-project-config', hasProjectConfigHeading)
            .toggleClass('upm-operations-headers', hasOperationMenu)
            .toggleClass('upm-action-buttons', hasActionButtons)
            .toggleClass('upm-h1', upm.productId == 'bamboo');
        return notificationsContainer;
    }

    /**
     * Refresh the contents of the notifications dropdown
     * @method refreshNotificationsDropdown
     */
    function refreshNotificationsDropdown() {
        AJS.$.ajax({
            url: upm.notificationsUrl,
            type: 'get',
            cache: false,
            dataType: 'json',
            contentType: upmContentType,
            success: function(response) {
                notifications = response;
                var groups = notifications && notifications.notificationGroups;

                // Populate the dropdown with the notifications
                populateNotificationsContainer(groups);
                notificationsContainer.removeClass('hidden').addClass('loaded');
            },
            error: function(request) {
                // We get a 401 if we are on demand and/or do not show notifications
                notificationsContainer.addClass('loaded');
            }
        });
    }

    /**
     * Temporary function to return the context path until
     * refactored to include UPM.require when we'll use UpmContextPathMixin
     */
    function _getUpmContextPath() {
        if (AJS && AJS.contextPath) {
            return AJS.contextPath();
        }

        if (window.contextPath) {
            return window.contextPath;
        }

        var path = window.location.pathname.split("/plugins/servlet/upm");
        if (path.length) {
            return path[0];
        }

        return "";
    }

    function logBadgeClick() {
        var url = window.location.pathname,
            contextPath = _getUpmContextPath();

        // strip the context path out of the URL such that we can more easily aggregate the source.
        // (and also because we don't need that bit of personal information).
        if (contextPath) {
            url = url.substr(contextPath.length);
        }

        logAnalytics('notification-badge-click', {url: url});
    }

    function logAnalytics(type, logData) {
        if (upm.analyticsUrl) {
            logData = logData || {};
            logData['type'] = type;

            // Don't bother handling any success or error responses since we wouldn't display them in the UI.
            AJS.$.ajax({
                type: 'POST',
                url: upm.analyticsUrl,
                dataType: 'json',
                contentType: upmContentType,
                data: JSON.stringify({data: logData})
            });
        }
    }

    /**
     * Populates the notificationsContainer element with notifications returned from the server
     * @method populateNotificationsContainer
     * @param {Object} notificationGroups Notifications details
     */
    function populateNotificationsContainer(notificationGroups) {
        var notificationsDropdown = AJS.$('#upm-notifications-dropdown'),
            notificationCount = 0;

        if (notificationGroups) {
            notificationCount = notificationGroups.length;
        }

        //clear notifications that were added on the previous refresh
        notificationsDropdown.find('div.upm-notification').remove();
        notificationsDropdown.find('#upm-no-notifications').remove();

        if (notificationCount) {
            for (var i = 0; i < notificationCount; i++) {
                var elements = buildNotificationGroupElements(notificationGroups[i]);
                for (var j = 0; j < elements.length; j++) {
                    notificationsDropdown.append(elements[j]);
                }
            }
            if (notificationsDropdown.find('.upm-notification-new').length) {
                notificationsContainer.addClass('new-notifications');
                updateNewNotificationCount();
            }
        } else {
            buildNoNotificationsMessage().appendTo(notificationsDropdown);
        }
        notificationsDropdown.appendTo(notificationsContainer);
        return notificationsContainer;
    }

    function init() {
        AJS.$(window).unbind('upmready', init);

        var container = getMessageContainer(),
            start = new Date().getTime(),
            notificationsDropdown = AJS.$('<div id="upm-notifications-dropdown" class="upm-notifications-dropdown aui-dropdown"></div>'),
            $built;

        // if the container element doesn't exist, we've got nowhere to put the notifications
        if (!container || !container.length) {
            return;
        }

        // Build the element to hold the dropdown

        $built = buildNotificationsContainer();

        // Stick before project config (only in jira)
        if (hasProjectConfigHeading) {
            container.before($built);
        } else if (upm.productId == 'jira' && !hasAdminPageHeadings) {
            container.after($built);
        } else {
            container.append($built);
        }

        notificationsContainer.addClass('hidden upm-notifications-' + upm.productId);

        buildNotificationsTrigger(0).appendTo(notificationsContainer);
        buildNotificationsHeader().appendTo(notificationsDropdown);
        notificationsDropdown.appendTo(notificationsContainer);

        // The icon popping in after a second or so is jarring, it doesn't look like part of the
        // normal page load, so fade it in for that smooth jazz feel
        if (new Date().getTime() - start > minMsBeforeFadeIn) {
            notificationsContainer.fadeIn();
        }

        notificationsContainer.dropDown('Standard');

        // UPM-2684 don't even bother checking for notifications when OnDemand
        if (!upm.onDemand) {
            // PLUG-819 - We could put the "notifications" to the web transformer and remove this AJAX call, but caching
            //            is broken right now.
            AJS.$.ajax({
                url: upm.rootNotificationsUrl,
                type: 'get',
                dataType: 'json',
                contentType: upmContentType,
                success: function(response) {
                    if (response.links) {
                        //user is logged in, display their personalized notifications
                        upm.notificationsUrl = response.links['my-notifications'];
                    } else {
                        //user is not logged in (should never happen since this is only on admin pages...)
                        //display all publicly visible notifications, always showing as un-dismissed
                        upm.notificationsUrl = upm.rootNotificationsUrl;
                    }

                    refreshNotificationsDropdown();
                },
                error: function(request) {
                    // We get a 401 if we are on demand and/or do not show notifications
                    notificationsContainer.addClass('loaded');
                }
            });
        }
    }

    // If we are on the upm page, wait for upm loaded to trigger to at the very least get the upm container
    AJS.$(window).bind('upmready', init);

    AJS.toInit(function() {
        if (!upm.isUpm) {
            init();
        }
    });
})();
