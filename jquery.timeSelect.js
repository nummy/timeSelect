;(function($) {
    function timeSelect(elem, settings) {
        this.settings = settings;
        this.$elem = elem;
        this.weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
        this.init();
    }
    timeSelect.prototype = {
        // init plugin
        init: function() {
            this.initTable();
        },
        // bind events
        bindEvent: function() {
            var that = this;
            var $table = this.$elem;
            // click x axis
            $table.find("input[class^=x_]").change(function() {
                var xy = that.getXy($(this).attr("class"));
                var cki = this;

                $table.find("tr:gt(1)").each(function() {
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
                            $table.find("input[class=y_0_" + i + "]").prop("checked", true);
                        }
                    }

                } else {
                    $table.find("input[class^=y_]").each(function(i) {
                        var yckd = $table.find("tr:eq(" + (i + 1) + ")>td").children("div.checked");
                        if (yckd.length == 48) {
                            $table.find(".y_0_" + (i + 1)).prop("checked", true);
                        } else {
                            $table.find(".y_0_" + (i + 1)).prop("checked", false);
                        }
                    });
                }
                that.displayInfo();
            });
            // click y axis
            $table.find("input[class^=y_]").change(function() {
                var xy = that.getXy($(this).attr("class"));
                var cki = this;

                $table.find("tr:eq(" + (parseInt(xy.y) + 1) + ")>td").each(function() {
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
                            $table.find("input[class=x_" + i + "_0" + "]").prop("checked", true);
                        }
                    }

                } else {
                    $table.find("input[class^=x_]").each(function() {
                        var xy = that.getXy($(this).attr("class"));
                        var xckd = $table.find("div[class^='span xy_" + xy.x + "']").filter(".checked");
                        if (xckd.length == 7) {
                            $table.find(".x_" + xy.x + "_0").prop("checked", true);
                        } else {
                            $table.find(".x_" + xy.x + "_0").prop("checked", false);
                        }
                    });
                }
                that.displayInfo();
            });
            // click div span
            $table.find("div.span").click(function() {
                var xy = that.getXy($(this).attr("class").replace(" checked", ""));
                var cked = $(this).hasClass("checked");
                if (cked) {
                    $(this).removeClass("checked");
                } else {
                    $(this).addClass("checked");
                }
                that.cacheCheck(xy);
                that.displayInfo();
            });
            // click reset button
            $table.find(".clearButton").click(function(e) {
                that.clear();
                e.preventDefault();
            });
        },
        // init table
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
        // init table header
        initHeader: function() {
            var $header = [],
              $tr = $("<tr>"),
              $td,
              i;
            for (i = 0; i < 25; i++) {
                if (i == 0) {
                    $td = $("<td colspan=2 rowspan=2></td>");
                } else {
                    $td = $("<td colspan=2>" + (i - 1) + "</td>");
                }
                $td.appendTo($tr);
            }
            $header.push($tr);
            $tr = $("<tr>");
            for (i = 0; i < 50; i++) {
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
        // init table body
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
        // init table footer
        initFooter: function() {
            var $tr = $("<tr>");
            var $labelTd = $("<td colspan=2><p>已选时间</p></td>");
            var $infoTd = $("<td class='info' colspan=46></td>");
            var $clearTd = $("<td class='clearTd' colspan=2><p><a class='clearButton'>重置</a></p></td>");
            $tr.append($labelTd);
            $tr.append($infoTd);
            $tr.append($clearTd);
            return $tr;
        },
        // check if all checkbox on one row are checked
        isRowAllChecked: function(y) {
            var yckd = this.$elem.find("tr:eq(" + (y + 1) + ")>td").children("div.checked");
            return yckd.length == 48;
        },
        // check if all checkbox on one column are checked
        isColumnAllChecked: function(x) {
            var xckd = this.$elem.find("div[class^='span xy_" + x + "_']").filter(".checked");
            return xckd.length == 7;
        },
        checkRowAndColumn: function() {
            for (var i = 0; i < 7; i++) {
                if (this.isRowAllChecked(i + 1)) {
                    this.$elem.find("input[class=y_0_" + (i+1) + "]").prop("checked", true);
                }
            }
            for (var j = 0; j < 48; j++) {
                if (this.isColumnAllChecked(j + 1)) {
                    this.$elem.find("input[class=x_" + (j+1) + "_0" + "]").prop("checked", true);
                }
            }
        },
        cacheCheck: function(xy) {
            var xckd = this.$elem.find("div[class^='span xy_" + xy.x + "_']").filter(".checked");
            if (xckd.length == 7) {
                this.$elem.find(".x_" + xy.x + "_0").prop("checked", true);
            } else {
                this.$elem.find(".x_" + xy.x + "_0").prop("checked", false);
            }
            var yckd = this.$elem.find("tr:eq(" + (parseInt(xy.y) + 1) + ")>td").children("div.checked");
            if (yckd.length == 48) {
                this.$elem.find(".y_0_" + xy.y).prop("checked", true);
            } else {
                this.$elem.find(".y_0_" + xy.y).prop("checked", false);
            }
        },
        initArray: function() {
            var arr = [];
            for (var i = 0; i < 7; i++) {
                arr[i] = [];
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
            var checkeds = this.$elem.find("div.checked");
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
                this.$elem.find("td.info").html(timeStr.join(""));
            }
        },
        minutesToHour: function(minutes) {
            var hour = Math.floor(minutes / 60);
            minutes = minutes % 60;
            if (minutes == 0) {
                minutes = "00";
            }
            return hour + ":" + minutes;
        },
        clear: function() {
            this.$elem.find("div.checked").each(function() {
                $(this).removeClass("checked");
            });
            this.$elem.find("input[class^=y_]").each(function(i) {
                $(this).prop("checked", false);
            });
            this.$elem.find("input[class^=x_]").each(function(i) {
                $(this).prop("checked", false);
            });
            this.$elem.find("td.info").html("");

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
                         this.$elem.find("div.xy_" + (j + 1) + "_" + (i + 1)).addClass("checked");
                    }
                }
            }
            this.checkRowAndColumn();
            this.displayInfo();
        },
        getValue: function() {
            var that = this;
            var checkeds = this.$elem.find("div.checked");
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
            window.times = result;
            return result;
        },
        destroy: function(){
            this.$elem.empty();
            this.$elem.removeData("timeSelect");
        }
    };

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
