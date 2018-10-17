$(function(){
    $(".approve").bind('click', function () {
        if(confirm("确定批准该点位请求吗？")==true){
            return true;
        }else{
            return false;
        };
    });

    $(".reject").bind('click', function () {
        if(confirm("确定拒绝该点位请求吗？")==true){
            return true;
        }else{
            return false;
        };
    });

    $(".reject_user").bind('click', function () {
        if(confirm("确定取消申请吗？")==true){
            return true;
        }else{
            return false;
        };
    });

    $(".delete").bind('click', function () {
        if(confirm("确定删除该点位的使用信息并使该点位置为未使用吗？")==true){
            return true;
        }else{
            return false;
        };
    });

    $(".application").bind("click", function () {
        var id = $(this).attr("id");
        var information_id = "#information" + id;
        var submit_id = "#submit" + id;
        var status_id = "#status" + id;
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        var badge_number = parseInt($('#badge').text());
        if($(information_id).val()){
            pk = $(this).attr("name");
            content = $(information_id).val();
            $.ajax({
                url: "/Stable/submit/",
                type:"POST",
                data:{
                    "pk":pk,
                    "content":content,
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                    },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){

                        if (data['isAdmin']){
                            $(status_id).html(data["status"] + '<a href="#" class="approve"><span class="glyphicon glyphicon-ok"></span></a>   <a href="#" class="reject_user"><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');
                        }else{
                            $(status_id).html(data["status"] + '<a href="#" class="reject_user"><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');
                        };
                        
                        $(status_id).css('background-color', 'yellow');
                        $(user_information_id).html(data["user"] + '<a href="#" data-toggle="modal" data-target="#detail' + id +'"><span class="glyphicon glyphicon-search"></span></a>');
                        $(apply_id).html("该点位暂不能申请");
                        $('#badge').html(badge_number+1);
                    };
                    $(submit_id).modal('hide');
                }
            });
            return true;
        }else{
            alert("请填写设备信息！");
            return false;
        };
    });

    $("#select-location").change(function(){
        var location = $(this).children('option:selected').val();
        if (location == "1"){
            $(".location").each(function(){
                if ($(this).html().search(/园区/) == -1){
                    $(this).parent().hide();
                }else{
                    $(this).parent().show();
                };
            })
        }else if (location == '2'){
            $(".location").each(function(){
                if ($(this).html().search(/群乐/) == -1){
                    $(this).parent().hide();
                }else{
                    $(this).parent().show();
                };
            })            
        }else if (location == '0'){
            $(".location").each(function(){
                $(this).parent().show();
            })
        }
    })
})