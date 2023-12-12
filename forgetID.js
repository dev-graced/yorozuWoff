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

//////////// Main script /////////////////////////////

///////////////////////////////////////////
////    相談ID忘れ問い合わせフォームの処理
///////////////////////////////////////////

// ボタン要素を取得
const forgetIDSendButton = document.getElementById('forgetID-sendButton');

if(forgetIDSendButton === null){
  console.log("forgetID-sendButton ID の要素がありません");
}else{

  // ボタンがクリックされたときの処理を追加
  forgetIDSendButton.addEventListener('click', async function() {

    // テキスト入力フィールドの値を取得
    let textInput = document.getElementById('forgetID-textInput').value;
    if(!textInput){
      alert("相談内容を入力してください");
      return;
    }

    let ans = window.confirm("送信します。よろしいですか？");
    if(ans){
      ////　ボタンを disabled にする
      // document.getElementById("forgetID-sendButton").disabled = true;

      // フォームに入力された内容の頭に　###相談ID忘れ### のタグを付ける
      textInput = "＜相談ID忘れ＞" + textInput;

      //　ボタンを 非表示 にし、代わりに非アクティブなボタンを表示する　
      document.getElementById("forgetID-sendButton").style.display ="none";
      document.getElementById("forgetID-sendButton2").style.display ="flex";

      //// アクセストークンを取得する
      let accessTokenResult = await wrap_getAccessToken();
      let accessToken = accessTokenResult[0];
      // エラーメッセージの表示
      if(accessTokenResult[1]){
        document.getElementById("forgetID-sendButton2").style.display ="none";
        document.getElementById("forgetID-sendButton3").style.display ="flex";
      };

      // let accessToken;
      // await getAccessToken()
      // .then((accessTokenRes)=>{
      //   accessToken = accessTokenRes.access_token;
      //   console.log("accessToken",accessToken);
      //   //document.getElementById('accessTokenField').textContent = accessToken;
      // })
      // .catch((error)=>{
      //   let msg = "エラー: アクセストークンが取得できませんでした";
      //   alert("トークン取得中にエラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
      //   console.log(msg);

      //   sendProgressMessage = "送信エラー";
      //   document.getElementById('foretID-sendButton2').textContent = sendProgressMessage;
      
        // //// エラー発生を管理者にメールで通知 (未作成）
      //});
      //let accessToken = accessTokenRes.access_token;
      // console.log("accessToken",accessToken);
      // document.getElementById('accessTokenField').textContent = accessToken;

      //// 相談した内容を送信
      let apiFunc = { //呼び出す API関数とその引数を設定する
        function: 'receiveQuery',
        //parameters: [textInput,secretNo]
        parameters: [textInput]
      };

      // リクエスト
      let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
      //let apiResponse = await sendPostRequest(url,requestOptions);
      let resultArray = apiResponse.response.result;
      let queryName = resultArray[0];

      // 送信完了ページへ遷移(相談ID付き)
      window.location.href 
      = hostUrl + 'post_complete.html?queryName='+queryName;
      //document.getElementById('apiResField').textContent = text;
    }
  });
}