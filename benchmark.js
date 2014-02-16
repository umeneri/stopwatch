// ============================================================
// benchmark function
// ============================================================
/**
 * check processsing time of f()
 * usage: insert(x, e) => benchmark(x, insert, e)
 * @param name method name
 * @param f method
 */
function benchmark(name, f) {
  var args = Array.prototype.slice.call(arguments).slice(2);
  var s = Date.now();
  
  f.apply(null, args);          /* f(args) */
  
  var t = Date.now() - s;
  
  console.log(name, ': time = ' + t + 'msec');
}

/**
 * usage:
 * [1, 2, 3].concat([4, 5]) => benchmarkProto([1, 2, 3], Array.concat, [4, 5])
 * useless?
 */
function benchmarkProto(that, f) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  var s = Date.now();

  f.apply(that, args);
  
  var t = Date.now() - s;
  
  console.log(f, ': time = ' + t + 'msec');
}

function benchmarkSort(that) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  var s = Date.now();

  that.sort();
  
  var t = Date.now() - s;
  
  console.log(that, ': time = ' + t + 'msec');
}


/**
 * check n times avarage of processsing time of f()
 * @param name method name
 * @param times count times
 * @param f method
 */
function benchmarkAvg(name, times, f) {
  console.log(name + ':');
  
  var args = Array.prototype.slice.call(arguments).slice(3);
  var sum = 0;
  
  for(var i = 0; i < times; i++){
    var s = Date.now();
    f.apply(null, args);
    sum += (Date.now()) - s;
  }
  
  console.log('time = ', sum / times, 'msec');
}
/**
 * check n times avarage of processsing time of f()
 * @param name method name
 * @param times number of impliments for f
 * @param n array length
 * @param f method
 */
function benchmarkAvgArray(name, times, n, f) {
  console.log(name + ':');
  
  var args = Array.prototype.slice.call(arguments).slice(3);
  var sum = 0;

  for(var i = 0; i < times; i++){
    var x = genShuffledArray(n); //状況に応じて変更
    args.unshift(x);
    var s = Date.now();
    f.apply(null, args);
    sum += (Date.now()) - s;
    if (!isSorted(x)) console.log('not sorted!!!:', name, i);
  }
  
  console.log(times + 'timesAverage : time = ', sum / times, 'msec');
}

/**
 * n times checking for processing time of f()
 * @param name method name
 * @param n times
 * @param f method
 */
function benchmarkN(name, n, f) {
  console.log(name + ':');
  var args = Array.prototype.slice.call(arguments).slice(3);
  var s = Date.now();
  
  for(var i = 0; i < n; i++){
    f.apply(null, args);
  }

  var t = Date.now() - s;
  console.log('time = ' + t + 'msec');
  return t;
}

/**
 * avarage 10times: n times checking for processing time of f()
 * @param name method name
 * @param n times
 * @param f method
 */
function benchmarkNAvg(name, n, f) {
  console.log(name + ':');
  var args = Array.prototype.slice.call(arguments).slice(3);
  var sum = 0;
  var times = 10;
  
  for(var i = 0; i < times; i++){
    var s = Date.now();
    for(var j = 0; j < n; j++){
      f.apply(null, args);
    }
    sum += Date.now() - s;
  }
  var t = sum / times;
  console.log('time = ' + t + 'msec');
  return t;
}

// ============================================================
// utility function
// ============================================================
/**
 * generate random number n that min <= n <= max
 */
function rand(min, max){ return min + ~~(Math.random() * (max - min + 1));};

/**
 * shuffle array x
 */
function shuffle(x){
  for(var i = 0; i < x.length - 1; i++){
    var j =  rand(i + 1, x.length - 1);
    var temp = x[j];
    x[j] = x[i];
    x[i] = temp;
  }
  return x;
}

/**
 * generate initialized array
 */
function genArray(n) {
  var a = new Array(n);
  for(var i = 0; i < n; i++){
    a[i] = i;
  }
  return a;
}

/**
 * generate array initialized with random numberes
 */
function genRandomArray(n, min, max) {
  if (min == null) min = 0;
  if (max == null) max = n - 1;
  var a = new Array(n);
  for(var i = 0; i < n; i++){
    a[i] = rand(min, max);
  }
  return a;
}

/**
 * generate shuffled array 
 */
function genShuffledArray(n) {
  return shuffle(genArray(n));
}

function clone (a) {
  var b = new Array(a.length);
  for (var i=0, len=a.length; i<len; i++) {
    b[i] = a[i];
  }
  return b;
}

/**
 * 配列がちゃんと整列されているかを確かめる
 */
function isSorted(x) {
  for (var i=0, len=x.length; i<len - 1; i++) {
    if (x[i] > x[i+1]) return false;
  }
  return true;
}

// ============================================================
// test function
// ============================================================

