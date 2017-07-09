<!-- #include virtual="/NetPower3.asp" -->
<!-- #include virtual="/WeixinAPI.asp" -->
<% @debug = on
'stop

function setOpenid()
    dim rs, sSQL

    sSQL = "select openid,title from biVIPMemberInfo where Handset='"&phone&"'"
    set rs = CreateObject("adodb.recordset")
    rs.CursorLocation = 3
    rs.Open sSQL, Conn, 3, 3
    if rs.RecordCount > 1 then err.Raise 1000, "bundlephone", "手机号码有重复:" & phone
    if rs.EOF then
        err.Raise 1000, "bundlephone", "没找到手机号码"
    else
        'if not rs("openid").value is null then
            if len(rs("openid").value) > 0 then err.Raise 1000, "bundlephone", "已被绑定"
        'end if
        rs("openid") = openid
        rs.Update
        setOpenid = "{result:1}"
    end if
end function

conn.begintrans
on error resume next
dim result, s, openid, phone, AccountID, Owner, OwnerName

s = request("callback")
openid = SQLEncode(request("openid"))
phone = SQLEncode(request("phone"))
AccountID = 0
Owner = 0
OwnerName = "Weixin"

if len(s) = 0 then err.Raise 1000, "bundlephone", "参数有误！"
if len(openid) = 0 then err.Raise 1000, "bundlephone", "OpenID有误！"
if len(phone) = 0 then err.Raise 1000, "bundlephone", "手机号码有误！"

result = setOpenid()

if err.number <>0 then
	conn.RollbackTrans
	WriteLog "微信接口.捆绑OpenID", "失败, Err.Description =" & Err.Description
    response.Write s & "({result:0, msg:'"&escape(Err.Description)&"'})"
else
	conn.commitTrans
	WriteLog "微信接口.捆绑OpenID", "成功, phone =" & SQLEncode(request("phone")) & ", OpenID = " & SQLEncode(request("openid"))
    'setWeixinMessage()
    response.Write s & "(" & result & ")"
end if


function setWeixinMessage()
    dim wxobj
    set wxobj = new WeixinAPI
    wxobj.init(conn)
    wxobj.WeixinMessage openid, "t_nT78m-GEUMdf-y2th5A9b6t1fi9CDEhJNO8sV44TM", "http://weixin.qq.com/download", "{""first"":{""value"":""尊敬的用户，您已成功绑定会员"",""color"":""#173177""},""keyword1"":{""value"":"""&phone&""",""color"":""#173177""},""keyword2"":{""value"":"""&now()&""",""color"":""#173177""},""remark"":{""value"":""感谢您的支持！"",""color"":""#173177""}}"
end function

%>