/**
 * Created by glavnyjpolzovatel on 13.07.15.
 */

testManager = {
    title: null,
    //catList: null,
    //codeList: null,
    listview: null,
    panel: null,
    init: function () {
        $('#newQuestion').bind('pagebeforeshow', function() {
            $('input').val('');
            $('input #correct1').attr('checked',true).checkboxradio('refresh');
        } );
        this.listview = $('#listView');
        //this.catList = $('#catList');
        //this.codeList = $('#codeList');
        this.title = $('#titleHeader');
        this.panel = $('#mainPanel');
        //this.loadCategories();
        //this.loadCode();
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
                error: function(data, status, errorThrow) {
                    alert(data.responseText);
                }
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
                error: function(data, status, errorThrow) {
                    alert(data.responseText);
                }
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
                        testManager.listview.append('<li data-icon="false" id="cat' + item.id + '"><a onclick="testManager.catDetail(' + item.id + ')">' + item.catname + '</a>' +
                        '<a data-icon="delete" onclick="testManager.removeCategories(' + item.id + ')"></a></li>');
                    });
                    testManager.listview.listview('refresh');
                } else { alert(response.message); }
            },
            error: function(data, status, errorThrow) {
                alert(data.responseText);
            }
        });
    },

    catDetail: function (catid) {
        $.ajax({
            url: 'db/cat_detail.php?act=get&catid=' + catid,
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var res = response.result;
                    testManager.listview.empty();
                    testManager.listview.append('<div class="ui-grid-b">' +
                    '<div class="ui-block-a"><a class="ui-btn ui-btn-inline ui-corner-all" href="#newQuestion" data-rel="dialog">+Q</a>' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all"> << </a></div>' +
                    '<div class="ui-block-b" align="center"><br><span> 1 .. 20 of 100 </span></div>' +
                    '<div class="ui-block-c" align="right"><a class="ui-btn ui-btn-inline ui-corner-all"> >> </a></div>' +
                    '</div>');
                    res.forEach(function (item, position, all) {
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
                        li += '<a></a>';
                        li += '</li>';
                        testManager.listview.append(li).listview('refresh');
                    });
                } else { alert(response.message); }
            },
            error: function (data, status, errorThrow) {
                alert (data.responseText);
            }
        });
    },

    addQuestion: function () {
        var question = $('#question').val();
        var answer_1 = $('#answer1').val();
        var answer_2 = $('#answer2').val();
        var answer_3 = $('#answer3').val();
        var answer_4 = $('#answer4').val();
        var answer_5 = $('#answer5').val();
        //var correct = ;
        alert('Q: ' + question + ', correct: ' + $("#ca1").val());
        $('#newQuestion').dialog('close');
    },

    loadCode: function () {
        $.ajax({
            url: 'db/code.php?act=get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var result = response.result;
                    testManager.listview.empty();
                    testManager.listview.append('<li><a class="ui-btn ui-corner-all" onclick="testManager.addCode()">Add new code</a></li>');
                    result.forEach(function(item, count, all) {
                        testManager.listview.append('<li id="' + item.id + '"><a><h3>' + item.code + '</h3><p>' + item.email + '</p>' +
                        (item.used == '1'?'<span class="ui-li-count">used</span>':'') + '</a><a data-icon="delete" onclick="testManager.removeCode(' + item.id + ')"></a>' +
                        '</li>').listview('refresh');
                    });
                } else { alert(response.message); }
            },
            error: function (data, status, errorThrow) {
                alert (data.responseText);
            }
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
                error: function(data, status, errorThrow) {
                    alert(data.responseText);
                }
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
                error: function(data, status, errorThrow) {
                    alert(data.responseText);
                }
            });
        }
    }
};
