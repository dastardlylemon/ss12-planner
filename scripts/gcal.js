

		var clientId = '823704617519.apps.googleusercontent.com';
		var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
		var scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
		var calid = 'g42kio0ms52em9nt39sjoulh7s@group.calendar.google.com';
		//evar event titles
    	var events = new Array();
    	events.sort(function(a,b){return a>b ? -1 : a<b ? 1 : 0;})

    	//Constructor for an event resource
    	function resource(title,id,description,tasks,start,end) {
			this.title = title;
			this.id = id;
			this.description = description;
			this.tasks = tasks;
			this.start = start;
			this.end = end;
		}
		 

		
		// due to the way the google API works, these access codes only work for me. replace with your own if you want to run off a local server
		function handleClientLoad() {
	        gapi.client.setApiKey(apiKey);
	        window.setTimeout(checkAuth,1);
      	}

		function checkAuth() {
			gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
		}

		function handleAuthResult(authResult) {
			if (authResult && !authResult.error) {
				loadTimeline();
				fetchUserInfo(loadEvent);
				var authTimeout = (authResult.expires_in - 5 * 60) * 1000;
				setTimeout(checkAuth, authTimeout);
			} 
			else {
				window.location="index.html";
			}
		}
		//Prints User Info by accessing json 
		function fetchUserInfo(eid){
	      gapi.client.load('oauth2', 'v1', function(){
	        var userinfo = gapi.client.request('oauth2/v1/userinfo?alt=json');
	        userinfo.execute(function(resp){
	          window.user={
	          	"email":resp.email,
	          	"name":resp.given_name,
	          	"id":resp.id
	          }
	          eid('sssjtb43u55ek0uidvh9u16f20');
	          //$('#header').append('<h5>Welcome '+user.name+'! Your email address is '+user.email+'.</h5>');
	        });
	      });
	    }

      // Loads the timeline on the side.  Display the results on the screen.
      	function loadTimeline() {
	  		gapi.client.load('calendar', 'v3', function() {
	  			var calendarRequest = gapi.client.calendar.calendarList.list();
		    	var request = gapi.client.calendar.events.list({ 'calendarId': calid, 'orderBy': 'startTime', 'singleEvents': true });
		    	
		    	calendarRequest.execute(function(resp){
		    		for (var i=0;i<resp.items.length;i++) {
		    			console.log("CALENDAR ID "+resp.items[i].summary);
		    		}
		    	});

			    request.execute(function(resp) {
			      	for (var i = 0; i < resp.items.length; i++) {
				        var parsedDate = new Date(resp.items[i].end.date);
				        var edate=(parsedDate.getMonth()+1)+'-'+(parsedDate.getDate());
				        events[i] = new resource(resp.items[i].summary,resp.items[i].id,resp.items[i].location,resp.items[i].description,resp.items[i].start.date,resp.items[i].end.date);
				      	$('#list_events').append("<li><h6>"+edate+"</h6><span class='tooltip'><a eid='"+events[i].id+"' class='eventlinks' id='"+events[i].id+"'>"+events[i].title+"</a></span></li>");
			      	};
			      	$('#leftbar').show();
			    });
			});
	  	} 

	  	//Loads an individual event
	  	function loadEvent (uid) {
	  		window.curUID=uid;
	  		gapi.client.load('calendar', 'v3', function() {
			    var requestDesc = gapi.client.calendar.events.get({ 'calendarId': calid , 'eventId': uid});

				requestDesc.execute(function(resp) { 
					var title = resp.summary;
					var description = resp.location;
					var taskstring = resp.description;
	  				var completeEmail = "&d_" + user.email;
	  				if (taskstring && taskstring.search(completeEmail)!=-1)
	  					var eventComplete = true;
	  				else
	  					var eventComplete = false;
					console.log(description);
					printInfo(title,description,taskstring,eventComplete);
				});
			});
		}

	  	function printInfo(lamft,lamfd,lamfs,itfec) {
		  		if (!lamfs)
					{
						$('#miletitle').html(lamft);
						$('#miledesc').html(lamfd);
						alert('Tasks have not yet been added for this Milestone');
						$('#load-message').hide();
						return;
					}
		  		var parsedWords = new Array();
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
				//clears DOM element before insertion
				$('#list_tasks, #miletitle, #miledesc').empty();
				//inserts data into DOM element
				if (itfec)
				{
					$('#miletitle').html(lamft).css({'text-decoration':'line-through'});
					$('#miledesc').html(lamfd).css({'text-decoration':'line-through'});
					$('#mastercheck').html("<input type='checkbox' checked='checked' disabled/><label>Completed!</label>");
					for(i=1;i<parsedWords.length;i++)
						{
							$('#list_tasks').append("<div class='miletask'><div class='check'><input class='taskcheck' type='checkbox' checked /><label>Done!</label></div><div class='taskdata'><div class='tasktitle'>"+parsedWords[i]+"</div></div></div>");
						}
				}
				else
				{
					$('#miletitle').html(lamft).css({'text-decoration':'none'});
					$('#miledesc').html(lamfd).css({'text-decoration':'none'});
					$('#mastercheck').html("<input type='checkbox' disabled/><label>Completed!</label>");
					for(i=1;i<parsedWords.length;i++)
						{
							$('#list_tasks').append("<div class='miletask'><div class='check'><input class='taskcheck' type='checkbox' /><label>Done!</label></div><div class='taskdata'><div class='tasktitle'>"+parsedWords[i]+"</div></div></div>");
						}
				}
				$('#load-message').hide();
				$('.auth-console').show();
	  	}

	  	function clearScreen(callback,uid) {
	  		$('#load-message').show();
	  		$('.auth-console').hide();
	  		callback(uid);
	  	}

	    function completeEvent(uid){
	        gapi.client.load('calendar', 'v3', function() {
	            var eventToUpdateCall = gapi.client.calendar.events.get(
	                {'calendarId': calid , 'eventId': uid}
	            );

	            eventToUpdateCall.execute(function(resp){

					var completeEmail = "&d_" + user.email;
					if (resp.description.search(completeEmail)==-1)
	            	{
						resp.description = completeEmail + " " + resp.description;
		            	var updateStage = gapi.client.calendar.events.update(
			               {'calendarId': calid, 'eventId': uid, 'resource': resp}
			            );

		            	updateStage.execute(function(resp) {
					       console.log(resp);
						   if (resp.id){
						   	 alert("Event completed!");
						   }
						   else{
						   	alert("An error occurred. Please try again later.")
						   }
					       clearScreen(loadEvent,uid);
					     });
		            }
	            	else
	            		alert("Event has already been completed");
	            });
	        });
	    }


  	$(document).on('click', '.eventlinks', function(event){ 
  		var tempid = $(this).attr('eid');
    	clearScreen(loadEvent,tempid);
	}); 

	$('#list_tasks').on('click', '.taskcheck', function(event){
		if (!$('input.taskcheck[type=checkbox]:not(:checked)').length)
    		completeEvent(curUID);
    });






