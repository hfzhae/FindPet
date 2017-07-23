<!-- #include file="public.asp" -->
<!-- #include file="findpet.asp" -->

<% 
dim s, timeInput, Varieties, Gender, sterilization, color, name, phone, memo, imgText, placeText, placepoint, n, isRe, sendType, isFind, fp, isfrom
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
isfrom = getFrom(ClngEx(request("isfrom")))
if len(imgText)>0 then
    imgText = left(imgText, len(imgText) - 1)
end if
placeText = SQLInputParam(unescape(request("placeTextES")))
placepoint = SQLInputParam(unescape(request("placepoint")))

isRe = getRe(phone)

set fp = new FindpetObj
fp.init(conn)

isFind = fp.findpet(timeInput, Varieties, Gender, color, placeText, placepoint, sendType)

n = 0

on error resume next
conn.execute "insert into findpet (CreateDate,timeInput,Varieties,Gender,sterilization,color,isname,phone,memo,imgText,placeText,placepoint, isDeleted, state, UpdateDate, isRe, sendType, isFind, isfrom) values ('"&now&"','"&timeInput&"','"&Varieties&"','"&Gender&"','"&sterilization&"','"&color&"','"&name&"','"&phone&"','"&memo&"','"&imgText&"','"&placeText&"','"&placepoint&"', 0, 'Î´ÉóºË', '"&now&"', '"&isRe&"', "&sendType&", "&isFind&", '"&isfrom&"')", n
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

function getFrom(id)
    getFrom = "ÆäËû"
    dim rs
    set rs = conn.execute("select title from Info where InfoType=2004 and sort="&id)
    if not rs.eof then
        getFrom = rs("title").value
    end if
end function
%>