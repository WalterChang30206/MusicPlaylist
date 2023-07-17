import React from 'react'

const Modal_music_item_del = ({modal_state,closemodal}) => {

  const api_url = process.env.API_URL

  const handleSubmit = async (e) => {

    e.preventDefault()
    
    try { const response = await fetch( api_url + '/music_item/del/' + modal_state[1] +'/', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    })

    } catch (ex) {
      console.error('POST error!');
    }
    

    await closemodal([false,0])

    window.location.reload();
  }

  return (
    <div className="modalHead">
        <div className='modalBackground'></div>
        <div className="modalContainer_lib_del">
            <div className='modalContainer_background'></div>
            <form onSubmit={handleSubmit}>
                <div className='modal_title_del_box'>
                  <div>Delete music item :</div>
                  <div className='modal_deleted_music'>{modal_state[2]}</div>
                </div>
                <br></br>
                <div className='yes_box' >
                  delete
                  <button  type="submit"></button>
                </div>
                <div className='no_box' onClick={() => closemodal([false,0])}>cancel
                </div>
            </form>
        </div>
    </div>
  )
}

export default Modal_music_item_del
