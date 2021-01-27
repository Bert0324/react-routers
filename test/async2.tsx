import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

export const AsyncTwoComponent: FC = () => {
    return (
        <div style={{ height: '80vh', width: '80vw', backgroundColor: 'blue' }}>
            <Link to='/page2/page3'>
                page2
            </Link>
        </div>
    )
}