import { SCRIPT_ID, DEBUG_FLAG } from './params.js'
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


/////////////////////////////////////////
//// 相談の感想コメント入力フォームのスクリプト
////////////////////////////////////////

//// コメント送信フォーム                // ボタン要素を取得
const closeCommentSendButton = document.getElementById('closeComment-sendButton');
// ボタンがクリックされたときの処理を追加
closeCommentSendButton.addEventListener('click', async function() {

    // テキスト入力フィールドの値を取得
    let textInput = document.getElementById('closeComment-textInput').value;
    if(!textInput){
        alert("コメント内容を入力してください");
        return;
    }

    let ans = window.confirm("感想コメントを送信します。よろしいですか？");
    if(ans){
        //　ボタンを 非表示 にし、代わりに非アクティブなボタンを表示する　
        document.getElementById("closeComment-sendButton").style.display ="none";
        document.getElementById("closeComment-sendButton2").style.display ="flex";

        //// アクセストークンを取得する
        let accessTokenResult = await wrap_getAccessToken();
        let accessToken = accessTokenResult[0];
        //alert(accessToken);
        
        // エラーメッセージの表示
        if(accessTokenResult[1]){
            document.getElementById("closeComment-sendButton2").style.display ="none";
            document.getElementById("closeComment-sendButton3").style.display ="flex";
        };

        // コメントを送信
        let apiFunc = { //呼び出す API関数とその引数を設定する
            function: 'receiveCloseComment',
            parameters: [queryID,textInput]
        };
        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        let text = apiResponse.response.result;
        if(text){
            //コメント受付メッセージを表示
            document.getElementById("closeQuery-message").innerHTML ="<p>コメントを送信しました。<br><br>ご利用ありがとうございました！</p>";

            //コメント送信フォームとボタンの非表示
            document.getElementById("closeComment-sendButton2").style.display ="none";
            document.getElementById("closeComment-form").style.display ="none";
        }else{
            alert("コメント送信時にエラーが発生しました。申し訳ありませんが、コメント投稿なしで相談を終了します。ご利用ありがとうございました！");
        }
        //alert(text);
    }
});