/**
 * Created by glavnyjpolzovatel on 13.07.15.
 */

testManager = {
    title: null,
    listview: null,
    panel: null,
    contentDiv: null,
    init: function () {
        $('#newQuestion').bind('pagebeforeshow', function() {
            //$('input').val('');
            //$('input #correct1').attr('checked',true).checkboxradio('refresh');
        } );
        this.listview = $('#listView');
        this.contentDiv = $('#contentDiv');
        this.title = $('#titleHeader');
        this.panel = $('#mainPanel');

        this.load.statPage();
    },

    ajaxOnError: function (data, status, errorThrow) {
        alert (data.responseText);
    },

    load: {
        statPage: function () {
            testManager.title.html('Statistic');
            testManager.listview.empty();
            testManager.getStatistic();
            testManager.panel.panel('close');
        },
        catPage: function () {
            testManager.title.html('Categories');
            testManager.loadCategories();
            testManager.panel.panel('close');
        },
        codePage: function () {
            testManager.title.html('Access codes');
            testManager.loadCode();
            testManager.panel.panel('close');
        },
        searchPage: function () {
            $('#searchWord').val('');
            $.mobile.changePage('#searchPage', {role:'dialog'});
            testManager.panel.panel('close');
        }
    },

    getStatistic: function () {
        $.ajax({
            url: 'db/statistic.php',
            dataType: 'json',
            success: function (response) {
                if(response.status) {
                    var codeStat = response.result.codes;
                    var questionStat = response.result.questions;

                    var codes = '';
                    for(i=0; i<codeStat.length; i++) {
                        codes = '<li><h3>' + (codeStat[i].used==0?'Unused codes: ':'Used codes: ') + codeStat[i].cnt + '</h3></li>';
                        testManager.listview.append(codes).listview('refresh');
                    }
                    testManager.listview.append('<li>&nbsp;</li>').listview('refresh');
                    var questions = '';
                    for(i=0; i<questionStat.length; i++) {
                        questions = '<li><h3>' + questionStat[i].catname + '</h3><p>questions ' + questionStat[i].cnt + '</p></li>';
                        testManager.listview.append(questions).listview('refresh');
                    }
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
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

    changeCategoryName: function (catid, catname, page) {
        $.ajax({
            url: 'db/categories.php?act=put&catid=' + catid + '&catname=' + encodeURIComponent(catname) + '&page=' + page,
            dataType: 'json',
            success: function (response) {
                if(response.status) {
                    testManager.getQuestions(catid, page);
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
    },

    search: function (form, page) {
        $('#searchPage').dialog('close');
        var per_page = 10;
        if(page == null || page < 0) page = 0;
        var data = $(form).serialize();
        $.ajax({
            url: 'db/search.php',
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var title;
                    var res = response.result;
                    var start_item = page * per_page;
                    var end_item = res.length<(start_item + per_page)?res.length:(start_item + per_page);
                    var minus_page = page==0?0:page-1;
                    var plus_page = end_item>=res.length?page:page+1;
                    testManager.listview.empty();
                    testManager.title.html('Found ' + res.length + ' records ...');

                    //$('input[name=formCatId]').val(catid);
                    testManager.listview.append('<div class="ui-grid-b">' +
                    '<div class="ui-block-a">' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" id="prevTable"> << </a></div>' +
                    '<div class="ui-block-b"  align="center"><br><span> ' + start_item + ' .. ' + end_item + ' of ' + res.length + ' </span></div>' +
                    '<div class="ui-block-c" align="right">' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" id="nextTable"> >> </a></div>' +
                    '</div>').listview('refresh');
                    $('#prevTable').bind('click', {formObj: form, pageNumber: minus_page}, function (e) { testManager.search(e.data.formObj, e.data.pageNumber); });
                    $('#nextTable').bind('click', {formObj: form, pageNumber: plus_page}, function (e) { testManager.search(e.data.formObj, e.data.pageNumber); });
                    for(var i=start_item; i<end_item; i++) {
                        var item = res[i];
                        li = '<li data-icon="delete" id="question' + item.id + '">';
                        li += '<a><h3>' + item.catname + '</h3>';
                        li += '<p>' + item.question + '</p>';
                        li += '<ol>';
                        li += '<li class="' + (item.success==1?'correct':'') + '"><p>' + item.answer1 + '</p></li>';
                        li += '<li class="' + (item.success==2?'correct':'') + '"><p>' + item.answer2 + '</p></li>';
                        li += '<li class="' + (item.success==3?'correct':'') + '"><p>' + item.answer3 + '</p></li>';
                        li += '<li class="' + (item.success==4?'correct':'') + '"><p>' + item.answer4 + '</p></li>';
                        li += '<li class="' + (item.success==5?'correct':'') + '"><p>' + item.answer5 + '</p></li>';
                        li += '</ol></a>';
                        li += '<a id="delete' + item.id + '"></a>';
                        li += '</li>';
                        testManager.listview.append(li).listview('refresh');
                        $('#delete' + item.id).bind('click', {itemid: item.id, catid: item.catid, formObj: form, page: page}, function (e) {
                            var callback = {
                                param1: e.data.formObj,
                                param2: e.data.page,
                                callbackFunc: function() { testManager.search(this.param1, this.param2); }
                            };
                            testManager.delQuestion(e.data.itemid, e.data.catid, callback);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                        $('#question'+item.id).bind('click', {item: item, form: form, page: page}, function(e) {
                            var item = e.data.item;
                            $('#newQuestionForm').unbind().bind('submit', {form: e.data.form, page: e.data.page}, function(e) {
                                var callback = {
                                    param1: e.data.form,
                                    param2: e.data.page,
                                    callbackFunc: function() { testManager.search(this.param1, this.param2); }
                                };
                                testManager.addQuestion(this, callback);
                                e.stopPropagation();
                                e.preventDefault();
                            });
                            $('#formCatId').val(item.catid);
                            $('#formQId').val(item.id);
                            $('#question').val(item.question);
                            $('#answer1').val(item.answer1);
                            $('#answer2').val(item.answer2);
                            $('#answer3').val(item.answer3);
                            $('#answer4').val(item.answer4);
                            $('#answer5').val(item.answer5);
                            $('input:radio').each(function() { this.checked = false; } );
                            document.getElementById('ca'+item.success).checked = true;
                            $('#newQuestion').trigger('create');
                            $.mobile.changePage('#newQuestion', {role:'dialog'});
                        });
                    }
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
                    var title;
                    var res = response.result;
                    var start_item = page * per_page;
                    var end_item = res.length<(start_item + per_page)?res.length:(start_item + per_page);
                    var minus_page = page==0?0:page-1;
                    var plus_page = end_item>=res.length?page:page+1;
                    testManager.listview.empty();

                    $('input[name=formCatId]').val(catid);
                    testManager.listview.append('<div class="ui-grid-b">' +
                    '<div class="ui-block-a">' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" href="#newQuestion" data-rel="dialog" id="newQuestionBtn">+Q</a>' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" onclick="testManager.getQuestions('+catid+','+minus_page+')"> << </a></div>' +
                    '<div class="ui-block-b"  align="center"><br><span> ' + start_item + ' .. ' + end_item + ' of ' + res.length + ' </span></div>' +
                    '<div class="ui-block-c" align="right">' +
                    '<a class="ui-btn ui-btn-inline ui-corner-all" onclick="testManager.getQuestions('+catid+','+plus_page+')"> >> </a></div>' +
                    '</div>');
                    $('#newQuestionBtn').bind('click', {catid: catid}, function (ev) {
                        $('#newQuestionForm').unbind().bind('submit', {catid: ev.data.catid}, function(e) {
                            var callback = {
                                param1: e.data.catid,
                                callbackFunc: function() { testManager.getQuestions(this.param1, 0); }
                            };
                            testManager.addQuestion(this, callback);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                        $('#formQId').val(0);
                        $('#question').val('');
                        $('#answer1').val('');
                        $('#answer2').val('');
                        $('#answer3').val('');
                        $('#answer4').val('');
                        $('#answer5').val('');
                        $('input:radio').each(function() { this.checked = false; } );
                        $('#newQuestion').trigger('create');
                    });
                    for(var i=start_item; i<end_item; i++) {
                        var item = res[i];
                        title = '<a href="#" id="categoryTitle">' + item.catname + '</a>';
                        li = '<li data-icon="delete" id="question' + item.id + '">';
                        li += '<a><h3>' + item.question + '</h3>';
                        li += '<ol>';
                        li += '<li class="' + (item.success==1?'correct':'') + '"><p>' + item.answer1 + '</p></li>';
                        li += '<li class="' + (item.success==2?'correct':'') + '"><p>' + item.answer2 + '</p></li>';
                        li += '<li class="' + (item.success==3?'correct':'') + '"><p>' + item.answer3 + '</p></li>';
                        li += '<li class="' + (item.success==4?'correct':'') + '"><p>' + item.answer4 + '</p></li>';
                        li += '<li class="' + (item.success==5?'correct':'') + '"><p>' + item.answer5 + '</p></li>';
                        li += '</ol></a>';
                        li += '<a href="#" id="delete' + item.id + '"></a>';
                        li += '</li>';
                        testManager.listview.append(li).listview('refresh');
                        $('#delete' + item.id).bind('click', {itemid: item.id, catid: item.catid, page: page}, function (e) {
                            var callback = {
                                param1: e.data.catid,
                                param2: e.data.page,
                                callbackFunc: function() { testManager.getQuestions(this.param1, this.param2); }
                            };
                            testManager.delQuestion(e.data.itemid, e.data.catid, callback);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                        $('#question'+item.id).bind('click', {item: item, page: page}, function(e) {
                            var item = e.data.item;
                            $('#newQuestionForm').unbind().bind('submit', {form: this, catid: item.catid, page: e.data.page}, function(e) {
                                var callback = {
                                    param1: e.data.catid,
                                    param2: e.data.page,
                                    callbackFunc: function() { testManager.getQuestions(this.param1, this.param2); }
                                };
                                testManager.addQuestion(this, callback);
                                e.stopPropagation();
                                e.preventDefault();
                            });
                            $('#formCatId').val(item.catid);
                            $('#formQId').val(item.id);
                            $('#question').val(item.question);
                            $('#answer1').val(item.answer1);
                            $('#answer2').val(item.answer2);
                            $('#answer3').val(item.answer3);
                            $('#answer4').val(item.answer4);
                            $('#answer5').val(item.answer5);
                            $('input:radio').each(function() { this.checked = false; } );
                            document.getElementById('ca'+item.success).checked = true;
                            $('#newQuestion').trigger('create');
                            $.mobile.changePage('#newQuestion', {role:'dialog'});
                        });
                    }
                    testManager.title.html(title);
                    $('#categoryTitle').bind('click', {catid:item.catid, catname: item.catname, page: page}, function (e) {
                        var name;
                        if(name = prompt('Category name', e.data.catname)) {
                            testManager.changeCategoryName(e.data.catid, name, page);
                        }
                    });
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
    },

    addQuestion: function (form, callback) {
        var data = $(form).serialize();
        $.ajax({
            url: 'db/question_add.php',
            data: data,
            dataType: 'json',
            success: function (response) {
                if(response.status) {
                    callback.callbackFunc();
                    //testManager.getQuestions($('input[name="formCatId"]').val());
                } else { alert(response.message); }
            },
            error: testManager.ajaxOnError
        });
        $('#newQuestion').dialog('close');
        $('input[name^="answer"]').val('');
        $('input[name="question"]').val('');
    },

    delQuestion: function (qid, catid, callback) {
        if(confirm('Are you sure?')) {
            $.ajax({
                url: 'db/question_del.php?qid=' + qid,
                dataType: 'json',
                success: function (response) {
                    if(response.status) {
                        callback.callbackFunc();
                        //testManager.getQuestions(catid);
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
                        testManager.listview.append('<li id="code' + item.id + '"><a><h3>' + item.code + '</h3><p>' + item.email + '</p>' +
                        (item.used == '1'?'<span class="ui-li-count" style="background: lime;">used</span>':'') + '</a><a data-icon="delete" onclick="testManager.removeCode(' + item.id + ')"></a>' +
                        '</li>').listview('refresh');
                        $('#code' + item.id).bind('click', {itemId: item.id}, function (e) { testManager.resetCode(e.data.itemId); });
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
    },

    resetCode: function (cid) {
        if(confirm('reset used flag for this code?')) {
            $.ajax({
                url: 'db/code.php?act=reset&id='+cid,
                dataType: 'json',
                success: function (response) {
                    if(response.status) {
                        testManager.loadCode();
                    } else { alert(response.message); }
                },
                error: testManager.ajaxOnError
            });
        }
    }
};
