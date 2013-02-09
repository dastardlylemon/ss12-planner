var Class = Backbone.collection.extend({
	model: Milestone,
	className: 'Default Class Name'
})

//Milestones will be Events in gCal that contain Tasks
var Event = Backbone.collection.extend({
	model: Task,
	eventName: 'Default Event Name',
	eventDesc: 'Default Milestone Description',
	eventDate: 'Expected Completion Date'm,
	eventPerc: 0,
	eventComp: false
})

//Tasks will be parsed from the description in the event
var Task = Backbone.Model.extend({
	//String after %t
	taskDesc: 'Default Task Description'
	//Task completed boolean
	taskComp: false,
})

////////////////////////////////////////////////////////////////////////////////////////////////////

var selClass = new Class({goalName: 'THE NAME OF THE CLASS'})

for (int i=0;i<"NUMBER OF GCAL EVENTS";i++)
{
	selClass.add({
		eventName: "EVENT NAME IN GCAL",
		eventDesc: "EVENT DESC IN GCAL",
		eventDate: "EVENT DATE IN GCAL",
		eventPerc: "COMPLETION PERCENTAGE IN GCAL",
		if ("STUDENT ID IN EVENT DESC IS PRESENT")
			eventComp: true;
		else
			eventComp: false;
	})


}