/**
 * 配列xのi番目の要素とi+1番目の要素の間に配列yを挿入
 */
function insert(x, i, y) {
  if (i === null || typeof i === 'undefined') {
    return x;
  }
  
  if (i >= x.length || i < 0) {
    return x;
  }
  
  return x = x.slice(0, i + 1).concat(y).concat(x.slice(i + 1));
}

/**
 * 配列xのi番目以降を配列yの要素に変更
 */
function replace(x, i, y) {
  if (i === null || typeof i === 'undefined') {
    return x;
  }
  
  if (i >= x.length || i < 0) {
    return x;
  }
  
  if (y === null || typeof y === 'undefined' || !(y instanceof Array)) {
    return x;
  }
  
  return x  = x.slice(0, i).concat(y).concat(x.slice(i + y.length));
}

/**
 * 配列xのi番目からj番目までを反転させる
 */
function reverse(x, i, j) {
  if (i === null || typeof i === 'undefined') {
    return x.reverse();
  }
  
  if (i >= x.length || i < 0) {
    return x;
  }

  if (j === null || typeof j === 'undefined') {
    return reverse(x, i, x.length - 1);
  }
  
  if (j >= x.length) {
    j = x.length - 1;
  } else if (j < i) {
    j = i;
  }

  var a = x.slice(i, j + 1).reverse(); /* i~jまでの配列だけ反転 */
  return x = replace(x, i, a);         /* 置換 */
}

/* compact: */
function reverse(x, i, j) {
  var a = x.slice(i, j + 1).reverse();
  return x = x.slice(0, i).concat(a).concat(x.slice(j + 1));
}


/**
 * 配列xの要素eの中で、f(e)が真であるものが1つでもあれば真を変えす
 */
function any(x, f) {
  for (var i = 0, len = x.length; i < len; i++) {
    if (f(x[i])) return true;
  }

  return false;
}

/**
 * 配列xの要素e全てについてf(e)が真である時、真を返す
 */
function all(x, f) {
  for (var i = 0, len = x.length; i < len; i++) {
    if (!f(x[i])) return false;
  }

  return true;
}

/**
 * 配列xのすべての要素eについて，f(e)を適用した結果の配列を返す
 */
function collect(x, f) {
  var a = [];
  for (var i = 0, len = x.length; i < len; i++) {
    a.push(f(x[i]));
  }
  return a;
}

/**
 * 配列xを左にn個ずらす。(前n個の要素を後ろに置く)
 */
function rotate(x, n) {
  return x.slice(n - 1).concat(x.slice(0, n));
}

/**
 * 配列x,yの2つをまとめた配列を返す
 */
function zip(x, y){
  var l = x.length > y.length ? y.length : x.length;
  var a = new Array(l);
  for (var i = 0; i < l; i++) {
    a[i] = [x[i], y[i]];
  }
  return a;
};

/**
 * 配列xのn番目より前の部分配列を取得する
 */
function take(x, n){
  var a = [];
  for (var i = 0, l = n; i < l; i++) {
    a.push(x[i]);
  }
  return a;
};


/**
 * 配列xのn番目以降の部分配列を取得する
 */
function drop(x, n){
  var a = [];
  for (var i = n, l = x.length; i < l; i++) {
    a.push(x[i]);
  }
  return a;
};

/**
 * 配列xの重複を排除する
 */
function uniq(x){
  for (var i = 0; i < x.length; i++) {
    for (var j = x.length; j > i; j--) {
      if (x[i] === x[j]) x.splice(j, 1);
    }
  }
  return x;
};

/**
 * 重複した要素がなければば真を返す
 */
function isUniq(x) {
  for (var i = 0, l = x.length; i < l; i++) {
    for (var j = i + 1; j < l; j++) {
      if (x[i] === x[j]) return false;
    }
  }
  return true;
}

/**
 * 配列x中の要素eと同じもののインデックスを返す
 * ない場合は-1を返す
 */
function index(x, e){
  for (var i = 0, l = x.length; i < l; i++) {
    if (x[i] === e) {
      return i;
    }
  }
  return -1;
};

/**
 * 配列x中の，条件式関数fによってf(e)が真となる要素eからなる配列を返す
 */
function select(x, f){
  var a = [];
  for (var i = 0, l = x.length; i < l; i++) {
    if (f(x[i])) {
      a.push(x[i]); 
    }
  }
  return a;
};


/**
 * 配列x中の，条件式関数fによってf(e)が偽となる要素eからなる配列を返す
 */
function reject(x, f){
  var a = [];
  for (var i = 0, l = x.length; i < l; i++) {
    if (!f(x[i])) {
      a.push(x[i]); 
    }
  }
  return a;
};

