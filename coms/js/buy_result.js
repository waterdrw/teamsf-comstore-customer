var g_isOpen = false;

function initAll ()
{
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var url = "http://teamsf.co.kr/~coms/member_compon_purchase.php";
    var sId = $.getUrlVar("shopId");
    var itemId = $.getUrlVar("itemId");

    var params = {sid:sId, mid:userData.id, item:itemId};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        $('#shop-name').html(data.shop_name);
        $('#limit-date').html(data.limit_date);
        $('#combo-count').html(data.member_combo);
        $('#price-discount').html(data.discount_rate);
        $('.foo #left-date').html(data.combo_left_day);
        $('.foo #compon-code').html(data.coupon_code);
        $('#shop-img').attr('src', data.shop_profile_img_path);
        $('#buy-price').html(commaNum(parseInt(data.price*10000)));
        $('#buy-discount-price').html(commaNum(parseInt(data.price*10000)-parseInt(data.discount_price*10000)));
        
        $('#pid').val(data.purchase_id);

        //myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('#btn-use').on('click tap', function()
    {
    	if ( g_isOpen == true ) { return; }
    	g_isOpen = true;
    	
    	navigator.notification.confirm ( "사용 신청 하시겠습니까?", function ( btnIndex )
    	{
    		g_isOpen = false;
    		if ( btnIndex == 1 )
    		{
    			var url = "http://teamsf.co.kr/~coms/member_compon_use.php";
    	        var pid = $('#pid').val();
    	        var params = {pid:pid}
    	        $.ajax({
    	            type: 'post',
    	            dataType: 'json',
    	            url: url,
    	            data: params        
    	        }).done(function(data){
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

function initPhoneGap ()
{
	document.addEventListener("deviceready", initAll , false);	
}