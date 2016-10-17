var restify = require('restify');
var builder = require('botbuilder');
var forecast = require("weather-yahoo-jp").forecast;


//=========================================================
// ボットの準備
//=========================================================

// Restifyサーバの設定
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// ボットの接続先設定
var connector = new builder.ChatConnector({
  // MicrosoftBotFrameworkで取得した、IDとパスワードを入力します
  appId: '******************************',
  appPassword: '******************************'
});

// ボットの仕組みを提供してくれるUniversalBotオブジェクトを作成
var bot = new builder.UniversalBot(connector, {
  // エラーメッセージの初期設定を変更
  dialogErrorMessage: "すみません。予報を所得できない場所か、学習不足で認識できません。(T_T)"
});

// ***/api/messagesをエンドポイントとして、ボットをサーバで提供する
server.post('/api/messages', connector.listen());



//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================

// 認識に指定するLUIS APIのアドレスを指定
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=1c84a65b-3072-43b2-941f-8f7bb2c52cb5&subscription-key=7f74b882ccc8402aa7c770179f68ed02');

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
  recognizers: [recognizer]
});


//=========================================================
// 会話の処理
//=========================================================

// 初期ダイアログを、intentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents
  .matches('AskWeather', function (session, args) {

    //=======================================================
    // インテントが「AskWeather」と認識された時の処理
    //=======================================================

    console.log(args); // argesの中には、LUISの認識結果が入っている。

    //　例: 「明日の東京は？」

    //  { score: 1,
    //  intent: 'AskWeather',
    //  intents:
    //   [ { intent: 'AskWeather', score: 1, actions: [Object] },
    //     { intent: 'None', score: 0.0144235147 } ],
    //  entities:
    //   [ { entity: '東京',
    //       type: '場所',
    //       startIndex: 3,
    //       endIndex: 4,
    //       score: 0.9854452 },
    //     { entity: '明日',
    //       type: '日にち',
    //       startIndex: 0,
    //       endIndex: 1,
    //       score: 0.963219762 } ] }


    // EntityRecognizerを使用して、エンティティの内容を抽出する。
    var area = builder.EntityRecognizer.findEntity(args.entities, '場所');
    var day = builder.EntityRecognizer.findEntity(args.entities, '日にち');

    if (area) {

      // --------------------------------------------------------
      // LUISが「場所」エンティティを認識できた場合の処理
      // --------------------------------------------------------

      // 「場所」エンティティから、余計な空白を取り除く
      forecastArea = area.entity.replace(/\s+/g, "");

      // 抽出した「場所」エンティティで、Yahoo!天気から天気情報をスクレイピングする
      forecast.get(forecastArea)
        .then(function (forecast) {

          var forecastResult = "", resultText = "";

          if (day) {

            // ▼ 「日にち」エンティティが認識できた場合の処理

            // 「日にち」エンティティの内容が、「明日」なら明日の天気情報を。
            // それ以外なら、今日の天気情報を用意する。
            forecastResult = (day.entity == "明日") ? forecast.tomorrow.text : forecast.today.text; // ※三項演算子を使用
            resultText += day.entity + "の ";

          } else {

            // ▼ 「日にち」エンティティがなかった場合の処理

            forecastResult = forecast.today.text;
            resultText += "今日の ";

          }

          // 結果テキストを作成
          resultText += forecast.where + "の天気は、" + forecastResult + "です！";

          // 結果テキストを発言 + 会話の終了
          session.endDialog(resultText);

        })
        .catch(function (err) {
          console.error(err.stack || err);
        });

    } else {

      // --------------------------------------------------------
      // LUISが「場所」エンティティを認識できなかったときの処理
      // --------------------------------------------------------

      session.endDialog("ごめんなさい。学習不足で、場所がまだ認識できません。(T_T)");

    }

  })
  .onDefault(function(){

    // =======================================================
    // 当てはまるインテントがなかったのとき(None) の処理
    // =======================================================

    session.endDialog("ごめんなさい。学習不足で意図が理解できませんでした。orz");

    });


// サーバで静的ファイルを提供する
server.get(/.*/, restify.serveStatic({
  'directory': './static/',
  'default': 'index.html'
}));
