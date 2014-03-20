var g_isOpen = false;

function initAll ()
{
	bindBackButton ();
	
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    console.log(userData);

    var url = "http://teamsf.co.kr/~coms/member_compon_list_show.php";

    var params = {mid:userData.id, used:true};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        
        var compons_html = "<div class='area-padding'>";

        for(var i in data) {

            if (data[i].ok_date == null) {data[i].ok_date = "승인 대기 중"};

            compons_html += "<div class='list-mycompon used-compon' value='"+data[i].id+"'><div class='list-inner'>";
            compons_html += "<img class='img' src='"+data[i].shop_profile_img_path+"'>";
            compons_html += "<p class='name'>"+data[i].shop_name+" ["+data[i].ok_date+"] "+"</p>";
            compons_html += "<p class='price'>"+commaNum(parseInt(data[i].price*10000))+"원 이상 이용시 "+commaNum(parseInt(data[i].price*10000) - parseInt(data[i].discount_price*10000))+"원 할인템";            
            compons_html += "</p>";
            compons_html += "<p><span class='compon-nums'>"+data[i].combo_count+"</span> 콤보 / <span class='compon-nums'>"+data[i].discount_rate+"%</span> 할인";
            compons_html += "</p>";
            compons_html += "<p class='foo'><span class='combo-left used-compon'><i class='icon-time'></i> "+data[i].combo_left_day+"일</span><span class='compon-code'>콤템번호 : "+data[i].coupon_code+"</span>";
            compons_html += "</p>";            
            compons_html += "</div></div>";
        }
        compons_html += "</div>";

        $('#container').html(compons_html);
        
        $('.list-mycompon').on('click tap', function(){
            var cId = $(this).attr('value');
            console.log(cId);
            //window.location = "./detail_used_compon.html?cId="+cId;
        })

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
	document.addEventListener ( "deviceready", initAll , false );
}