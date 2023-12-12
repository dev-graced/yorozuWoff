import { woffId, SCRIPT_ID, DEBUG_FLAG } from './params.js'
import {sendApiRequest,wrap_getAccessToken } from './funcs.js'
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

// web アプリのホストPCのURL
let hostUrl;
if(DEBUG_FLAG == 0){
    hostUrl = 'https://dev-graced.github.io/yorozuWoff/';
}else{
    hostUrl = 'https://potential-space-sniffle-rq6w7445g66cp7r5-5500.app.github.dev/';
};

//////////// Main /////////////////////////////

// デフォルトで相談終了ボタンを非表示にしておく
//document.getElementById("queryFinishButton").style.display ="none";

//// 相談履歴の解析

let paraPair  = new Array();                       
let paraName  = new Array();
let paraValue = new Array();

// URLから渡された引数を取得
let paramPart = location.search.split("?")[1];
let para = paramPart.split("&");                 
let paraNum = para.length;

// 各引数をパラメーター名とパラメーターに分離
for (let i = 0; i <paraNum; i++) {               
    paraPair = para[i].split("=");                   
    paraName[i]  = decodeURIComponent(paraPair[0]);
    paraValue[i] = decodeURIComponent(paraPair[1]);
}

let queryID = paraValue[0];
let queryStatus = paraValue[1]

let textQueryID = queryID + "さんの相談履歴"; 
let textQueryStatus = "相談状況：" + queryStatus;

// 相談履歴を解析
let queryHistory = paraValue[2];
let queryHistoryArray = queryHistory.split(";");
let textQueryHistory = '<div class="line-bc">';
let postDate,postDateOld;
let lastReplyFlag = 0; // 一番最後の質問に対する返信の有無を表すフラグ　0:返信なし　1:返信あり
for(let i=0; i<queryHistoryArray.length; i++){
    // 各投稿エントリーを解析
    let queryArray = queryHistoryArray[i].split(",");
    //alert(queryArray);

    // 投稿エントリーを HTML化
    if(queryArray[1]){
        //　投稿日時を解析
        let postDateTime = queryArray[0].split(" ");
        let postDateNew = postDateTime[0];
        let postTime = postDateTime[1]; 

        if(postDateOld != postDateNew){
            postDate = postDateNew;
            postDateOld = postDateNew
        }else{
            postDate = "";
        }

        // 相談内容によって相談の表示方法を変える
        let queryMain;
        if(queryArray[1].match(/^＜相談ID忘れ＞/)){
            queryMain = "＜相談ID忘れ＞<br><br>[忘れた相談IDの相談内容]<br>"+queryArray[1].slice(8);
        }else{
            queryMain = queryArray[1];
        }

        // 相談履歴の設定
        textQueryHistory += '<div>' + postDate + '</div>';
        textQueryHistory += '<div class="mycomment"><div style="text-align: right"><p>' 
        + queryMain + '</p></div></div>';
        
        // 自動返信メッセージの設定
        let replyText;
        if(queryArray[2]){
            //返信メッセージを追加
            replyText = queryArray[2];
            textQueryHistory += '<div class="balloon6"> <div class="faceicon"><img src="yorozu_logo.png" style=""></div><div class="chatting"><div class="says"><p>' 
            + replyText + '</p></div></div></div>';

            //alert("queryHistoryArrayLength: "+queryHistoryArray.length);
            //一番最後の質問への返信だったら、相談終了確認メッセーじを追加し、lastReplyFlag = 1 にする
            if(i == queryHistoryArray.length-2){

                if(queryStatus == "相談終了"){
                    //相談終了のメッセージを追加
                    textQueryHistory += '<div class="balloon6"> <div class="faceicon"><img src="yorozu_logo.png" style=""></div><div class="chatting"><div class="says"><p>' 
                    + "相談は終了しました" + '</p></div></div></div>';

                    // 追加質問フォームを非表示にする
                    document.getElementById("addQuery-form").style.display ="none";
                    document.getElementById("addQuery-sendButton").style.display ="none";

                }else{
                    // 相談を終了するかの確認メッセージを追加
                    let confirmText = "これで相談を終了する場合は下の「相談を終了する」ボタンを押してください。<br><br>" 
                    + "追加の質問がある場合は下から質問を送信してください。";
                    textQueryHistory += '<div class="balloon6"> <div class="faceicon"><img src="yorozu_logo.png" style=""></div><div class="chatting"><div class="says"><p>' 
                    + confirmText + '</p></div></div></div>';

                    lastReplyFlag = 1;
                }
            }

        }else{
            if(queryArray[1].match(/^＜相談ID忘れ＞/)){
                replyText = "ただいま相談IDを調べています。<br>しばらくお待ち下さい（目安は２日です）。";
            }else{
                replyText = "ただいま相談を検討中です。<br>しばらくお待ち下さい（目安は１週間です)。";
            }

            // queryStatus が 「返信する」ではない場合だけ replyText (自動返信メッセージ)を表示する
            if(queryStatus != "返信する"){
                textQueryHistory += '<div class="balloon6"> <div class="faceicon"><img src="yorozu_logo.png" style=""></div><div class="chatting"><div class="says"><p>' 
                + replyText + '</p></div></div></div>';
            }
        }
    }
    
}
textQueryHistory += '</div>';

