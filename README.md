# LUIS bot demo

[デモサイト](https://github.com/okajax/luis-bot-demo)

LUISと連携したBotのサンプルです。天気を教えてくれます。

LUIS(自然言語理解AI)と連携しているので、学習して賢くなっていきます。ただ、インテントは「天気を尋ねる」ための物しか用意していないため、このBotは天気を答える事しかできません...！


## つかいかた

* 「大阪の天気は？」
* 「明日の東京はどう？」
* 「今日の名古屋！」

のように、話しかけてあげてください。

指定した場所の、今日または明日の天気を教えてくれます。 (Yahoo!天気のスクレイピングのため、限界はあります...！)


## 各ファイルについて

### [app.js](https://github.com/okajax/luis-bot-demo/blob/master/app.js)
　こちらが天気予報Botの本体です。


### [app-without-comment.js](https://github.com/okajax/luis-bot-demo/blob/master/app-without-comment.js)
　コメントによる解説がないバージョンです。ソースだけでサクっと読みたい方、コピペして使いたい方向けです。


### [intent-dialog-template.js](https://github.com/okajax/luis-bot-demo/blob/master/intent-dialog-template.js)
　IntentDialogのひな形+解説です。コピペしてお使いください。


## Powered by
* Microsoft Bot Framework V3
* LUIS (Microsoft Cognitive Services)
* [weather-yahoo-jp](https://www.npmjs.com/package/weather-yahoo-jp)

