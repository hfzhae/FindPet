<!-- #include file="public.asp" -->
<% 
dim s, strSale, varieties
s = request("callback")

varieties = getVarieties()

function getVarieties()
    dim rs, sSQL, s
    s = ""
    sSQL = "select title from Info where isdeleted=0 and infotype=2002 order by sort desc, id"
    set rs = CreateObject("adodb.recordset")
    rs.CursorLocation = 3
    rs.Open sSQL, Conn, 0, 1
    if not rs.eof then
        do while not rs.eof
            s = s & "'" & escape(rs("title").value) & "',"
        rs.movenext
        loop
        s = left(s, len(s) - 1)
    end if
    getVarieties = s
end function
%>
<%=s%>({
    phone:'',
    item:[{
        dataid:'find pet',
        icon:'',
        iconimg:'icon_find_Footprint.png',
        title:'<%=escape("寻宠") %>',
        desc:'<%=escape("请如实填写信息，详实的信息对于寻找宠物起着至关重要的作用！") %>',
        item:[]
    },{
        dataid:'Pick up',
        icon:'',
        iconimg:'icon_findmaster.png',
        title:'<%=escape("捡到") %>',
        desc:'<%=escape("感谢你的参与，请如实填写信息，详实的信息对于寻找宠物起着至关重要的作用！") %>',
        item:[]
    }],
    varieties:[<%=varieties %>],
    gender:[
        '<%=escape("公") %>',
        '<%=escape("母") %>',
        '<%=escape("不详") %>',
    ],
    sterilization:[
        '<%=escape("未节育") %>',
        '<%=escape("已节育") %>',
        '<%=escape("不详") %>',
    ]
})
