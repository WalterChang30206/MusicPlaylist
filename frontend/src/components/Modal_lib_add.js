import React from 'react'


const Modal_lib_add = ({closemodal , setLib_list}) => {

  const api_url = process.env.API_URL

  const handleSubmit = async (e) => {

    e.preventDefault()
    const elements = e.target.elements;
    const requestData = {
      playlist_name: elements.new_library.value,
    }

    const requestJson = JSON.stringify(requestData)
    const user_email = localStorage.getItem('user_email')


    try { const response = await fetch( api_url + "/library/" + user_email + '/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: requestJson,
    });
    } catch (ex) {
      console.error("POST error!");
    }
    
    await closemodal(false);

    window.location.reload();
  };

  return (
    <div className="modalHead">
        <div className='modalBackground'></div>
        <div className="modalContainer">
            <div className='modalContainer_background'></div>
            <form onSubmit={handleSubmit}>
                <div className='modal_title_add'>Add Playlist Name :</div>
                <br></br>
                <input type='text' name='new_library'></input>
                <br></br>
                <div className='yes_box' >
                  add playlist
                  <button  type="submit"></button>
                </div>
                <div className='no_box' onClick={() => closemodal(false)}>cancel
                </div>
            </form>
        </div>
    </div>
  )
}

export default Modal_lib_add
