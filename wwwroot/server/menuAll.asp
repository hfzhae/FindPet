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
        title:'<%=escape("Ѱ��") %>',
        desc:'<%=escape("����ʵ��д��Ϣ����ʵ����Ϣ����Ѱ�ҳ�������������Ҫ�����ã�") %>',
        item:[]
    },{
        dataid:'Pick up',
        icon:'',
        iconimg:'icon_findmaster.png',
        title:'<%=escape("��") %>',
        desc:'<%=escape("��л��Ĳ��룬����ʵ��д��Ϣ����ʵ����Ϣ����Ѱ�ҳ�������������Ҫ�����ã�") %>',
        item:[]
    }],
    varieties:[<%=varieties %>],
    gender:[
        '<%=escape("��") %>',
        '<%=escape("ĸ") %>',
        '<%=escape("����") %>',
    ],
    sterilization:[
        '<%=escape("δ����") %>',
        '<%=escape("�ѽ���") %>',
        '<%=escape("����") %>',
    ]
})
