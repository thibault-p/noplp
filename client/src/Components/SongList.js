import React from "react";
import TextBox from "./TextBox";

import './SongList.css';

export default function SongList(props) {
    props.jukebox('bed');
    return (
        <>
            <TextBox content={props.title} className="category-name"></TextBox>
            {props.songs.map((song, i) => (<TextBox disabled={song.picked} key={i} >
                    <div>{song.title} </div>
                    <div className="song-artist">{song.artist} </div>
                </TextBox>))}
        </>
    )
}
