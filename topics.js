var choiceA = document.getElementById("A");
var choiceB = document.getElementById("B");
var choiceC = document.getElementById("C");
var choiceD = document.getElementById("D");
var qstn = document.getElementById("qstn");
var i = 0;
var x = 0;
var y = 0;
var btn_id;
var exam_qstns = [];
var sideoptArr = [];
var optbtn_id;
var exam_btn;
var ref_btn;
var opt_sel;
var sec;
var min;
var addArr = [];
var final_ans;
var pull_ans;
var add;
var pro_ans = [];
var selected_opt=[];
var countDown;

$(document).ready(function() {

    $("#topic-btn").click(function() {
        $("#btn-slider").slideToggle();
    });
    $.ajax({
        url: "https://ansznhx4he.execute-api.us-east-1.amazonaws.com/v1/glarimy-quiz/topics",
        dataType: "JSON",
        type: "get",
        success: function(data) {
            setTopic();
            console.log(data);
            function setTopic() {
                var topics = [];
                var ids = [];
                for (var j = 0; j <= data.length - 1; j++) {
                    var id = data[j].id;
                    var topic = data[j].title;
                    topics[j] = topic;
                    ids[j] = id;
                }
              

                //btn title
                for (var j = 0; j <= topics.length - 1; j++) {
                    $("#sub_btns").append("<button class='btn btn-outline-dark w-100 mb-2' id=" + ids[j] + "> " + topics[j] + " </button>");
                    // $("#sub_btns").append("<label class='btn btn-outline-dark w-100 mb-2'><input type='radio' name='options' id=" + ids[j] + " checked> " + topics[j] + "  </label>");
                }

                // function getBtn_id() {
                //     // $("button").click(function() { btn_id = this.id; });
                //     // console.log(btn_id);
                //     alert("done");
                // }
                let btn_count=0;
                $("button").click(function() { //display box
                    btn_id = this.id;
                    console.log(btn_id);
                    $.each(ids, function(index, value) {
                        if (btn_id == value) {
                            btn_count++;
                            if(btn_count==1){
                                $("#topics_box").slideUp(1000);
                                $("#online_exam_box").slideDown(1000);
                                topicTodata(topics, ids, btn_id);
                            }  
                            else null;
                        }
                    });

                });


            }
        }
    });

    function topicTodata(topics, ids, btn_id) {

        $.ajax({ //qstns api
            url: 'https://ansznhx4he.execute-api.us-east-1.amazonaws.com/v1/glarimy-quiz/topics/' + btn_id + '/questions',
            dataType: 'json',
            type: 'get',
            success: function(data) {

                for (var j = 0; j <= data.length - 1; j++) {
                    exam_qstns[j] = data[j].description;
                }

                $("#total_qstns").html(exam_qstns.length); //side bar options
                for (var j = exam_qstns.length; j > 0; j--) {
                    $("#p1").after("<button id='sideopt" + j + "' class='btn btn-default border m-2' > " + parseInt(j) + "<span id='add" + j + "' class='add_opt'></span></button>");
                    sideoptArr[j] = "sideopt" + j;
                    addArr[j] = "add" + j;
                }
                console.log(sideoptArr);
                $("button").click(function() {
                    optbtn_id = this.id;
                    // if (optbtn_id == "review") {
                    //     // alert($("#curr_qstn").attr('id'));
                    //     var markRev = $("#cur_qstn").attr('id');
                    //     console.log(markRev);
                    //     ("#").css("background-color", "gold");
                    // }

                    $.each(sideoptArr, function(index, value) { //sideOpts click
                        console.log(optbtn_id);
                        if (optbtn_id == value) {
                            x = 0;
                            $("#" + optbtn_id).css("background-color", "none");
                            console.log(index);

                            x = index - 1;


                            $("#curr_qstn").html(x + 1);
                            $.each(sideoptArr, function(i, v) {
                                $("#" + v).removeClass("shadow p-3");
                            });
                            $("#sideopt" + (x + 1)).addClass("shadow p-3");
                            $("#A,#B,#C,#D").removeClass(" active");
                            setData();
                        }
                    });
                });

                setData();

                function setData() {
                    //while (x <= data.length - 1) {                //get questions from api
                    if (x == data.length) {
                        x = data.length;
                    } else if (x < 0) {
                        x = 0;
                    } else {

                        var question = data[x].description;
                        var a = data[x].a;
                        var b = data[x].b;
                        var c = data[x].c;
                        var d = data[x].d;
                        var options = new Array(a, b, c, d);
                        getQstn(question, options);
                      

                    }
                    //}
                }

                function Timer(){
                      countDown= setInterval(function() {
                        if (min == 0 && sec == 0) {
                            clearInterval(countDown);
                            formOptions();
                            if(pro_ans.length==0){
                                return noDataAnalysis();
                                
                               }
                               else
                                return  send_ans(pro_ans,data,selected_opt);

                        }
    
                        if (sec == 0) {
                            min--;
    
                            if (min <= 0) { min = 0; }
                            if (min < 10) { min = "0" + min; }
                            $("#minutes").html(min);
                        }
                        if (min >= 0) {
                            sec = parseInt(sec);
                            sec--;
                            if (sec < 0) {
                                sec = 59;
                                console.log(sec);
                            }
                            if (sec < 10) { sec = "0" + sec; }
                            if (sec < 0) { sec = 59; }
                            $("#seconds").html(sec);
                        }
                        console.log(min,sec);
                    }, 1000);
                }
               

                function getQstn(question, options) {
                    qstn.innerHTML = "<p>" + question + "</p>";
                    choiceA.innerHTML = options[0];
                    choiceB.innerHTML = options[1];
                    choiceC.innerHTML = options[2];
                    choiceD.innerHTML = options[3];
                }
                initiateTimer();
                function initiateTimer(){
                    console.log(data);
                    min=data.length;
                    $("#time_count").fadeIn(); //time counter
                    sec = "00";
                    $("#seconds").html(sec);
                    $("#minutes").html(min);
                    console.log(exam_qstns.length);
                    Timer();
                }

                exitExam=()=>{
                    $("#online_exam_box").slideUp().delay(1000, function() {
                        window.location.reload();
                    });

                }

                submitExam=()=>{
                    let opt_pending=0;
                        formOptions();
                        console.log(pro_ans.length);
                        $.each(selected_opt,function(index){
                            if(selected_opt[index]==null){
                                opt_pending++;
                            }
                        });
                        if(opt_pending==selected_opt.length){
                            $("#ZeroAnswers").modal("show");
                        }
                        else if(opt_pending==0){
                            $("#SubmitExam").modal("show");
                        }
                        else{
                                $("#WarningExam").modal('show');
                        }
                        
                     
                }

                submitExamConfirmed=()=>{
                    if(pro_ans.length==0){
                        noDataAnalysis();
                        
                       }
                       else
                        send_ans(pro_ans,data,selected_opt);
                }
              
            


                $("button").click(function() {
                    exam_btn = this.id;
                    if (exam_btn == "next") { //next btn
                        x++;
                        if (x >= data.length - 1) {
                            x = data.length - 1;
                        }
                        y = x + 1;
                        // markReview(y);

                        $("#A,#B,#C,#D").removeClass(" active");
                        $.each(sideoptArr, function(i, v) {
                            $("#" + v).removeClass("shadow p-3");
                        });
                        $("#sideopt" + y).addClass("shadow p-3");

                        $("#curr_qstn").html(y);
                        setData();
                    }
                    if (exam_btn == "prev") { //prev

                        x--;
                        if (x <= 0) {
                            x = 0;
                        }
                        y = x + 1;
                        $("#A,#B,#C,#D").removeClass(" active");

                        $.each(sideoptArr, function(i, v) {
                            $("#" + v).removeClass("shadow p-3");
                        });
                        $("#sideopt" + y).addClass("shadow p-3");

                        $("#curr_qstn").html(y);
                        setData();
                    }

                    if (exam_btn == "review") { //Review btn
                        ref_btn = $("#curr_qstn").html();


                        // if (opt_sel) {
                        $("#sideopt" + ref_btn).css("background-color", "#ffc107");
                        // } else {
                        // 
                        //     $("#popRev").slideToggle().delay(1000).slideToggle();

                        // }
                    }
                    
                    if (exam_btn == "A" || exam_btn == "B" || exam_btn == "C" || exam_btn == "D") { //opt_selector

                        ref_btn = $("#curr_qstn").html();
                        $("#sideopt" + ref_btn + ">.add_opt").html(exam_btn);

                        $(".btn").removeClass(" active");

                        $(this).toggleClass(" active");

                        ref_btn = $("#curr_qstn").html();
                        $("#sideopt" + ref_btn).css("background-color", "#28a745");
                        if (document.activeElement) {
                            // $(this).toggleClass(" active");
                            console.log($(this).html());
                            opt_sel = $(this).html();



                        }

                    }
                    if (exam_btn == "deselect") { //deselect

                        ref_btn = $("#curr_qstn").html();
                        $("#sideopt" + ref_btn + ">.add_opt").html("");
                        $("#sideopt" + ref_btn).css("background-color", "transparent");
                        $("#A,#B,#C,#D").removeClass(" active");
                        opt_sel = undefined;
                        delete(opt_sel);
                    }

                    
                });
                $("#sideopt1").addClass("shadow p-3");

                function formOptions(){
                    let j=0;
                    for (var i = 1; i <= addArr.length - 1; i++) {
                        
                        pull_ans = $("#add" + i).html();
                        console.log(pull_ans);
                        console.log(typeof(btn_id));
                        console.log(data);
                        final_ans = pull_ans.toLowerCase();
                        if (final_ans == undefined|| final_ans=="") {
                            selected_opt[i-1]=null;
                           next;
                        } else {
                            selected_opt[i-1]=pull_ans;
                        
                            pro_ans[j]={  
                                    "option":final_ans,
                                    "qid":data[i-1].qid,
                                    "topic":btn_id
                                        }
                          j++;              
                        }

                    }
                }
            }


        });
        // }
        // }


    }


    function send_ans(pro_ans,content,selected_opt) {
        var pro_ansVar = JSON.stringify(pro_ans);
        console.log(pro_ansVar);
        // $.ajax({
        //     type: "POST",
        //     url: "https://ansznhx4he.execute-api.us-east-1.amazonaws.com/v1/glarimy-quiz/answers",
        //     headers: {
        //         'Content-Type': 'application/jsonp',
        //         'Access-Control-Allow-Origin': '*'

        //     },
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     crossDomain: true,
        //     data: JSON.stringify(pro_ans),
        //     dataType: 'json',
        //     success: function(data) {
        //         alert("success");
        //         console.log(data);
        //     },
        //     error: function() {
        //         alert("error");
        //     }
        // });
        $.ajax({
            type: "POST",
            url: "https://ansznhx4he.execute-api.us-east-1.amazonaws.com/v1/glarimy-quiz/answers",
            dataType: "json",
            data: JSON.stringify(pro_ans),
            // headers: {
            //     "Access-Control-Allow-Origin": "http://redants.info/online",
            //     " Access-Control-Allow-Credentials": " true",
            //     "Content-Type": "application/json"

            // },
            success: function(resultData) {
                console.log(resultData);
                $("#online_exam_box").slideUp();
                
                // $("#minutes").html(" ");
                // $("#seconds").html(" ");
                clearInterval(countDown);
                $("#time_count").html(" ");
                analysis(resultData,content,selected_opt);
                $("#final_result").delay(500).slideDown();

            },
            error: function(status) {
                alert('Error');
                console.log(status);
            }
        });

        
    }


    function analysis(resultData,content,selected_opt){
        let crct=0;
        console.log(resultData.score);
        console.log(resultData.results[0].pass);
        $.each(resultData.results,function(index){
           resultData.results[index].pass==true ? crct++ : null;
        })
        console.log(crct);
        $("#answered_qstns").html(resultData.results.length);
        $("#correct_qstns").html(crct);
        $("#incorrect_qstns").html(resultData.results.length-crct);
        $("#place_score").html(resultData.score.toFixed(1));
        let click_once=0;
        $("#clear_analysis").click(function(){
            click_once++;
            if(click_once==1){
                $.each(content,function(index){
                    console.log(content[index]);
                    selected_opt[index]==null?selected_opt[index]="--":selected_opt[index];
                    $("#placeClearAnalysis").append("<div class='border border-dark rounded p-2 m-1'><p><b>"+[index+1]+":</b> "+content[index].description+"</p><p><b>A:</b>"+content[index].a+"</p><p><b>B:</b>"+content[index].b+"</p><p><b>C:</b>"+content[index].c+"</p><p><b>D:</b>"+content[index].d+"</p><p>Option you selected: <b>"+selected_opt[index] +"</b></p></div>");
                });
                $("#placeClearAnalysis").slideDown(600);    
            }
            else
            $("#placeClearAnalysis").slideToggle(600);
            
           
        });
        $("#exit_btn").click(function(){
            window.location.reload();
        })
    }

    function noDataAnalysis(){
        $("#online_exam_box").slideUp();
        clearInterval(countDown);
        $("#time_count").html(" ");
        $("#final_result").delay(1000).slideDown();
        $("#answered_qstns").html("0");
        $("#correct_qstns").html("0");
        $("#incorrect_qstns").html("0");
        $("#place_score").html("0");
        $("#clear_analysis").click(function(){
            $("#placeClearAnalysis").html("<p class='text-center'>You have not answered any of the questions&nbsp;&nbsp;<i class='far fa-frown' style='font-size:24px'></i></p>");
        });
        $("#exit_btn").click(function(){
            window.location.reload();
        })
    }

    

});