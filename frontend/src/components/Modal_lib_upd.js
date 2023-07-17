import React from 'react'

const Modal_lib_upd = ({playlist_id , closemodal}) => {

  const api_url = process.env.REACT_APP_API_URL

  const handleSubmit = async (e) => {

    e.preventDefault()
    const elements = e.target.elements;
    const requestData = {
      playlist_name: elements.new_library.value,
      id: playlist_id,
    }
    console.log(playlist_id)
    const requestJson = JSON.stringify(requestData)

    try { const response = await fetch( api_url + "/library/upd_del/" + playlist_id + "/",
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: requestJson,
    })
    } catch (ex) {
      console.error("POST error!");
    }

    await closemodal(false)

    window.location.reload();
  }

  return (
    <div className="modalHead">
        <div className='modalBackground'></div>
        <div className="modalContainer">
            <div className='modalContainer_background'></div>
            <form onSubmit={handleSubmit}>
                <div className='modal_title_upd'>Updated Playlist Name :</div>
                <br></br>
                <input type='text' name='new_library'></input>
                <br></br>
                <div className='yes_box' >
                  update playlist
                  <button  type="submit"></button>
                </div>
                <div className='no_box' onClick={() => closemodal(false)}>cancel
                </div>
            </form>
        </div>
    </div>
  )
}

export default Modal_lib_upd
