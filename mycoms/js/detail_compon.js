var g_isOpen = false;

function initAll ()
{
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var pid = $.getUrlVar('cId');

    var url = "http://teamsf.co.kr/~coms/member_compon_detail_show.php";

    var params = {pid:pid};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        
        $('.name').html(data.shop_name);
        $('.price').html(commaNum(parseInt(data.price*10000))+"원 이상 이용시 "+commaNum(parseInt(data.price*10000) - parseInt(data.discount_price*10000))+"원 할인템");
        $('#combo-count').html(data.combo_count);
        $('#price-discount').html(data.discount_rate);
        $('.icon-time').html(" "+data.combo_left_day+"일");
        $('.compon-code').html("승인번호 : "+data.compon_code);
        $('.img').attr('src', data.shop_profile_img_path);


        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('#btn-use').on('click', function()
    {
    	if ( g_isOpen == true ) { return; }
    	g_isOpen = true;
    	
    	navigator.notification.confirm ( "사용 신청 하시겠습니까?", function ( btnIndex )
    	{
    		g_isOpen = false;
    		if ( btnIndex == 1 )
    		{
    			var url = "http://teamsf.co.kr/~coms/member_compon_use.php";
    	        var params = {pid:pid}
    	        $.ajax({
    	            type: 'post',
    	            dataType: 'json',
    	            url: url,
    	            data: params        
    	        }).done(function(data){
    	        	doAlert ( "사용신청이 완료되었습니다." , "콤템 사용" , function (){} );
    	            window.location.replace("../mycoms/used_compon.html"); 
    	        });
    		}
    		else if ( btnIndex == 2 ) {}
    	}, "발급 콤템" ,"확인,취소" );
    	
    });
    $('#btn-unuse').on('click tap', function(){
        window.location.replace("../mycoms/compon.html"); 
    });
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function initPhoneGap ()
{
	document.addEventListener("deviceready", initAll , false);	
}