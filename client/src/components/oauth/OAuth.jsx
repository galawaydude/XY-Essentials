import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    return (
        <>
            <p className='mainbtn googlebtn' type='button'>
                <i className="fa-brands fa-google tag-icon"></i> Continue with Google
            </p>
        </>
    );
}