const CLIENT_ID = "479289013154-2l1m68f7pc3dp21o1voscge1h82cqeqe.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const AUTHORIZATION_CODE = '4/0AfJohXlNpoH2_0uQnv6pE4eZ2OYUMxxpNITVVKEa4A-MHv6Wab1EbdjIOANb_QlawDQE_w'; // リダイレクトURIから取得した認証コード
const REFRESH_TOKEN = "1//04zuaF6Bs3dFhCgYIARAAGAQSNwF-L9Irr4jAl-RQsZ1JMjjubovFEEJGM_4w44IIJ2HigeAn3fzwbPzUtItqCrtTzMshqR_yTYk"
const TOKEN_URL = "https://accounts.google.com/o/oauth2/token"
//const SCRIPT_ID = "AKfycbwGhfPrq3DeBK60vtPsBa5EIDXX4sGMk4YgH6dSYgyoZD_m0DKxhp4dqStpMYrre7Vo3g" //本番用
const SCRIPT_ID = "AKfycbz2d8acJnBkhwaHrplkaBCAqe4FqMiBong648t6FAAQ" //テスト用
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

// let accessToken;
// getAccessToken()
//   .then((accessTokenRes)=>{
//     accessToken = accessTokenRes.access_token;
//     console.log("accessToken",accessToken);
//     //document.getElementById('accessTokenField').textContent = accessToken;
//   })
//   .catch((error)=>{
//     //alert("エラー",error);
//     console.log("エラー: アクセストークンが取得できませんでした");
//   })

// // let msg = "エラーです";
// // let apiFunc = { //呼び出す API関数とその引数を設定する
// //   function: 'helloworld',
// //   parameters: [msg]
// // };

// let textInput = "OKKKK";
// let secretNo = "1234";
// let apiFunc = { //呼び出す API関数とその引数を設定する
//   function: 'receiveQuery',
//   parameters: [textInput,secretNo]
// };

// // リクエスト
// // リクエスト
// sendApiRequest(url,accessToken,apiFunc)
// .then((apiResponse)=>{
//   let text = apiResponse.response.result;
//   //document.getElementById('apiResField').textContent = text;
//   //alert(text);
//   console.log(text);
// });
// //let apiResponse = await sendPostRequest(url,requestOptions);

async function main() {
  try {
    
      //let accessToken = accessTokenRes.access_token;
      // console.log("accessToken",accessToken);
      // document.getElementById('accessTokenField').textContent = accessToken;

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
        //alert("エラーが発生しました。原因を調査中です。明日以降でまた試してみてください。");
        console.log(msg);

        //sendProgressMessage = "送信エラー";
        //document.getElementById('send-progress').textContent = sendProgressMessage;
      })

      //// 質問を送信
      let apiFunc = { //呼び出す API関数とその引数を設定する
        function: 'receiveQuery',
        parameters: ['こんにちは','1234']
      };

      // リクエスト
      let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
      //let apiResponse = await sendPostRequest(url,requestOptions);
      let text = apiResponse.response.result;
      //document.getElementById('apiResField').textContent = text;
      //alert(text);

    //  //// メッセージスレッドの表示を管理するJavaScriptコード
    //  const messageThread = document.getElementById("message-thread");
    //  const messageInput = document.getElementById("message-input");
    //  const sendButton2 = document.getElementById("send-button-2");

    //  sendButton2.addEventListener("click", () => {
    //      const messageText = messageInput.value;
    //      if (messageText) {
    //          const messageElement = document.createElement("div");
    //          messageElement.className = "message";
    //          messageElement.textContent = messageText;
    //          messageThread.appendChild(messageElement);
    //          messageInput.value = "";
    //      }
    //  });

  } catch (e) {
      throw e;
  } 
}

main();


async function getAccessToken(){
  return new Promise(function (resolve,reject) {
   
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

   //let response = sendPostRequest(TOKEN_URL,options);
   sendPostRequest(TOKEN_URL,options)
   .then((response)=>{
      resolve(response);
   })
   .catch((error)=>{
      reject(error);
   })
   // alert(response);
   //console.log("LKLKLL");
   //resolve(response);
 })
}

// POSTリクエストを送信する関数
function sendPostRequest(url,requestOptions) {
 return new Promise((resolve,reject) => {
   // Fetch APIを使用してPOSTリクエストを送信
   fetch(url,requestOptions)
   .then(response => {
     if (!response.ok) { 
      let msg = `HTTPエラー! ステータスコード: ${response.status}`;
      reject(msg);
      //throw new Error(msg);
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
   //let response = sendPostRequest(url,requestOptions);
   sendPostRequest(url,requestOptions)
   .then((response)=>{
      resolve(response);
   })
   .catch((val)=>{
      console.log("エラー",val);
   })
 })
}