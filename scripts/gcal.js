

		var clientId = '823704617519.apps.googleusercontent.com';
		var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
		var scopes = 'https://www.googleapis.com/auth/calendar';
		var calid = 'g42kio0ms52em9nt39sjoulh7s@group.calendar.google.com';
		//evar event titles
    	var evar = new Array();
    	//event id 
    	var eid = new Array();
    	//event date
    	var edate = new Array();

		
		// due to the way the google API works, these access codes only work for me. replace with your own if you want to run off a local server


      // Loads the timeline on the side.  Display the results on the screen.
      	function loadTimeline() {
	  		gapi.client.load('calendar', 'v3', function() {
		    	var request = gapi.client.calendar.events.list({ 'calendarId': calid, 'orderBy': 'startTime', 'singleEvents': true });

			    request.execute(function(resp) {
			      	for (var i = 0; i < resp.items.length; i++) {
				        var li = document.createElement('li');
				        li.appendChild(document.createTextNode(resp.items[i].summary));
				        evar[i] = resp.items[i].summary;
				        console.log(evar[i]);
				        eid[i] = resp.items[i].id;
				        console.log(eid[i]);
				        var parsedDate = new Date(resp.items[i].end.date);
				        edate[i]=(parsedDate.getMonth()+1)+'-'+(parsedDate.getDate());
				      	$('#list_events').append("<li><h6>"+edate[i]+"</h6><span class='tooltip'><a eid='"+eid[i]+"' class='eventlinks' id='"+eid[i]+"'>"+evar[i]+"</a></span></li>");
			      	};
			    });
			});
	  	}
	  	//Loads an individual event
	  	function loadEvent(uid) {
	  		gapi.client.load('calendar', 'v3', function() {
			    var requestDesc = gapi.client.calendar.events.get({ 'calendarId': calid , 'eventId': uid});

				requestDesc.execute(function(resp) { 
					var title = resp.summary;
					var description = resp.description;
					console.log(description);
					printInfo(title,description);
				});
			});
		}

	  	function printInfo(lamft,lamfs) {
	  			console.log("LAMFT "+lamft);
		  		console.log("LAMFS "+lamfs);
		  		var parsedWords = new Array;
				var curWord = "";
				var i = 0;
				while (i<lamfs.length)
				{
					if (i==lamfs.length-1)
					{
						curWord=curWord+lamfs.charAt(i);
						parsedWords.push(curWord);
						i++;
						continue;
					}
					//MAJOR ISSUES AND LOGIC ERRORS
					if (lamfs[i]=='&'&&lamfs[i+1]=='t'&&lamfs[i+2]=='_')
					{	
						parsedWords.push(curWord);
						curWord="";
						i=i+3;
						continue;
					}
					else 
						curWord=curWord+lamfs.charAt(i);
					i++;
				}
				console.log(parsedWords[1]);
				console.log(parsedWords[2]);
				//clears DOM element before insertion
				$('#list_tasks, #miletitle').empty();
				$('#miletitle').html(lamft);
				for(i=1;i<parsedWords.length;i++)
					{
						$('#list_tasks').append("<div class='miletask'><div class='check'><input type='checkbox' /><label>Done!</label></div><div class='taskdata'><div class='tasktitle'>"+parsedWords[i]+"</div></div></div>");
					}
	  	}

  	$(document).on('click', '.eventlinks', function(event){ 
  		var tempid = $(this).attr('eid');
    	alert('Finish your current task first!');
    	//var pathname = window.location.pathname;
    	console.log("TEMP ID " +tempid);
    	loadEvent(tempid);
	}); 






