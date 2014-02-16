function dateTime(time) {
  var date = new Date();
  var year = date.getYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (year < 2000) { year += 1900; }
  if (month < 10) { month = "0" + month; }
  if (day < 10) { day = "0" + day; }
  if (hour < 10) { hour = "0" + hour; }
  if (min < 10) { min = "0" + min; }
  if (sec < 10) { sec = "0" + sec; }
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var msec = date.getMilliseconds();
  return year + "/" + month + "/" + day + "/"
              + hour + ":" + min + ":" + sec + "." + msec;
}

function rand(n) {
  return Math.random() * n | 0;
}

function clone (a) {
  var b = new Array(a.length);
  for (var i=0, len=a.length; i<len; i++) {
    b[i] = a[i];
  }
  return b;
}

function Gradient(elem) {
  // color gradients
  var gradients = [[255,0,0], //red
                   [208, 32, 144], //violetRed
                   [255, 165, 0], //orange
                   [0, 255, 255], //yellow
                   [50, 205, 50], //LimeGreen
                   [0, 255, 0], //green 
                   [32, 178, 170], //LightSeeGreen
                   [0, 0, 255], //blue 
                   [0, 0, 128], //navy 
                   [160, 32, 240] // purple
                  ];
  var interval = 30;
  
  /**
   * extract rgb integer from css string (rgb(r,b,g))
   */
  this.extractRgb = function (colorStr) {
    var rgbStr = colorStr.match(/\d+/g);
    var rgbInt = [];
    rgbStr.forEach(function(str) {
      rgbInt.push(parseInt(str));
    });
    return rgbInt; //no validation checking
  };
  
  /**
   * change this.color to this.nextColor gradualy.
   */
  this.gradient  = function () {
    this.colors[0] += this.vr;
    this.colors[1] += this.vg;
    this.colors[2] += this.vb;
    this.elem.css("color", "rgb("
                  + (this.colors[0] & -1) + ","
                  + (this.colors[1] & -1) + ","
                  + (this.colors[2] & -1) + ")");
    if (++this.tick >= interval) {
      // initalize
      this.tick = 0;
      this.n = this.n == gradients.length - 1 ? 0 : this.n + 1;
      /* this.nextColors = gradients[rand(gradients.length)]; */
      this.nextColors = gradients[this.n];
      this.vr = (this.nextColors[0] - this.colors[0]) / interval;
      this.vg = (this.nextColors[1] - this.colors[1]) / interval;
      this.vb = (this.nextColors[2] - this.colors[2]) / interval;
    }
  };

  // initialize
  this.elem = elem; //element which change color
  this.tick = 0;
  this.n = 0;
  this.colors = this.extractRgb(this.elem.css("color"));
  this.nextColors = gradients[this.n];
  this.vr = (this.nextColors[0] - this.colors[0]) / interval;
  this.vg = (this.nextColors[1] - this.colors[1]) / interval;
  this.vb = (this.nextColors[2] - this.colors[2]) / interval;
  
  return this;
}


