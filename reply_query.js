import { woffId, SCRIPT_ID, DEBUG_FLAG } from './params.js'
import { wrap_getAccessToken,sendApiRequest } from './funcs.js'
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

// web アプリのホストPCのURL
let hostUrl;
if(DEBUG_FLAG == 0){
    hostUrl = 'https://dev-graced.github.io/yorozuWoff/';
}else{
    hostUrl = 'https://potential-space-sniffle-rq6w7445g66cp7r5-5500.app.github.dev/';
};

//////////// Main /////////////////////////////

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

        textQueryHistory += '<div>' + postDate + '</div>';
        textQueryHistory += '<div class="mycomment"><div style="text-align: right"><p>' 
        + queryMain + '</p></div></div>';
        
        // 自動返信メッセージの設定
        let replyText;
        if(queryArray[2]){
            replyText = queryArray[2];
            textQueryHistory += '<div class="balloon6"> <div class="faceicon"><img src="yorozu_logo.png" style=""></div><div class="chatting"><div class="says"><p>' 
            + replyText + '</p></div></div></div>';
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
textQueryHistory += '</div>'

document.getElementById('queryID').innerHTML = textQueryID;
// document.getElementById('queryStatus').innerHTML = queryStatus;
document.getElementById('queryHistory').innerHTML = textQueryHistory;


/////////////////////////////////////////
//// 相談への返信メッセージ入力フォームのスクリプト
////////////////////////////////////////

//// 返信送信フォーム                // ボタン要素を取得
const replySendButton = document.getElementById('reply-sendButton');
// ボタンがクリックされたときの処理を追加
replySendButton.addEventListener('click', async function() {

    // テキスト入力フィールドの値を取得
    let textInput = document.getElementById('reply-textInput').value;
    if(!textInput){
        alert("返信内容を入力してください");
        return;
    }

    // // 送信中のメッセージを表示する
    // let sendProgressMessage = "送信中...";
    // document.getElementById('addQuery-sendButton-a').textContent = sendProgressMessage;

    //　ボタンを 非表示 にし、代わりに非アクティブなボタンを表示する　
    document.getElementById("reply-sendButton").style.display ="none";
    document.getElementById("reply-sendButton2").style.display ="flex";

    //// アクセストークンを取得する
    let accessTokenResult = await wrap_getAccessToken();
    let accessToken = accessTokenResult[0];
    //alert(accessToken);
    
    // エラーメッセージの表示
    if(accessTokenResult[1]){
        document.getElementById("reply-sendButton2").style.display ="none";
        document.getElementById("reply-sendButton3").style.display ="flex";
    };

    // 返信を送信
    let apiFunc = { //呼び出す API関数とその引数を設定する
        function: 'receiveReply',
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
        // document.getElementById('reply-sendProgress').textContent = sendProgressMessage;
        // alert(errorMessage);
        document.getElementById("reply-sendButton2").style.display ="none";
        document.getElementById("reply-sendButton3").style.display ="flex";
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
        = hostUrl + 'reply_complete.html?queryID='+queryId+'&queryStatus='+queryStatus+'&queryHistory='+textQueryHistory;
    }
});