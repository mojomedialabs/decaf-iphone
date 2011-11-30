"use strict";

var jQT = new $.jQTouch( {
	preloadImages: []
});

var userName = "";
var password = "";

function Client() {
	this.clientID = "";
	this.firstName = "";
	this.lastName = "";
	this.SSN = "";
	this.dateRegistered = "";
	this.course1 = "";
	this.course2 = "";
}

var clients = [];

var sessionKeepAliveTimeoutID;

function onDeviceReady() {
	var rememberMe = localStorage.getItem("decaf_remember_me");

	if (rememberMe) {
		$("#ccUsers__username").val(localStorage.getItem("decaf_username"));

		$("#ccUsers__password").val(localStorage.getItem("decaf_password"));

		$("#slbtn").click();
	} else {
		localStorage.clear();
	}
}

function onBodyLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function resetLoginFormFields() {
  $("#ccUsers__username").val("");
	$("#ccUsers__password").val("");
	$("#remember_me").val("remember");
	$("#remember_me").attr("checked", true);
}

function resetEnrollClientFormFields() {
  $("#ss").val("");
  $("#ss2").val("");
  $("#ss3").val("");
  $("#has_ssn").val("1");
  $("#course1").val("0");
  $("#course2").val("0");
  $("#title1").attr("selectedIndex", 0);
  $("#firstName").val("");
  $("#middleName").val("");
  $("#lastName").val("");
  $("#_has_ssn_ssn").val("1");
  $("#_has_ssn_ssn").attr("checked", true);
	$("#_ssn_0_0").val("");
	$("#_ssn_0_0").attr("disabled", false);
	$("#_ssn_0_1").val("");
	$("#_ssn_0_1").attr("disabled", false);
	$("#_ssn_0_2").val("");
	$("#_ssn_0_2").attr("disabled", false);
	$("#_has_ssn_ein").val("0");
	$("#_has_ssn_ein").attr("checked", false);
	$("#_ssn_0_3").val("");
	$("#_ssn_0_3").attr("disabled", true);
	$("#_ssn_0_4").val("");
	$("#_ssn_0_4").attr("disabled", true);
  $("#ccPrefs__lang").attr("selectedIndex", 0);
  $("#_course1").val("on");
  $("#_course1").attr("checked", false);
  $("#_course1").val("on");
  $("#_course2").attr("checked", false);
  $("#username").val("");
  $("#password").val("");
  $("#confirm_password").val("");
}

function resetClientHandoutFormFields() {
  $("#handout-username").empty();
	$("#handout-password").empty();
  $("#handout-course-id1").empty();
  $(".handout-user-id").empty();
  $("#handout-course-id2").empty();
  $(".handout-user-id").empty();
  $("#attorney_code").val("");
  $("#bkcase").val("");
  $("#client_name").val("");
  $("#course_id_c1").val("");
  $("#course_id_c2").val("");
  $("#firm").val("");
  $("#email-client-password").val("");
  $("#randomz").val("");
  $("#user_id").val("");
  $("#email-client-username").val("");
  $("#email_to").val("");
}

function resetAllFormValues() {
  resetLoginFormFields();

	$("#user-name").empty();

	$("#client").empty();

	resetEnrollClientFormFields();

  $("#settings-remember-me").attr("checked", true);
}

function keepSessionAlive() {
  var jqxhr = $.get("https://www.bkcert.com/attorney/view-clients.php", null,
		function(data, textStatus, jqXHR) {
			var result = $("#body-homepage", $(data));

			if (result.length) {
			  var rememberMe = localStorage.getItem("decaf_remember_me");

			  logout();

      	if (rememberMe) {
      		$("#ccUsers__username").val(userName);

      		$("#ccUsers__password").val(password);
      	}

				login();
			} else {
				sessionKeepAliveTimeoutID = setTimeout(keepSessionAlive, 30000);
			}
	}, "html");
}

function login() {
  $("#slbtn").attr("disabled", true);

	var jqxhr = $.post("https://www.bkcert.com/login/login.php", $("form#aform").serialize(),
		function(data, textStatus, jqXHR) {
			var result = $(".error", $(data));

			if (result.length) {
				$("#slbtn").attr("disabled", false);

				navigator.notification.alert("Login failed! Please try again.", null, "Error!", "Retry");
			} else {
				userName = $("#ccUsers__username").val();
				password = $("#ccUsers__password").val();

				if ($("#remember_me").is(":checked")) {
					localStorage.setItem("decaf_username", userName);

					localStorage.setItem("decaf_password", password);

					localStorage.setItem("decaf_remember_me", true);
				} else {
					localStorage.clear();
				}

				getUserName();

				getClients();

				sessionKeepAliveTimeoutID = setTimeout(keepSessionAlive, 30000);

				jQT.goTo("#home", "slideleft");

				$("#slbtn").attr("disabled", false);
			}
	}, "html");
}

