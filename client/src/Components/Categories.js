import React from 'react';
import TextBox from './TextBox';

export default function Categories(params) {
    return (
        <>
            {params.categories.map((category, i) => <TextBox content={category} key={i} />)}
        </>
    )
}