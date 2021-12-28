import React from 'react';
import ReactLoading from 'react-loading';

const Loading = ({ type, color }) => (
    <ReactLoading type={'bubbles'} color={'cyan'} height={200} width={200} />
);

export default Loading;