function logout() {
  localStorage.clear();

  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var equalPosition = cookie.indexOf("=");
    var name = equalPosition > -1 ? cookie.substr(0, equalPosition) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  resetAllFormValues();

  clearTimeout(sessionKeepAliveTimeoutID);

  jQT.goTo("#login", "slideleft");
}

function getUserName() {
	var jqxhr = $.get("https://www.bkcert.com/attorney/view-clients.php", null,
		function(data, textStatus, jqXHR) {
			var result = $("#top-bottom-01 > div > strong", $(data));

			if (result.length) {
				$("#user-name").empty().append($(result).text().substr(0, $(result).text().indexOf(".") + 1));
			} else {
				navigator.notification.alert("Error retrieving user name!", null, "Error!", "OK");
			}
	}, "html");
}

function getClients() {
	var jqxhr = $.get("https://www.bkcert.com/attorney/view-clients.php", null,
		function(data, textStatus, jqXHR) {
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
					client.lastName = $(value).children().eq(0).text();
					client.firstName = $(value).children().eq(1).text();
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

					var seperator = clients[0].lastName.substr(0, 1).toUpperCase();

					$("#clients").append("<li class=\"sep\">" + seperator + "</li>");

					clients.each(function(element, index, array) {
						if (element.lastName.substr(0,1 ).toUpperCase() !== seperator) {
							seperator = element.lastName.substr(0, 1).toUpperCase();

							$("#clients").append("<li class=\"sep\">" + seperator + "</li>");
						}

						$("#clients").append("<li><a class=\"client-link\" data-client-index=\"" + index + "\" href=\"#\">" + element.lastName + ", <em>" + element.firstName + "</em></li>");
					});
				} else {
					$("#clients").append("<li>No clients found.</li>");
				}
			} else {
				navigator.notification.alert("Error retrieving client list!", null, "Error!", "OK");
			}
	}, "html");
}

function getClientHandout(clientID) {
	var jqxhr = $.get("https://www.bkcert.com/forms/handouts/client-handout-both.php?client_user_id=" + clientID, null,
		function(data, textStatus, jqXHR) {
			var result = $("body", $(data)).text();

			if (result.indexOf("Error generating the client handout.") !== -1) {
				navigator.notification.alert("Error generating the client handout!", null, "Error!", "OK");
			} else {

				var clientUserName = $("#username", $(data)).val();

				$("#handout-username").empty();

				$("#handout-username").append(clientUserName);

				var clientPassword = $("#password", $(data)).val();

				$("#handout-password").empty();

				$("#handout-password").append(clientPassword);

				$(".handout-user-id").empty();

				$(".handout-user-id").append(clientID);

				var course1ID = $("#course_id_c1", $(data)).val();

				$("#handout-course-id1").empty();

				$("#handout-course-id1").append(course1ID);

				var course2ID = $("#course_id_c2", $(data)).val();

				$("#handout-course-id2").empty();

				$("#handout-course-id2").append(course2ID);

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

				$("#email-client-password").val(clientPassword);

				$("#randomz").val(Math.random() * 99999);

				$("#user_id").val(clientID);

				$("#handout-form-username").val(clientUserName);
			}
	}, "html");
}

$.fn.forceInteger = function() {
	return this.each(function() {
		$(this).keydown(function(event) {
			var key = event.which || event.keyCode;

			if (!(!event.shiftKey && !event.altKey && !event.ctrlKey &&
				//numbers
				((key >= 48 && key <= 57) ||
				//numeric keypad
				(key >= 96 && key <= 105) ||
				//backspace, tab, and enter
				key === 8 || key === 9 || key === 13 ||
				//home and end
				key === 35 || key === 36 ||
				//left and right arrows
				key === 37 || key === 39 ||
				//delete and insert
				key === 46 || key === 45))) {
				event.preventDefault();
			}
		});
	});
};

var logoutButtonTimeoutID;

function temporarilyDisableLogoutButton() {
  $("#logout").hide();

  clearTimeout(logoutButtonTimeoutID);

  logoutButtonTimeoutID = setTimeout(enableLogoutButton, 500);
}

