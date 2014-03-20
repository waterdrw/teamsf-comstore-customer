$(document).ready(function(){

	var url = "http://teamsf.co.kr/~coms/donation_statistic_show.php";

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url
	}).done(function(data){
		console.log(data);

		$('#giving1').html(data.giving_1.giving_count);
		$('#giving2').html(data.giving_2.giving_count);
		$('#giving3').html(data.giving_3.giving_count);
		$('#giving4').html(data.giving_4.giving_count);
		
	});


});