import { woffId, SCRIPT_ID } from './params.js'
import { getAccessToken,sendApiRequest } from './funcs.js'
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

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

        textQueryHistory += '<div>' + postDate + '</div>';
        textQueryHistory += '<div class="mycomment"><div style="text-align: right"><p>' 
        + queryArray[1] + '</p></div></div>';
        
        let replyText;
        if(queryArray[2]){
            replyText = queryArray[2];
        }else{
            replyText = "ただいま相談を検討中です。<br>しばらくお待ち下さい（目安は１週間です)。"
        }
        textQueryHistory += '<div class="balloon6"> <div class="faceicon"><img src="yorozu_logo.png" style=""></div><div class="chatting"><div class="says"><p>' 
            + replyText + '</p></div></div></div>';
    }
    
}
textQueryHistory += '</div>'

document.getElementById('queryID').innerHTML = textQueryID;
// document.getElementById('queryStatus').innerHTML = queryStatus;
document.getElementById('queryHistory').innerHTML = textQueryHistory;

/////////////////////////////////////////
//// メッセージ入力フォームのスクリプト
////////////////////////////////////////

//// 追加質問送信フォーム                // ボタン要素を取得
const addQuerySendButton = document.getElementById('addQuery-sendButton');
// ボタンがクリックされたときの処理を追加
addQuerySendButton.addEventListener('click', async function() {

    // テキスト入力フィールドの値を取得
    let textInput = document.getElementById('addQuery-textInput').value;
    if(!textInput){
        alert("追加の質問内容を入力してください");
        return;
    }

    // 送信中のメッセージを表示する
    let sendProgressMessage = "送信中...";
    document.getElementById('addQuery-sendButton-a').textContent = sendProgressMessage;

    // アクセストークンを取得する
    let accessToken;
    await getAccessToken()
    .then((accessTokenRes)=>{
        accessToken = accessTokenRes.access_token;
        //console.log("accessToken",accessToken);
    })
    .catch((error)=>{
        let msg = "エラー: アクセストークンが取得できませんでした";
        alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
        console.log(msg);
        sendProgressMessage = "送信エラー";
        document.getElementById('addQuery-sendProgress').textContent = sendProgressMessage;
    });

    // 質問を送信
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
        sendProgressMessage = "送信エラー";
        document.getElementById('addQuery-sendProgress').textContent = sendProgressMessage;
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
        //= 'https://dev-graced.github.io/yorozuWoff/query_history.html'
        = 'https://potential-space-sniffle-rq6w7445g66cp7r5-5500.app.github.dev/query_history.html'
        +'?queryID='+queryId+'&queryStatus='+queryStatus+'&queryHistory='+textQueryHistory;
    }
});