$(document).ready(function() {
  dateTime();
  var isStopping = true; //停止中か
  /* var isDown = false; //時間を減らすか */
  
  var startTimeStamp = 0, stopTimeStamp = 0;
  var elapsedTime = 0; //経過時間
  var date = new Date();

  var MAX_STAMP_NUM = 10; //最大の指定時刻数
  var stamps = new Array(MAX_STAMP_NUM);  //指定時刻を保持する配列
  var stampFlgs = new Array(MAX_STAMP_NUM);  //スタンプが発動したかを記録する配列
  
  /* var stamps = $('.stamp'); //アラーム時刻 */
  var progressButton = $('#progressButton');
  var resetButton = $('#resetButton');
  var createButton = $('#createButton');
  /* var reverseButton = $('#reverseButton'); */
  var timeText = $('#timeText');
  var dateText = $('#dateText');
  var dateColor = new Gradient(dateText);
  var stamp = 30;

  //design init
  var icons = {progress: "▶", stop: "||", reset:"Reset", down: "Down", up: "Up"};
  progressButton.val(icons.stop);
  resetButton.val(icons.reset);
  /* reverseButton.val(icons.down); */

  //logic init
  progressButton.click(progress);
  resetButton.click(reset);
  createButton.click(createStamp);
  dateText.click(progress);
  /* reverseButton.click(reverse); */

  /**
   * 初期化する
   */
  function initalize() {
    elapsedTime = 0;
    startTimeStamp = Date.now();
    stopTimeStamp = Date.now();
    timeText.val(elapsedTime);
    dateText.val(elapsedTime);
    
    for(var i = 0, elems = $('.stamp'); i < elems.length; i++) {
      stamps[i] = parseInt(elems[i].innerHTML);
      stampFlgs[i] = false;
    }
    /* console.log(stamps); */
  }


  /**
   * 時計を進める/留めるボタンの動作
   */
  function progress(e) {
    if (isStopping) {
      //再開時
      //止まっていた時間分開始時刻をすすめる
      startTimeStamp += Date.now() - stopTimeStamp;
    } else {
      //停止時
      stopTimeStamp = Date.now();
    }
    
    isStopping = !isStopping;
    
    //スタンプの取得
    stamp = getStampTime();

    //design ボタンアイコンの変更
    if(isStopping) progressButton.val(icons.stop);
    else progressButton.val(icons.progress);

    //ボタンhoverの変更
    progressButton.toggleClass('glow');
    progressButton.toggleClass('pulse');
  }

  /**
   * 時計の時間をリセット
   */
  function reset(e) {
    initalize();
  }

  /* /\** */
  /*  * 時間の進み方を正方向/負方向へ切り替え */
  /*  *\/ */
  /* function reverse() { */
  /*     //ボタンアイコンの変更 */
  /*     if(isDown) reverseButton.val(icons.down); */
  /*     else reverseButton.val(icons.up); */
  
  /*     isDown = !isDown; */
  /* } */

  /**
   * ミリセカンドの整数を「時''分'秒.ミリ秒」形式に変換
   */
  function convertToHMS(elapsedTime) {
    var temp = elapsedTime / 1000;
    var hour = temp / 3600 | 0;
    var min = (temp % 3600) / 60 | 0;
    var sec = (temp % 3600) % 60 | 0;
    var msec = ((elapsedTime % 3600000) % 60000) % 1000 | 0;
    return hour + "''" + min + "'" + sec + "." + msec;
  }

  /**
   * ミリセカンドの整数を「時''分'秒.ミリ秒」形式に変換 (Dateオブジェクト使用)
   */
  function convertToDateHMS(elapsedTime) {
    date.setTime(elapsedTime);
    var hour = date.getUTCHours();
    var min = date.getUTCMinutes();
    var sec = date.getUTCSeconds();
    var msec = date.getUTCMilliseconds();
    return hour + "''" + min + "'" + sec + "." + msec;
  }

  /**
   * 指定時刻を検出する
   */
  function getStampTime() {
    for (var i = 0; i < stamps.length; i++) {
      if (stamps[i] > 0) {
        return stamps[i];
      }
    }
    return 30; //defaults
  }

  /**
   * タイムスタンプを新規作成
   * jQueryで要素を作成するときのパフォーマンス - メモログ
   * http://memolog.org/2013/01/jquery_peformance_about_creating_element.html
   */
  function createStamp() {
    var elems = $('.stamp');
    if (elems.length < MAX_STAMP_NUM) {
      var num = 5000;
      $('<td class="stamp button border-fade">' + num + '</td>').appendTo('table tr');
      for(var i = 0; i < elems.length; i++) {
        stamps[i] = parseInt(elems[i].innerHTML);
        stampFlgs[i] = false;
      }
    } else {
      alert("これ以上タイムスタンプを追加することは出来ません!");
    }
  }

  /**
   * 逐次実行処理
   */
  function enterframe() {
    if (isStopping) {
      timeText.val(elapsedTime);
    } else {
      elapsedTime = Date.now() - startTimeStamp;

      for (var i = 0; i < stamps.length; i++) {
        if (!stampFlgs[i] && elapsedTime > stamps[i]) {
          //タイムスタンプ発動
          stampFlgs[i] = true;
          alert(convertToDateHMS(stamps[i]) + "が経過しました!");
        }
      }

      //design
      timeText.val(elapsedTime);
      dateText.html(convertToDateHMS(elapsedTime));
      dateColor.gradient();
    }

    // debug
    $("#isStopping").val(isStopping);
  }

  initalize();
  
  setInterval(enterframe, 1000 / 30);

  /* console.log(Array.prototype.sort); */

});
