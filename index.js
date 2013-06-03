// [魔王勇者まとめ](http://maouyusya2828.web.fc2.com/) からテキストを抽出する
//  kazunori.kimura.js@gmail.com
var request = require("request"),
    cheerio = require("cheerio"),
    url = require("url"),
    fs = require("fs");

//base url
var baseUrl = "http://maouyusya2828.web.fc2.com/matome${num}.html";
//13
var page = 13;

//proxyサーバー設定を取得する
var r = request;
if (process.env["http_proxy"]){
    r = request.defaults({proxy: process.env["http_proxy"]});
}

for (var i=1; i<=page; i++){
    //連番
    var seq = ("00"+i).slice(-2);
    //url
    var path = baseUrl.replace(/\$\{num\}/, seq);
    console.log(path);
    
    //html取得
    r(path, function(err, res, body){
        if (!err && res.statusCode === 200){
            //html読み込み
            var $ = cheerio.load(body);
            //出力ファイル名
            var fileName = url.parse(res.req.path).path.replace(/\//, "").replace(/\.html$/, ".txt");
            
            var lines = [];
            $("div.mainRes p").each(function(index, element){
                lines.push($(this).text());
            }); //end each
            
            fs.writeFileSync(fileName,
                lines.join(String.fromCharCode(13)+String.fromCharCode(10)),
                {encoding:"utf8"});
            //完了
            console.log(fileName);
        }else{
            console.log(err);
        }
    }); //end request
}
