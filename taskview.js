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
    "{{ name }} publius"
);

var TaskView = Backbone.View.extend({
    tagName: 'li',
    className: 'task',
    el: 'body',
    template: TaskTemplate,
    initialize: function(){
        this.model = new Task;
        this.render();
        alert("initialized")
    },
    render: function(){
        this.$el.html(this.template(this))
        return this;
    },
    name: function() { return this.model.taskDesc; }
    // events: {
    //     "click input[type=button]": "showDescription"  
    // },
    // doMilestone: function( event ){
    //     // Button clicked, you can access the element that was clicked with event.currentTarget
    //     alert( "Milestone for " + $("#milestone_input").val() );
    // },
    // Task.on("change", this.render)
});

window.sampletask = new TaskView({el: $("container")});


