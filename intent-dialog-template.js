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
    .matches('intentC', function (session, args) {

        // インテントが 'intentC' だったときの処理をここに記述します。


        // ▼ 応用 ▼

        // argsの中には、LUISの認識結果が入っています。
        console.log(args);

            //  例えば、天気予報Botを想定したLUISの場合 : 「明日の東京の天気は？」を解析すると..

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

            // 上記のような結果が得られます。


        // EntityRecognizerを使うと、指定したエンティティの内容を抽出できます。
        var area = builder.EntityRecognizer.findEntity(args.entities, '場所');

        // 「場所」エンティティが認識できた場合の処理
        if (area) {
            session.send("あなたが天気を知りたい場所は、" + area + "ですね！"); // この場合、「東京」が出力されます。
        }

    })

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // ※ インテントの数だけ .matches('*****', ... ) を繰り返します。
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    .onDefault(function(session){

        // 当てはまるインテントがなかったのとき(None) の処理をここに記述します。

    });
