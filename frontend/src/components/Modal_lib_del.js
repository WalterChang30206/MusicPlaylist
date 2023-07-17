import React from 'react'

const Modal_lib_del = ({selected_lib , playlist_id , closemodal}) => {

  const api_url = process.env.API_URL

  const handleSubmit = async (e) => {

    e.preventDefault()
    
    try {  const response = await fetch( api_url + '/library/upd_del/' + playlist_id + '/' , {
      method: 'DELETE',
      headers: {
        'Content-type':'application/json',
      },
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
        <div className="modalContainer_lib_del">
            <div className='modalContainer_background'></div>
            <form onSubmit={handleSubmit}>
                <div className='modal_title_del_box'>
                  <div >Delete playlist :</div>
                  <br></br>
                  <div className='modal_deleted_lib'>{selected_lib} ?</div>
                </div>
                <br></br>
                <div className='yes_box' >
                  delete
                  <button  type="submit"></button>
                </div>
                <div className='no_box' onClick={() => closemodal(false)}>cancel
                </div>
            </form>
        </div>
    </div>
  )
}

export default Modal_lib_del
