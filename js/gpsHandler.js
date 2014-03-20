/*

GPS 수신 모듈 
Javascript class GPSHandler  

=OverView
PhoneGap을 이용하여 GPS좌표를 가져옴.

=setNavigatorObj ( navObj ) : void 
navObj 폰갭에서 제공하는 Navigator 인스턴스 
무조건 이 값을 맨 먼저 세팅해야함

=getCoodinate ( callBackFunction ) : void 
callBackFunction 콜백메서드
PhoneGap을 이용하여 GPS좌표를 얻어오고, Callback으로 리턴하는 메서드.
Callback method의 parameter는 JSONObject이며 각 키는 다음과 같음

success : 성공/실패여부 (true/false)
cancel : 실패인 경우만 값이 주어짐. 사용자가 취소하였는지의 여부 (true/false)
lat : 위도(Latitude)
lng : 경도(Longitude)

*/


function GPSHandler ()
{
	this.mNavObj = null;
	
	this.setNavigatorObj = function ( navObj ) { this.mNavObj = navObj; };
	
	this.getCoodinate = function ( callback )
	{
		if ( this.mNavObj == null )
		{
			callback ({
				"success":false,
				"cause":"Navigator object not be set"
			});
			return;
		}
		else if ( !this.mNavObj.geolocation )
		{
			callback ({
				"success":false,
				"cause":"GPS 센서가 작동하지 않습니다."
			});
			return;
		}
		
		this.mNavObj.geolocation.getCurrentPosition ( function (p)
		{
			callback ({
				"success":true,
				"cause":null,
				"lat":p.coords.latitude,
				"lng":p.coords.longitude
			});
		}, 
		function (err)
		{
			console.log ( err );
			callback ({
				"success":false,
				"cause":"GPS 좌표 획득에 실패하였습니다."
			});
		},
		{
			maximumAge:3000, 
			timeout:10000,
			enableHighAccuracy: true
		});
	};
}