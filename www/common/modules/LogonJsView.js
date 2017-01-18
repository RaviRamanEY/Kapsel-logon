    var utils = sap.logon.Utils;
    var staticScreens = sap.logon.StaticScreens;
    var dynamicScreens = sap.logon.DynamicScreens;
    
    var windowRef;
    var events;
	
	var onWindowReady;
    var lastOperation;
    
    var state = 'NO_WINDOW';
    var currentScreenID;
    var previousScreenID;
    var currentContext;
    var previousContext;
    var STYLE = "fiori";
    var pathOpened;
    
    function findCordovaPath() {
        var path = null;
        var scripts = document.getElementsByTagName('script');
        var term = 'cordova.js';
        for (var n = scripts.length-1; n>-1; n--) {
            var src = scripts[n].src;
            if (src.indexOf(term) == (src.length - term.length)) {
                path = src.substring(0, src.length - term.length);
                break;
            }
        }
        return path;
    }
    
    //Open a MessageDialog only on Windows
    function showConfirmDialog(message, buttons) {
        if (device.platform.toLowerCase().indexOf("windows") === 0) {

            var dialog = new Windows.UI.Popups.MessageDialog(message);
            for (var i = 0; i < buttons.length; i++) {
                var button = new Windows.UI.Popups.UICommand(buttons[i].text, buttons[i].callback, i);
                dialog.commands.append(button);
            }

            return dialog.showAsync();
        }
    };
    
    var showScreenWithCheck = function(screenId, screenEvents, context) {
      utils.debug('IAB showScreenWithCheck, '+ screenId);
      //check whether application wants to handle the showScreen event
      previousScreenID = currentScreenID;
      previousContext = currentContext
      currentScreenID = screenId;
      currentContext = context;
      
      var bypassDefaultShowScreen = false;
      if (this.onShowScreen){
         bypassDefaultShowScreen = this.onShowScreen(screenId, screenEvents, currentContext);
      }
    
      if (!bypassDefaultShowScreen){
		  //switch screenid from old inappbrowserui to the new one
		  switch (screenId){
			case "SCR_SET_PASSCODE_OPT_ON":
			case "SCR_SET_PASSCODE_OPT_OFF":
			case "SCR_SET_PASSCODE_MANDATORY":
			   screenId = "setPasscode";
			   break;
			case "SCR_ENTER_CREDENTIALS":
				screenId = "enterRegistrationInfo";
				break;
			case "SCR_UNLOCK":
				screenId = "enterPasscode";
				break;
			case "SCR_SSOPIN_SET":
				screenId = "enterSSOPasscode";
				break;
			case "SCR_REGISTRATION":
				screenId = "enterRegistrationInfo";
				break;
			case "SCR_SHOW_REGISTRATION":
				screenId = "showRegistrationInfo";
				break;
			case "SCR_ENTER_EMAIL":
				screenId = "enterEmail";
				break;
			case "SCR_ENTER_AFARIA_CREDENTIAL":
				screenId = "enterAfariaUsernamePassword";
				break;
			case "SCR_CHOOSE_DEMO_MODE":
				screenId = "chooseDemoMode";
				break;
			case "SCR_CHANGE_PASSWORD":
			    screenId = "changePassword";
			    break;
            case "SCR_CHANGE_PASSCODE_MANDATORY":
                screenId="changePasscode";
                break;
            case "SCR_MANAGE_PASSCODE_OPT_ON":
            case "SCR_MANAGE_PASSCODE_OPT_OFF":
            case "SCR_MANAGE_PASSCODE_MANDATORY":
                screenId="changePasscode";
                break;
            default:
				//TODO: log an console error if screen id startw with SCR but cannot find a match
				;
		  }

        // Check flag to disable the passcode screen
        if (currentContext && currentContext.registrationContext && currentContext.registrationContext.custom
            && currentContext.registrationContext.custom.disablePasscode
            && (currentContext.registrationContext.custom.disablePasscode.toString() == "true")) {
            
            if (screenId == "setPasscode") {
                currentContext.passcodeEnabled = true;
                currentContext.passcode = "Password1@";
                currentContext.passcode_CONFIRM = "Password1@";
                screenEvents.onsubmit(currentContext);
                return true;
            } else if (screenId == "enterPasscode") {
                currentContext.unlockPasscode = "Password1@";
                screenEvents.onsubmit(currentContext);
                return true;
            }
        }

		 if (state === 'ANDROID_STATE_SAML') {
				// ANDROID_STATE_SAML is an Android-specific state, necessary because the InAppBrowser behaves
				// differently on Android.  On iOS, if an InAppBrowser is launched while an old InAppBrowser
				// is still around, the old one is destroyed.  On Android, the old one will still exist,
				// but can no longer be closed (it is leaked, effectively).  This piece of code will make
				// sure the InAppBrowser is closed before launching the InAppBrowser again.
				utils.debug('IAB showScreenWithCheck, ANDROID_STATE_SAML');
				windowRef.removeEventListener('loadstart', iabLoadStart);
				windowRef.removeEventListener('loadstop', iabLoadStop);
				windowRef.removeEventListener('loaderror', iabLoadError);
				windowRef.removeEventListener('exit', iabExit);

				windowRef.addEventListener('exit', function(){
					// The plugin resources must be relative to cordova.js to resolve for
					// the case that cordova and plugins are local and the application resources/code
					// is remote.
					var pathToIabHtml = findCordovaPath() + 'smp/logon/ui/iab.html';
					if (device.platform == 'Android' && pathToIabHtml.toLowerCase().indexOf("https://actuallylocalfile")===0) {
						pathToIabHtml = "file:///android_asset/www/smp/logon/ui/iab.html";
					}
					// use setTimeout to give the first InAppBrowser time to close before opening a new
					// InAppBrowser (which would make the first unclosable if it was still open).
					setTimeout(function(){
						windowRef = newScreen(pathToIabHtml);
					}, 100);
				});
				windowRef.close();
				state = 'INIT_IN_PROGRESS';
				lastOperation = function() {
					showScreen(screenId, screenEvents, currentContext);
				}
				onWindowReady = function(){
					state = 'READY';
					if (lastOperation) {
						lastOperation();
					}
				};
			} else if (state === 'NO_WINDOW') {
				utils.debug('IAB showScreenWithCheck, NO_WINDOW');
				state = 'INIT_IN_PROGRESS';
				lastOperation = function() {
					utils.debug("lastOperation invoked, currentContext: " + JSON.stringify(currentContext));
					showScreen(screenId, screenEvents, currentContext);
				}
				onWindowReady = function(){
					state = 'READY';
					if (lastOperation) {
						lastOperation();
					}
				};

				// The plugin resources must be relative to cordova.js to resolve for
				// the case that cordova and plugins are local and the application resources/code
				// is remote.
				var pathToIabHtml = findCordovaPath();
				if (screenId == "SCR_SAML_AUTH") {
					// Don't waste time loading iab.html in this case, since that takes over 2
					// seconds due to loading UI5 (which is not required).
					pathToIabHtml += 'smp/logon/ui/blank.html';
				} else {
					pathToIabHtml += 'smp/logon/ui/iab.html';
				}
				if (device.platform == 'Android' && pathToIabHtml.toLowerCase().indexOf("https://actuallylocalfile")===0) {
					pathToIabHtml = "file:///android_asset/www/smp/logon/ui/iab.html";
				}
				windowRef = newScreen(pathToIabHtml);
			}
			else if (state === 'INIT_IN_PROGRESS') {
				utils.debug('IAB showScreenWithCheck, INIT_IN_PROGRESS');
				lastOperation = function() {
					showScreen(screenId, screenEvents, currentContext);
				}
			}
			else if (state === 'READY') {
				utils.debug('IAB showScreenWithCheck, READY');
				showScreen(screenId, screenEvents, currentContext);
			}
		}
	};

	var showNotification = function(notificationKey,notificationMessage,notificationTitle,extraInfo) {
		utils.debug('iabui showNotification');

		var bypassShowNotification = false;

		if (this.onShowNotification){
			bypassShowNotification = this.onShowNotification(currentScreenID, notificationKey,notificationMessage,notificationTitle);
		}

		if (!bypassShowNotification) {
			if (!windowRef) {
				return false;
				//if inappbrowser is not ready to show the notification, return false to let caller
				//stops the registration and calls the registration or unlock method's onerrorcallback
			}

			var message = notificationMessage != null ? "\"" + notificationMessage + "\"" : "null";
			var title = notificationTitle != null ? "\"" + notificationTitle + "\"" : "null";
			var payload = "showNotification(\"" + notificationKey + "\"," + message + "," + title + ",\"" + extraInfo + "\");";
            
			windowRef.executeScript(
				{ code: payload },
				function (param) {
					utils.debug('executeScript returned:' + JSON.stringify(param));
				});
		}
		return true;
	};

	var showScreen = function(screenId, screenEvents, currentContext) {
        utils.debugJSON(screenEvents, 'showScreen: ' + screenId );

        if (currentContext) {
        	   utils.debugJSON(currentContext);
        }
        // saving event callbacks (by-id map)
        events = screenEvents;
		
        var uiDescriptor;

        if (screenId == "SCR_SAML_AUTH"){
             var proxyPath = (currentContext.resourcePath?currentContext.resourcePath:"") +
                              (currentContext.farmId?"/"+currentContext.farmId:"");
           
             var url = "https://"+currentContext.serverHost+utils.getPort(currentContext.serverPort)+proxyPath+"/odata/applications/v1/"+currentContext.applicationId+"/Connections";

             if (device.platform === 'windows'){
                 // Add a random parameter at the end of the url so that the underlying networking lib will not cache the response. 
                 // Remove this after the SMP server fixes their response. 
                 url = url +"?rand=" + new Date().getTime();
             }

             if (device.platform == 'iOS') {
                        		
                    // SAML against an SMP server requires the first request to have the application id to set
                    // a proper X-SMP-SESSID cookie. The url constructed as below works. This extra request
                    // has no effect against HMC.
                    var successCallback = function() {
                            //For ios inappbrowser, if window.location is used to update the html content, then
                            //the uiwebview will not be released when dismissing the webview. A workaround is
                            //display cancel button for ios client 
 
                            clearWindow(function(){
        
                                var path =   currentContext["config"]["saml2.web.post.finish.endpoint.uri"];
                                windowRef = window.open( path, '_blank', 'location=no,toolbar=yes,overridebackbutton=yes,allowfileaccessfromfile=yes,closebuttoncaption=Cancel,hidenavigation=yes');
                                windowRef.addEventListener('loadstart', iabLoadStart);
                                windowRef.addEventListener('loadstop', iabLoadStop);
                                windowRef.addEventListener('loaderror', iabLoadError);
                                windowRef.addEventListener('exit', iabExit);
                                windowRef.addEventListener('backbutton', function(){
                                    if (events['onbackbutton']) {
                                        utils.debug('IABUI onbackbutton');
                                        events['onbackbutton']();
                                    }
                                    else if (events['oncancel']) {
                                        utils.debug('IABUI onbackbutton oncancel');
                                        events['oncancel']();
                                    }
                                });
                            }, true);

                    };
               
                    var errorCallback = function(e) {
                            //show confirmaton box to let user retry the SAML preflight request, and if user cancels
                            //the request, then call onError screen event
                            utils.log("LogonJSView: error sending initial SAML request" + JSON.stringify(e));
               
                            var i18n = require('kapsel-plugin-i18n.i18n');
                            i18n.load({
                                        path: "smp/logon/i18n",
                                        name: "i18n"
                                      },
                                      function (bundle) {
                                          var retryConnect = function () {
                                              sap.AuthProxy.sendRequest("GET", url, null, null, successCallback, errorCallback);
                                          };

                                          var cancelConnect = function () {
                                              events["onerror"](e);
                                          };

                                          if (device.platform.toLowerCase().indexOf("windows") === 0) {
                                              showConfirmDialog(bundle.get("FAILED_TO_CONNECT"), [{text:bundle.get("BUTTON_OK"), callback:retryConnect  }, { text: bundle.get("BUTTON_CANCEL"), callback: cancelConnect}]);
                                          }
                                          else {
                                              var ret = confirm(bundle.get("FAILED_TO_CONNECT"));
                                              if (ret == true) {
                                                  retryConnect();
                                              }
                                              else {
                                                  cancelConnect();
                                              }
                                          }
                                      }
                            );
                    };
                    // use cert from Logon in case a cert provider is configured. If the cert provider is not configured, the logon will return nil 
                    var logonCert = new sap.AuthProxy.CertificateFromLogonManager(currentContext.applicationId);
         
                    sap.AuthProxy.sendRequest("GET",url,null,null, successCallback, errorCallback, null, null, 0, logonCert);
               
            }
            else {
                var endpointUrl = currentContext["config"]["saml2.web.post.finish.endpoint.uri"];
                var sendSAMLRequest = function() {
                    // In certain situations, the IAB needs multiple nudges to actually load the endpointUrl.
                    // That's what the setTimeout calls in the payload are for.  Note that when the IAB
                    // actually starts loading the endpointUrl the javascript context gets destroyed so the
                    // rest of the setTimeouts will not be invoked.
                    var payload = 'window.location.href="' + endpointUrl + '";setTimeout(function(){window.location.href="'+endpointUrl + '#iabDidNotLoad' +'";setTimeout(function(){window.location.href="'+endpointUrl + '#iabDidNotLoad' +'";},3000);},3000);';
                    // SAML against an SMP server requires the first request to have the application id to set
                    // a proper X-SMP-SESSID cookie. The url constructed as below works. This extra request
                    // has no effect against HMC.
                    var successCallback = function(response){
                        // For Android, check for the challenge header (windows doesn't get the challenge header).
                        if (device.platform.toLowerCase().indexOf("windows") === 0 || (response && response.headers && response.headers[currentContext["config"]["saml2.web.post.authchallengeheader.name"]])) {
                            windowRef.executeScript(
                                { code: payload },
                                function (param) {
                                utils.debug('executeScript returned:' + JSON.stringify(param));
                            });
                        } else {
                            // Server did not send challenge header, the session must still be active.
                            var payloadToSkipSAML = 'window.location.href="'+pathOpened + '?'+currentContext["config"]["saml2.web.post.finish.endpoint.redirectparam"]+'=someUnusedValue";';
                            windowRef.executeScript(
                                { code: payloadToSkipSAML },
                                function (param) {
                                utils.log('executeScript returned:' + JSON.stringify(param));
                            });
                        }
                    };
                    var errorCallback = function(e){
                        utils.log("LogonJSView: error sending initial SAML request" + JSON.stringify(e));
            
                        var i18n = require('kapsel-plugin-i18n.i18n');
                        i18n.load({
                                    path: "smp/logon/i18n",
                                    name: "i18n"            
                                  },
                                  function(bundle){
                                        var ret = confirm(bundle.get("FAILED_TO_CONNECT"));
                                        if (ret == true) {
                                            if (device.platform.toLowerCase().indexOf("windows") === 0) {
                                                sap.AuthProxy.sendRequest("GET", url, null, null, successCallback, errorCallback);
                                            } else {
                                                // Use cert from Logon in case a cert provider is configured.
                                                // Don't follow redirects, because if the server is configured with Redirect
                                                // binding, the redirected response won't have the SAML challenge header.
                                                var authConfig = {"followRedirects": false,"clientCert":{"type":"logon"}};
                                                sap.AuthProxy.sendRequest2("GET", url, null, null, successCallback, errorCallback, 0, authConfig);
                                            }
                                        }
                                        else {
                                            events["onerror"](e);
                                        }
                                  }
                        );
                    };
                    
                    if (device.platform.toLowerCase().indexOf("windows") === 0) {
                        sap.AuthProxy.sendRequest("GET", url, null, null, successCallback, errorCallback);
                    } else {
                        // Use cert from Logon in case a cert provider is configured.
                        // Don't follow redirects, because if the server is configured with Redirect
                        // binding, the redirected response won't have the SAML challenge header.
                        var authConfig = {"followRedirects": false,"clientCert":{"type":"logon"}};
                        sap.AuthProxy.sendRequest2("GET", url, null, null, successCallback, errorCallback, 0, authConfig);
                    }
                }
                sap.AuthProxy.isInterceptingRequests(function(isInterceptingRequests) {
                    if (isInterceptingRequests && endpointUrl.toLowerCase().indexOf("https") == 0){
                        endpointUrl = "http" + endpointUrl.substring(5);
                        sap.AuthProxy.addHTTPSConversionHost(sendSAMLRequest, sendSAMLRequest, endpointUrl);
                    } else {
                        sendSAMLRequest();
                    }
                }, function(error){
                    utils.log("error calling isInterceptingRequests: " + JSON.stringify(error));
                    sendSAMLRequest();
                }, true);
            }

            // On Android the SAML inAppBrowser stuff has to be handled differently.
            if (device.platform.toLowerCase().indexOf("android") >= 0) {
                state = "ANDROID_STATE_SAML";
            }
            return;
        } else if (screenId === "SCR_OAUTH") {
                // OAUTH authentication
                sap.AuthProxy.stopIntercepting(function() {
                    utils.debug("AuthProxy interception stopped");
                }, function(error) {
                    utils.log("AuthProxy interception could not be stopped");
                });

                var auth_url = currentContext.auth[0].config["oauth2.authorizationEndpoint"] + "?response_type=code&client_id=" + currentContext.auth[0].config["oauth2.clientID"];

                // utitlity method looking for url parameters 'code' and 'error';
                // it is used to parse out the authorization code from the redirect url
                var codeReader = function (arg) {
                    var url = arg.url;
                    var code = getUrlParameter('code', url);
                    var error = getUrlParameter('error', url);

                    if (code || error) {
               
                        clearWindow(function(){
                            requestToken(code, currentContext);
                        }, true);
                    }
                };

                // utility method to find a given url parameter
                var getUrlParameter = function (name, url) {
                    if (!url) url = location.href;
                    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                    var regexS = "[\\?&]" + name + "=([^&#]*)";
                    var regex = new RegExp(regexS);
                    var results = regex.exec(url);
                    return results == null ? null : results[1];
                };

                // an http POST request is sent to the token-endpoint to get the access and refresh tokens;
                // the parameters grant-type, client-id and authorization code are sent inside the POST body in url encoded form
                var requestToken = function (code, currentContext) {
                    var token_url = currentContext.auth[0].config["oauth2.tokenEndpoint"];
                    var headers = {"Content-Type": "application/x-www-form-urlencoded"};
                    var body = "grant_type=" + currentContext.auth[0].config["oauth2.grantType"] + "&client_id=" +
                        currentContext.auth[0].config["oauth2.clientID"] + "&code=" + code;

                    module.exports.tokenEndpoint = token_url;

                    sap.AuthProxy.sendRequest("POST", token_url, headers, body,
                        function (result) {
                            // success
                            if (result.status == 200 && result.responseText) {
                                utils.debug("Received tokens from the endpoint");
                                try {
                                    var tokens = JSON.parse(result.responseText);

                                    module.exports.accessToken = tokens.access_token;
                                    module.exports.refreshToken = tokens.refresh_token;

                                    sendPingRequest(currentContext, tokens.access_token);
                                } catch (e) {
                                    utils.Error("Invalid token JSON!");
                                }
                            } else {
                                utils.Error("Error at the token request!");
                            }
                        }, function (error) {
                            // error
                            alert('ERROR: Something goes wrong.' + error);
                        });
                };

                // sends a ping request with the access token to get a session cookie for the registration request;
                // the cookie is then coopied to the store of the native stack and used automatically for the registration request
                var sendPingRequest = function (context, token) {
                    var protocol = !context.https || context.https == "false" ? "http" : "https";
                    var pingUrl = protocol + "://" + context.serverHost;
                    if(context.serverPort && context.serverPort!=="0"){
                        pingUrl += ":" + context.serverPort;
                    }
                    //FIXME: we need to change this logic to support v1, v2, v3 and latest?
                    pingUrl += "/odata/applications/v3/" + sap.Logon.applicationId + "/Connections";
                                          
                    sap.AuthProxy.sendRequest("POST", pingUrl, {"Authorization": "Bearer " + token}, null,
                        function (result) { // success
                            // Http response 415 is the expected behaviour
                            utils.debug("Ping success: " + result.status + " --- " + result.responseText);

                            // trigger the registration
                            if (events && events["onevent"]) {
                                events["onevent"](protocol + "://" + context.serverHost);
                            }
                        },
                        function (error) { // error

                            utils.log("PING_ERROR: " + error);
                        });
                };

                if ((device.platform.toLowerCase().indexOf("android") >= 0) || (device.platform.toLowerCase().indexOf("ios") >= 0)) {
                    // close the previous inappbrowser screen, and open the new oauth one
                    close(function(){
                            windowRef = window.open(auth_url, '_blank', 'location=no');
                            windowRef.addEventListener('loadstart', codeReader);
                            windowRef.addEventListener('exit', iabExit)
                        }, true);

                } else {
                    // WINDOWS specific code for handling the close of the previous inappbrowser screen
                    windowRef.close();
                    windowRef = window.open(auth_url, '_blank', 'location=no');
                    windowRef.addEventListener('loadstart', codeReader);
                }
                return;
        }
        else {
            // saving event callbacks (by-id map)
            uiDescriptor = {"viewID":screenId};
        }

        if (!uiDescriptor) {
            screenEvents.onerror(new utils.Error('ERR_UNKNOWN_SCREEN_ID', screenId));
        }
        
        uiDescriptor.style = STYLE;
        var uiDescriptorJSON = JSON.stringify(uiDescriptor);
        utils.debug('LogonJsView.showScreen(): ' + uiDescriptorJSON + ', windowRef: ' + windowRef);

		var defaultContextJSON = '""';
        if (currentContext){
            if(currentContext.policyContext && currentContext.registrationContext && !currentContext.registrationContext.policyContext){
                currentContext.registrationContext.policyContext = currentContext.policyContext;
            }
            if (screenId === "SCR_GET_CERTIFICATE_PROVIDER_PARAMETER" || currentContext.registrationContext == null){
                defaultContextJSON = JSON.stringify(currentContext);
            }
            else {
                if (currentContext.busy){
                    currentContext.registrationContext.busy = currentContext.busy;
                }
               
                //SMP server side passcode policy is returned as part of root context, but when showing jsview, only
                //registration context is sent to jsview, so we need to copy the passcode policy from root context to
                //registration context
                if (currentContext.policyContext){
                    currentContext.registrationContext.policyContext = currentContext.policyContext;
                }
               
                defaultContextJSON = JSON.stringify(currentContext.registrationContext);
            }
        }
        		
        var payload = "showScreen(" + uiDescriptorJSON + "," + defaultContextJSON + ");";
        windowRef.executeScript(
            { code: payload },
            function (param) {
                utils.debug('executeScript returned:' + JSON.stringify(param));
            });
	}
    
	var evalIabEvent = function (event) {
        //for ios, the loadstop event is not fired for # command
        //for android, the loadstart event is not fired for # command
        //with the saml support, the loadstop event is used to detect saml auth finish flag for both ios and andorid client
        var handleEvent = {
            android :
            {
               loadstart: false,
               loadstop: true
            },
            ios :
            {
               loadstart: true,
               loadstop: false
            },
            windows :
            {
               loadstart: true,
               loadstop: false
            }

        };
               
        //The logic is:
        //1. for # command, android fire eithe loadstop or loadstart event to logoncontroller.
        //2. saml event will be fired only on loadstop event

        var url = document.createElement('a');
        //first check whether the submit payload is through localstorage
        if (event.url.indexOf("#SUBMIT&iabpayload") >= 0) {
            url.href = window.localStorage.getItem("iabpayload");
            if (event.type === "loadstop") {
                window.localStorage.removeItem("iabpayload");
            }
        }
        else {
            url.href = event.url;
        }
		var hash = decodeURIComponent(url.hash.toString());

		var fragments = hash.match(/#([A-Z]+)(\+.*)?/);
        if (fragments) {
            if (handleEvent[cordova.require("cordova/platform").id][event.type])
            {
                var eventId = 'on' + fragments[1].toLowerCase();
                var resultContext;
                if (fragments[2]) {
                    // TODO Pass on as a string, or deserialize ?
                    resultContext = JSON.parse(fragments[2].substring(1));
                    //resultContext = fragments[2].substring(1);
                }

                if (typeof eventId === 'string' && eventId !== null ) {
                    utils.debug('event: "' + eventId + '"');
                    if (eventId === 'onready' && state === 'INIT_IN_PROGRESS') {
                        utils.debug('IAB calling onwindowready');
                        onWindowReady();
                    } else if (eventId === 'onlog') {
                        utils.debug('IAB CHILDWINDOW:' + resultContext.msg);;
                    }
                    else if (events[eventId]) {
                        utils.debugJSON(resultContext, 'calling parent callback');
                        
                        events[eventId](resultContext);
                    }
                    else {
                        utils.log('invalid event: ' + eventId);
                    }
                }
            }
            else {
                utils.log('invalid event');
            }
        }
        else{
            if (event.type== 'loadstop') {
               utils.debug(event);
                if (events && events["onevent"]) {
                    events["onevent"](event);
                }
                else {
                    utils.debug('no events to process');
                }
            }
		}
    }
	
	var iabLoadStart = function(event) {
		utils.debug('IAB loadstart: ' + device.platform ); // JSON.stringify(event), do not log url as it may contain sensitive information
        evalIabEvent(event);
	};
	var iabLoadError = function(event) {
		utils.log('IAB loaderror: ' + event.url);
        
        if (device.platform == "windows" || device.platform == "Android") {
            events["onerror"](event);
        }
	};
    
	var iabExit = function(event) {
		
		state = 'NO_WINDOW';
		lastOperation = null;
		windowRef = null;
        if (event != null && typeof event != "undefined") {
		    utils.debug('IAB exit: ' + event.url);
		    setTimeout(events['oncancel'], 30);
		}
	};
	
	var iabLoadStop = function(event) {
		utils.debug('IAB loadstop: ' + device.platform ); //  JSON.stringify(event), do not log url as it may contain sensitive informatio
        // Need this event on windows to track the urls so that we can clear the cookies on a reset. Remove after webview supports clearing cookies. 
        if (device.platform === "windows") {
	        WinJS.Application.queueEvent(event);
	    }
        evalIabEvent(event);
	};
	
	
	var newScreen = function (path) {
	    utils.debug("create newScreen: " + path);

		var windowRef = window.open( path, '_blank', 'location=no,toolbar=no,overridebackbutton=yes,allowfileaccessfromfile=yes,closebuttoncaption=Cancel,hidenavigation=yes,isFromLogon=true');
		windowRef.addEventListener('loadstart', iabLoadStart);
		windowRef.addEventListener('loadstop', iabLoadStop);
		windowRef.addEventListener('loaderror', iabLoadError);
		windowRef.addEventListener('exit', iabExit);
		windowRef.addEventListener('backbutton', function(){
			if (state === 'ANDROID_STATE_SAML'){
				// Close the InAppBrowser if the user presses back from the SAML authentication page.
				// This will result in onFlowCancel being invoked.
				windowRef.close();
			} else if (events['onbackbutton']) {
        			utils.log('IABUI onbackbutton');
        			events['onbackbutton']();
      			} else if (events['oncancel']) {
        			utils.log('IABUI onbackbutton oncancel');
        			events['oncancel']();
      			}
		});
		pathOpened = path;
		return windowRef;
	}
	
    
//onClosed callback method will be called once the native window of inappbrowser is closed. 
//Open the new inappbrowser window before onClosed is called may fail   
	var close = function(onClosed, bSkipCancelOnClose) {
        
		if (state === 'NO_WINDOW') {
			utils.debug('IAB close, NO_WINDOW');
            //even if window is closed by others, the callback still needs to be invoked to continue the caller's logic
			if (typeof onClosed === 'function'){
                    onClosed();
			}
		}
		else if (state === 'INIT_IN_PROGRESS') {
			utils.debug('IAB close, INIT_IN_PROGRESS');
        	lastOperation = function(){
                clearWindow(onClosed, bSkipCancelOnClose);
            };
		
		}
		else if (state === 'READY') {
			utils.debug('IAB close, READY');
			clearWindow( onClosed, bSkipCancelOnClose);
		}
		else { //for android, the SAML window is closed when showing the previous screen, if no previous screen, then just close it
			clearWindow( onClosed, bSkipCancelOnClose);
		}
    }

    //when close method calls clearWindow, the inappbrowser window is not yet closed. so
    //do not reset the windowRef in this method. It will be reset when iabexit is called.
    //if cancel is skipped, it means just closing the inappbrowser, but do not cancel the registration or unlock
    //operation. To do so, temporarily set onCancel event handler to null.
    var clearWindow = function(onClosed, bSkipCancelOnClose) {
		utils.debug('IAB clear window');

                  
        var oncancel = null;
        if (bSkipCancelOnClose){
            oncancel = events['oncancel'];
            events['oncancel'] = null;
        }
        
        windowRef.close();
        
        if (device.platform == "windows") {
            iabExit();
        }
        
        if (typeof onClosed === 'function' ) {
            var interval = setInterval(function(){
                if (isClosed()){
                    clearInterval(interval);
                    events['oncancel'] = oncancel;
                    onClosed()
                }
            }, 100);
        }
        
	}

    var getPreviousScreenID = function() {
        return previousScreenID;
    }
 
    var getPreviousContext = function() {
        return previousContext;
    }
    
    var getStyle = function(){
        return STYLE;
    }
    
    var isClosed = function(){
        if (windowRef != null){
            return false;
        }
        else{
            return true;
        }
    }

	
//=================== Export with cordova ====================

    module.exports = {
    		showScreen: showScreenWithCheck,
			close: close,
			showNotification: showNotification,
            getPreviousScreenID: getPreviousScreenID,
            getPreviousContext: getPreviousContext,
            clearWindow:clearWindow,
            getStyle: getStyle,
            accessToken: null,
            refreshToken: null,
            tokenEndpoint: null,
            isClosed : isClosed
        };

