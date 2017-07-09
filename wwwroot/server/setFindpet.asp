<!-- #include file="public.asp" -->
<% 
dim s, timeInput, Varieties, Gender, sterilization, color, name, phone, memo, imgText, placeText, placepoint, n, isRe, sendType
s = SQLInputParam(request("callback"))
timeInput = replace(SQLInputParam(request("timeInput")), "T", " ")
Varieties = SQLInputParam(unescape(request("Varieties")))
Gender = SQLInputParam(unescape(request("Gender")))
sterilization = SQLInputParam(unescape(request("sterilization")))
color = SQLInputParam(unescape(request("color")))
name = SQLInputParam(unescape(request("name")))
phone = SQLInputParam(request("phone"))
memo = SQLInputParam(unescape(request("memo")))
imgText = SQLInputParam(unescape(request("imgText")))
sendType = ClngEx(request("sendType"))
if len(imgText)>0 then
    imgText = left(imgText, len(imgText) - 1)
end if
placeText = SQLInputParam(unescape(request("placeTextES")))
placepoint = SQLInputParam(unescape(request("placepoint")))

isRe = getRe(phone)

n = 0

on error resume next
conn.execute "insert into findpet (CreateDate,timeInput,Varieties,Gender,sterilization,color,isname,phone,memo,imgText,placeText,placepoint, isDeleted, state, UpdatDate, isRe, sendType) values ('"&now&"','"&timeInput&"','"&Varieties&"','"&Gender&"','"&sterilization&"','"&color&"','"&name&"','"&phone&"','"&memo&"','"&imgText&"','"&placeText&"','"&placepoint&"', 0, 'Î´ÉóºË', '"&now&"', '"&isRe&"', "&sendType&")", n
on error goto 0

if n > 0 then
    response.Write s & "({result: true})"
else
    response.Write s & "({result: false})"
end if

function getRe(phone)
    getRe = 0
    dim rs
    set rs = conn.execute("select top 1 id from findpet where phone='"&phone&"' order by id desc")
    if not rs.eof then
        getRe = rs("id").value
    end if
    
end function
%>