import React, { memo } from 'react';
import { Skeleton } from 'antd';

export const LoadingPage: React.FC = memo(() => (
    <>
        <Skeleton active />
    </>
));

