		var clientId = '823704617519.apps.googleusercontent.com';
		var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
		var scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
		var calid;
    	var events = new Array();
    	var calendars = new Array();
    	var curCalIndex = 0;
    	var curIndex = 0;

    	//Constructor for an event resource
    	function resource(title,id,description,tasks,start,end,complete) {
			this.title = title;
			this.id = id;
			this.description = description;
			this.tasks = tasks;
			this.start = start;
			this.end = end;
			this.complete = complete;
		}

		function calendar(name,id) {
			this.name = name;
			this.id = id;
		}



		//Checking for authentication with Google's OAuth API
		function handleClientLoad() {
	        gapi.client.setApiKey(apiKey);
	        window.setTimeout(checkAuth,1);
      	}

		function checkAuth() {
			gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
		}

		function handleAuthResult(authResult) {
			if (authResult && !authResult.error) {
				fetchUserInfo();
				var authTimeout = (authResult.expires_in - 5 * 60) * 1000;
				setTimeout(checkAuth, authTimeout);
			} 
			else {
				window.location="index.html";
			}
		}

		//Saves user info to a global object variable.
		function fetchUserInfo(){
	      gapi.client.load('oauth2', 'v1', function(){
	        var userinfo = gapi.client.request('oauth2/v1/userinfo?alt=json');
	        userinfo.execute(function(resp){
	          window.user={
	          	"email":resp.email,
	          	//"name":resp.given_name,
	          	//"id":resp.id
	          }
	          loadTimeline();
	        });
	      });
	    }

      // Loads the timeline on the side.  Display the results on the screen.
      	function loadTimeline() {
      		//Calls Google's API to retrieve all accessible calendars that have been prepended with Habitask's custom tag. In this case, all calendars created via Habitask are prepended with "&c_"
	  		gapi.client.load('calendar', 'v3', function() {
	  			var calendarRequest = gapi.client.calendar.calendarList.list();
		    	calendarRequest.execute(function(resp){
		    		calendars.length=0;
		    		for (var i=0;i<resp.items.length;i++) {
		    			if (resp.items[i].summary !== undefined) {
                    		if (resp.items[i].summary.substring(0, 3) == "&c_") {
                    			//Pushes each calendar to an object in the calendars array
		    					calendars.push(new calendar(resp.items[i].summary.substring(3),resp.items[i].id));
		    				}
		    			}
		    		}
		    		//Displays the list of calendars in a drop down
		    		$('#plan-select').empty();
		    		for (var i=0;i<calendars.length;i++)
		    		{
		    			if (i==curCalIndex)
		    				$('#plan-select').append('<option class="calselect" selected value="'+i+'" >'+calendars[i].name+'</option>');
		    			else 
		    				$('#plan-select').append('<option class="calselect" value="'+i+'" >'+calendars[i].name+'</option>');
		    		}
		    		//Calls Google's API to retrieve all events from the current Calendar
		    		var request = gapi.client.calendar.events.list({ 'calendarId': calendars[curCalIndex].id, 'orderBy': 'startTime', 'singleEvents': true });

				    request.execute(function(resp) {
				    	if (resp.items)
				    	{
				    		events.length=0;
					      	for (var i = 0; i < resp.items.length; i++) {
						        var parsedDate = new Date(resp.items[i].end.date);
						        var curDate = new Date();
						        if (curIndex==0 && parsedDate>=curDate)
						        	curIndex = i;
						        else
						        	curIndex = 0;
						        console.log(curIndex);
						        var fdate=(parsedDate.getMonth()+1)+'-'+(parsedDate.getDate()+1);
						        if (resp.items[i].description && resp.items[i].description.search("&d_"+user.email)!=-1)
						        	var eventComplete = "complete";
						        else 
						        	var eventComplete = "ncomplete";
						        console.log(eventComplete);
						        //Pushes each event to an object in the events array
						        events[i] = new resource(resp.items[i].summary,resp.items[i].id,resp.items[i].location,resp.items[i].description,resp.items[i].start.date,fdate,eventComplete);
					      	}
					      	printTimeline();
				      	}
				      	else
				      		alert ('Calendar contains no Milestones');
			    	});
		    	});

			});
		}

		//Iterates through the events array and displays each entry
		function printTimeline(){
	      	$('#list_events').empty();
	      	for (var j=0; j<events.length; j++) {
	      		if (j<curIndex)
	      			$('#list_events').append("<li class='pastdue "+events[j].complete+"'><h6>"+events[j].end+"</h6><span class='tooltip'><a index='"+j+"' class='eventlinks' id='"+events[j].id+"'>"+events[j].title+"</a></span></li>");
	      		else if (j==curIndex)
	      			$('#list_events').append("<li class='"+events[j].complete+"'><h6>"+events[j].end+"</h6><span class='tooltip' style='display:block;''><a index='"+j+"' class='eventlinks' id='"+events[j].id+"'>"+events[j].title+"</a></span></li>");
	      		else 
	      			$('#list_events').append("<li class='"+events[j].complete+"'><h6>"+events[j].end+"</h6><span class='tooltip'><a index='"+j+"' class='eventlinks' id='"+events[j].id+"'>"+events[j].title+"</a></span></li>");
	      	}
	      	$('#leftbar').show();
	      	clearScreen(curIndex);
		}

		//Displays info on one specific event
	  	function printInfo(index) {
		  		if (!events[index].tasks)
					{
						$('#miletitle').html(events[index].title);
						$('#miledesc').html(events[index].description);
						$('#miletitle').html(events[index].title).css({'text-decoration':'none'});
						$('#miledesc').html(events[index].description).css({'text-decoration':'none'});
						$('#mastercheck').html("<input type='checkbox' disabled/><label>Completed!</label>");
						alert('Tasks have not yet been added for this Milestone');
						$('#load-message').hide();
						$('.auth-console').show();
						return;
					}
		  		var parsedWords = new Array();
				var curWord = "";
				var i = 0;
				//Habitask stores the tasks of a Milestone in the description field of a gCal event. Each task is prepended with "&t_"
				//This iterates through the description string and parses out each task
				while (i<events[index].tasks.length)
				{
					if (i==events[index].tasks.length-1)
					{
						curWord=curWord+events[index].tasks[i];
						parsedWords.push(curWord);
						i++;
						continue;
					}
					
					if (events[index].tasks[i]=='&'&&events[index].tasks[i+1]=='t'&&events[index].tasks[i+2]=='_')
					{	
						parsedWords.push(curWord);
						curWord="";
						i=i+3;
						continue;
					}
					else 
						curWord=curWord+events[index].tasks[i];
					i++;
				}

				if (events[index].complete=="complete")
				{
					$('#duedate').html('You have completed this milestone');
					$('#miletitle').html(events[index].title).css({'text-decoration':'line-through'});
					$('#miledesc').html(events[index].description).css({'text-decoration':'line-through'});
					$('#mastercheck').html("<input type='checkbox' checked='checked' disabled/><label>Completed!</label>");
					for(i=1;i<parsedWords.length;i++)
						{
							$('#list_tasks').append("<div class='miletask'><div class='check'><input class='taskcheck' type='checkbox' checked /><label>Done!</label></div><div class='taskdata'><div class='tasktitle'>"+parsedWords[i]+"</div></div></div>");
						}
				}
				else
				{
					$('#duedate').html('Your next Milestone: Due '+events[index].end);
					$('#miletitle').html(events[index].title).css({'text-decoration':'none'});
					$('#miledesc').html(events[index].description).css({'text-decoration':'none'});
					$('#mastercheck').html("<input type='checkbox' disabled/><label>Completed!</label>");
					for(i=1;i<parsedWords.length;i++)
						{
							$('#list_tasks').append("<div class='miletask'><div class='check'><input class='taskcheck' type='checkbox' /><label>Done!</label></div><div class='taskdata'><div class='tasktitle'>"+parsedWords[i]+"</div></div></div>");
						}
				}
				$('#load-message').hide();
				$('.auth-console').show();
	  	}

	  	//Clears the screen
	  	function clearScreen(index) {
	  		$('#load-message').show();
	  		$('.auth-console').hide();
	  		$('#list_tasks, #miletitle, #duedate, #miledesc').empty();
	  		printInfo(index);
	  	}

	  	//Calls Google's API to update the calendar to allow the student user to "complete" the Milestone. This inserts the user's email prepended by "&d_" into the description field of the event as well"
	    function completeEvent(index){
	        gapi.client.load('calendar', 'v3', function() {
	            var eventToUpdateCall = gapi.client.calendar.events.get(
	                {'calendarId': calendars[curCalIndex].id , 'eventId': events[index].id}
	            );

	            gapi.client.calendar.events.get(
	                {'calendarId': calendars[curCalIndex].id , 'eventId': events[index].id}
	            ).execute(function(resp){
					var completeEmail = "&d_" + user.email;
					if (resp.description.search(completeEmail)==-1)
	            	{
						resp.description = completeEmail + " " + resp.description;
		            	var updateStage = gapi.client.calendar.events.update(
			               {'calendarId': calendars[curCalIndex].id, 'eventId': events[index].id, 'resource': resp}
			            );

		            	updateStage.execute(function(resp) {
					       console.log(resp);
						   if (resp.id){
						   	 alert("Event completed!");
						   }
						   else{
						   	alert("An error occurred. Please try again later.")
						   }
					       loadTimeline();
					     });
		            }
	            	else
	            		alert("Event has already been completed");
	            });
	        });
	    }


  	$(document).on('click', '.eventlinks', function(event){ 
  		curIndex = $(this).attr('index');
    	printTimeline();
	}); 

	$('#plan-select').change(function(){
		var temp = $(this).val();
		if (temp!=curCalIndex)
    	{
    		curCalIndex=temp;
    		loadTimeline();
    	}
	})

	$('#list_tasks').on('click', '.taskcheck', function(event){
		if (!$('input.taskcheck[type=checkbox]:not(:checked)').length)
    		completeEvent(curIndex);
    });