$('form').submit(function(e){
	
	e.preventDefault();
	
	obj = system.serializeObject('#'+$(this).attr('id'));
	
	system.send(obj);
	
});

