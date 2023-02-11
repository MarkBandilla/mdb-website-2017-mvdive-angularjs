	$('#sea-temperature').attr('src','https://www.seatemperature.org/asia/philippines/coron.htm');
	$('#sea-temperature').on('load', function() {
		var iframe = document.getElementById('iframe');
  		
		var temp = $(iframe).contents().find("html").html();
		console.log('coron', temp);
	});	
