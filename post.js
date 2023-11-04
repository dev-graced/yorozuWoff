import { woffId, SCRIPT_ID } from './params.js'
import { getAccessToken,sendApiRequest } from './funcs.js'

const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

async function main() {
  try {

    //// 質問送信フォーム
    // ボタン要素を取得
    const sendButton = document.getElementById('send-button');

    if(sendButton === null){
      console.log("send-button ID の要素がありません");
    }else{

      // ボタンがクリックされたときの処理を追加
      sendButton.addEventListener('click', async function() {

        // テキスト入力フィールドの値を取得
        let textInput = document.getElementById('text-input').value;
        if(!textInput){
          alert("相談内容を入力してください");
          return;
        }
        let secretNo = document.getElementById('secretNo').value;
        if(!secretNo){
          alert("４桁の暗証番号を入力してください");
          return;
        }else{
          let regx = /^[0-9]{4}$/;
          let testInput = regx.test(secretNo);
          if(!testInput){
            alert("暗証番号は「半角数字」を４つ入力してください");
            document.getElementById('secretNo').value = "";
          return;
          }
        }
        //document.getElementById('showInputTextField').textContent = textInput;

        // 送信中のメッセージを表示する
        let sendProgressMessage = "送信中です";
        document.getElementById('send-progress').textContent = sendProgressMessage;

        // アクセストークンを取得する
        let accessToken;
        await getAccessToken()
        .then((accessTokenRes)=>{
          accessToken = accessTokenRes.access_token;
          console.log("accessToken",accessToken);
          //document.getElementById('accessTokenField').textContent = accessToken;
        })
        .catch((error)=>{
          let msg = "エラー: アクセストークンが取得できませんでした";
          alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
          console.log(msg);

          sendProgressMessage = "送信エラー";
          document.getElementById('send-progress').textContent = sendProgressMessage;

          // //// エラー発生を管理者に LINE WORKS で通知
          // let apiFunc = { //呼び出す API関数とその引数を設定する
          //   function: 'sendMsgToAdm',
          //   parameters: [msg]
          // };
          // // リクエスト
          // sendApiRequest(url,accessToken,apiFunc);
        });
        //let accessToken = accessTokenRes.access_token;
        // console.log("accessToken",accessToken);
        // document.getElementById('accessTokenField').textContent = accessToken;

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

        //送信完了のメッセージを表示する
        sendProgressMessage = "";
        document.getElementById('send-progress').textContent = sendProgressMessage;

      });
    }

    //// 相談ネームと暗証番号を送信すると、相談履歴と相談ステータスが表示されるフォーム
    // ボタン要素を取得
    const queryInfoSendButton = document.getElementById('queryInfo-sendButton');

    if(queryInfoSendButton === null){
      //alert("queryInfo-sendButton ID の要素がありません");
      console.log("queryInfo-sendButton ID の要素がありません");
    }else{
      // ボタンがクリックされたときの処理を追加
      queryInfoSendButton.addEventListener('click', async function() {

        // テキスト入力フィールドの値を取得
        let queryName = document.getElementById('queryInfo-queryName').value;
        if(!queryName){
          alert("相談ネームを入力してください");
          return;
        }
        let secretNo = document.getElementById('queryInfo-secretNo').value;
        if(!secretNo){
          alert("４桁の暗証番号を入力してください");
          return;
        }else{
          let regx = /^[0-9]{4}$/;
          let testInput = regx.test(secretNo);
          if(!testInput){
            alert("暗証番号は「半角数字」を４つ入力してください");
            document.getElementById('secretNo').value = "";
          return;
          }
        }

        // 送信中のメッセージを表示する
        let sendProgressMessage = "送信中です";
        document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;

        // アクセストークンを取得する
        let accessToken;
        await getAccessToken()
        .then((accessTokenRes)=>{
          accessToken = accessTokenRes.access_token;
          console.log("accessToken",accessToken);
          //document.getElementById('accessTokenField').textContent = accessToken;
        })
        .catch((error)=>{
          let msg = "エラー: アクセストークンが取得できませんでした";
          alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
          console.log(msg);

          sendProgressMessage = "送信エラー";
          document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;

        })

        let apiFunc = { //呼び出す API関数とその引数を設定する
          function: 'requestQueryInfo',
          parameters: [queryName,secretNo]
        };

        // リクエスト
        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        //let apiResponse = await sendPostRequest(url,requestOptions);
        let apiResults = apiResponse.response.result;
        //document.getElementById('queryInfo-apiResField').textContent = text;
        //alert(text);

        //送信完了のメッセージを表示する
        sendProgressMessage = "";
        document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;

        ////相談履歴と相談ステータスの表示

        // 表示領域要素の取得
        let messageThread = document.getElementById("queryInfo-messageThread");

        if(apiResults[3] === ""){

          //相談ネームの表示
          let messageElement = document.createElement("div");
          messageElement.className = "queryName";
          messageElement.innerHTML = "相談ネーム：" + apiResults[0];
          messageThread = messageThread.appendChild(messageElement);

          //相談ステータスの表示
          messageElement = document.createElement("div");
          messageElement.className = "queryStatus";
          messageElement.innerHTML = "相談状況：" + apiResults[1];
          messageThread = messageThread.appendChild(messageElement);

          // タイトル（相談履歴）の表示
          let title = document.createElement("div");
          title.className = "queryHistoryTitle";
          title.innerHTML = "相談履歴";
          messageThread = messageThread.appendChild(title);

          //相談履歴の表示
          let queryHistory = apiResults[2];
          for(let ii=0;ii<queryHistory.length;ii++){
            messageElement = document.createElement("div");
            messageElement.className = "message";
            messageElement.innerHTML = queryHistory[ii][0] + ": " + queryHistory[ii][1];
            messageThread.appendChild(messageElement);

            messageElement = document.createElement("div");
            messageElement.className = "message";
            messageElement.innerHTML = "相談への返信" + ": " + queryHistory[ii][2];
            messageThread.appendChild(messageElement);
          }

        }else{ // エラーメッセージの表示
          let messageElement = document.createElement("div");
          messageElement.className = "errorMessage";
          messageElement.innerHTML = apiResults[3];
          messageThread = messageThread.appendChild(messageElement);
        }

      });
    }
  } catch (e) {
    alert("エラーですよ");
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
  console.log(woffId);

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
          alert("エラー");
          window.alert(err);
          console.error(err)
      });
    }else{
      alert("LINE WORKS アプリ以外からはこのページにアクセスできません。");
      window.location.href = 'https://line.worksmobile.com/jp';
    };
});