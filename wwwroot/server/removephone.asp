<!-- #include virtual="/NetPower3.asp" -->
<!-- #include virtual="/WeixinAPI.asp" -->
<% 

function removephone()
    dim sSQL, rs
    set rs = conn.execute("select Handset from biVIPMemberInfo where openid='"&openid&"'")
    if rs.eof then err.Raise 1000, "bundlephone", "δ�ҵ�OpenID"
    phone = rs("Handset").value
    sSQL = "update biVIPMemberInfo set openid='' where openid='"&openid&"'"
    conn.execute(sSQL)
    removephone = "{result:1}"
end function

conn.begintrans
on error resume next
dim result, s, openid, AccountID, Owner, OwnerName, phone

s = request("callback")
openid = SQLEncode(request("openid"))
AccountID = 0
Owner = 0
OwnerName = "Weixin"

if len(s) = 0 then err.Raise 1000, "bundlephone", "��������"
if len(openid) = 0 then err.Raise 1000, "bundlephone", "OpenID����"

result = removephone()

if err.number <>0 then
	conn.RollbackTrans
	WriteLog "΢�Žӿ�.���OpenID", "ʧ��, Err.Description =" & Err.Description
    response.Write s & "({result:0, msg:'"&escape(Err.Description)&"'})"
else
	conn.commitTrans
	WriteLog "΢�Žӿ�.���OpenID", "�ɹ�, OpenID = " & SQLEncode(request("openid"))
	'setWeixinMessage
    response.Write s & "(" & result & ")"
end if


function setWeixinMessage()
    dim wxobj
    set wxobj = new WeixinAPI
    wxobj.init(conn)    
    wxobj.WeixinMessage openid, "27NOI5JheTd23iNp4Z-kTxwhzyjYGKhH2dzTtGud8lQ", "http://weixin.qq.com/download", "{""first"":{""value"":""�𾴵��û������ѽ���Ա"",""color"":""#173177""},""keyword1"":{""value"":"""&phone&""",""color"":""#173177""},""keyword2"":{""value"":"""&now()&""",""color"":""#173177""},""remark"":{""value"":""�ٴθ�л����֧�֣�"",""color"":""#173177""}}"
end function

%>