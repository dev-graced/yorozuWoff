//const axios = require('axios');

const CLIENT_ID = "479289013154-2l1m68f7pc3dp21o1voscge1h82cqeqe.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REFRESH_TOKEN = "1//040_FdivnbfKACgYIARAAGAQSNwF-L9IrvrI73MsPi93Riz3nZSvWl7Yk8IIN_Qz2iCJZXKacfX5mcLoMWN3xZdNg6WHJnVMcV6U"
const SCRIPT_ID = "1b4ljgunjX9B-Yql8C5fiACUziGNrIe3tGwSD77PUMdDoCdZyc9sf9yiO"
/**
 * メイン関数
 * @return string
 */
async function main() {
  document.getElementById('domainIdField').textContent = "OKKK?";
  //try {
    // アクセストークンを取得する
    //const accessToken = await getAccessToken();
     //document.getElementById('domainIdField').textContent = "OK?";
  //   // GASを実行
  //   const url = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`;
  //   const headers = {
  //     Authorization: `Bearer ${accessToken}`,
  //   };
  //   const payload = {
  //     function: 'helloworld',
  //     parameters: ['OKKKKKKKKKK']
  //   };
  //   // リクエスト
  //   const instance = axios.create({ headers });
  //   const response = await instance.post(url, payload);
  //   if (response.status !== 200 || !response.data || response.data.error) {
  //       throw new Error('Failed to run google apps script.');
  //   }
  //   const { result } = response.data.response;
  //   console.log(result);

  //   //document.getElementById('domainIdField').textContent = result;
  // } catch (e) {
  //   throw e;
  //}
}

/**
 * アクセストークンを取得する関数
 * @return string
 */
async function getAccessToken() {
  const payload = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: 'refresh_token',
  };
  // リクエスト
  const response = await axios.post(TOKEN_URL, payload);
  if (response.status !== 200 || !response.data) {
    throw new Error('Failed to get access token.');
  }
  const accessToken = response.data.access_token;
  return accessToken;
}

async function test() {
  document.getElementById('domainIdField').textContent = "OYYY?";
}

//test()
main()

