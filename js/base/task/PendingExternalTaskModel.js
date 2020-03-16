/**
 * Singleton model that describes the status of a long-running task that another user is executing.
 * See UpmLongRunningTasks and UpmCommonUi.
 */
UPM.define('PendingExternalTaskModel',
	[
		'brace'
	],
	function(Brace) {

	var PendingExternalTaskModel = Brace.Model.extend({
		namedAttributes: [
			'otherUserTaskDesc',
			'otherUserTaskUserKey',
			'otherUserTaskStartTime'
		]
	});

	return new PendingExternalTaskModel();
});