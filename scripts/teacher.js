// global variables and constants
var clientId = '823704617519.apps.googleusercontent.com';
var apiKey = 'AIzaSyD6B1gCukBc6Hudi0oNLXNZaCYSg1pU_MU';
var scopes = 'https://www.googleapis.com/auth/calendar';
var calnames = new Array();
var calids = new Array();
var calval;
var calid;
var currentPlan = 0;

// due to the way the google API works, these access codes only work for me. replace with your own if you want to run off a local server

// adds a new calendar
function addcal() {
    calval = '&c_' + document.getElementById('calname').value;
    console.log(calval);
    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.calendars.insert({
            'resource': {
                'summary': calval
            }
        });
        request.execute(function (resp) {
            console.log(resp);
            calid = resp.id;
            console.log(calid);
        });
    })
    location.reload();
}

// adds a new milestone to the plan
function insertEvent() {
    var ms_title = document.getElementsByName('mile_name')[0].value;
    var ms_desc = document.getElementsByName('mile_desc')[0].value;
    var ms_time = document.getElementsByName('mile_date')[0].value;
    var ms_tasks = document.getElementsByName('task_desc');

    var ms_tdesc = '';
    // generate the tasks
    for (var i = 0; i < ms_tasks.length; i++) {
        // trim leading/trailing whitespace from tasks, only adds if it's not empty
        var thisTask = ms_tasks[i].value.replace(/^\s+/, '').replace(/\s+$/, '');
        if (thisTask === '') continue;
        else ms_tdesc = ms_tdesc + '&t_' + thisTask + ' ';
    }
    console.log(ms_tdesc);

    // generate a new gcal event resource
    var resource = {
        "summary": ms_title,
        "description": ms_tdesc,
        "location": ms_desc,
        "start": {
            "date": ms_time
        },
        "end": {
            "date": ms_time
        }
    };
    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.events.insert({
            'calendarId': calids[currentPlan],
            'resource': resource
        });
        request.execute(function (resp) {
            console.log(resp);

            // and yet it usually refreshes before it can display an alert. oh, well.
            if (resp.id) {
                console.log("Milestone successfully added!");
                loadMilestones();
                clearInputs();
            } else {
                console.log("An error occurred. Please try again later.")
            }

        });
    });
    return false;
}

// utility function for clearing everything after a button is pressed
function clearInputs() {
    var elements = document.getElementsByTagName("input");
    for (var ii = 0; ii < elements.length; ii++) {
        if (elements[ii].type == "text") {
            elements[ii].value = "";
        }
    }
}

// Use a button to handle authentication the first time. 
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
    }, handleAuthResult);
}


function handleAuthResult(authResult) {
    // interim authorization code, though you shouldn't be able to get here without being authorized
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
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: false
    }, handleAuthResult);
    return false;
}

// this doesn't work and i don't even need it right now
/*    function getCalList() {
  gapi.client.load('calendar', 'v3', function() {
      var request = gapi.client.calendar.calendarList.list({ showHidden : true });

      request.execute(function(resp) {
          for (var i = 0; i < resp.items.length; i++) {
              if (resp.items[i].summary !== undefined) {
                  if (resp.items[i].summary.substring(0,3) == "&c_") {
                      calendarNames.push(resp.items[i].summary);
                      console.log(resp.items[i].summary);
                      calendarIDs.push(resp.items[i].id);
                      console.log(resp.items[i].id);
                  }
              }
          }
      }
      //omg what
      for (var j = 0
      //do something here
  }
*/


// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.calendarList.list({
            showHidden: true
        });

        // we've been authorized, so let's display the stuff
        document.getElementById('load-message').style.display = 'none';
        document.getElementById('auth-console').style.display = 'block';

        // loads all calendars with the appropriate name
        request.execute(function (resp) {
            for (var i = 0; i < resp.items.length; i++) {
                if (resp.items[i].summary !== undefined) {
                    if (resp.items[i].summary.substring(0, 3) == "&c_") {
                        calnames.push(resp.items[i].summary);
                        calids.push(resp.items[i].id);
                    }

                }
            }
            draw();
        });
    });
}

function draw() {
    loadMilestones();

    // change the text as appropriate
    if (calnames && calnames.length > 0) {
        var oneplan = document.getElementById('oneplan');
        oneplan.style.visibility = '';
        oneplan.style.display = 'block';
        document.getElementById('noplans').innerHTML = "<h3>Add a new plan:</h3>";
    }

    // show a dropdown if there are multiple plans
    if (calnames && calnames.length >= 1) document.getElementById('current-plan').style.visibility = '';

    // create a select list if more than one calendar
    if (calnames.length >= 1) {
        var select = document.createElement('select');
        select.setAttribute('name', 'plans');
        select.setAttribute('id', 'select-plans');

        select.onchange = function () {
            currentPlan = select.value;
            console.log(currentPlan);
            loadMilestones();
        }

        var option;
        for (var k = 0; k < calnames.length; k++) {
            option = document.createElement('option');
            var namae = calnames[k].substring(3);
            option.setAttribute('value', k);
            option.innerHTML = namae;
            select.appendChild(option);
        }
        document.getElementById('current-plan').appendChild(select);
    }
}

// load/refresh the milestone list
function loadMilestones() {
    var request = gapi.client.calendar.events.list({
        'calendarId': calids[currentPlan]
    });

    var mdiv = document.getElementById('milestones');
    mdiv.style.display = 'block';
    mdiv.setAttribute('style', '');
    mdiv.innerHTML = "<h3>Milestones:</h3>";
    var mstone;
    request.execute(function (resp) {
        if (resp.items) {
            for (var j = 0; j < resp.items.length; j++) {
                console.log(resp.items[j].summary);
                mstone = document.createElement('div');
                mstone.setAttribute('class', 'milestone');
                mstone.innerHTML = resp.items[j].summary;
                mdiv.appendChild(mstone);
            }
        } else {
            mdiv.innerHTML = "<h5>No Milestones available</h5>";
            mdiv.setAttribute('style', 'margin-bottom: -90px;');
        }
    })
}