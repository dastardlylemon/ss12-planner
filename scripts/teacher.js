      var clientId = '823704617519.apps.googleusercontent.com';
      var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
      var scopes = 'https://www.googleapis.com/auth/calendar';
      var calnames = new Array();
      
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
        console.log("okay");
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
          makeApiCall();
          var authTimeout = (authResult.expires_in - 5 * 60) * 1000;
        setTimeout(checkAuth, authTimeout);
        } else {
          authorizeButton.onclick = handleAuthClick;
          console.log("Error! Could not authenticate!");
        }
      }

      function handleAuthClick(event) {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
        return false;
      }

      // Load the API and make an API call.  Display the results on the screen.
      function makeApiCall() {
      gapi.client.load('calendar', 'v3', function() {
      var request = gapi.client.calendar.calendarList.list();

      // loads all calendars with the appropriate  
      request.execute(function(resp) { 
      for (var i = 0; i < resp.items.length; i++) {
        if (resp.items[i].description !== undefined) {
          if (resp.items[i].description.substring(0,3) == "&c_")
            calnames.push(resp.items[i].description);
        }
      }

      for (var j = 0; j < calnames.length; j++) 
        console.log(calnames[i]);

      // display the block if there are no calendars already established
      if (calnames && calnames.length <= 0) {
        var nocalblock = document.getElementById('noplans');
        nocalblock.style.visibility = '';
      } else {
        var oneplan = document.getElementById('oneplan');
        oneplan.style.visibility = '';
      }
    });
  });
}