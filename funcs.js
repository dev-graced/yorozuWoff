import {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI,AUTHORIZATION_CODE,REFRESH_TOKEN,TOKEN_URL} from './params.js'

/**
 * refresh_token or authorization_code から google API のアクセストークンを取得する関数
 */
export async function getAccessToken(){
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
 export function sendPostRequest(url,requestOptions) {
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
 export function sendApiRequest(url,accessToken,payload) {
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
 
 // setIntervalを使う方法
 export function sleep(waitSec, callbackFunc) {
 
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