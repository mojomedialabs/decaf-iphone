"use strict;"

var jQT = new $.jQTouch( {
	preloadImages: []
});

// If you want to prevent dragging, uncomment this section
/*
function preventBehavior(e)
{
	e.preventDefault();
};
document.addEventListener("touchmove", preventBehavior, false);
*/

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
for more details -jm */
/*
function handleOpenURL(url)
{
	// TODO: do something with the url passed in.
}
*/

function onBodyLoad()
{
	document.addEventListener("deviceready", onDeviceReady, false);
}

/* When this function is called, PhoneGap has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
for more details -jm */
function onDeviceReady()
{
	var rememberMe = localStorage.getItem("decaf_remember_me");

	if (rememberMe) {
		$("#ccUsers__username").val(localStorage.getItem("decaf_username"));

		$("#ccUsers__password").val(localStorage.getItem("decaf_password"));

		$("#slbtn").click();
	} else {
		localStorage.clear();
	}
}

var userName = "";
var password = "";

$(function() {
	$("#slbtn").click(function(event) {
		event.preventDefault();

		$("#slbtn").attr("disabled", true);

		var jqxhr = $.post("https://www.bkcert.com/login/login.php", $("form#aform").serialize(),
			function(data, textStatus, jqXHR) {
				//alert("data: " + data + "\n" + "textStatus: " + textStatus + " \n" + "jqXHR: " + jqXHR);
				var result = $(".error", $(data));

				if (result.length) {
					$("#slbtn").attr("disabled", false);

					navigator.notification.alert("Login failed! Please try again.", null, "Error!", "Retry");
				} else {
					userName = $("#ccUsers__username").val();
					password = $("#ccUsers__password").val()

					if ($("#remember_me").is(":checked")) {
						localStorage.setItem("decaf_username", $("#ccUsers__username").val());

						localStorage.setItem("decaf_password", $("#ccUsers__password").val());

						localStorage.setItem("decaf_remember_me", true);
					} else {
						localStorage.clear();
					}

					getUserName();

					getClients();

					jQT.goTo("#home", "slideleft");
				}
		}, 'html');
	});

	$("#ccUsers__username").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#slbtn").click();
		}
	});

	$("#ccUsers__password").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#slbtn").click();
		}
	});

	$("#update-clients").click(function() {
		getClients();
	});

	$(".client-link").live("click", function() {
		$("#client").empty();

		clientID = $(this).attr("data-client-index");

		$("#client").append("<h2>" + clients[clientID].firstName + " " + clients[clientID].lastName + "</h2");

		$("#client").append("<ul class=\"rounded\"></ul>");

		$("#client ul").append("<li>Course 1 Status: <strong>" + clients[clientID].course1 + "</strong></li>");

		$("#client ul").append("<li>Course 2 Status: <strong>" + clients[clientID].course2 + "</strong></li>");

		$("#client ul").append("<li>Date Registered: <strong>" + clients[clientID].dateRegistered + "</strong></li>");

		jQT.goTo("#view-client", "slideleft");
	});

	$("#_ssn_0_0").forceInteger();
	$("#_ssn_0_1").forceInteger();
	$("#_ssn_0_2").forceInteger();
	$("#_ssn_0_3").forceInteger();
	$("#_ssn_0_4").forceInteger();

	$("#_has_ssn_ssn").click(function(event) {
		$("#_ssn_0_0").removeAttr("disabled");
		$("#_ssn_0_1").removeAttr("disabled");
		$("#_ssn_0_2").removeAttr("disabled");
		$("#_ssn_0_3").val("");
		$("#_ssn_0_3").attr("disabled", true);
		$("#_ssn_0_4").val("");
		$("#_ssn_0_4").attr("disabled", true);
		$("#has_ssn").val("1");
	});

	$("#_has_ssn_ein").click(function(event) {
		$("#_ssn_0_0").val("");
		$("#_ssn_0_0").attr("disabled", true);
		$("#_ssn_0_1").val("");
		$("#_ssn_0_1").attr("disabled", true);
		$("#_ssn_0_2").val("");
		$("#_ssn_0_2").attr("disabled", true);
		$("#_ssn_0_3").removeAttr("disabled");
		$("#_ssn_0_4").removeAttr("disabled");
		$("#has_ssn").val("0");
	});

	$("#button_register_4").click(function() {
		event.preventDefault();

		$("#button_register_4").attr("disabled", true);

		if (!validateNotBlank($("#firstName"), "Client must have a first name.")) {
			return false;
		}

		//if (!validateMinLength($("#firstName"), 1, "Client first name must be at least 1 character in length.")) {
		//	return false;
		//}

		if (!validateNotBlank($("#lastName"), "Client must have a last name.")) {
			return false;
		}

		//if (!validateMinLength($("#lastName"), 1, "Client last name must be at least 1 character in length.")) {
		//	return false;
		//}

		var SSN = "";

		if ($("#has_ssn").val() === "1") {
			if (!validateNotBlank($("#_ssn_0_0"), "SSN part 1 cannot be blank.")) {
				return false;
			}

			if (!validateMinLength($("#_ssn_0_0"), 3, "SSN part 1 must be 3 digits.")) {
				return false;
			}

			if (!validateNotBlank($("#_ssn_0_1"), "SSN part 2 cannot be blank.")) {
				return false;
			}

			if (!validateMinLength($("#_ssn_0_1"), 2, "SSN part 2 must be 2 digits.")) {
				return false;
			}

			if (!validateNotBlank($("#_ssn_0_2"), "SSN part cannot be blank.")) {
				return false;
			}

			if (!validateMinLength($("#_ssn_0_2"), 4, "SSN part 3 must be 4 digits.")) {
				return false;
			}

			if (!validateSSN($("#_ssn_0_0").val(), $("#_ssn_0_1").val(), $("#_ssn_0_2").val())) {
				return false;
			}

			SSN = $("#_ssn_0_0").val() + $("#_ssn_0_1").val() + $("#_ssn_0_2").val();
		} else {
			if (!validateNotBlank($("#_ssn_0_3"), "Client must have a valid EIN.")) {
				return false;
			}

			if (!validateMinLength($("#_ssn_0_3"), 2, "EIN part 1 must be 2 digits.")) {
				return false;
			}

			if (!validateNotBlank($("#_ssn_0_4"), "Client must have a valid EIN.")) {
				return false;
			}

			if (!validateMinLength($("#_ssn_0_4"), 7, "EIN part 2 must be 7 digits.")) {
				return false;
			}

			SSN = $("#_ssn_0_3").val() + $("#_ssn_0_4").val();
		}

		$("#ss").val(SSN.substr(0,3));
		$("#ss2").val(SSN.substr(3,2));
		$("#ssn3").val(SSN.substr(5, 4));

		if ($("#_course1").attr("checked")) {
			$("#course1").val("1");
		}

		if ($("#_course2").attr("checked")) {
			$("#course2").val("1");
		}

		if ($("#course1").val() === "0" && $("#course2").val() === "0") {
			navigator.notification.alert("The client must be enrolled in at least one course.", function() {
				$("html, body").animate({
					scrollTop: $("#_course1").offset().top -30
				}, 250);

				$("#button_register_4").attr("disabled", false);
			}, "Error!", "OK");

			return false;
		}

		if (!validateNotBlank($("#username"), "Client must have a username.")) {
			return false;
		}

		if (!validateUserName($("#username").val())) {
			return false;
		}

		if (!validateNotBlank($("#password"), "Client must have a password.")) {
			return false;
		}

		if (!validateNotBlank($("#confirm_password"), "Password confirmation is blank.")) {
			return false;
		}

		if ($("#password").val() !== $("#confirm_password").val()) {
			navigator.notification.alert("The password confirmation does not match.", function() {
				$("html, body").animate({
					scrollTop: $("#password").offset().top -30
				}, 250);

				$("#button_register_4").attr("disabled", false);
			}, "Error!", "OK");

			return false;
		}

		var jqxhr = $.post("https://www.bkcert.com/attorney/client-register.php", $("form#enroll").serialize(),
			function(data, textStatus, jqXHR) {
				//alert("data: " + data + "\n" + "textStatus: " + textStatus + " \n" + "jqXHR: " + jqXHR);

				var error = $("#body-content p.error", $(data)).text();

				if (error.length > 0) {
					$("#button_register_4").attr("disabled", false);

					navigator.notification.alert(error, null, "Error!", "Retry");
				}

				var result = $("#body-content > h2", $(data)).text();

				if (result !== "Client Registration Successful!") {
					$("#button_register_4").attr("disabled", false);

					navigator.notification.alert("Unknown error registering client.", null, "Error!", "Retry");
				} else {
					var clientHandoutURL = $(".handout-link a", $(data)).attr("href");

					var clientID = clientHandoutURL.substr(clientHandoutURL.indexOf("client_user_id=") + 15);

					if (clientID.indexOf("&") !== -1) {
						clientID = clientID.substr(0, clientID.indexOf("&"));
					}

					getClientHandout(clientID);

					$("#button_register_4").attr("disabled", false);

					jQT.goTo("#client-handout", "slideleft");

					getClients();
				}
		}, 'html');
	});

	$("#view-client-handout").click(function(event) {
		var clientID = clients[$(this).attr("data-client-index")].clientID;

		getClientHandout(clientID);

		jQT.goTo("#client-handout", "slideleft");
	});

	$("#settings-auto-login").click(function(event) {
		if ($("#settings-auto-login").is(":checked")) {
			localStorage.setItem("decaf_username", userName);

			localStorage.setItem("decaf_password", password);

			localStorage.setItem("decaf_remember_me", true);
		} else {
			localStorage.clear();
		}
	});

	var currentDate = new Date();

	$("#copyright").append(currentDate.getFullYear());
});

