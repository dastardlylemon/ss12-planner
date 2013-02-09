var Class = Backbone.Collection.extend({
	model: Event,
	className: 'Default Class Name'
})

//Milestones will be Events in gCal that contain Tasks
var Event = Backbone.Collection.extend({
	model: Task,
	eventName: 'Default Event Name',
	eventDesc: 'Default Milestone Description',
	eventDate: 'Expected Completion Date',
	eventPerc: 0,
	eventComp: false
})

//Tasks will be parsed from the description in the event
var Task = Backbone.Model.extend({
	//String after %t
	defaults:{
	'taskDesc': 'Default Task Description',
	//Task completed boolean
	'taskComp': false
	}
})

////////////////////////////////////////////////////////////////////////////////////////////////////









