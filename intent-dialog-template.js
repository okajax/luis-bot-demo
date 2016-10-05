var restify = require('restify');
var builder = require('botbuilder');

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
  // MicrosoftBotFramework公式サイトで取得した、IDとパスワードを入力します
  appId: '******************************',
  appPassword: '******************************'
});

// ボットの仕組みを提供してくれるUniversalBotオブジェクトを作成
var bot = new builder.UniversalBot(connector);

// ***/api/messagesをエンドポイントとして、ボットをサーバで提供する
server.post('/api/messages', connector.listen());



//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================

// 認識に指定するLUIS APIのURLを指定
var recognizer = new builder.LuisRecognizer('**********************************');

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
    .matches('intentA', function (session, args) {

        // インテントが 'intentA' だったときの処理をここに記述します。

    })
    .matches('intentB', function (session, args) {

        // インテントが 'intentB' だったときの処理をここに記述します。

    })

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // ※ インテントの数だけ .matches('*****', ... ) を繰り返します。
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    .onDefault(

        // 当てはまるインテントがなかったのとき(None) の処理をここに記述します。

    );
