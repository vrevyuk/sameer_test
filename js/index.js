/**
 * Created by glavnyjpolzovatel on 13.07.15.
 */

testManager = {
    title: null,
    listview: null,
    panel: null,
    init: function () {
        $('#newQuestion').bind('pagebeforeshow', function() {
            //$('input').val('');
            //$('input #correct1').attr('checked',true).checkboxradio('refresh');
        } );
        this.listview = $('#listView');
        //this.catList = $('#catList');
        //this.codeList = $('#codeList');
        this.title = $('#titleHeader');
        this.panel = $('#mainPanel');
        //this.loadCategories();
        //this.loadCode();
    },

    ajaxOnError: function (data, status, errorThrow) {
        alert (data.responseText);
    },

    load: {
        catPage: function () {
            testManager.title.html('Categories of subjects');
            //testManager.codeList.empty();
            testManager.loadCategories();
            testManager.panel.panel('close');
        },
        codePage: function () {
            testManager.title.html('Access codes');
            //testManager.catList.empty();
            testManager.loadCode();
            testManager.panel.panel('close');
        }
    },

    addCategory: function () {
        if(catname = prompt('Category name')) {
            $.ajax({
                url: 'db/categories.php?act=post&catname=' + catname,
                dataType: 'json',
                success: function (response) {
                    if(response.status) {
                        testManager.loadCategories();
                    } else { alert(response.message); }
                },
                error: testManager.ajaxOnError
            });
        }
    },

    removeCategories: function (catid) {
        if(confirm('Are you sure?')) {
            $.ajax({
                url: 'db/categories.php?act=delete&catid=' + catid,
                dataType: 'json',
                success: function (response) {
                    if(response.status) {
                        testManager.loadCategories();
                    } else { alert(response.message); }
                },
                error: testManager.ajaxOnError
            });
        }
    },

    loadCategories: function () {
        $.ajax({
            url: 'db/categories.php',
            dataType: 'json',
            success: function(response) {
                if(response.status) {
                    var list = response.result;
                    testManager.listview.empty();
                    testManager.listview.append('<li><a class="ui-btn ui-corner-all" style="color: blue;" onclick="testManager.addCategory();">Add new category</a></li>').listview('refresh');
                    list.forEach(function (item, position, all) {
                        testManager.listview.append('<li data-icon="false" id="cat' + item.id + '"><a onclick="testManager.getQuestions(' + item.id + ')">' + item.catname + '</a>' +
                        '<a data-icon="delete" onclick="testManager.removeCategories(' + item.id + ')"></a></li>');
                    });
                    testManager.listview.listview('refresh');
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
    },

    getQuestions: function (catid, page) {
        var per_page = 10;
        if(page == null || page < 0) page = 0;
        $.ajax({
            url: 'db/question_get.php?catid=' + catid,
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var res = response.result;
                    var start_item = page * per_page;
                    var end_item = res.length<(start_item + per_page)?res.length:(start_item + per_page);
                    var minus_page = page==0?0:page-1;
                    var plus_page = end_item>=res.length?page:page+1;
                    testManager.listview.empty();
                    $('input[name=formCatId]').val(catid);
                    testManager.listview.append('<div class="ui-grid-b">' +
                    '<div class="ui-block-a">' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" href="#newQuestion" data-rel="dialog">+Q</a>' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" onclick="testManager.getQuestions('+catid+','+minus_page+')"> << </a></div>' +
                    '<div class="ui-block-b" align="center"><br><span> ' + start_item + ' .. ' + end_item + ' of ' + res.length + ' </span></div>' +
                    '<div class="ui-block-c" align="right">' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" onclick="testManager.getQuestions('+catid+','+plus_page+')"> >> </a></div>' +
                    '</div>');
                    for(var i=start_item; i<end_item; i++) {
                        var item = res[i];
                        testManager.title.html(item.catname);
                        li = '<li data-icon="delete">';
                        li += '<a><h3>' + item.question + '</h3>';
                        li += '<ol>';
                        li += '<li class="' + (item.success==1?'correct':'') + '">' + item.answer1 + '</li>';
                        li += '<li class="' + (item.success==2?'correct':'') + '">' + item.answer2 + '</li>';
                        li += '<li class="' + (item.success==3?'correct':'') + '">' + item.answer3 + '</li>';
                        li += '<li class="' + (item.success==4?'correct':'') + '">' + item.answer4 + '</li>';
                        li += '<li class="' + (item.success==5?'correct':'') + '">' + item.answer5 + '</li>';
                        li += '</ol></a>';
                        li += '<a onclick="testManager.delQuestion(' + item.id + ',' + item.catid + ')"></a>';
                        li += '</li>';
                        testManager.listview.append(li).listview('refresh');
                    }
                    //res.forEach(function (item, position, all) {
                    //});
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
    },

    addQuestion: function (form) {
        var data = $(form).serialize();
        $.ajax({
            url: 'db/question_add.php',
            data: data,
            dataType: 'json',
            success: function (response) {
                if(response.status) {
                    testManager.getQuestions($('input[name="formCatId"]').val());
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
        $('#newQuestion').dialog('close');
        $('input[name^="answer"]').val('');
        $('input[name="question"]').val('');
    },

    delQuestion: function (qid, catid) {
        if(confirm('Are you sure?')) {
            $.ajax({
                url: 'db/question_del.php?qid=' + qid,
                dataType: 'json',
                success: function (response) {
                    if(response.status) {
                        testManager.getQuestions(catid);
                    } else { alert(response.message); }
                },
                error: testManager.ajaxOnError
            });
        }
    },

    loadCode: function () {
        $.ajax({
            url: 'db/code.php?act=get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var result = response.result;
                    testManager.listview.empty();
                    testManager.listview.append('<li><a class="ui-btn ui-corner-all" style="color: blue;" onclick="testManager.addCode()">Add new code</a></li>');
                    result.forEach(function(item, count, all) {
                        testManager.listview.append('<li id="' + item.id + '"><a><h3>' + item.code + '</h3><p>' + item.email + '</p>' +
                        (item.used == '1'?'<span class="ui-li-count">used</span>':'') + '</a><a data-icon="delete" onclick="testManager.removeCode(' + item.id + ')"></a>' +
                        '</li>').listview('refresh');
                    });
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
    },

    addCode: function() {
        var email;
        if(email = prompt('Enter email from request', '')) {
            $.ajax({
                url: 'db/code.php?act=post&email=' + email,
                dataType: 'json',
                success: function(response) {
                    if(response.status) {
                        var r = response.result;
                        alert('For ' + r.email + ' generated code: ' + r.code);
                        testManager.loadCode();
                    } else { alert(response.message); }
                },
                error: testManager.ajaxOnError
            });
        }
    },

    removeCode: function(id) {
        if(confirm('Are you sure?')) {
            $.ajax({
                url: 'db/code.php?act=delete&id='+id,
                dataType: 'json',
                success: function(response) {
                    if(response.status) {
                        testManager.loadCode();
                    } else { alert(response.message); }
                },
                error: testManager.ajaxOnError
            });
        }
    }
};
