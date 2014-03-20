
// LoginHandler : 사용자 로그인 체크 클래스 


// 사용법 

/*

7-1 로그인
JavaScript class LoginHandler

* OverView
최초 로그인시 디바이스에 raw ID / PW 이 아닌
서버에서 리턴한 ID PK와 PW의 md5 해쉬를 저장하고 
다음 로그인부터 이 정보를 사용하여 로그인함

* setId ( id ) : void
id 아이디 
최초 로그인시의 아이디 입력

* setPw ( pw ) : void
pw 비밀번호
최초 로그인시의 비밀번호 입력 

* doLogin ( callBackFunction ) : void 
callBackFunction 		콜백 메서드
최초 로그인시 및 저장된 비밀번호를 이용한 로그인을 수행 
콜백 메서드 parameter는 JSON object이며 키는 다음과 같다.
success : 성공/실패 여부 (true/false)
cause : 실패인 경우의 실패사유 
memberInfo : 
로그인한 유저에 대한 JSONObject. 
멤버는 member테이블의 field와 같으나 다음의 key/value가 추가되어있다.
{profile_img_path:프로필 이미지 절대 경로}

* flushLogin () : void
디바이스에 저장되어있던 로그인 정보를 제거함

* isLogged () : boolean
디바이스에 로그인 정보가 남아있는지의 여부를 true/false로 리턴
true : 로그인 정보가 남아있음 / false : 남아있지 않음

* getLocalLoginInfo () : JSONObject
디바이스에 저장되어있는 로그인 정보를 가져옴. 정보가 없을 경우는 null리턴.
반환되는 JSONObject의 키는 다음과 같음
id : 저장되어있던 id 
pw : 저장되어있던 pw 



* 사용 예제 

(1) 사용자가 입력한 아이디와 패스워드를 이용하여 로그인 
var lh = new LoginHandler ();
lh.setId ( id ); lh.setPw ( pw );

lh.doLogin ( function ( resultObj )
{
	if ( resultObj.success == true ) { alert ( "성공!"); }
	else { alert ( "실패! 실패사유 : " + resultObj.cause ); }
});


(2) 최초 로그인 후 혹은 앱 재시작 후 로그인 체크 
var lh = new LoginHandler ();
lh.doLogin ( function ( resultObj )
{
	if ( resultObj.success == true ) { alert ( "성공!"); }
});


(3) 앱에 저장되어있던 사용자 로그인 정보를 플러쉬 할때 (로그아웃)
var lh = new LoginHandler ();
lh.flushLogin ();


(4) 로그인완료시 각종 사용자 정보 가져오기 

var lh = new LoginHandler ();
lh.doLogin ( function ( resultObj )
{
	if ( resultObj.success == true ) 
	{ 
		var memberObj = resultObj.memberInfo;

		// 프로필 이미지 절대경로 + 닉네임 가져오기 
		alert ( memberObj.profile_img_path + " : nick : " + memberObj.nickname );
	}
});

*/

function LoginHandler ()
{
	this.mId = null;
	this.mPw = null;

	this.setId = function ( id ) { this.mId = id; };
	this.setPw = function ( pw ) { this.mPw = pw; };

	this.doLogin = function ( callBackFunction )
	{
		if ( this.isLogged () == false )
		{
			var id = this.mId; var pw = this.mPw;
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/member_login.php",
				type:"post",
				data:"id=" + id + "&pw=" + pw + "&mode=raw",
				dataType:"json",
				success:function ( jsonObj )
				{
					var ret = {"success":null,"cause":null,"mode":"raw","memberInfo":null};

					if ( jsonObj.success == true )
					{
						window.localStorage.setItem ( "id" , jsonObj.id );
						window.localStorage.setItem ( "pw" , jsonObj.pw );
						window.localStorage.setItem ( "zid" , jsonObj.zid );

						ret.memberInfo = jsonObj;
						ret.success = true; ret.cause = null;
					}
					else { ret.success = false; ret.cause = jsonObj.cause; }
					callBackFunction ( ret );
				},
				error:function ( x , e )
				{
					var ret = {"success":false,"cause":"인터넷 연결을 확인해주세요!","mode":"raw"};
					callBackFunction ( ret );
				}
			});
		}
		else 
		{
			var loginInfo = this.getLocalLoginInfo ();
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/member_login.php",
				type:"post",
				data:"id=" + loginInfo.id + "&pw=" + loginInfo.pw + "&mode=secure",
				dataType:"json",
				success:function ( jsonObj )
				{
					var ret = {"success":null,"cause":null,"mode":"secure","memberInfo":null};

					if ( jsonObj.success == true )
					{
						window.localStorage.setItem ( "id" , jsonObj.id );
						window.localStorage.setItem ( "pw" , jsonObj.pw );
						window.localStorage.setItem ( "zid" , jsonObj.zid );

						ret.memberInfo = jsonObj;
						ret.success = true; ret.cause = null;
					}
					else { ret.success = false; ret.cause = jsonObj.cause; }
					callBackFunction ( ret );
				},
				error:function ( x , e )
				{
					var ret = {"success":false,"cause":"인터넷 연결을 확인해주세요!","mode":"secure"};
					callBackFunction ( ret );
				}
			});
		}
	};

	this.isLogged = function ()
	{
		if ( this.getLocalLoginInfo() == null ) { return false; }
		return true;
	};

	this.flushLogin = function ()
	{
		window.localStorage.clear ();
	};

	this.getLocalLoginInfo = function ()
	{
		var ret = { "id":null,"pw":null,"zid":null };
		var localId = window.localStorage["id"]; 
		var localPw = window.localStorage["pw"];
		var localzId = window.localStorage["zid"];
		if ( localId == null || localPw == null || localzId == null ) { return null; }
		ret.id = localId; 
		ret.pw = localPw; 
		ret.zid = localzId;
		return ret;
	};
}

// 화폐단위 세자리마다 쉼표 삽입
function commaNum(num) {  
    if (num < 0) { num *= -1; var minus = true} 
    else var minus = false      
    var dotPos = (num+"").split(".")
    var dotU = dotPos[0] 
    var dotD = dotPos[1] 
    var commaFlag = dotU.length%3

    if(commaFlag) { 
            var out = dotU.substring(0, commaFlag)  
            if (dotU.length > 3) out += "," 
    } 
    else var out = "" 
    for (var i=commaFlag; i < dotU.length; i+=3) { 
            out += dotU.substring(i, i+3)  
            if( i < dotU.length-3) out += "," 
    } 
    if(minus) out = "-" + out 
    if(dotD) return out + "." + dotD 
    else return out 
}