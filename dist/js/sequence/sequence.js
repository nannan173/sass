 !(function(w, $, SVG) {
     var sequence = function(dom, opt) {
         this.contain = dom;
         this.init(data);
     };
     sequence.prototype = {
         children: {

             nodes: [],
             messages: []
         },
         linelineheight: 0,
         init: function(data) {
             //初始化数据   
             var _this = this;
             for (var a in data) {
                 var edata = data[a];
                 switch (a) {
                     case "nodes":
                         _this.addNode(edata);
                         break;
                     case "messages":
                         _this.addMessage(edata);
                         break;
                 }
             }
         },

         render: function() {
             //渲染页面
             var _this = this;
             if (SVG.supported) {
                 var messages = _this.children.messages,
                     nodes = _this.children.nodes;
                 _this.draw = SVG(_this.contain.attr('id')).size(nodes.length * 280, _this.getlifelineheight(parseInt(-1)) + 200);
                 if ($(window).width() > nodes.length * 270) {
                     $("#" + _this.draw.id()).css({ "left": ($(window).width() - nodes.length * 270) / 2 });
                 }
                 for (var i in nodes) {
                     nodes[i].setLifelineheight(_this.getlifelineheight(-1));
                     console.log(_this.getlifelineheight(-1));
                     nodes[i].draw(this.draw);
                 }
                 for (var i in messages) {
                     messages[i].setY(_this.getlifelineheight(parseInt(i)));
                     messages[i].draw(this.draw);

                 }
             } else {
                 return;
             }
         },
         findNodeById: function(id) {
             var _this = this;
             var nodes = _this.children.nodes;
             for (var i in nodes) {
                 if (nodes[i].id === id) {
                     return nodes[i];
                 }
             }
             return null;
         },
         findMessageById: function(id) {

         },
         getNodes: function(obj) {
             var _this = this;
             for (var i in _this.children) {
                 _this.children[i].elementType === "message" && obj.push(_this.children[i]);
             }
             return obj;
         },
         getMessages: function(obj) {
             var _this = this;
             for (var i in _this.children) {
                 _this.children[i].elementType === "message" && obj.push(_this.children[i]);
             }
             return obj;
         },
         getlifelineheight: function(index) {
             var _this = this;
             var messages = _this.children.messages;
             var no = _this.children.nodes[0];
             var lifelineheight = node ? no.style.height + no.style.y + 90 : 90;
             l = messages.length;
             var lindex = index == -1 ? l - 1 : index > l - 1 ? l - 1 : index;
             for (var i = 0; i < lindex; i++)
                 lifelineheight += (messages[i].getHeight() + 40);
             if (index == -1) {
                 lifelineheight += (messages[i - 1].getHeight() + 40);
             }
             return lifelineheight + 30;
         },
         addNode: function(data) {
             var w = 300,
                 _this = this;
             var l = _this.children.nodes.length;
             if (isArray(data)) {
                 for (var n in data) {
                     var no = new node(data[n]);
                     no.postion(Math.floor((l + n) * w + 30), 30);
                     _this.children.nodes.push(no);
                 }
             } else {
                 _this.children.nodes.push(new node(data));
             }
         },
         addMessage: function(data) {
             var _this = this,
                 h = 140;
             var l = _this.children.messages.length;
             if (isArray(data)) {
                 for (var n in data) {
                     var mess = new message(data[n]);
                     _this.children.messages.push(mess);
                     mess.nodeA = _this.findNodeById(data[n].nodeAId);
                     mess.nodeB = _this.findNodeById(data[n].nodeBId);
                 }
             } else {
                 _this.children.messages.push(new message(data));
             }
         }
     };

     var node = function(data) {
         this.init(data);
     };
     node.prototype = {
         elementType: "node",
         messages: [],
         detail: null,
         init: function(data) {
             //数据初始化以及赋值
             var _this = this;
             var styleDfaulte = {
                 x: 0,
                 y: 0,
                 width: 0,
                 height: 52,
                 background: "#add868",

                 minWidth: 120,
                 radius: 10,
                 lifelineStyle: {
                     x: 0,
                     y: 0,
                     width: 4,
                     height: 0,
                     color: '#add868'
                 },
                 lifelineblockStyle: {
                     x: 0,
                     y: 0,

                     width: 24,
                     height: 0,
                     background: '#add868'
                 }
             };
             _this.style = $.extend({}, styleDfaulte, data.style);
             _this.id = data.id;
             _this.title = data.title;
             _this.detail = data.detail;

         },
         postion: function(x, y) {
             var _this = this;
             _this.style.x = x;
             _this.style.y = y;
         },
         draw: function(draw) {
             var _this = this;
             _this.group = draw.group().move(_this.style.x, _this.style.y).addClass("node");
             var text = _this.drawText(draw);
             var rect = draw.rect(this.style.width, _this.style.height).radius(10).fill(_this.style.background).addClass("nodebg"); 
             var rectbg = draw.rect(_this.style.width + 2, _this.style.height + 2).radius(10).fill("#96bd57").addClass("nodeshadow");
             _this.group.add(_this.drawLifeLine(draw));
             _this.group.add(_this.drawLifeblock(draw));
             _this.nodegroup = draw.group().addClass("node-innear");
             _this.nodegroup.add(rectbg);
             _this.nodegroup.add(rect);
             _this.nodegroup.add(text);
             _this.group.add(_this.nodegroup);
             _this.detail && _this.hover(draw, 0, this.style.height + 10);


         },
         drawText: function(draw) {
             var _this = this;
             text = draw.text(function(add) {
                 add.tspan(_this.title).newLine();
             }).font({
                 family: 'Microsoft Yahei',
                 size: 20,
                 leading: '1'
             }).fill({
                 color: '#fff'
             });
             var w = text.length() + 20;

             var h = text.node.clientHeight;
             text.move(10, (_this.style.height - h) / 2);
             !this.style.width && (_this.style.width = w);
             return text;

         },
         hover: function(draw, x, y) {
             var _this = this;
             $(document).on("mouseover", "#" + _this.nodegroup.id(), function() {
                 if (!_this.hovergroup) {
                     _this.drawDetail(draw, x, y);
                     _this.hovergroup && _this.hovergroup.show();
                 } else {

                     _this.hovergroup.show();
                 }

             }).on("mouseout", "#" + _this.nodegroup.id(), function() {
                 _this.hovergroup && _this.hovergroup.hide();
             });
         },
         drawDetail: function(draw, x, y) {
             //更多hover
             var _this = this;
             var group = draw.group().addClass("svghover").move(_this.group.x() + x, _this.group.y() + y);
             var detail = _this.detail;
             if (!detail) return;
             var h = 0;
             var mw = 0,
                 tw = 0;
             var text = draw.text(function(add) {
                 for (var k in detail) {
                     tw = add.tspan(k + " :").newLine().length() +
                         add.tspan(detail[k]).dx(5).length() + 5;
                     h += 30;
                     if (tw > mw) mw = tw;
                 }
             }).font({
                 family: 'Microsoft Yahei',
                 size: 12,
                 leading: '2.5'
             }).fill("#fff").move(25, 25);
             // var w=text.length()+30; 
             var w = mw + 50 > 150 ? mw + 50 : 150;
             group.add(draw.path("M" + (_this.style.width / 2 - 13) + "  0 L" + _this.style.width / 2 + "  " + (-13) + " L" + (_this.style.width / 2 + 13) + "  0 Z ").fill("#666"));
             var offset = (_this.style.width - w) / 2
             var rect = draw.rect(w, h + 55).radius(10).fill("#666");
             group.add(rect.dx(offset));
             group.add(text.dx(offset));
             _this.hovergroup = group;
             group.hide();
             _this.hover(group);

         },
         drawLifeLine: function(draw) {
             var _this = this;
             var cx = Math.floor(_this.style.width / 2),
                 cy = Math.floor(_this.style.height + 2);
             _this.style.lifelineStyle.x = cx;
             _this.style.lifelineStyle.y = cy;

             return draw.path("M" + cx + " " + cy + " L" + cx + " " + (cy + _this.style.lifelineStyle.height)).stroke({
                 color: '#aaa',
                 width: _this.style.lifelineStyle.width,
                 "  dasharray": "16 8"
             }).addClass("nodelifeline");
         },

         drawLifeblock: function(draw) {
             var _this = this;
             var style = _this.style.lifelineblockStyle;
             var cx = Math.floor(_this.style.width / 2),
                 cy = Math.floor(_this.style.height + 2);
             style.x = cx - style.width / 2;
             style.y = cy + 40;
             style.height = _this.style.lifelineStyle.height - 90;


             return draw.rect(style.width, style.height).fill(style.background).addClass("wait-block").dx(style.x).dy(style.y);
         },
         drawPop: function(draw, g, x, y) {
             var _this = this;
             var group = draw.group().addClass('popwap').move(x, y);
             var text = draw.text(_this.wait.time).font({
                 family: 'Microsoft Yahei',
                 size: 12,
                 leading: '1'
             }).fill({
                 color: '#fff'
             }).dy(2).dx(12);
             var w = text.length();
             group.add(draw.path("M0 12 L9 4 L7 11z").fill("#add868"));
             group.add(draw.rect(w + 10, 16).dx(6).radius(5).fill("#add868"));
             group.add(text);
             g.add(group);
         },
         setLifeHight: function() {

         },
         addMessage: function(mess) {
             //messageAs messageBs赋值
             // var offset = 30;
             // this.lifelineStyle.height += mess.height + offset;
         },
         setLifelineheight: function(h) {
             this.style.lifelineStyle.height = h;
         }
     };
     var message = function(data) {
         var _this = this;
         _this.type = "0";
         _this.index = "-1";
         _this.title = "message";
         _this.state = "0";
         _this.nodeA = null;
         _this.nodeB = null;
         _this.wait = null;
         _this.detail = null;
         _this.init(data);
     };
     message.prototype = {
         elementType: "message",
         init: function(data) {
             var _this = this;
             //数据初始化以及赋值
             var styleDfaulte = {
                 x: 0,
                 y: 0,
                 width: 0,
                 height: 120,
                 linestyle: {
                     color: "#81a941",
                     width: 1
                 },
                 indexStyle: {
                     width: 18,
                     height: 18,
                     type: "circle",
                     color: "#fff",
                     fontSize: 12,
                     background: "#ff5454"
                 },
                 remarkStyle: {}
             };
             _this.style = $.extend({}, styleDfaulte, data.style);
             _this.type = data.type + "";
             _this.state = data.state + "";
             _this.index = data.index;
             _this.title = data.title;
             _this.remark = data.remark;
             _this.detail = data.detail;
             _this.wait = data.wait;

         },
         draw: function(draw) {
             var _this = this;
             var tag = 1;
             var ax = _this.nodeA.style.x,
                 bx = _this.nodeB.style.x;
             var lw = _this.nodeA.style.lifelineblockStyle.width / 2,
                 lax = _this.nodeA.style.lifelineStyle.x,
                 lbx = _this.nodeB.style.lifelineStyle.x;
             if (ax < bx) {
                 tag = 1;
             } else if (ax == bx) {
                 tag = 0;
             } else {
                 tag = -1;
             }
             _this.tag = tag;
             _this.style.x = lax + ax + (lw + 2) * tag;
             _this.style.width = lbx + bx - (lax + ax) - (lw + 2) * 2 * tag;
             _this.group = draw.group().move(_this.style.x, _this.style.y).addClass("message");
             _this.inneargroup = draw.group().move(0, 0).addClass("message-innear");
             _this.group.add(this.inneargroup);
             _this.drawLine(draw);
             _this.drawIndex(draw);
             _this.drawText(draw);
             _this.drawWait(draw);
             _this.hover(draw);
             _this.detail && _this.group.add(draw.rect(_this.width, 50));
         },
         drawIndex: function(draw) {
             //序号
             var _this = this;
             var style = _this.style.indexStyle;
             var group = draw.group().move(15, 7);
             if (_this.tag == -1) group.dx(_this.style.width);
             var circle = draw.circle(style.width).fill(style.background);

             var text = draw.text(_this.index).font({
                 family: 'Microsoft Yahei',
                 size: 12,
                 leading: '1'
             }).fill({
                 color: '#fff'
             });
             text.dx(style.width / 2 - text.length() / 2).dy(2);
             group.add(circle);
             group.add(text);
             _this.inneargroup.add(group);
         },
         drawText: function(draw) {
             var _this = this;
             var text = draw.text(_this.title).font({
                 family: 'Microsoft Yahei',
                 size: 14,
                 leading: '1'
             }).fill({
                 color: '#333'
             });

             var group = draw.group().move(43, 7);
             if (_this.tag == -1) group.dx(_this.style.width);
             group.add(text);
             _this.inneargroup.add(group);
             _this.style.height = 90;
             if (!!_this.remark) _this.drawRemake(draw, group, text.length(), -10);
            function mutilText(text){
                
            }
         },
         hover: function(draw) {
             var _this = this;
             $(document).on("mouseover", "#" + _this.inneargroup.id(), function() {
                 if (!_this.hovergroup) {
                     _this.drawDetail(draw, 0, 0);
                     _this.hovergroup && _this.hovergroup.show();
                 } else {

                     _this.hovergroup.show();
                 }

             }).on("mouseout", "#" + _this.inneargroup.id(), function() {
                 _this.hovergroup && _this.hovergroup.hide();
             });
         },
         drawDetail: function(draw, x, y) {
             //更多hover

             //_this.inneargroup ; 
             var _this = this;
             var group = draw.group().addClass("svghover").move(_this.group.x(), _this.group.y() + 50);
             var detail = _this.detail;
             if (!detail) return;
             var h = 0;
             var mw = 0,
                 tw = 0;
             var text = draw.text(function(add) {
                 for (var k in detail) {
                     tw = add.tspan(k + " :").newLine().length() +
                         add.tspan(detail[k]).dx(5).length() + 5;
                     h += 30;
                     if (tw > mw) mw = tw;
                 }
             }).font({
                 family: 'Microsoft Yahei',
                 size: 12,
                 leading: '2.5'
             }).fill("#fff").move(25, 25);
             // var w=text.length()+30; 
             // var w=mw+30;
             var w = mw + 50 > 150 ? mw + 50 : 150;
             group.add(draw.path("M" + (_this.style.width / 2 - 13) + "  0 L" + _this.style.width / 2 + "  " + (-13) + " L" + (_this.style.width / 2 + 13) + "  0 Z ").fill("#666"));
             var offset = (_this.style.width - w) / 2
             var rect = draw.rect(w, h + 55).radius(10).fill("#666");
             group.add(rect.dx(offset));
             group.add(text.dx(offset));
             group.hide();
             _this.hovergroup = group;
             _this.hover(_this.hovergroup);

         },
         drawWait: function(draw) {
             //请求等待
             var _this = this;
             if (!_this.wait) return;
             var group = draw.group();
             _this.tag !== -1 ? group.move(_this.style.width + 3, 70) : group.move(_this.style.width - 24, 70);

             var pattern = draw.pattern(3, 3, function(add) {
                 add.rect(1, 1).fill('rgba(0,0,0,.1)').move(2, 0);
                 add.rect(1, 1).fill('rgba(0,0,0,.1)').move(1, 1);
                 add.rect(1, 1).fill('rgba(0,0,0,.1)').move(0, 2);

             });
             var rect = draw.rect(22, 50).fill(pattern);
             var waiticongroup = draw.group().addClass("waiticon").move(24, 19);
             for (var i = 0; i < 8; i++) {
                 var icon = draw.rect(2, 7).radius(1).dx(10).dy(0).fill("#ccc");
                 icon.transform({ rotation: 45 * i, cx: 11, cy: 11 });
                 waiticongroup.add(icon);
             }
             var text = draw.text(_this.wait.title).font({
                 family: 'Microsoft Yahei',
                 size: 14,
                 leading: '1'
             }).fill({
                 color: '#333'
             }).move(50, 21);
             group.add(rect);
             group.add(waiticongroup);
             group.add(text);
             _this.drawPop(draw, group, 50 + text.length(), 10);
             _this.group.add(group);
         },
         drawPop: function(draw, g, x, y) {
             var _this = this;
             var group = draw.group().addClass('popwap').move(x, y);
             var text = draw.text(_this.wait.time).font({
                 family: 'Microsoft Yahei',
                 size: 12,
                 leading: '1'
             }).fill({
                 color: '#fff'
             }).dy(2).dx(12);
             var w = text.length();
             group.add(draw.path("M0 12 L9 4 L7 11z").fill("#add868"));
             group.add(draw.rect(w + 10, 16).dx(6).radius(5).fill("#add868"));
             group.add(text);
             g.add(group);
         },
         drawRemake: function(draw, g, x, y) {
             //耗费时间
             var _this = this;
             // _this.drawPop(draw,_this.nodegroup,x,y)
             var color = _this.getStateColor();
             var group = draw.group().addClass('popwap').move(x, y);
             var text = draw.text(_this.remark).font({
                 family: 'Microsoft Yahei',
                 size: 12,
                 leading: '1'
             }).fill({
                 color: '#fff'
             }).dy(2).dx(12);
             var w = text.length();
             group.add(draw.path("M0 12 L9 4 L7 11z").fill(color));
             group.add(draw.rect(w + 10, 16).dx(6).radius(5).fill(color));
             group.add(text);
             g.add(group);
         },
         drawLine: function(draw) {
             //线箭头
             var _this = this;
             var color = _this.getStateColor();
             var style = _this.style.linestyle;
             var line = draw.path("m" + 0 + " " + (30+style.width%2/2) + " L" + (_this.style.width) + " " + (30+style.width%2/2)).stroke({ "color": color, 'width': style.width });
             _this.mark = line.marker('end', 4, 8, function(add) {
                 add.path("M0 0 L0 8 L4 4 ");
                 this.fill(color);
             });
             if (this.type === "1") line.addClass("dashedline");
             _this.inneargroup.add(line);

         },
         getStateColor: function() {
             var color = "";
             switch (this.state) {
                 case '1':
                     color = "#ffc600";
                     break;
                 case '2':
                     color = "#ff5454";
                     break;
                 case '0':
                 default:
                     color = this.style.linestyle.color;
                     break;
             }
             return color;
         },
         getWidth: function() {
             return Math.abs(this.style.width);
         },
         setY: function(y) {
             var _this = this;
             _this.style.y = y;
         },
         getHeight: function() {
             return this.style.height;
         }

     };

     function isArray(o) {
         return Object.prototype.toString.call(o) === '[object Array]';
     }
     $.fn.extend({
         mysequence: function(opt) {
             return this.length !== 0 ? new sequence(this, opt) : undefined;
         }
     });

 })(window, jQuery, SVG);
