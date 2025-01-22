import React from 'react'
import './error404.css'
import errimg from '../../assets/undraw_page-not-found_6wni.svg'

function error404() {
    return (
        <div className='err-main-con'>

            <div className='err-head-con'>
                <h1>Page Not Found!</h1>
            </div>

            <div className='err-img-con'>
                <img loading="lazy" src={errimg} alt="" />
            </div>

            <div className='err-txt-con'>
                <span>
                    Check for spelling errors in the URL, or go to the home page.
                </span>
            </div>
        </div>
    )
}

export default error404