UPM.define('UpmLicenseInfo',
	['jquery',
	 'UpmEnvironment',
	 'LicenseDescriptionTemplate',
	 'LicenseStatusTemplate'],
	function($,
			 UpmEnvironment,
			 licenseDescriptionTemplate,
			 licenseStatusTemplate) {

	var UpmLicenseInfo = {
		getLicenseDescription: function(licenseDetails) {
			var app = UpmEnvironment.getApplicationKey(),
				roleBased = UpmLicenseInfo.isRoleBasedLicense(licenseDetails),
	            expiryDate = licenseDetails && (licenseDetails.maintenanceExpiryDateString || licenseDetails.subscriptionEndDateString),
	            countType,
	            templateParams,
	            $el,
	            $expiry;

	        if (licenseDetails) {
		        if (licenseDetails.maximumNumberOfUsers === undefined) {
		        	countType = 'unlimited';
		        } else if (licenseDetails.maximumNumberOfUsers === 1) {
		        	countType = 'single';
		        } else if (licenseDetails.maximumNumberOfUsers === 0 && app === 'bamboo') {
		        	countType = 'local';
		        } else {
		        	countType = 'limited';
		        }
		    }

	        templateParams = {
	        	license: licenseDetails,
	        	isActive: !UpmLicenseInfo.isUnlicensed(licenseDetails),
	        	isRemoteAgents: app === 'bamboo',
	        	isRoleBased: roleBased,
	        	canBeEnterprise: !roleBased && ('jira' === app || 'confluence' === app || 'stash' === app || 'bitbucket' === app),
	        	countType: countType,
	        	expiryDate: expiryDate
	        };

	        $el = $('<span></span>');
	        $el.html(licenseDescriptionTemplate(templateParams).trim());
	        $expiry = $el.find('.upm-license-expiry');
	        if (expiryDate) {
	        	$expiry.replaceWith($expiry.text());
	        } else {
	        	$expiry.remove();
	        }
	        return $el.html();
	    },

	    getLicenseStatusDescription: function(plugin, licenseDetails) {
	        var app = UpmEnvironment.getApplicationKey(),
	            roleBased = UpmLicenseInfo.isRoleBasedLicense(licenseDetails),
	            roleCount,
	            roleLabel,
	            templateParams;

	        if (roleBased) {
	        	if (licenseDetails.maximumNumberOfUsers === undefined) {
	        		roleCount = licenseDetails.currentRoleCount;
	        	} else {
	        		roleCount = licenseDetails.maximumNumberOfUsers;
	        	}
	        	roleLabel = roleCount != 1 ? licenseDetails.typeI18nPlural : licenseDetails.typeI18nSingular;
	        }

	        templateParams = {
	        	enabled: plugin.enabled,
	        	license: licenseDetails,
	        	isRemoteAgents: app === 'bamboo',
	        	isRoleBased: roleBased,
	        	roleLabel: roleLabel
	        };

	        return licenseStatusTemplate(templateParams).trim();
	    },

        isUnlicensed: function(licenseDetails) {
		    return !licenseDetails || (licenseDetails.subscription && !licenseDetails.active);
		},

		isRoleBasedLicense: function(licenseDetails) {
		    return licenseDetails && (typeof licenseDetails.currentRoleCount !== 'undefined') && $.isNumeric(licenseDetails.currentRoleCount);
		}
	};
	return UpmLicenseInfo;
});