function validateNotBlank(formField, errorMessage) {
	if ($(formField).val() === "") {
		navigator.notification.alert(errorMessage, function() {
			$("html, body").animate({
				scrollTop: $(formField).offset().top -30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	} else {
		return true;
	}
}

function validateMinLength(formField, minLength, errorMessage) {
	if ($(formField).val().length < minLength) {
		navigator.notification.alert(errorMessage, function() {
			$("html, body").animate({
				scrollTop: $(formField).offset().top -30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	} else {
		return true;
	}
}

function validateSSN(ssn1, ssn2, ssn3) {
	var ssn = ssn1 + "-" + ssn2 + "-" + ssn3;
    var ssnFormat = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/;

    if (!ssnFormat.test(ssn)) {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_0").offset().top -30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

	ssn = (ssn.split("-")).join("");

    if (ssn.substr(0, 3) === "000") {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_0").offset().top -30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

    if (ssn.substr(3, 2) === "00") {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_1").offset().top -30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

    if (ssn.substring(5, 4) === "0000") {
		navigator.notification.alert("Invalid SSN format.", function() {
			$("html, body").animate({
				scrollTop: $("#_ssn_0_2").offset().top -30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	}

    return true;
}

function validateUserName(userName) {
	if (!(/^[-a-zA-Z0-9@._]*$/.test(userName))) {
		navigator.notification.alert("Invalid username format.", function() {
			$("html, body").animate({
				scrollTop: $("#username").offset().top - 30
			}, 250);

			$("#button_register_4").attr("disabled", false);
		}, "Error!", "OK");

		return false;
	} else {
		return true;
	}
}

$.fn.forceInteger = function() {
	return this.each(function() {
		$(this).keydown(function(event) {
			var key = event.which || event.keyCode;

			if (event.shiftKey) {
				alert(key);
			}

			if (!event.shiftKey && !event.altKey && !event.ctrlKey &&
				//numbers
				key >= 48 && key <= 57 ||
				//numeric keypad
				key >= 96 && key <= 105 ||
				//backspace, tab, and enter
				key == 8 || key == 9 || key == 13 ||
				//home and end
				key == 35 || key == 36 ||
				//left and right arrows
				key == 37 || key == 39 ||
				//delete and insert
				key == 46 || key == 45) {
					//allow default
			} else {
				event.preventDefault();
			}
		});
	});
};

function getUserName() {
	var jqxhr = $.get("https://www.bkcert.com/attorney/view-clients.php", null,
		function(data, textStatus, jqXHR) {
			//alert("data: " + data + "\n" + "textStatus: " + textStatus + " \n" + "jqXHR: " + jqXHR);
			var result = $("#top-bottom-01 > div > strong", $(data));

			if (result.length) {
				$("#user-name").append($(result).text().substr(0, $(result).text().indexOf(".") + 1));
			} else {
				navigator.notification.alert("Error retrieving user name!", null, "Error!", "OK");
			}
	}, 'html');
}

function Client() {
	this.clientID = "";
	this.firstName = "";
	this.lastName = "";
	this.SSN = "";
	this.dateRegistered = "";
	this.course1 = "";
	this.course2 = "";
}

var clients = new Array();

function getClients() {
	var jqxhr = $.get("https://www.bkcert.com/attorney/view-clients.php", null,
		function(data, textStatus, jqXHR) {
			//alert("data: " + data + "\n" + "textStatus: " + textStatus + " \n" + "jqXHR: " + jqXHR);
			var result = $("table.listview tbody tr", $(data));

			if (result.length) {
				clients.length = 0;

				$(result).each(function(index, value) {
					if (index === 0) {
						return true;
					}

					var client = new Client();

					var clientURL = $(value).children().eq(0).children().attr("href");

					client.clientID = clientURL.substr(clientURL.indexOf("client_user_id") + 15);
					client.firstName = $(value).children().eq(0).text();
					client.lastName = $(value).children().eq(1).text();
					client.SSN = $(value).children().eq(2).text();
					client.dateRegistered = $(value).children().eq(3).text();
					client.course1 = $(value).children().eq(4).text();
					client.course2 = $(value).children().eq(5).text();

					clients.push(client);
				});

				if (clients.length) {
					clients.sortBy(function(element) {
						return element.lastName;
					});

					$("#clients").empty();

					seperator = clients[0].lastName.substr(0, 1).toUpperCase();

					$("#clients").append("<li class=\"sep\">" + seperator + "</li>");

					clients.each(function(element, index, array) {
						if (element.lastName.substr(0,1 ).toUpperCase() !== seperator) {
							seperator = element.lastName.substr(0, 1).toUpperCase();

							$("#clients").append("<li class=\"sep\">" + seperator + "</li>");
						}

						$("#clients").append("<li><a class=\"client-link\" data-client-index=\"" + index + "\" href=\"#\">" + element.lastName + ", <em>" + element.firstName + "</em></li>");

						$("#view-client-handout").attr("data-client-index", index);
					});
				} else {
					$("#clients").append("<li>No clients found.</li>")
				}
			} else {
				navigator.notification.alert("Error retrieving client list!", null, "Error!", "OK");
			}
	}, 'html');
}

function getClientHandout(clientID) {
	var jqxhr = $.get("https://www.bkcert.com/forms/handouts/client-handout-both.php?client_user_id=" + clientID, null,
		function(data, textStatus, jqXHR) {
			//alert("data: " + data + "\n" + "textStatus: " + textStatus + " \n" + "jqXHR: " + jqXHR);
			var result = $("body", $(data)).text();

			if (result.indexOf("Error generating the client handout.") !== -1) {
				navigator.notification.alert("Error generating the client handout!", null, "Error!", "OK");
			} else {

				var userName = $("#username", $(data)).val();

				$("#handout-username").empty();

				$("#handout-username").append(userName);

				var password = $("#password", $(data)).val();

				$("#handout-password").empty();

				$("#handout-password").append(password);

				$(".handout-user-id").empty();

				$(".handout-user-id").append(clientID);

				var course1ID = $("#course_id_c1", $(data)).val();

				$("#handout-course-id1").empty();

				$("#handout-course-id1").append(course1ID);

				var course2ID = $("#course_id_c2", $(data)).val();

				$("#handout-course-id1").empty();

				$("#handout-course-id1").append(course2ID);

				var attorneyCode = $("#attorney_code", $(data)).val();

				$("#attorney_code").val(attorneyCode);

				var bkCase = $("#bkcase", $(data)).val();

				$("#bkcase").val(bkCase);

				var clientName = $("#client_name", $(data)).val();

				$("#client_name").val(clientName);

				$("#course_id_c1").val(course1ID);

				$("#course_id_c2").val(course2ID);

				var firm = $("#firm", $(data)).val();

				$("#firm").val(firm);

				$("#email-client-password").val(password);

				$("#randomz").val(Math.random() * 99999);

				$("#user_id").val(clientID);

				$("#username").val(userName);
			}
	}, 'html');
}

function emailClientHandout(clientID) {
	var jqxhr = $.post("https://www.bkcert.com/forms/handouts/client-handout-both-email.php", $("form#email-client-handout").serialize(),
		function(data, textStatus, jqXHR) {
			//alert("data: " + data + "\n" + "textStatus: " + textStatus + " \n" + "jqXHR: " + jqXHR);
			var error = $("#body-content p.error", $(data)).text();
	}, 'html');
}