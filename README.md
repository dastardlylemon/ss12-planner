Habitask
============
A web application built primarily in JQuery that interfaces with the [Google Calendar API](https://developers.google.com/google-apps/calendar/) to create a student/teacher academic planner for students with ADHD. Created as part of the SS12 2013 Hackathon.

[View a working demo](http://www.thecalvinchan.com/sandbox/SS12)

###The Prompt
> Students with ADHD often require assistance with academic planning. This project seeks to develop a Google Calendar based tool that allows teachers and students to plan a homework project schedule together. The teacher would have a master calendar interface to create templated project event and define some number of milestones which the application could evenly layout between the beginning and the deadline. The student would be able to post progress on each milestone, which the teacher could then check off. Teachers and students would be in synch about project expectations and corrective actions could be taken if appropriate progress is not made – before the deadline.

###Features
* Fine-grain setting of tasks and milestones to reach goals
* Restricts visibility of next milestone to encourage focus on the current goal
* Links with Google Calendar and uses Google accounts for authentication

###Details
> Habitask is entirely powered by Google Calendar. The application is built using Javascript on Google's API for gCal. Due to the fact that the Javascript API for Google Calendar is currently in Beta, we are limited in what we can and cannot do. Users are authenticated onto our website using Google's OAuth API. There is a teacher interface for creating lesson plans, which correlate to entire calendars in gCal (the respective fields in gCal will be noted within paranthesis). Each lesson plan consists of Milestones (events in gCal, respectively). Each milestone consists of a title, description, due date, and respective tasks. All of these are stored in the various fields accessible through Google's Calendar API. The tasks of each milestone is stored in the description field of the event. Each task is prepended by "&t_". Furthermore, when a student finishes an event, his/her email address is prepended to the description with a "&d_" tag in front. Lastly, each calendar created through Habitask is prepended by "&c_". Together, these three tags allow Habitask to store and parse through user information on gCal.