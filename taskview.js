// TaskView = Backbone.View.extend({
//     initialize: function(){
//         this.render();
//     },
//     render: function(){
//         // Compile the template using underscore
//         var template = _.template( $("#task_template").html(), {} );
//         // Load the compiled HTML into the Backbone "el"
//         this.$el.html( template );
//     },
//     events: {
//         "click input[type=button]": "showDescription"  
//     },
//     doTask: function( event ){
//         // Button clicked, you can access the element that was clicked with event.currentTarget
//         alert( "Task for " + $("#task_input").val() );
//     }
// });
    
// var task_view = new TaskView({ el: $("#search_container") });

// Milestone.listento(Task,'change'Milestone.render);




var TaskTemplate = Handlebars.compile(
    "<p>{{ name }} is complete? {{ complete }}</p><a href='#' class='complete'>Complete</a>"
);

var EventTemplate = Handlebars.compile(
    "<h1>{{ name }} EVENT</h1>"
);

var EventView = Backbone.View.extend({
    tagName: 'li',
    className: 'event',
    el: 'body',
    template: EventTemplate,
    initialize: function(){
        this.model = new Event();
        this.render();
    },
    render: function(){
        this.$el.html(this.template(this))
        return this;
    },
    name: function() { return this.model.get('eventName');}
})

var TaskView = Backbone.View.extend({
    tagName: 'p',
    className: 'task',
    el: 'body',
    template: TaskTemplate,
    initialize: function(){
        this.model = new Task();
        this.render();
        alert(this.model.get('taskDesc'))
    },
    events: {
        'click .complete': 'completeTask'
    },
    completeTask: function() {
        this.model.set('taskComp',true);
        this.render();
        alert(this.name() + ' : ' + this.complete());
    },
    render: function(){
        this.$el.html(this.template(this))
        return this;
    },
    
    name: function() { return this.model.get('taskDesc'); },
    complete: function() { if (this.model.get('taskComp')) return 'true'; else return 'false';},
});

window.selClass = new Class();
window.selEvent = new Event();

var numEvents = 3;
var nameEvent = "EVENT NAME IN GCAL";
var descEvent = "EVENT DESC IN GCAL";
var dateEvent = "EVENT NAME IN GCAL";
var compPerc = 0.8;
var compEvent = false;

window.sampletask = new TaskView({el: $("#tasks")});



