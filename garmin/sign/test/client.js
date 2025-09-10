$('#ledon-button').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:1337/LEDon',
		success: function (resp) {
			console.log("Success: "+resp);
		},
		error : function(err){
			console.log("Error: " + err);
		}
    });
});