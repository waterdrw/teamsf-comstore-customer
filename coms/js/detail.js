
var g_lh = null;

function initAll ()
{
	var shopId = $.getUrlVar("shopId");
	g_lh = new LoginHandler ();
	
	initMenuPage ();
	initLocationPage ();
	
	$("#inner-wrapper").css("display","none");
	$("#loading-wrapper").css("display","block");
	
	$("#btn-buy").on ( "tap" , function()
	{
		if ( g_lh.isLogged() == true ) { location.href = "./buy.html?shopId=" + shopId; }
		else { location.href = "../member/index.html"; }
	});
	
	var param = null;
	if ( g_lh.isLogged () == true ) 
	{
		param = { sid:shopId, mid:g_lh.getLocalLoginInfo().id };
	}
	else { param = { sid:shopId }; }
	
	$.ajax ({
		url:"http://teamsf.co.kr/~coms/shop_detail_show.php",
		type:"post",
		dataType:"json",
		data:param,
		success:function ( currentShop )
		{
			var openTime = currentShop.start_time + " ~ " + currentShop.end_time;
			
			$("#name").html(currentShop.category_name);
	        $("#location").html(currentShop.location);
	        $("#time").html(openTime);
	        $("#closed").html(currentShop.closed);
	        $("#phone").html(currentShop.phone);
	        $("#profile-img").attr("src", currentShop.profile_img_path);
	        $("#shop-address").html("<i class='icon-map-marker'></i> "+currentShop.address);

	        $("#combo1").html(currentShop.combo_1);
	        $("#combo2").html(currentShop.combo_2);
	        $("#combo3").html(currentShop.combo_3);
	        $("#combo4").html(currentShop.combo_4);
	        $("#combo5").html(currentShop.combo_5);

	        $(".currentCombo").html(currentShop.member_combo-1);
	        $(".currentCombo2").html(currentShop.member_combo);
	        $("#left-comboday").html(currentShop.combo_left_day);

	        $("#title").html(currentShop.name);
	        $("#tag-phone").attr("href", "tel:"+currentShop.phone);
	        $(".combo-box:nth-child("+parseInt(currentShop.member_combo)+")").addClass("active");

			$("#inner-wrapper").css("display","block");
			$("#loading-wrapper").css("display","none");
			
			// Passing shop variables to sub pages
			$("#page-location").attr("lat",currentShop.latitude)
			.attr("lng",currentShop.longitude)
			.attr("sname",currentShop.name);

			$('#btn-location').on('click', function(){
				location.href = "./viewLocation.html?address="+encodeURIComponent(currentShop.address)+
				"&lat="+currentShop.latitude+
				"&lng="+currentShop.longitude;
			});
			
			$("#page-menu").attr("imgaddr",currentShop.menu_img_path)
			.attr ( "sname",currentShop.name);
		}
	});
	$.ajax({
		url:"http://teamsf.co.kr/~coms/shop_benefit_list_show.php",
		type:"post",
		dataType:"json",
		data:param,
		success:function(benefit){
			if (benefit.length == 0) { return 0; }			
			var html = "<ul class='list-shop-benefits'>";
			for(var i in benefit) { 
				
				html += "<li class='list-shop-benefit type"+benefit[i].benefit_type+"'><p class='benefit-desc'><span class='combo-count'>"+benefit[i].combo_count+
						"</span><span style='font-size:13px'>콤보 서비스</span><span class='benefit-type type"+benefit[i].benefit_type+"'>"+returnReward(benefit[i].benefit_type)+
						"</span></p><p class='benefit-desc2'>"+benefit[i].benefit_desc+"</p></li>"; 				
			}
			html+="</div>";			
			$("#area-shop-benefit").html(html);
		}
	})
}

function returnReward(num) {
	var temp;

	switch(num){
		case "0":
			temp = "공짜메뉴";
		break;
		case "1":
			temp = "내맘대로";
		break;
		case "2":
			temp = "랜덤";
		break;
		case "3":
			temp = "1+1";
		break;
		case "4":
			temp = "콤보세트";
		break;
		case "5":
			temp = "쿠폰";
		break;
		case "6":
			temp = "사은품";
		break;
		case "7":
			temp = "이벤트";
		break;
		case "8":
			temp = "비밀이야";
		break;
		case "9":
			temp = "판타스틱";
		break;
	}
	return temp;
}
function initMenuPage ()
{
	$("#page-menu").on ( "pagebeforeshow" , function ()
	{
		var imgPath = $(this).attr("imgaddr");
		var shopName = $(this).attr("sname");
		
		$("#menu-inner-wrapper").css("display","none");
		$("#menu-loading-wrapper").css("display","block");
		
		$("#title-menu").html(shopName);
		$("#menu-img").attr({
			"src":imgPath,
			"width":"100%"
		});
	});
	
	$("#page-menu").on ( "pageshow" , function ()
	{
		$("#menu-inner-wrapper").css("display","block");
		$("#menu-loading-wrapper").css("display","none");
	});
}

function initLocationPage ()
{
	$("#page-location").on ( "pagebeforeshow" , function ()
	{
		//navigator.notification.activityStart("위치보기", "지도 정보를 가져오는 중...");
		//$("#content-location").css("display","invisible");
		var params = {};
		
		var lat = $("#page-location").attr("lat");
		var lng = $("#page-location").attr("lng");
		var shopName = $("#page-location").attr("sname");
		
		var latlng = new google.maps.LatLng (lat, lng);
        $('#map_canvas').gmap({'center': latlng});
        
        $("#title-location").html(shopName);
        
	});
	
	$("#page-location").on ( "pageshow" , function ()
	{
		//navigator.notification.activityStop ();
		$("#content-location").css("display","block");
	});
}

function initPhoneGap () 
{
	document.addEventListener ( "deviceready", initAll , false );
}