function enableLogoutButton() {
  $("#logout").show();
}

$(function() {
	$("#slbtn").click(function(event) {
		event.preventDefault();

		login();

		/*$("#slbtn").attr("disabled", true);

		var jqxhr = $.post("https://www.bkcert.com/login/login.php", $("form#aform").serialize(),
			function(data, textStatus, jqXHR) {
				var result = $(".error", $(data));

				if (result.length) {
					$("#slbtn").attr("disabled", false);

					navigator.notification.alert("Login failed! Please try again.", null, "Error!", "Retry");
				} else {
					userName = $("#ccUsers__username").val();
					password = $("#ccUsers__password").val();

					if ($("#remember_me").is(":checked")) {
						localStorage.setItem("decaf_username", $("#ccUsers__username").val());

						localStorage.setItem("decaf_password", $("#ccUsers__password").val());

						localStorage.setItem("decaf_remember_me", true);
					} else {
						localStorage.clear();
					}

					getUserName();

					getClients();

					sessionKeepAliveTimeoutID = setTimeout(keepSessionAlive, 10000);

					jQT.goTo("#home", "slideleft");
				}
		}, "html");*/
	});

	$("#ccUsers__username, #ccUsers__password").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#slbtn").click();
		}
	});

  $("#logout").click(function() {
    logout();
  });

	$("#update-clients").click(function() {
		getClients();
	});

	$(".client-link").live("click", function() {
		$("#client").empty();

		var clientIndex = $(this).attr("data-client-index");

		$("#client").append("<h2>" + clients[clientIndex].firstName + " " + clients[clientIndex].lastName + "</h2");

		$("#client").append("<ul class=\"rounded\"></ul>");

		$("#client ul").append("<li>Course 1 Status: <strong>" + clients[clientIndex].course1 + "</strong></li>");

		$("#client ul").append("<li>Course 2 Status: <strong>" + clients[clientIndex].course2 + "</strong></li>");

		$("#client ul").append("<li>Date Registered: <strong>" + clients[clientIndex].dateRegistered + "</strong></li>");

		$("#view-client-handout").attr("data-client-index", clientIndex);

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
		$("#_ssn_0_3").attr("disabled", true);
		$("#_ssn_0_4").attr("disabled", true);
		$("#has_ssn").val("1");
	});

	$("#_has_ssn_ein").click(function(event) {
		$("#_ssn_0_0").attr("disabled", true);
		$("#_ssn_0_1").attr("disabled", true);
		$("#_ssn_0_2").attr("disabled", true);
		$("#_ssn_0_3").removeAttr("disabled");
		$("#_ssn_0_4").removeAttr("disabled");
		$("#has_ssn").val("0");
	});

	$("#button_register_4").click(function() {
		event.preventDefault();

		$("#button_register_4").attr("disabled", true);

		var enableRegisterButton = function() {
		    $("#button_register_4").attr("disabled", false);
		}

    if (!validatePresenceOf($("#firstName"), "Client must have a first name.", enableRegisterButton)) {
			return false;
		}

    if (!validatePresenceOf($("#lastName"), "Client must have a last name.", enableRegisterButton)) {
			return false;
		}

		var ssn = "";

		if ($("#has_ssn").val() === "1") {
			if (!validatePresenceOf($("#_ssn_0_0"), "SSN part 1 cannot be blank.", enableRegisterButton)) {
			    return false;
			}

			if (!validateLengthOf($("#_ssn_0_0"), "SSN part 1 must be 3 digits.", 3, 3, enableRegisterButton)) {
			    return false;
			}

			if (!validatePresenceOf($("#_ssn_0_1"), "SSN part 2 cannot be blank.", enableRegisterButton)) {
				return false;
			}

			if (!validateLengthOf($("#_ssn_0_1"), "SSN part 2 must be 2 digits.", 2, 2, enableRegisterButton)) {
			    return false;
			}

			if (!validatePresenceOf($("#_ssn_0_2"), "SSN part 3 cannot be blank.", enableRegisterButton)) {
				return false;
			}

			if (!validateLengthOf($("#_ssn_0_2"), "SSN part 3 must be 4 digits.", 4, 4, enableRegisterButton)) {
			    return false;
			}

			if (!validateSSN($("#_ssn_0_0").val(), $("#_ssn_0_1").val(), $("#_ssn_0_2").val())) {
				return false;
			}

			ssn = $("#_ssn_0_0").val() + $("#_ssn_0_1").val() + $("#_ssn_0_2").val();
		} else {
			if (!validatePresenceOf($("#_ssn_0_3"), "EIN part 1 cannot be blank.", enableRegisterButton)) {
				return false;
			}

			if (!validateLengthOf($("#_ssn_0_3"), "EIN part 1 must be 2 digits.", 2, 2, enableRegisterButton)) {
			    return false;
			}

			if (!validatePresenceOf($("#_ssn_0_4"), "EIN part 2 cannot be blank.", enableRegisterButton)) {
				return false;
			}

			if (!validateLengthOf($("#_ssn_0_2"), "EIN part 2 must be 7 digits.", 7, 7, enableRegisterButton)) {
			    return false;
			}

			ssn = $("#_ssn_0_3").val() + $("#_ssn_0_4").val();
		}

		$("#ss").val(ssn.substr(0,3));
		$("#ss2").val(ssn.substr(3,2));
		$("#ssn3").val(ssn.substr(5, 4));

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

		if (!validatePresenceOf($("#username"), "Client must have a username.", enableRegisterButton)) {
			return false;
		}

    if (!validateFormatOf($("#username"), "Client username can only consist of alphanumeric characters.", /^[a-zA-Z0-9@._]*$/, enableRegisterButton)) {
        return false;
    }

		if (!validatePresenceOf($("#password"), "Client must have a password.", enableRegisterButton)) {
			return false;
		}

		if (!validatePresenceOf($("#confirm_password"), "Password confirmation is blank.", enableRegisterButton)) {
			return false;
		}

		if (!validateConfirmationOf($("#password"), $("#confirm_password"), "The password confirmation does not match.", enableRegisterButton)) {
		    return false;
		}

		var jqxhr = $.post("https://www.bkcert.com/attorney/client-register.php", $("form#enroll").serialize(),
			function(data, textStatus, jqXHR) {
				var error = $("#body-content p.error", $(data)).text();

				if (error.length > 0) {
					enableRegisterButton();

					navigator.notification.alert(error, null, "Error!", "OK");
				}

				var result = $("#body-content > h2", $(data)).text();

				if (result !== "Client Registration Successful!") {
					enableRegisterButton();

					//navigator.notification.alert("Unknown error registering client. Please try again.", null, "Error!", "OK");
				} else {
					var clientHandoutURL = $(".handout-link a", $(data)).attr("href");

					var clientID = clientHandoutURL.substr(clientHandoutURL.indexOf("client_user_id=") + 15);

					if (clientID.indexOf("&") !== -1) {
						clientID = clientID.substr(0, clientID.indexOf("&"));
					}

					getClientHandout(clientID);

          resetEnrollClientFormFields();

					enableRegisterButton();

					navigator.notification.alert("Your client has been registered!");

					jQT.goTo("#client-handout", "slideleft");

					getClients();
				}
		}, "html");
	});

	$("#firstName, #middleName, #lastName, #_ssn_0_0, #_ssn_0_1, #_ssn_0_2, #_ssn_0_3, #_ssn_0_4, #username, #password, #confirm_password").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#button_register_4").click();
		}
	});

	$("#view-client-handout").click(function(event) {
		var clientID = clients[$(this).attr("data-client-index")].clientID;

		getClientHandout(clientID);

		jQT.goTo("#client-handout", "slideleft");
	});

	$("#email-submit").click(function(event) {
	  event.preventDefault();

	  $("#email-submit").attr("disabled", true);

      var jqxhr = $.post("https://www.bkcert.com/forms/handouts/client-handout-both-email.php", $("form#email-client-handout").serialize(),
        function(data, textStatus, jqXHR) {
          if (data.indexOf("<strong>The instructional handout has been sent to:</strong>") === -1) {
            navigator.notification.alert("Error sending email to client.", null, "Error!", "Retry");
          }

          navigator.notification.alert("Email sent to client!");

          $("#email-submit").attr("disabled", false);
      }, "html");
  });

  $("#email_to").keyup(function(event) {
    if (event.keyCode === 13) {
      $("#email-submit").click();
    }
  });

	$("#settings-remember-me").click(function(event) {
		if ($("#settings-remember-me").is(":checked")) {
			localStorage.setItem("decaf_username", userName);

			localStorage.setItem("decaf_password", password);

			localStorage.setItem("decaf_remember_me", true);
		} else {
			localStorage.clear();
		}
	});

	$(".back").click(function() {
	  temporarilyDisableLogoutButton();
	});

	var currentDate = new Date();

	$("#copyright").append(currentDate.getFullYear());
});
