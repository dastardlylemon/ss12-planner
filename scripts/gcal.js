var clientId = '823704617519.apps.googleusercontent.com';
		var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
		var scopes = 'https://www.googleapis.com/auth/calendar';
		var calid = 'g42kio0ms52em9nt39sjoulh7s@group.calendar.google.com';
    var evar = new Array();

    var eid = new Array();

		
		// due to the way the google API works, these access codes only work for me. replace with your own if you want to run off a local server

      // Use a button to handle authentication the first time. 
      function handleClientLoad() {
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth,1);
      }

      function checkAuth() {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
      }

      function handleAuthResult(authResult) {
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
          authorizeButton.style.visibility = 'hidden';
          makeApiCall();
          var authTimeout = (authResult.expires_in - 5 * 60) * 1000;
    	  setTimeout(checkAuth, authTimeout);
        } else {
          authorizeButton.style.visibility = '';
          authorizeButton.onclick = handleAuthClick;
        }
      }

      function handleAuthClick(event) {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
        return false;
      }

      // Load the API and make an API call.  Display the results on the screen.
      function makeApiCall() {
  		gapi.client.load('calendar', 'v3', function() {
    	var request = gapi.client.calendar.events.list({ 'calendarId': calid });

	    request.execute(function(resp) {
	      for (var i = 0; i < resp.items.length; i++) {
	        var li = document.createElement('li');
	        li.appendChild(document.createTextNode(resp.items[i].summary));
	        evar[i] = resp.items[i].summary;
	        console.log(evar[i]);
	        eid[i] = resp.items[i].id;
	        console.log(eid[i]);
	      }
	    });
	    var requestDesc = gapi.client.calendar.events.get({ 'calendarId': calid , 'eventId': 'sssjtb43u55ek0uidvh9u16f20'});
		requestDesc.execute(description = function(resp) {return resp.description;});
	  })};

	  var parsedWords=new Array;
	  var curWord="";
	  var i = 0;
	  while (i<description.length)
	  {
	  	if (description[i]=='%'&&description[i+1]=='t'&&description[i+2]=='_')
	  	{	parsedWords.push(curWord);
	  		curWord="";
	  		i=i+2;
	  		continue;}
	  	else 
	  		curword=curword+description[i];
	  	i++;
	  }
	  console.log(parsedWords);




