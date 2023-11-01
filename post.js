import { woffId } from './params.js'
import {CLIENT_ID} from './params.js'
import {CLIENT_SECRET} from './params.js'
import {REDIRECT_URI} from './params.js'
import {AUTHORIZATION_CODE} from './params.js'
import {REFRESH_TOKEN} from './params.js'
import {TOKEN_URL} from './params.js'
//const SCRIPT_ID = "AKfycbwGhfPrq3DeBK60vtPsBa5EIDXX4sGMk4YgH6dSYgyoZD_m0DKxhp4dqStpMYrre7Vo3g" //本番用
import {SCRIPT_ID} from './params.js'
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

async function main() {
  try {
    // アクセストークンを取得する
    let accessTokenRes = await getAccessToken();
    let accessToken = accessTokenRes.access_token;
    console.log("accessToken",accessToken);
    document.getElementById('accessTokenField').textContent = accessToken;

    //// 質問送信フォーム
    // ボタン要素を取得
    const sendButton = document.getElementById('send-button');
    // ボタンがクリックされたときの処理を追加
    sendButton.addEventListener('click', async function() {

      // テキスト入力フィールドの値を取得
      let textInput = document.getElementById('text-input').value;
      let secretNo = document.getElementById('secretNo').value;
      document.getElementById('showInputTextField').textContent = textInput;

      //// 質問を送信
      let apiFunc = { //呼び出す API関数とその引数を設定する
        function: 'receiveQuery',
        parameters: [textInput,secretNo]
      };

      // リクエスト
      let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
      //let apiResponse = await sendPostRequest(url,requestOptions);
      let text = apiResponse.response.result;
      document.getElementById('apiResField').textContent = text;
      //alert(text);
    });

  } catch (e) {
      throw e;
  } 
}

/**
 * refresh_token or authorization_code から google API のアクセストークンを取得する関数
 */
 async function getAccessToken(){
   return new Promise(function (resolve) {
    
    const data = {
      //code: AUTHORIZATION_CODE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token'
      //grant_type: 'authorization_code'
    };
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    let response = sendPostRequest(TOKEN_URL,options);
    // alert("OKKK");
    // alert(response);
    console.log("LKLKLL");
    resolve(response);
  })
 }

// POSTリクエストを送信する関数
function sendPostRequest(url,requestOptions) {
  return new Promise((resolve) => {
    // Fetch APIを使用してPOSTリクエストを送信
    fetch(url,requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータスコード: ${response.status}`);
      }
      resolve(response.json());
    })
    .catch(error => {
      result = error;
      console.error("エラー:", error);
      //alert("sendPostRequest エラー:");
    });
  })
}

// APIリクエストを送信する関数
function sendApiRequest(url,accessToken,payload) {
  return new Promise((resolve) => {
    
    //ヘッダーの定義
    let header = {
      authorization: `Bearer ${accessToken}`
    };
    
    // リクエストオプションの設定
    let requestOptions = {
      method: "POST",
      headers: header,
      body: JSON.stringify(payload), // 送信するデータをJSON形式に変換
    };

    //リクエストの送信
    let response = sendPostRequest(url,requestOptions);
    resolve(response);
  })
}

// setIntervalを使う方法
function sleep(waitSec, callbackFunc) {

  // 経過時間（秒）
  var spanedSec = 0;

  // 1秒間隔で無名関数を実行
  var id = setInterval(function () {

      spanedSec++;

      // 経過時間 >= 待機時間の場合、待機終了。
      if (spanedSec >= waitSec) {

          // タイマー停止
          clearInterval(id);

          // 完了時、コールバック関数を実行
          if (callbackFunc) callbackFunc();
      }
  }, 1000);

}

// const getProfile = () => {
// // LINE WORKS のユーザー情報を取得
//   woff.getProfile().then((profile) => {
//     // Success
//     console.log(profile)
//     let lwUserId = profile.userId;
//     document.getElementById('userIdProfileField').textContent = lwUserId;
//   })
//   .catch((err) => {
//     // Error
//     console.log(err)
//     window.alert(err);
//   });
// };

// プログラム実行

//WOFF On load
window.addEventListener('load', () => {
  console.log(woffId)

  //if(woff.isInClient()){
  if(woffId){ //woff.isInClient を回避するデバッグ用
  // Initialize WOFF
  woff.init({ woffId: woffId })
      .then(() => {
          //// Get and show LINE WORKS userId
          //getProfile();
          //alert("initialized");

          // if(woff.isLoggedIn()){
          //   alert("OKKKKK");
          //   // よろず相談API の実行
          //   main();
          // }else{
          //   alert("LINE WORKS にログインしていない状態ではこのページにアクセスできません。");
          //   window.location.href = 'https://auth.worksmobile.com/login/login?accessUrl=http%3A%2F%2Fjp2-common.worksmobile.com%2Fproxy%2Fmy';
          //   //woff.login();
          // };

          main();
      })
      .catch((err) => {
          // Error
          window.alert(err);
          console.error(err)
      });
    }else{
      alert("LINE WORKS アプリ以外からはこのページにアクセスできません。");
      window.location.href = 'https://line.worksmobile.com/jp';
    };
});