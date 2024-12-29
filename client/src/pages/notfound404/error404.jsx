import React from 'react'
import './error404.css'
import errimg from '../../assets/undraw_page-not-found_6wni.svg'

function error404() {
    return (
        <div className='err-main-con'>
            
            <div className='err-head-con'>
                <h1>Sorry, Page Not Found!</h1>
            </div>

            <div className='err-img-con'>
                <img src={errimg} alt="" />
            </div>
        </div>
    )
}

export default error404