"use strict";

function alertAndScrollToField(formField, errorMessage, duration) {
    if (duration === undefined) {
        duration = 250;
    }

    navigator.notification.alert(errorMessage, function() {
		  $("html, body").animate({ scrollTop: $(formField).offset().top - 30 }, duration);
    }, "Error!", "OK");
}

function validatePresenceOf(formField, errorMessage, falseCallback, trueCallback) {
    if ($(formField).val().isBlank()) {
        alertAndScrollToField(formField, errorMessage);

        if (falseCallback) {
            falseCallback();
        }

        return false;
    } else {
        if (trueCallback) {
            trueCallback();
        }

        return true;
    }
}

function validateLengthOf(formField, errorMessage, minimum, maximum, falseCallback, trueCallback) {
    if (minimum < 1) {
        minimum = 1;
    }

    if ($(formField).val().length < minimum) {
        alertAndScrollToField(formField, errorMessage);

        if (falseCallback) {
            falseCallback();
        }

        return false;
    }

    if (maximum) {
        if (maximum < 1) {
            maximum = 1;
        }

        if (minimum > maximum) {
            var temp = minimum;
            minimum = maximum;
            maximum = temp;
        }

        if ($(formField).val().length > maximum) {
            alertAndScrollToField(formField, errorMessage);

            if (falseCallback) {
                falseCallback();
            }

            return false;
        }
    }

    if (trueCallback) {
        trueCallback();
    }

    return true;
}

function validateFormatOf(formField, errorMessage, format, falseCallback, trueCallback) {
    if (!format.test($(formField).val())) {
        alertAndScrollToField(formField, errorMessage);

        if (falseCallback) {
            falseCallback();
        }

        return false;
    } else {
        if (trueCallback) {
            trueCallback();
        }

        return true;
    }
}

function validateConfirmationOf(formField1, formField2, errorMessage, falseCallback, trueCallback) {
    if ($(formField1).val() !== $(formField2).val()) {
        alertAndScrollToField(formField1, errorMessage);

        if (falseCallback) {
            falseCallback();
        }

        return false;
    } else {
        if (trueCallback) {
            trueCallback();
        }

        return true;
    }
}

function validateSSN(ssn1, ssn2, ssn3) {
	var ssn = ssn1 + "-" + ssn2 + "-" + ssn3;
    var ssnFormat = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/;

    if (!ssnFormat.test(ssn)) {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_0").offset().top - 30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

	ssn = (ssn.split("-")).join("");

    if (ssn.substr(0, 3) === "000") {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_0").offset().top - 30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

    if (ssn.substr(3, 2) === "00") {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_1").offset().top - 30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

    if (ssn.substring(5, 4) === "0000") {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_2").offset().top - 30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

    return true;
}