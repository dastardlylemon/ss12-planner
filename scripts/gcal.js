

		var clientId = '823704617519.apps.googleusercontent.com';
		var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
		var scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
		var calid = 'g42kio0ms52em9nt39sjoulh7s@group.calendar.google.com';
		//evar event titles
    	var events = new Array();
    	//events.sort(function(a,b){return a>b ? -1 : a<b ? 1 : 0;})

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
				fetchUserInfo();
				var authTimeout = (authResult.expires_in - 5 * 60) * 1000;
				setTimeout(checkAuth, authTimeout);
			} 
			else {
				window.location="index.html";
			}
		}
		//Prints User Info by accessing json 
		function fetchUserInfo(callback,callback2,callback3){
	      gapi.client.load('oauth2', 'v1', function(){
	        var userinfo = gapi.client.request('oauth2/v1/userinfo?alt=json');
	        userinfo.execute(function(resp){
	          window.user={
	          	"email":resp.email,
	          	"name":resp.given_name,
	          	"id":resp.id
	          }
	          loadTimeline();
	          //$('#header').append('<h5>Welcome '+user.name+'! Your email address is '+user.email+'.</h5>');
	        });
	      });
	    }

      // Loads the timeline on the side.  Display the results on the screen.
      	function loadTimeline() {
	  		gapi.client.load('calendar', 'v3', function() {
	  			var calendarRequest = gapi.client.calendar.calendarList.list();
	  			window.curIndex = 0;
		    	var request = gapi.client.calendar.events.list({ 'calendarId': calid, 'orderBy': 'startTime', 'singleEvents': true });
		    	
		    	calendarRequest.execute(function(resp){
		    		for (var i=0;i<resp.items.length;i++) {
		    			console.log("CALENDAR ID "+resp.items[i].summary);
		    		}
		    	});

			    request.execute(function(resp) {
			      	for (var i = 0; i < resp.items.length; i++) {
				        var parsedDate = new Date(resp.items[i].end.date);
				        var curDate = new Date();
				        if (curIndex==0 && parsedDate>=curDate)
				        	curIndex = i;
				        var fdate=(parsedDate.getMonth()+1)+'-'+(parsedDate.getDate());
				        if (resp.items[i].description && resp.items[i].description.search("&d_"+user.email)!=-1)
				        	var eventComplete = "complete";
				        else 
				        	var eventComplete = "ncomplete";
				        events[i] = new resource(resp.items[i].summary,resp.items[i].id,resp.items[i].location,resp.items[i].description,resp.items[i].start.date,fdate,eventComplete);
			      	};
			      	printTimeline();
			    });
			});
		}

		function printTimeline(){
	      	$('#list_events').empty();
	      	for (var j=0; j<events.length; j++) {
	      		if (j<curIndex)
	      			$('#list_events').append("<li class='pastdue "+events[j].complete+"'><h6>"+events[j].end+"</h6><span class='tooltip'><a index='"+j+"' class='eventlinks' id='"+events[j].id+"'>"+events[j].title+"</a></span></li>");
	      		else 
	      			$('#list_events').append("<li class='"+events[j].complete+"'><h6>"+events[j].end+"</h6><span class='tooltip'><a index='"+j+"' class='eventlinks' id='"+events[j].id+"'>"+events[j].title+"</a></span></li>");
	      	}
	      	$('#leftbar').show();
	      	printInfo(curIndex);
		}

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
				while (i<events[index].tasks.length)
				{
					if (i==events[index].tasks.length-1)
					{
						curWord=curWord+events[index].tasks[i];
						parsedWords.push(curWord);
						i++;
						continue;
					}
					//MAJOR ISSUES AND LOGIC ERRORS
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
				//clears DOM element before insertion
				//$('#list_tasks, #miletitle, #miledesc').empty();
				//inserts data into DOM element
				if (events[index].complete=="complete")
				{
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

	  	function clearScreen(index) {
	  		$('#load-message').show();
	  		$('.auth-console').hide();
	  		$('#list_tasks, #miletitle, #miledesc').empty();
	  		printInfo(index);
	  	}

	    function completeEvent(index){
	        gapi.client.load('calendar', 'v3', function() {
	            var eventToUpdateCall = gapi.client.calendar.events.get(
	                {'calendarId': calid , 'eventId': events[index].id}
	            );

	            eventToUpdateCall.execute(function(resp){

					var completeEmail = "&d_" + user.email;
					if (resp.description.search(completeEmail)==-1)
	            	{
						resp.description = completeEmail + " " + resp.description;
		            	var updateStage = gapi.client.calendar.events.update(
			               {'calendarId': calid, 'eventId': events[index].id, 'resource': resp}
			            );

		            	updateStage.execute(function(resp) {
					       console.log(resp);
						   if (resp.id){
						   	 alert("Event completed!");
						   }
						   else{
						   	alert("An error occurred. Please try again later.")
						   }
					       clearScreen(loadTimeline,loadEvent);
					     });
		            }
	            	else
	            		alert("Event has already been completed");
	            });
	        });
	    }


  	$(document).on('click', '.eventlinks', function(event){ 
  		var index = $(this).attr('index');
    	clearScreen(index);
	}); 

	$('#list_tasks').on('click', '.taskcheck', function(event){
		if (!$('input.taskcheck[type=checkbox]:not(:checked)').length)
    		completeEvent(curIndex);
    });






