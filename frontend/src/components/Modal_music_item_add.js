import React from 'react'
import { api_url } from '../environment.js'

const Modal_music_item_add = ({playlist_name , closemodal}) => {

  const handleSubmit = async (e) => {

    e.preventDefault()
    const elements = e.target.elements;
    const audio_urls = elements.new_url.value

    const requestData = {
      audio_urls: audio_urls,
      playlist_name: playlist_name,
    };

    const requestJson = JSON.stringify(requestData);

    try { const response = await fetch( api_url + '/music_item/get/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: requestJson,
    });
    } catch (ex) {
      console.error('POST error!');
    }

    await closemodal(false)

    window.location.reload()
    
  }

  return (
    <div className="modalHead">
        <div className='modalBackground'></div>
        <div className="modalContainer">
            <div className='modalContainer_background'></div>
            <form onSubmit={handleSubmit}>
                <div className='modal_title_url'>Video url :</div>
                <br></br>
                <input type='text' name='new_url'></input>
                <br></br>
                <div className='yes_box' >
                  add url
                  <button  type="submit"></button>
                </div>
                <div className='no_box' onClick={() => closemodal(false)}>cancel
                </div>
            </form>
        </div>
    </div>
  )
}

export default Modal_music_item_add
