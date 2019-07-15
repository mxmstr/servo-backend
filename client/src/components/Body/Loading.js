import React from 'react';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
`;

class Loading extends React.Component{
    render() {
        return(
            <ClipLoader
                css={override}
                sizeUnit={"px"}
                size={50}
                color={'#123abc'}
                loading={ true }
            />
        );
    }
}

export default Loading;