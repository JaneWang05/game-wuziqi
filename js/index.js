$(function(){
	var canvas=$('#canvas').get(0);
	var ctx=canvas.getContext('2d');
	var ROW=15;//15X15
	var width=canvas.width;
	var off=width/ROW;
    var flag=true;//间距
    var qizi={};//{'3_3':'color'}
    var ai=false;
    var blank={};
    var renji=$('.duizhan');
	var audio1=$('audio').get(0);
	var audio2=$('audio').get(1);
	$('audio1').on('ended',function(){
		audio1.play();
	})	
	//空白
    for (var i = 0; i <ROW ; i++) {
    	for(var j = 0;j < ROW ;j++){
    		blank[jilu(i,j)]=true;
    	}
    };
	function lamda(pos){
       return pos.x+'_'+pos.y;
	}
	function jilu(x,y){
       return x+'_'+y;
	}
	//把x_y 分成[x,y] x,y为字符串  转化为数值
	function change(key){
		var arr=key.split('_');
		return {x:parseInt(arr[0]),y:parseInt(arr[1])}
	}
	//定位点
	function circle(x,y){
		ctx.beginPath();
		ctx.arc(x*off+0.5,y*off+0.5,4,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
	};
	//棋盘
	function draw(){
		for (var i = 0; i < ROW; i++) {
			ctx.beginPath();
			ctx.moveTo(off/2+0.5,off/2+0.5+i*off);
			ctx.lineTo((ROW-0.5)*off+0.5,off/2+0.5+i*off);
			ctx.lineWidth=2;
			ctx.strokeStyle="#8f6125";
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(off/2+0.5+i*off,off/2+0.5);
			ctx.lineTo(off/2+0.5+i*off,(ROW-0.5)*off+0.5);
			ctx.lineWidth=2;
			ctx.strokeStyle="#8f6125";
			ctx.stroke();
			ctx.closePath();
		};
		circle(3.5,3.5);
		circle(11.5,3.5);
		circle(7.5,7.5);
		circle(3.5,11.5);
		circle(11.5,11.5);
	};

	//棋子
	function drawChess(pos,color){
		ctx.save();
		ctx.beginPath();
		var a=pos.x*off+0.5;
		var b=pos.y*off+0.5;
		ctx.translate(a,b);
        ctx.beginPath();
		if (color==='black') {
			var img = new Image();
			img.onload = function(){
				  ctx.drawImage(img,a,b)
				}
			img.src = 'img/hq.png';
		}
		if (color==='white') {
			var img1 = new Image();
			img1.onload = function(){
				  ctx.drawImage(img1,a,b)
				}
			img1.src = 'img/bq.png';
		}
		ctx.closePath();
		ctx.restore();
		qizi[lamda(pos)]=color;
		delete blank[lamda(pos)];
		
	}
	//判断输赢
	function check(pos,color){
    	var table={};
		var rownum=1;
		var colnum=1;
		var leftnum=1;
		var rightnum=1;
		for (var i in qizi) {
			if (qizi[i]===color) {
				table[i]=true;	
			};
		};
		///横////
		var tx=pos.x;var ty=pos.y;
		while(table[jilu(tx+1,ty)]) {tx++;rownum++;};
		tx=pos.x;ty=pos.y
		while(table[jilu(tx-1,ty)]) {tx--;rownum++;};
		///竖//
		tx=pos.x;ty=pos.y;
		while(table[jilu(tx,ty-1)]) {ty--;colnum++;};
		tx=pos.x;ty=pos.y
		while(table[jilu(tx,ty+1)]) {ty++;colnum++;};
		///右斜///
		tx=pos.x;ty=pos.y;
		while(table[jilu(tx+1,ty-1)]) {tx++;ty--;rightnum++;};
		tx=pos.x;ty=pos.y
		while(table[jilu(tx-1,ty+1)]) {tx--;ty++;rightnum++;};
		///左斜///
		tx=pos.x;ty=pos.y;
		while(table[jilu(tx-1,ty-1)]) {tx--;ty--;leftnum++;};
		tx=pos.x;ty=pos.y
		while(table[jilu(tx+1,ty+1)]) {tx++;ty++;leftnum++;};
       // return rownum>=5||colnum>=5||rightnum>=5||leftnum>=5;
        return Math.max(rownum, colnum, rightnum, leftnum)
	}
	//为棋谱绘制文字
	function drawText(pos,text,color){
		ctx.save();
		ctx.font = "15px 微软雅黑";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		if (color==='black') {
			console.log(text,color,pos)
			ctx.fillStyle='#fff';
		}else if(color==='white'){
			ctx.fillStyle='#000';
		}
		ctx.fillText(text, (pos.x+0.5)*off, (pos.y+0.5)*off);
		ctx.restore();
	}
	//绘制棋谱
	function review(){
		var i=1;
		for (var pos in qizi) {
			drawText(change(pos),i,qizi[pos]);
			i++;
		};
		console.log(qizi)
	}
	
	// 重新
	function restart(){
		ctx.clearRect(0,0,width,width);
		flag=true;
		moshi=false;
		qizi={};
		$(canvas).off('click').on('click',handlClick);
		draw();
   		hei.removeClass('addhei').addClass('addhei');
   		bai.removeClass('addbai').addClass('addbai');
   		clearInterval(t);
		s=0;
		b(ctx1,s);
		clearInterval(c);
		m=0;
		b(ctx2,m);
	}
    
    // 人机模式
    function AI() {
        //		遍历空白位置
        var max1 = -Infinity;
        var max2 = -Infinity;
        var pos1;
        var pos2;
        // var pos1;var pos2;
        for (var i in blank) {
            var score1 = check(change(i), 'black');
            if (score1 > max1) {
                max1 = score1;
                pos1 = change(i);
            }
        }
        for (var i in blank) {
            var score2 = check(change(i), 'white');
            if (score2 > max2) {
                max2 = score2;
                pos2 = change(i);
            }
        }
        if (max2 > max1) {
            return pos2;
        } else {
            return pos1;
        }
    }
    var moshi=false;
	function handlClick(e){
		moshi=true;
		audio2.play();
		var e=e||window.event;
    	var pos={x:Math.round((e.offsetX-20)/40),y:Math.round((e.offsetY-20)/40)};
    	// console.log(pos);
    	if(qizi[lamda(pos)]){
    		return;
    	}


    	if (ai) {
            drawChess(pos, 'black');
            if (check(pos, 'black') >= 5) {
                $(canvas).off('click');
                moshi=false;
				tishi.addClass('tishishow');
				tsinfo.text('黑棋赢!');	
				yes.on('click',function(){
					review();
					tishi.removeClass('tishishow');
				});
                return;
            }
            drawChess(AI(), 'white')
            if (check(AI(), 'white') >= 6) {
                $(canvas).off('click');
                moshi=false;
				tishi.addClass('tishishow');
				tsinfo.text('白棋赢!');	
				yes.on('click',function(){
					review();
					tishi.removeClass('tishishow');
				});
                return;
            }
            return
        }


    	if (flag) {
			c=setInterval(zhuan1,1000);
     		clearInterval(t);
            s=0;
     		b(ctx1,s);
			drawChess(pos,'black');
			if (check(pos,'black') >= 5) {
				$(canvas).off('click');
				moshi=false;
				tishi.addClass('tishishow');
				tsinfo.text('黑棋赢!');	
				yes.on('click',function(){
					review();
					tishi.removeClass('tishishow');
				});
			};
    	}else{
			t=setInterval(zhuan,1000);
     		clearInterval(c);
			m=0;
      		b(ctx2,m);	
    		drawChess(pos,'white');
    		if (check(pos,'white') >= 5) {
				$(canvas).off('click');
				moshi=false;
				tishi.addClass('tishishow');
				tsinfo.text('白棋赢!');	
				yes.on('click',function(){
					review();
					tishi.removeClass('tishishow');
				});
			};
    	}
    	flag=!flag;
	}
    //落子
    $(canvas).on('click',false);
    $('.restart').on('click',false);
    $('.restart').on('click',restart);
    var dzflag=true;
    renji.on('click',function(){
    	if (moshi) {
    		tishi.addClass('tishishow');
    		tsinfo.css("font-size","18px");
    		tsinfo.text('更换模式请重新开始或退出游戏');
    		
    		return;
    	};
    	if (dzflag) {
    		$(this).text("人机对战");
    		dzflag=false;
    	}else{
    		$(this).text("人人对战");
    		dzflag=true;
    	}
    	ai=!ai;
    	
    })


    //时钟指针
    var canvas1=document.getElementById('canvas1');
	var ctx1=canvas1.getContext('2d');
	var canvas2=document.getElementById('canvas2');
	var ctx2=canvas2.getContext('2d');
	function b(ctx1,a){
		ctx1.clearRect(0,0,100,100);
		ctx1.save();
		ctx1.translate(50,50);
		ctx1.rotate(2*Math.PI*a/60);
		ctx1.beginPath();
		ctx1.moveTo(2,0);
		ctx1.arc(0,0,2,0,Math.PI*2);
		ctx1.fillStyle="red";
		ctx1.fill();
		ctx1.lineWidth=2;
		ctx1.closePath();
		ctx1.beginPath();
		ctx1.moveTo(0,8);
		ctx1.lineTo(0,2);
		ctx1.moveTo(0,-2);
		ctx1.lineTo(0,-23);
		ctx1.strokeStyle="red";
		ctx1.stroke();
		ctx1.closePath();
		ctx1.restore();
		}
      b(ctx1,s);
      b(ctx2,m);
	
	var s=0;
	function zhuan(){
		ctx1.clearRect(0,0,100,100);
		s++;
		b(ctx1,s);
		if (s>=60) {
			clearInterval(t);
			s=0;
			b(ctx1,s);
			tishi.addClass('tishishow');
    		tsinfo.text('太慢了，认输吧！');
		};
	}

    var m=0;
    var t,c;
	function zhuan1(){
		ctx2.clearRect(0,0,100,100);
		m++;
		b(ctx2,m);
		if (m>=60) {
			clearInterval(c);
			m=0;
			b(ctx2,m);
			tishi.addClass('tishishow');
    		tsinfo.text('太慢了，认输吧！');
		};
	}


    //动画
    var jinru=$('.page1 .p');
    var leftd=$('.page1 .doorleft');
    var rightd=$('.page1 .doorright');
    var page2=$('.page2');
    var botton=$('.anniubox .button');
    jinru.on('click',function(){
    	leftd.removeClass('lmovehl').addClass('lmove');
    	rightd.removeClass('rmovehl').addClass('rmove');
    	$(this).addClass('imgp');
    	page2.delay(1000).queue(function(){
    		$(this).css({'z-index':20}).dequeue();
    	})

    })
    botton.on('mousedown',false);
    botton.on('mousedown',function(){
    	$(this).addClass('active');
    });
    botton.on('mouseup',function(){
    	$(this).removeClass('active');
    })


    // page2 按钮 点击事件
    var start=$('.anniubox .start');
	var renren=$('.anniubox .renren');
	var jieshao=$('.anniubox .jieshao');
	var bjmusic=$('.anniubox .bjmusic');
	var gameover=$('.anniubox .gameover');
	var hei=$('.page2 .hei');
	var bai=$('.page2 .bai');
	var tishi=$('.page2 .tishi');
	var tsinfo=$('.page2 .tishi span');
	var yes=$('.tishi .select .yes');
	var no=$('.tishi .select .no');
	var jieshaoinfo=$('.jieshaoinfo');
	var jsspan=$('.jieshaoinfo span');
	var kaishi=false;
	start.on('click',function(){
		if (kaishi) {
			tishi.addClass('tishishow');
			tsinfo.text('请重新开始吧')
			return;
		};
		kaishi=true;
    	$(canvas).on('click',handlClick);
		ctx.clearRect(0,0,width,width);
		draw();
   		hei.addClass('addhei');
   		bai.addClass('addbai');
	})
   	jieshao.on('click',function(){
   		jieshaoinfo.toggleClass('jsshow');
   	})
   	jsspan.on('click',function(){
		jieshaoinfo.removeClass('jsshow');
   	})
   	bjmusic.on('click',function(){
   		if (audio1.paused) {
    		$(this).text("关闭音乐");
    		audio1.play();
    	}else{
    		$(this).text("背景音乐");
    		audio1.pause();
    	}
   	})
   	gameover.on('click',function(){
   		ctx.clearRect(0,0,width,width);
		flag=true;
		dzflag=true;
		kaishi=false;
		qizi={};
		$(canvas).off('click');
		hei.removeClass('addhei');
   		bai.removeClass('addbai');
   		clearInterval(t);
		s=0;
		b(ctx1,s);
		clearInterval(c);
		m=0;
		b(ctx2,m);

   		leftd.removeClass('lmove').addClass('lmovehl');
    	rightd.removeClass('rmove').addClass('rmovehl');
    	jinru.removeClass('imgp');
    	// item.removeClass('imgs');
    	page2.css({'z-index':0})
   	})
   	no.on('click',function(){
   		restart();
		tishi.removeClass('tishishow');
   	});
})