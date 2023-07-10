import React ,{useState, useEffect} from 'react'



function Loginpage() {

    // environment variable
    let root_url = process.env.REACT_APP_ROOT_URL

    let [my_client_id,setMy_client_id] = useState('')

    const google_icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png'

    // 利用 localStorage 裡面的東西，來嘗試自動登入
    if (localStorage.getItem('oauth2-test-params') && localStorage.getItem('user_email') ) {
        window.location.assign(root_url + 'library/')
    }
    
    // 渲染網頁
    useEffect( () => {
        get_client_id()
    }, []);

    // client_id 是我需要秘密保管的 key，所以我把他藏在後端 server 裡面
    async function get_client_id() {

        let client_id = await fetch('http://127.0.0.1:8000/api/client_id/');
        let data = await client_id.json();
        let result = await data['client_id'];
        setMy_client_id(result)
    }
    
    function oauthSignIn() {
        
        // 一些等一下會用到的基本資訊，像是第三方api目標位址、自己帶有的 OAuth ID
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    

        // 由於 gapi 並不支援 CORS，所以需要通過 http method 來傳送
        var form = document.createElement('form');
        form.setAttribute('method','GET');
        form.setAttribute('action',oauth2Endpoint);

        // 預先設計好這個 form 表單當中，實際會傳出去的 body
        var params = {  'client_id': my_client_id,
                        'redirect_uri': root_url ,
                        'response_type': 'token',
                        'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                        'include_granted_scopes': 'true',
                        'state': 'try_sample_request',
        };

        // form 表單裡面真正儲存資訊的部分，每個 input 會對應一個 name(key) , value(value)，我們要去 traverse 前段建立的 dictionary，retrieve 每一個 object 成可傳送出去的狀態
        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        };

        // 把前面預先創建好的 form，放進 html body 裡面，實際把整個 form 表單傳送出去
        document.body.appendChild(form);
        form.submit();

    }

    // 訪客登入
    function visitor_login() {
        let pseudo_params = {'access_token':"visitor_token"}
        localStorage.setItem('oauth2-test-params', JSON.stringify(pseudo_params))
        localStorage.setItem('user_email','visitor@audionote.com')
        window.location.assign(root_url + 'login/')
    }

    return (
        <div className='login_page'>
            <div className='login_page_background'></div>
            <div className='login_page_welcome'>Welcome to AudioNote !</div>
            <div className='login_box'>
                <div id='login_googleButton'  >
                    <div style={{cursor: 'pointer'}} onClick={ oauthSignIn }>
                        <img src={google_icon_url}></img>
                        Log in with Google
                        </div>
                </div>
                <div id='login_visitorButton'  >
                    <div style={{cursor: 'pointer'}} onClick={visitor_login}>Log in as Visitor</div>
                </div>
            </div>
        </div>
    )
};

export default Loginpage