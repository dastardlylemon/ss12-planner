$(document).ready(function() {
	for(i=0;i<window.parsedWords.length;i++)
	{
		$('#list_tasks').append('<div class="miletask five columns"><div class="check"><input type="checkbox" /><label>Done!</label></div><div class="taskdata"><div class="taskdesc">'+parsedWords[i]+'</div></div></div>');
	}
})