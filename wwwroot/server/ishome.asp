<!-- #include file="public.asp" -->
<% 
dim s
s = request("callback")

%>
<%=s%>([{
        id:1,
        dataid:'',
        title:'Internal Medicine'
    },{
        id:2,
        dataid:'',
        title:'Surgery'
    },{
        id:3,
        dataid:'',
        title:'Gynecology'
    },{
        id:4,
        dataid:'',
        title:'Pediatrics'
    },{
        id:5,
        dataid:'',
        title:'Other Diseases'
    },{
        id:6,
        dataid:'about',
        title:'About Acuherb'
    }
])