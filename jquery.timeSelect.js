;(function($) {
    function timeSelect(elem, settings) {
        this.settings = settings;
        this.$elem = elem;
        this.weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
        this.init();
    }

    timeSelect.prototype = {
        init: function() {
            this.initTable();
        },
        bindEvent: function() {
            var that = this;
            $("input[class^=x_]").change(function() {
                var xy = that.getXy($(this).attr("class"));
                var cki = this;

                $("tr:gt(1)").each(function(index) {
                    var t = $(this).find("td:eq(" + (parseInt(xy.x) + 1) + ")>div");
                    if (cki.checked) {
                        if (!t.hasClass("checked")) {
                            t.addClass("checked");
                        }
                    } else {
                        t.removeClass("checked");
                    }
                });
                if (cki.checked) {
                    for (var i = 1; i <= 7; i++) {
                        if (that.isRowAllChecked(i)) {
                            $("input[class=y_0_" + i + "]").prop("checked", true);
                        }
                    }

                } else {
                    $("input[class^=y_]").each(function(i) {
                        var yckd = $("tr:eq(" + (i + 1) + ")>td").children("div.checked");
                        if (yckd.length == 48) {
                            $(".y_0_" + (i + 1)).prop("checked", true);
                        } else {
                            $(".y_0_" + (i + 1)).prop("checked", false);
                        }
                    });
                }
                that.displayInfo();
            });

            $("input[class^=y_]").change(function(index) {
                var xy = that.getXy($(this).attr("class"));
                var cki = this;

                $("tr:eq(" + (parseInt(xy.y) + 1) + ")>td").each(function(index) {
                    var t = $(this).children("div");
                    if (cki.checked) {
                        if (!t.hasClass("checked")) {
                            t.addClass("checked");
                        }
                    } else {
                        t.removeClass("checked");
                    }
                });
                if (cki.checked) {
                    for (var i = 1; i <= 48; i++) {
                        if (that.isColumnAllChecked(i)) {
                            $("input[class=x_" + i + "_0" + "]").prop("checked", true);
                        }
                    }

                } else {
                    $("input[class^=x_]").each(function(i) {
                        var xy = that.getXy($(this).attr("class"));
                        var xckd = $("div[class^='span xy_" + xy.x + "']").filter(".checked");
                        if (xckd.length == 7) {
                            $(".x_" + xy.x + "_0").prop("checked", true);
                        } else {
                            $(".x_" + xy.x + "_0").prop("checked", false);
                        }
                    });
                }
                that.displayInfo();
            });

            $("div.span").click(function(index) {
                var xy = that.getXy($(this).attr("class").replace(" checked", ""));
                var cki = this;
                var cked = $(this).hasClass("checked");

                if (cked) {
                    $(this).removeClass("checked");
                } else {
                    $(this).addClass("checked");
                }
                that.cacheCheck(xy);
                that.displayInfo();
            });

            $("button.clearButton").click(function() {
                that.clear();
            });
        },
        initTable: function() {
            var $table = this.$elem;
            var $header = this.initHeader();
            var $body = this.initBody();
            var $footer = this.initFooter();
            $table.append($header);
            $table.append($body);
            $table.append($footer);
            this.bindEvent();
        },
        initHeader: function() {
            var $header = []
            var $tr = $("<tr>");
            var $td;
            for (var i = 0; i < 25; i++) {
                if (i == 0) {
                    $td = $("<td colspan=2 rowspan=2></td>");
                } else {
                    $td = $("<td colspan=2>" + (i - 1) + "</td>");
                }
                $td.appendTo($tr);
            }
            $header.push($tr);
            $tr = $("<tr>");
            for (var i = 0; i < 50; i++) {
                if (i < 2) {
                    continue;
                } else {
                    $td = $("<td><input type='checkbox' class='x_" + (i - 1) + "_0'></td>");
                }
                $td.appendTo($tr);
            }
            $header.push($tr);
            return $header;
        },
        initBody: function() {
            var $tr, $td;
            var body = [];
            for (var i = 0; i < 7; i++) {
                $tr = $("<tr>");
                for (var j = 0; j < 50; j++) {
                    if (j == 0) {
                        $td = $("<td>" + this.weeks[i] + "</td>");
                    } else if (j == 1) {
                        $td = $("<td><input type='checkbox' class='y_0_" + (i + 1) + "'" + "></td>");
                    } else {
                        $td = $("<td><div class='span xy_" + (j - 1) + "_" + (i + 1) + "' " + "></div></td>");
                    }
                    $td.appendTo($tr);
                }
                body.push($tr);
            }
            return body;
        },
        initFooter: function() {
            var $tr = $("<tr>");
            var $labelTd = $("<td colspan=2><p>已选时间</p></td>");
            var $infoTd = $("<td class='info'colspan=46></td>");
            var $clearTd = $("<td class='clear' colspan=2><p><button class='clearButton'>重置</button></p></td>");
            $tr.append($labelTd);
            $tr.append($infoTd);
            $tr.append($clearTd);
            return $tr;
        },
        isRowAllChecked: function(y) {
            var yckd = $("tr:eq(" + (y + 1) + ")>td").children("div.checked");
            if (yckd.length == 48) {
                return true;
            } else {
                return false;
            }

        },
        isColumnAllChecked: function(x) {
            var xckd = $("div[class^='span xy_" + x + "_']").filter(".checked");
            if (xckd.length == 7) {
                return true;
            } else {
                return false;
            }
        },
        checkRowAndColumn: function() {
            for (var i = 0; i < 7; i++) {
                if (this.isRowAllChecked(i + 1)) {
                    $("input[class=y_0_" + (i+1) + "]").prop("checked", true);
                }
            }
            for (var j = 0; j < 48; j++) {
                if (this.isColumnAllChecked(j + 1)) {
                    $("input[class=x_" + (j+1) + "_0" + "]").prop("checked", true);
                }
            }
        },
        cacheCheck: function(xy) {
            var xckd = $("div[class^='span xy_" + xy.x + "_']").filter(".checked");
            if (xckd.length == 7) {
                $(".x_" + xy.x + "_0").prop("checked", true);
            } else {
                $(".x_" + xy.x + "_0").prop("checked", false);
            }
            var yckd = $("tr:eq(" + (parseInt(xy.y) + 1) + ")>td").children("div.checked");
            if (yckd.length == 48) {
                $(".y_0_" + xy.y).prop("checked", true);
            } else {
                $(".y_0_" + xy.y).prop("checked", false);
            }
        },
        initArray: function() {
            var arr = new Array();
            for (var i = 0; i < 7; i++) {
                arr[i] = new Array();
                for (var j = 0; j < 48; j++) {
                    arr[i][j] = 0;
                }
            }
            return arr;
        },
        arrayToString: function(arr) {
            var str = "";
            for (var i = 0; i < 7; i++) {
                str += arr[i].join("");
            }
            return str;
        },
        stringToArray: function(str) {
            var arr = this.initArray();
            var temp;
            if (str.length != 336) {
                return arr;
            } else {
                for (var i = 0; i < 7; i++) {
                    temp = str.substring(i * 48, i*48 + 48);
                    for (var j = 0; j < temp.length; j++) {
                        arr[i][j] = temp[j];
                    }
                }
                return arr;
            }
        },
        getTimeSection: function(arr) {
            var result = [];
            if (arr.length == 0) {
                result = [];
            } else if (arr.length == 1) {
                result = [this.minutesToHour(arr[0] * 30 - 30) + "-" + this.minutesToHour(arr[0] * 30)];
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] <= end) {
                        continue;
                    }
                    var start = arr[i];
                    var end = arr[i];
                    for (var j = i + 1, step = 1; j < arr.length; j++, step++) {
                        if (arr[j] == arr[i] + step) {
                            end = arr[j];
                        } else {
                            break;
                        }
                    }

                    result.push(this.minutesToHour(start * 30 - 30) + "-" + this.minutesToHour(end * 30));
                }
            }
            return result;
        },
        displayInfo: function() {
            var checkeds = $("div.checked");
            var that = this;
            if (checkeds.length > 0) {
                var data = {};
                checkeds.each(function() {
                    var xy = that.getXy($(this).attr("class").replace(" checked", ""));
                    var w = that.weeks[xy.y - 1];
                    var h = xy.x;
                    if (!data[w]) {
                        data[w] = [];
                    }
                    data[w].push(h);
                });
                var timeStr = [];
                $.each(data, function(k, v) {
                    timeStr.push("</p>" + k + ":" + that.getTimeSection(v).join(",") + "</p>");
                });
                $("td.info").html(timeStr.join(""));
            }
        },
        minutesToHour: function(minutes) {
            var result = "";
            var hour = Math.floor(minutes / 60);
            var minutes = minutes % 60;
            if (minutes == 0) {
                minutes = "00";
            }
            result = hour + ":" + minutes;
            return result;
        },
        clear: function() {
            $("div.checked").each(function() {
                $(this).removeClass("checked");
            });
            $("input[class^=y_]").each(function(i) {
                $(this).prop("checked", false);
            });
            $("input[class^=x_]").each(function(i) {
                $(this).prop("checked", false);
            });
            $("td.info").html("");

        },
        getXy: function(cls) {
            var arr = cls.split("_");
            return {
                x: parseInt(arr[1]),
                y: parseInt(arr[2])
            };
        },
        setValue: function(str) {
            this.clear();
            var arr = this.stringToArray(str);
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    if(arr[i][j] == 1){
                         $("div.xy_" + (j + 1) + "_" + (i + 1)).addClass("checked");
                    }
                }
            }
            this.checkRowAndColumn();
            this.displayInfo();
        },
        getValue: function() {
            var that = this;
            var checkeds = $("div.checked");
            var result = "";
            if (checkeds.length > 0) {
                var arr = that.initArray();
                checkeds.each(function() {
                    var xy = that.getXy($(this).attr("class").replace(" checked", ""));
                    var x = xy.x;
                    var y = xy.y;
                    arr[y - 1][x - 1] = 1;
                });
                result = that.arrayToString(arr);
            }
            return result;
        },
        destroy: function(){
            this.$elem.empty();
            this.$elem.removeData("timeSelect");
        }
    }

    $.fn.timeSelect = function(options) {
        var settings = $.extend({}, $.fn.timeSelect.defaults, typeof options === "object" ? options : {});
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var elem = $(this);
            var plugin = $(this).data("timeSelect");
            if (!plugin) {
                plugin = new timeSelect(elem, settings);
                $(this).data("timeSelect", plugin);
            }
            if (typeof options === "string" && typeof plugin[options] == "function") {
                plugin[options].apply(plugin, args);
            }
        });
    };
    $.fn.timeSelect.Constructor = timeSelect;
    $.fn.timeSelect.defaults = {};
    $(function () {
        $('[data-toggle="timeSelect"]').timeSelect();
    });
})(jQuery);
