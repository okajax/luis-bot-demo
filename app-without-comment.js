var restify = require('restify');
var builder = require('botbuilder');
var forecast = require("weather-yahoo-jp").forecast;

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: '******************************',
    appPassword: '******************************'
});

var bot = new builder.UniversalBot(connector, {
    dialogErrorMessage: "すみません。予報を所得できない場所か、学習不足で認識できません。(T_T)"
});

server.post('/api/messages', connector.listen());



var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=1c84a65b-3072-43b2-941f-8f7bb2c52cb5&subscription-key=7f74b882ccc8402aa7c770179f68ed02');

var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});


bot.dialog('/', intents);

intents
    .matches('AskWeather', function (session, args) {

        var area = builder.EntityRecognizer.findEntity(args.entities, '場所');
        var day = builder.EntityRecognizer.findEntity(args.entities, '日にち');

        if (area) {

            forecastArea = area.entity.replace(/\s+/g, "");

            forecast.get(forecastArea)
                .then(function (forecast) {

                    var forecastResult = "",
                        resultText = "";

                    if (day) {

                        forecastResult = (day.entity == "明日") ? forecast.tomorrow.text : forecast.today.text; // ※三項演算子を使用
                        resultText += day.entity + "の ";

                    } else {

                        forecastResult = forecast.today.text;
                        resultText += "今日の ";

                    }
                    resultText += forecast.where + "の天気は、" + forecastResult + "です！";

                    session.endDialog(resultText);

                })
                .catch(function (err) {
                    console.error(err.stack || err);
                });

        } else {

            session.endDialog("ごめんなさい。学習不足で、場所がまだ認識できません。(T_T)");

        }

    })
    .onDefault(

        builder.DialogAction.send("ごめんなさい。学習不足でまったく理解できませんでした。orz")

    );

server.get(/.*/, restify.serveStatic({
    'directory': './static/',
    'default': 'index.html'
}));
