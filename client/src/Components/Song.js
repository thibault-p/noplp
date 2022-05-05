import React from "react";
import TextBox from "./TextBox";

import "./Song.css";

export const STATE_LYRICS_NONE = 'none';
export const STATE_LYRICS_SUGGESTED = 'suggested';
export const STATE_LYRICS_FROZEN = 'frozen';
export const STATE_LYRICS_VALIDATE = ' validate';

export default class Song extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audioReady: false,
            lyricsReady: false,
            currentLine: -1,
        };
        this.audio = React.createRef();
        this.audioSource = React.createRef();
        this.lyrics = [];
        this.guessTimecode = 0;
        this.musicBedTimeout = null;
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps) {
        if (this.props.song.id !== prevProps.song.id) {
            this.reset();
            this.load();
        }
        this.startPlaying();
    }

    load() {
        this.reset();

        const parts = this.props.song.guess_timecode.split(':');
        this.guessTimecode = Math.floor((parseInt(parts[0]) * 60 + parseFloat(parts[1]))*100);

        this.audioSource.current.src = this.props.song.files.music;
        this.audio.current.load();

        const audioReadyCb = this.handleAudioReady.bind(this);
        this.audio.current.addEventListener('canplay', event => {
            audioReadyCb();
        });

        const timeUpdateCb = this.handleTimecodeUpdate.bind(this);
        this.audio.current.addEventListener('timeupdate', event => {
            timeUpdateCb();
        });

        const lyricsCb = this.loadLrcFile.bind(this);
        fetch(this.props.song.files.lyrics)
            .then(response => response.text())
            .then(data => {
                lyricsCb(data);
            });

    }

    reset() {
        this.props.jukebox('');

        if (this.audio.current) {
            this.audio.current.pause();
        }
        if (this.musicBedTimeout) {
            clearTimeout(this.musicBedTimeout);
        }
        this.lyrics = [];
        this.setState({
            audioReady: false,
            lyricsReady: false,
            currentLine: -1,
        });
    }

    handleAudioReady() {
        this.setState({
            ...this.state,
            audioReady: true,
        });
        this.startPlaying();
    }
    
    handleLyricsReady() {
        this.setState({
            ...this.state,
            lyricsReady: true,
        });
        this.startPlaying();
    }

    handleTimecodeUpdate() {
        if (!this.audio.current)
            return;

        const timecode = Math.floor(this.audio.current.currentTime * 100);
        const i = this.state.currentLine; 
        const nextCt = (i+1 < this.lyrics.length) ? this.lyrics[i+1].timecode : Number.MAX_VALUE;

        if (timecode > nextCt) {
            this.setState({
                ...this.state,
                currentLine: i + 1,
            });
        }

        if (this.guessTimecode < timecode) {
            this.audio.current.pause();
            const timeoutCb = () => {
                this.props.jukebox('bed');
            };
            this.musicBedTimeout = setTimeout(timeoutCb, 5000);
        }
    }

    loadLrcFile(file) {
        const lines = file.split('\n');
        for (let i in lines) {
            const line = lines[i].trim();
            if (line.length < 10)
                continue;
            if (line[0] !== '[' && line[9] !== ']')
                continue;
            const parts = line.slice(1, 9).split(':');
            const timecode = Math.floor((parseInt(parts[0]) * 60 + parseFloat(parts[1]))*100)  
            const content = line.slice(10);
            this.lyrics.push({
                timecode: timecode,
                content: content
            });
        }
        this.handleLyricsReady();
    }

    startPlaying() {
        if (!this.state.audioReady || !this.state.lyricsReady)
            return

        if (this.audio.current) {
            this.audio.current.play();
        }
    }

    render() {
        const header = (<TextBox className="song-info">
            <div className="song-title">{this.props.song.title}</div>
            <div className="song-artist">{this.props.song.artist}</div>
        </TextBox>);

        const suggestedLyrics = this.props.suggestedLyrics;

        if (suggestedLyrics.state !== STATE_LYRICS_NONE && this.props.song.guess_line === this.state.currentLine) {
            const previousLine = this.lyrics[this.state.currentLine - 1].content;
            const correctWords = this.lyrics[this.state.currentLine].content.split(' ');

            const words = suggestedLyrics.content.split(' ').map((w,i) => {
                let wordClass = '';
                if (suggestedLyrics.state === STATE_LYRICS_FROZEN) {
                    wordClass = 'freeze';
                } else if (suggestedLyrics.state === STATE_LYRICS_VALIDATE) {
                    wordClass = ' bad';
                    if (i < correctWords.length && correctWords[i].toUpperCase() === w.toUpperCase()) {
                        wordClass = 'good';
                    }
                }
                return (
                    <span className={`lyrics-word ${wordClass}`} key={`word-${i}`}>{`${w} `}</span>
                )
            });
            return (
                <>
                    {header}
                    <div>
                        <TextBox content={previousLine}></TextBox>
                        <TextBox>{words}</TextBox>
                    </div>
                </>
            )
        }

        let content = ' ';
        if (this.state.currentLine >= 0) {
            content = this.lyrics[this.state.currentLine].content;
        }

        const hidden = this.props.song.guess_line === this.state.currentLine;

        return (
            <>
                <audio ref={this.audio}>
                    <source ref={this.audioSource} src=""></source>
                </audio>
                { header }
                <TextBox content={content} hidden={hidden} className="song-lyrics" ></TextBox>
            </>
        )
    }
}