//alert("lastReplyFlag: "+lastReplyFlag);

// lastReplyFlag = 1 なら、相談終了ボタンを表示する
if(lastReplyFlag == 1){
    //alert("lastReplyFlag=1");
    document.getElementById("queryFinishButton").style.display ="flex";
};


document.getElementById('queryID').innerHTML = textQueryID;
// document.getElementById('queryStatus').innerHTML = queryStatus;
document.getElementById('queryHistory').innerHTML = textQueryHistory;


/////////////////////////////////////////
//// 相談終了ボタンのスクリプト
////////////////////////////////////////
const queryFinishButton = document.getElementById('queryFinishButton');
queryFinishButton.addEventListener('click', async function() {

    let result = window.confirm("相談を終了します。よろしいですか？");

    if(result){
        //　ボタンを押したらプログレスバーを表示する　
        document.getElementById("queryFinishButton").style.display ="none";
        document.getElementById("queryFinishButton2").style.display ="flex";

        //// アクセストークンを取得する
        let accessTokenResult = await wrap_getAccessToken();
        let accessToken = accessTokenResult[0];

        // エラーメッセージの表示
        if(accessTokenResult[1]){
            document.getElementById("queryFinishButton2").style.display ="none";
            document.getElementById("queryFinishButton3").style.display ="flex";
        };

        //// 相談終了を送信
        let apiFunc = { //呼び出す API関数とその引数を設定する
            function: 'closeQuery',
            parameters: [queryID]
        };

        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        let text = apiResponse.response.result;

        if(text){
            //相談終了ページに遷移
            window.location.href 
                = hostUrl + 'close_query.html?queryID='+queryID
        }else{
            alert("エラーが発生しました。申し訳ありませんが、明日以降にやり直してみてください。");
        }
    }
})


/////////////////////////////////////////
//// メッセージ入力フォームのスクリプト
////////////////////////////////////////

//// 追加質問送信フォーム                // ボタン要素を取得
const addQuerySendButton = document.getElementById('addQuery-sendButton');
// ボタンがクリックされたときの処理を追加
addQuerySendButton.addEventListener('click', async function() {

    let result = window.confirm("質問を送信します。よろしいですか？");

    if(result){
        // テキスト入力フィールドの値を取得
        let textInput = document.getElementById('addQuery-textInput').value;
        if(!textInput){
            alert("追加の質問内容を入力してください");
            return;
        }

        // // 送信中のメッセージを表示する
        // let sendProgressMessage = "送信中...";
        // document.getElementById('addQuery-sendButton-a').textContent = sendProgressMessage;

        //　ボタンを 非表示 にし、代わりに非アクティブなボタンを表示する　
        document.getElementById("addQuery-sendButton").style.display ="none";
        document.getElementById("addQuery-sendButton2").style.display ="flex";

        //// アクセストークンを取得する
        let accessTokenResult = await wrap_getAccessToken();
        let accessToken = accessTokenResult[0];
        //alert(accessToken);

        // エラーメッセージの表示
        if(accessTokenResult[1]){
            document.getElementById("addQuery-sendButton2").style.display ="none";
            document.getElementById("addQuery-sendButton3").style.display ="flex";
        };

        //// 質問を送信
        let apiFunc = { //呼び出す API関数とその引数を設定する
            function: 'receiveAddQuery',
            parameters: [queryID,textInput]
        };

        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        //let text = apiResponse.response.result;
        //alert(text);

        //// 相談履歴を再表示する
        apiFunc = { //呼び出す API関数とその引数を設定する
            function: 'requestQueryInfo',
            parameters: [queryID]
        };
        apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        let apiResults = apiResponse.response.result;

        let queryId = apiResults[0];
        let queryStatus = apiResults[1];
        let queryHistory = apiResults[2];
        let errorMessage = apiResults[3];
        //alert(apiResults);

        // API リクエストレスポンスのエラーメッセージ処理
        if(errorMessage){
            // sendProgressMessage = "送信エラー";
            // document.getElementById('addQuery-sendProgress').textContent = sendProgressMessage;
            document.getElementById("addQuery-sendButton2").style.display ="none";
            document.getElementById("addQuery-sendButton3").style.display ="flex";
            alert(errorMessage);
        }else{
            // queryHistoryを文字列として整形
            let textQueryHistory = "";
            for(let i=0; i<queryHistory.length; i++){
                textQueryHistory += queryHistory[i][0] + "," + queryHistory[i][1] + "," 
                + queryHistory[i][2] + ";";
            }
        //alert(textQueryHistory);

            // 送信完了ページへ遷移(相談ID、相談ステータス、相談履歴付き)
            window.location.href 
            = hostUrl + 'query_history.html?queryID='+queryId+'&queryStatus='+queryStatus+'&queryHistory='+textQueryHistory;
        }
    }
});