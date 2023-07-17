import React ,{useState, useEffect} from 'react'
import Modal_lib_upd from '../components/Modal_lib_upd'
import Modal_lib_del from '../components/Modal_lib_del'
import Modal_lib_add from '../components/Modal_lib_add'
import Modal_music_item_add from '../components/Modal_music_item_add'
import Modal_music_item_del from '../components/Modal_music_item_del'



const Librarypage = () => {

// environment variable
    const root_url = process.env.REACT_APP_ROOT_URL
    const api_url = process.env.API_URL

// 確保用戶在登出之後，不能夠隨意進入這個頁面 ( 因為 localStorage 內部關於登入的資訊都被清空了，我要把他們送回 login page )

    if (localStorage.getItem('oauth2-test-params') && localStorage.getItem('user_email') ) {
    } else {
        window.location.assign(root_url + '/login')
    }

    let access_token = JSON.parse(localStorage.getItem('oauth2-test-params'))['access_token']
    let user_email = localStorage.getItem('user_email')
    

// 與 useState , selected_lib_music 一起使用的一個常數
// 當我還沒點選 playlist item 的時候，我選擇讓我在頁面右側顯示出警語 -> 因為這個是預設好的，必須要早於 useState 使用這個常數之前創立

    const default_music_item = <div className='music_item_default_box'>
        <div>It's empty inside your playlist.</div>
        <div>Try to link your video urls to create a new note!</div>
    </div>  


// 這邊要設置各種 Hook，基本上我都馬他們當作一個 global variable 來使用

    let [lib_list,setLib_list] = useState([]);
    let [selected_lib,setSelected_lib] = useState('You have not select a playlist yet!')
    let [selected_lib_id,setSelected_lib_id] = useState(0)
    let [selected_lib_music_item,setSelected_lib_music_item] = useState(default_music_item)
    let [modal_state_upd, setModal_state_upd] = useState(false)
    let [modal_state_del, setModal_state_del] = useState(false)
    let [modal_state_add, setModal_state_add] = useState(false)
    let [modal_state_music_add, setModal_state_music_add] = useState(false)
    

    //  因為 onclick 一次只能更新一個 state，我又需要把多個參數，像是 id , audio_name 都傳進 modal 裡面，所以這邊選擇用 array 來儲存資訊，並且索性就直接與控制 modal 的 useState 結合
    let [modal_state_music_del, setModal_state_music_del] = useState([false,0,'default'])

    // 這個變數的用意是在於確定我們是否已經選取了一個 playlist，之後利用這裡的 boolean，可以鎖定某些按鈕避免產生 bug：例如，未選取 playlist 卻要刪除物件
    var check_lib = selected_lib != 'You have not select a playlist yet!'


// 這裡要獲取 playlist 列表，useEffect 讓我能夠啟動 fetch get 向後端索取 data

    useEffect(() => {
        getLib_list()
    }, [])


// 從後端獲取 playlist items

    let getLib_list = async () => {
  
        let response = await fetch( api_url + '/library/' + user_email )
        let data = await response.json()

        setLib_list(data)
    }


// 將從 promise 物件裡拆包出來的 list，mapping 成多個 html <div> 物件

    let library_list = lib_list.map(item => ( 
        <div className='lib_list_item' tabIndex={-1} onClick={ () => handleclick(item,setSelected_lib_music_item,setModal_state_music_del,vis_auth)} key={item.id}> {item.playlist_name} </div>
    ))



// 設計我的 playlist 點擊之後的反饋，基本上是手動製作前一個項目的 onClick 事件

    const handleclick = async (item,setSelected_lib_music_item,setModal_state_music_del,vis_auth) => {
        
        // 先讓這個東西得到 focus

        
        let new_url = api_url + '/music_item/get/?playlist_name=' + item.playlist_name

        let response = await fetch(new_url)
        let data = await response.json()

        // 為了取得影片的thumbnail，我在img src那邊對 audio_urls 進行加工
        
        if (data.length != 0) {
            
            let music_item_list = data.map( e => 
                (<div  className='music_item' tabIndex={-1} key={e.id} >
                    <button onClick={ () => window.open(e.audio_urls)} className='link_to_video'></button>
                    <div className='music_item_thumb'>
                        <img src={'https://img.youtube.com/vi/' + e.audio_urls.split('=')[1] +'/0.jpg'}></img>
                    </div>
                    <div className='music_item_title'>{e.audio_name}</div>
                    <div className='music_delete_box' onClick={ () => vis_auth() && setModal_state_music_del([true,e.id,e.audio_name]) }>
                        <button></button>
                        delete
                    </div>
                </div>
                ))
                
            setSelected_lib_music_item(music_item_list)
        } else {
            setSelected_lib_music_item(default_music_item)
        }
        
        setSelected_lib(item.playlist_name);
        setSelected_lib_id(item.id);
        
    }


// 用來辨別身分，如果是訪客，就把這些按鈕給鎖住，使訪客沒辦法進行增刪修改的操作
    const vis_auth = () => {

        if (user_email == 'visitor@audionote.com') {
            alert('you\'ve logged in as a visitor\nnot allowed to take this operation' )
            return false
        } else {
            return true
        }
    }
    

// 製作一個撤銷 token 的登出按鈕，同時，因為訪客並沒有向 google 申請 token，而是在一樣的 localStorage 位置上塞入我給的 pseudo data，所以登出按鈕也會根據身分做出不一樣的行為
    async function logout () {
        
        // 如果登入者不是訪客，而是確實有向 google 申請 token 的人，我們就在這邊執行撤銷 token 的操作
        if (user_email != 'visitor@audionote.com') {

            let response = await fetch('https://oauth2.googleapis.com/revoke?token=' + access_token, {
            method: 'POST',
            headers: {
                'Content-type':'application/x-www-form-urlencoded',
            }
        })    
        }
        
        // 無論我們是誰，都需要清空 localStorage 裡面的資訊，因為在這個 app 裡面是依據 localStorage 內部存放的資訊來辨別用戶身分；清除 localStorage 後再將用戶導回 login page
        localStorage.removeItem('oauth2-test-params')
        localStorage.removeItem('user_email')
        window.location.assign(root_url + '/login')
    }

    
  return (

    <div className='lib_page'>
        <div className='lib_page_big_box'>
            <Lib_list_box setModal_state_upd={setModal_state_upd}  setModal_state_del={setModal_state_del}  setModal_state_add={setModal_state_add} library_list={library_list} check_lib={check_lib} vis_auth={vis_auth}/>
            <div className='playlist_box'>
                <div className='playlist_box_title'>
                    <div className='play_list_box_title_text'>
                        <h3>
                            {selected_lib}
                        </h3>
                    </div>
                    <div className='add_music_button_box' onClick={ () => vis_auth() && check_lib && setModal_state_music_add(true)}>
                        Add
                        <button>
                        </button>
                    </div>
                </div>
                {selected_lib_music_item}
            </div>
            <div className='logout_box' onClick={logout}>
                logout
                <button></button>
            </div>
        </div>
        {modal_state_upd && <Modal_lib_upd playlist_id={selected_lib_id} closemodal={setModal_state_upd} />}
        {modal_state_del && <Modal_lib_del selected_lib={selected_lib} playlist_id={selected_lib_id} closemodal={setModal_state_del} />}
        {modal_state_add && <Modal_lib_add closemodal={setModal_state_add} setLib_list={setLib_list}/>}
        {modal_state_music_add && <Modal_music_item_add playlist_name={selected_lib} closemodal={setModal_state_music_add} />}
        {modal_state_music_del[0] && <Modal_music_item_del modal_state={modal_state_music_del} closemodal={setModal_state_music_del} />}

    </div>
  )
}

export default Librarypage

// 為了不要讓這一頁的 main component return 太長，所以把一部份的內容用另一個新的 component 包起來

const Lib_list_box = ({setModal_state_upd , setModal_state_del , setModal_state_add , library_list , check_lib , vis_auth}) => {
    return (
        <nav className='lib_list_box'>
            <div className='lib_list_box_title'>
                <h2>Library</h2>
                <div className='upd_lib_button_box'>
                    Upd
                    <button onClick={ () => vis_auth() && check_lib && setModal_state_upd(true)}>
                    </button>
                </div>
                <div className='del_lib_button_box'>
                    Del
                    <button onClick={ () => vis_auth() && check_lib && setModal_state_del(true)}>
                    </button>
                </div>
                <div className='add_lib_button_box'>
                    Add
                    <button onClick={ () => vis_auth() && setModal_state_add(true)}>
                    </button>
                </div>                                    
            </div>
            {library_list}
        </nav>
    )
}