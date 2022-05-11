import React from 'react';
import TextBox from './TextBox';

export default function Categories(props) {
    props.jukebox('bed');
    return (
        <>
            {props.categories.map((category, i) => <TextBox content={category} key={i} />)}
        </>
    )
}