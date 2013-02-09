    var clientId = '823704617519.apps.googleusercontent.com';
	var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
	var scopes = 'https://www.googleapis.com/auth/calendar';
	var calid = 'g42kio0ms52em9nt39sjoulh7s@group.calendar.google.com';
    var evar = new Array();

		
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
        desc[i] = resp.items[i].description;
      }
    });
  });
}

$(document).ready(function(){
	for(i=0;i<evar.length;i++)
	{
		var parsedWords = new Array();
		var curWord="";
		for(j=0;i<desc.length;j++)
		{
			if(desc[i][j]=='t'||desc[i][j]=='_')
			{	continue;}
			else if (desc[i][j]=='%')
			{
				parsedWords.push(curWord);
				continue;
			}
			else
			{
				curWord=curWord+desc[i][j];
			}
		}
	}
		$('#listTasks').append('
		<div class="miletask five columns">
        <div class="check">
        <input type="checkbox" />
        <label>Done!</label>
      	</div>
        <div class="taskdata">
        <div class="taskdesc">'+parsedWords[x]+'</div>
      	</div>
      	</div>');
	
});