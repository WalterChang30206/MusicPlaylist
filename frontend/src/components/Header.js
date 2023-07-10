import React , {useState} from 'react'



// 我試著製造一個要傳給 librarypage.js 的 global variavle => user_email

const Header = () => {

  // environment variable
  const root_url = process.env.REACT_APP_ROOT_URL

  // 擷取上方的 url，並且只取#後方的文字
  var fragmentString = window.location.hash.substring(1);


  // 當我登入 google 帳號之後，我會被導引到這個 homepage，並且在 url 上面帶著 google 給我的資訊，而我現在要解析這段 url ，去取得 google 所給予的 access token
  var params = {};
  var regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  
  // 只要確定我上方的 url 是有帶資料的，那麼就把 access_token 儲存進 localStorage，並且利用這個 access_token 再向 google 求取使用者資訊
  if ( Object.keys(params).length > 0 ) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params))
    if (params['state'] && params['state'] == 'try_sample_request') {
      checkToken();
  }
  } else {
    window.location.assign(root_url + 'login/')
  }

  // 求取使用者資訊的目的有兩個：
  // 1. 驗證這個 token 是否合法，確定使用者是否真的成功登入 google account 了； 2. 我需要利用使用者的 email 來辨別它們的身分
  // 如果 token 合法，那麼會將使用者導引到 librarypage 並且在 librarypage 頁面上顯示該使用者先前所建立的 playlist
  // 若 token 不合法，則把使用者彈回 login page，要求使用者再重新登入
  
  // -----------------------------------------------------------------------------------------------------------//
  // 我嘗試用兩種不一樣的方法向 google api drive v3 取得我要的使用者資訊，一為 XmlHttpRequest , 另一個為 fetch
  // 似乎，XHR 會直接返還給我相應的 json string，而 fetch 方法卻會給一個 ReadableStream，是一個有些奇怪的東西@@

  // XMLHttpRequest method
  function trySampleRequest() {
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET',
          'https://www.googleapis.com/drive/v3/about?fields=user&' +
          'access_token=' + params['access_token']);
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let response_json = JSON.parse(xhr.response);
          console.log(response_json['user']['emailAddress']);

        } else if (xhr.readyState === 4 && xhr.status === 401) {
          window.location.assign(root_url + 'login/')
        }
      };
      xhr.send(null)
    }
  }

  // fetch method , 這裡會有兩個分支，如果失敗，就 redirect 到 loginpage 並 return Null，如果成功，則回傳取得的 email，並且嘗試
  async function checkToken() {

    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {

    let response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user&' +
      'access_token=' + params['access_token']);

    if (response.status === 200) {

      let textDecoder = new TextDecoder('utf-8');

      response.body.getReader().read()
      .then(({done,value}) => {
        let result = JSON.parse(textDecoder.decode(value))['user']['emailAddress'];
        localStorage.setItem('user_email', result)
        window.location.assign(root_url + 'library/')
      })
      
      
    } else if (response.status === 401) {
      localStorage.removeItem('user_email')
      window.location.assign(root_url + 'login/')
    }
    }
  }

  // -----------------------------------------------------------------------------------------------------------//


  
  return (
    <div></div>
  )
}

export default Header;
