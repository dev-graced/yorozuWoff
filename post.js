import { woffId, SCRIPT_ID } from './params.js'
import { getAccessToken,sendApiRequest } from './funcs.js'

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