/* 早い? => 遅かった*/
function concat(x, y) {
  var xl = x.length;
  var yl = y.length;
  var a = new Array(xl + yl);
  for (var i = 0; i < xl; i++) {
    a[i] = x[i]; 
  }
  for (var i = 0; i < yl; i++) {
    a[i + xl] = y[i];
  }
  return a;
}

function concat2(x, y) {
  for (var i = 0, l = y.length; i < l; i++) {
    x.push(y[i]);
  }
  return x;
}

function floatToInt1(x) {
    var a = Math.floor(x);
}

function floatToInt2(x) {
    var a = ~~x;
}

function floatToInt3(x) {
    var a = x | 0;
}

//文字列→整数変換
var fs = [];
fs.push(function(str){ return parseInt(str); });
fs.push(function(str){ return parseInt(str, 10); });
fs.push(function(str){ return str&-1; });
fs.push(function(str){ return -1&str; });
fs.push(function(str){ return str|0; });
fs.push(function(str){ return 0|str; });
fs.push(function(str){ return str^0; });
fs.push(function(str){ return 0^str; });
fs.push(function(str){ return str>>0; });
fs.push(function(str){ return str<<0; });
fs.push(function(str){ return ~~str; });


//数値→整数
var fi = [];
fi.push(function(num){ return Math.floor(n); });
fi.push(function(num){ return n&-1; });
fi.push(function(num){ return -1&n; });
fi.push(function(num){ return n|0; });
fi.push(function(num){ return 0|n; });
fi.push(function(num){ return n^0; });
fi.push(function(num){ return 0^n; });
fi.push(function(num){ return n>>0; });
fi.push(function(num){ return n<<0; });
fi.push(function(num){ return ~~n; });

var fns = [];
fns.push(function(num){ return String(num); });
fns.push(function(num){ return (num).toString(10); });
fns.push(function(num){ return  (num).toPrecision(); });
fns.push(function(num){ return  (num).toFixed(); });
fns.push(function(num){ return  '' + num; });
fns.push(function(num){ return  num + ''; });

var ffi = [];
ffi.push(function(num){ return Math.round(1.5); });
ffi.push(function(num){ return Math.round(1.4); });
ffi.push(function(num){ return (1.5).toPrecision(1); });
ffi.push(function(num){ return (1.4).toPrecision(1); });
ffi.push(function(num){ return (1.5).toFixed(); });
ffi.push(function(num){ return (1.4).toFixed(); });
ffi.push(function(num){ return (1.5 + 0.5)|0; });
ffi.push(function(num){ return (1.4 + 0.5)|0; });

var fdiv = [];
fdiv.push(function(a){ return a / 256; });
fdiv.push(function(a){ return a >> 8; });

function qsortTest (a) {
  ArraySort(a);
}

// ============================================================
// testing
// ============================================================

/* for (var i = 0; i < fns.length; i++) { */
/*     var t = benchmarkN(n, fns[i], num); */
/*     /\* console.log(fs[i].toString() + '\t\t// time = ' + t + 'msec.'); *\/ */
/*     st += t + ','; */
/* } */

/* for (var i = 0; i < fdiv.length; i++) { */
/*     var t = benchmarkN(n, fdiv[i], num); */
/*     st += t + ','; */
/* } */
/* console.log(st); */


/* test */
var n = 100;
var times = 10;
/* var date = new Date().getTime(); */
var s = '1234567';
var st = 'abcdefg';
var num = 1234567;
var x = genRandomArray(n, 0, 12);
var y = genShuffledArray(n);
console.log('x', x);
console.log('y', y);
/* benchmark('margeSort:4', margeSort4, x); */
/* benchmarkAvgArray('margeSort:4', times, n, margeSort4); */
/* benchmarkAvgArray('qSort', times, n, qsortNotRec); */
/* benchmarkAvgArray('margeSort:2', times, n, margeSort2); */
/* benchmarkAvgArray('margeSort:1', times, n, margeSort); */


var times = 100000;
benchmarkNAvg('new Array()', times, function() {
  var a = new Array();
});

benchmarkNAvg('new Array(10)', times, function() {
  var a = new Array(10);
});

benchmarkNAvg('new Array(100000)', times, function() {
  var a = new Array(100000);
});

benchmarkNAvg('[]', times, function() {
  var a = [];
});

times = 100;
n = 100000;
benchmarkNAvg('new Array() & initalize', times, function() {
  var a = new Array();
  for (var i = 0, len = n; i < len; i++) {
    a[i] = i;
  }
});
benchmarkNAvg('new Array(n) & initalize', times, function() {
  var a = new Array(n);
  for (var i = 0, len = n; i < len; i++) {
    a[i] = i;
  }
});
benchmarkNAvg('[] & initalize', times, function() {
  var a = [];
  for (var i = 0, len = n; i < len; i++) {
    a[i] = i;
  }
});
