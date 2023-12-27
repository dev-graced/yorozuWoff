import { woffId, SCRIPT_ID, DEBUG_FLAG, ACCESS_FLAG } from './params.js'
import {sendApiRequest,wrap_getAccessToken } from './funcs.js'
const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`

// web アプリのホストPCのURL
let hostUrl;
if(DEBUG_FLAG == 0){
    hostUrl = 'https://dev-graced.github.io/yorozuWoff/';
}else{
    hostUrl = 'https://potential-space-sniffle-rq6w7445g66cp7r5-5500.app.github.dev/';
};

async function main() {
  try {

    /////////////////////////////////////
    //// 相談送信フォーム
    /////////////////////////////////////

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

        let ans = window.confirm("相談を送信します。よろしいですか？");
        if(ans){
          //　ボタンを disabled にする
          //document.getElementById("send-button").disabled = true;

          //　ボタンを 非表示 にし、代わりに非アクティブなボタンを表示する　
          document.getElementById("send-button").style.display ="none";
          document.getElementById("send-button2").style.display ="flex";

          //// アクセストークンを取得する
          let accessTokenResult = await wrap_getAccessToken();
          let accessToken = accessTokenResult[0];

          // エラーメッセージの表示
          if(accessTokenResult[1]){
            // document.getElementById('queryInfo-sendButton2').textContent = accessTokenResult[1];
            document.getElementById("send-button2").style.display ="none";
            document.getElementById("send-button3").style.display ="flex";
          };

            // //// エラー発生を管理者にメールで通知 (未作成）
          //});
          //let accessToken = accessTokenRes.access_token;
          // console.log("accessToken",accessToken);
          // document.getElementById('accessTokenField').textContent = accessToken;

          //// 質問を送信
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
   
    ///////////////////////////////////////////////////////////////////////////
    //// 相談ネームと暗証番号を送信すると、相談履歴と相談ステータスが表示されるフォーム
    ///////////////////////////////////////////////////////////////////////////

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
          alert("相談IDを入力してください");
          return;
        }
        //　ボタンを 非表示 にし、代わりに非アクティブなボタンを表示する　
        document.getElementById("queryInfo-sendButton").style.display ="none";
        document.getElementById("queryInfo-sendButton2").style.display ="flex";

        // // 送信中のメッセージを表示する
        // let sendProgressMessage = "ログイン中...";
        // document.getElementById('queryInfo-sendButton-a').textContent = sendProgressMessage;

        //// アクセストークンを取得する
        let accessTokenResult = await wrap_getAccessToken();
        let accessToken = accessTokenResult[0];
        // エラーメッセージの表示
        if(accessTokenResult[1]){
          // document.getElementById('queryInfo-sendButton2').textContent = accessTokenResult[1];
          document.getElementById("queryInfo-sendButton2").style.display ="none";
          document.getElementById("queryInfo-sendButton3").style.display ="flex";
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
        //   document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;

        // })

        let apiFunc = { //呼び出す API関数とその引数を設定する
          function: 'requestQueryInfo',
          // parameters: [queryName,secretNo]
          parameters: [queryName]
        };

        // リクエスト
        let apiResponse = await sendApiRequest(url,accessToken,apiFunc);
        //let apiResponse = await sendPostRequest(url,requestOptions);
        let apiResults = apiResponse.response.result;
        //document.getElementById('queryInfo-apiResField').textContent = text;
        //alert(text);
        let queryId = apiResults[0];
        let queryStatus = apiResults[1];
        let queryHistory = apiResults[2];
        let errorMessage = apiResults[3];
        //alert(apiResults);

        // API リクエストレスポンスのエラーメッセージ処理
        if(errorMessage){
          // sendProgressMessage = "送信エラー";
          // document.getElementById('queryInfo-sendProgress').textContent = sendProgressMessage;
          alert(errorMessage);

          //　ログインボタンをアクティブにし、代わりにログイン中ボタンを非アクティブにする　
          document.getElementById("queryInfo-sendButton").style.display ="block";
          document.getElementById("queryInfo-sendButton2").style.display ="none";
        }else{
          // queryHistoryを文字列として整形
          let textQueryHistory = "";
          for(let i=0; i<queryHistory.length; i++){
            textQueryHistory += queryHistory[i][0] + "," + queryHistory[i][1] + "," 
            + queryHistory[i][2] + ";";
          }
          //alert(textQueryHistory);


          ///// ログイン履歴の記録
          apiFunc = { //呼び出す API関数とその引数を設定する
            function: 'recordLoginEvent',
            parameters: [queryName]
          };
          apiResponse = await sendApiRequest(url,accessToken,apiFunc);


          ////// 送信完了ページへ遷移(相談ID、相談ステータス、相談履歴付き)
          window.location.href 
          = hostUrl + 'query_history.html?queryID='+queryId+'&queryStatus='+queryStatus+'&queryHistory='+textQueryHistory;
        }
  
      });
    }
  } catch (e) {
    alert("エラーですよ");
    throw e;
  } 
}


//// プログラム実行
//WOFF On load
window.addEventListener('load', () => {
  // console.log(woffId);

  // LINE WORKS アプリからのアクセスか判別するフラグ： true: アプリ内からのアクセス, false: アプリ外からのアクセス
  let inClientFlag = woff.isInClient();
  //alert("inClientFlag"+" = "+inClientFlag);

  // ACCESS_FLAG = 1 の時はLINE WORKS アプリ外からでもアクセスできるようにする
  if(ACCESS_FLAG == 1){
    inClientFlag = true;
  }
  //alert("inClientFlag"+" = "+inClientFlag);

  // WOFF の起動
  if(inClientFlag){
  //if(woffId){ //woff.isInClient を回避するデバッグ用
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
          //console.error(err)
      });
    }else{
      alert("LINE WORKS アプリ以外からはこのページにアクセスできません。");
      window.location.href = 'https://line.worksmobile.com/jp';
    };
});