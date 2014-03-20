
var myScroll;
var g_isOpen = false;

function initAll () 
{
	bindBackButton ();
	
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    lh.doLogin ( function ( resultObj ) {
        if ( resultObj.success == false ) { 
            window.location = "../member/index.html";
        }
    });

    var url = "http://teamsf.co.kr/~coms/member_mycoms_info.php";

    var params = {mid:userData.id};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        $('#giving1').html(data.giving_1.giving_count);
        $('#giving2').html(data.giving_2.giving_count);
        $('#giving3').html(data.giving_3.giving_count);
        $('#giving4').html(data.giving_4.giving_count);
      
        $('#profile').attr('src', data.profile_img_path);  
        $('#grade').html(data.grade_name);  
        $('#email').html(data.email);
        $('#nickname').html(data.nickname);
        $('#heart-cash').html(data.heart_cash);

        $("#total_shop_count").html(data.shop_count);
        $("#favorite_shop_count").html(data.favorite_shop);
        $("#total_sales_sum").html(data.sales_sum);
        $("#total_discount_sum").html(data.discount_sum);
      
        $('#compon-num').html(data.unused_compon_count);

    });
}

function bindBackButton ()
{
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if ( deviceType != "Android" ) { return; }
	
	navigator.app.overrideBackbutton(true);
	document.addEventListener("backbutton", function ()
	{
		if ( g_isOpen == true ) { return; }
    	g_isOpen = true;
    	
		navigator.notification.confirm ( "콤스를 종료하시겠습니까?", function ( btnIndex )
    	{	
    		g_isOpen = false;
    		if ( btnIndex == 1 ) { navigator.app.exitApp(); }
    	}, "콤스 종료" ,"확인,취소" );
	}, true );
}


function initPhoneGap ()
{
	document.addEventListener("deviceready", initAll , false);	
}