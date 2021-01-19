import React, { memo, FC } from 'react';
import { Skeleton } from 'antd';

export const LoadingPage: FC = memo((props) => {
    // console.log('loading', props)
    return (
        <>
            <Skeleton active />
        </>
    )
});

