import React from "react";

import Background from "./Background";
import Categories from "./Categories";
import ClientComponent from "./ClientComponent";
import Logo from "./Logo";
import Song, {STATE_LYRICS_FROZEN, STATE_LYRICS_NONE, STATE_LYRICS_VALIDATE, STATE_LYRICS_SUGGESTED, STATE_LYRICS_REVEAL} from "./Song";
import SongList from "./SongList";

const STATE_LOADING = 'loading';
const STATE_INTRO = 'intro';
const STATE_SONGLIST = 'songlist';
const STATE_CATEGORIES = 'categories';
const STATE_SONG = 'song';

export default class TerminalComponent extends ClientComponent {
    constructor(props) { 
        super(props);
        this.state = {
            ...this.state,
            current: STATE_LOADING,
            suggestedLyrics: {
                content: '',
                state: STATE_LYRICS_NONE,
            },
            payload: {},
            backgroundType: 'good',
        };
        this.soundRefs = {
            intro: { ref: React.createRef(), volume: 1 },
            bed: { ref: React.createRef(), volume: 0.5 },
            good: { ref: React.createRef(), volume: 1 },
            freeze: { ref: React.createRef(), volume: 1 },
            bad: { ref: React.createRef(), volume: 1 },
            introBed: { ref: React.createRef(), volume: 0.3 },
        };

        this.playSound = this.playSound.bind(this);
        this.handleFlashColor = this.handleFlashColor.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        
        const switchToCb = this.switchTo.bind(this);

        this.socket.on('to-intro', () => {
            switchToCb(STATE_INTRO);
            this.playSound('intro')
        });

        this.socket.on('to-song-list', data => {
            switchToCb(STATE_SONGLIST,  data);
        });

        this.socket.on('to-song', data => {
            this.playSound('');
            switchToCb(STATE_SONG, data);
        });

        this.socket.on('to-categories', data => {
            switchToCb(STATE_CATEGORIES, data);
        });

        this.socket.on('show-suggested-lyrics', data => {
            this.handleSuggestedLyrics(STATE_LYRICS_SUGGESTED ,data);
        });

        this.socket.on('freeze-lyrics', () => {
            this.handleSuggestedLyrics(STATE_LYRICS_FROZEN, '');
        });

        this.socket.on('validate-lyrics', () => {
            this.handleSuggestedLyrics(STATE_LYRICS_VALIDATE, '');
        });

        this.socket.on('reveal-lyrics', () => {
            this.handleSuggestedLyrics(STATE_LYRICS_REVEAL, '');
        });
    }

    playSound(sound) {
        // Stop all playing sound
        for (let k in this.soundRefs) {
            const ref = this.soundRefs[k].ref.current;
            if (ref !== null){
                console.log('Stop', ref);
                ref.pause();
            }
        }
        if (sound === '')
            return;

        const ref = this.soundRefs[sound].ref.current;
            if (ref !== null) {
                console.log('Play', ref);
                ref.volume = this.soundRefs[sound].volume;
                ref.play();
            }
    }

    switchTo(action, payload) {
        this.setState({
            ...this.state,
            payload: payload,
            current: action,
            backgroundType: '',
            suggestedLyrics: {
                content: '',
                state: STATE_LYRICS_NONE,
            }
        });
    }

    handleSuggestedLyrics(state, payload) {
        if (this.state.current !== STATE_SONG)
            return;
        let content = this.state.suggestedLyrics.content;
        if (state === STATE_LYRICS_SUGGESTED) {
            content = payload;
        }
        this.setState({
            ...this.state,
            suggestedLyrics: {
                content: content,
                state: state,
            },
        });
        console.log(payload)
    }

    _renderLoading() {
        return (
            <div className="waiting">
                <div>Attente de la régie </div>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        );
    }

    handleFlashColor(color) {
        this.setState({
            ...this.state,
            backgroundType: color,
        });
    }

    render() {
        let content;
        let background = (<Background effect={this.state.backgroundType} />);
        if (this.state.current === STATE_LOADING) {
            background = undefined;
            content =  this._renderLoading();
        } else if (this.state.current === STATE_INTRO) {
            content = (<Logo />)
        } else if (this.state.current === STATE_SONGLIST) {
            content = (<SongList title={this.state.payload.name} songs={this.state.payload.songs} jukebox={this.playSound} />);
        } else if (this.state.current === STATE_SONG) {
            content = (<Song 
                colorFlash={this.handleFlashColor}
                song={this.state.payload} 
                suggestedLyrics={this.state.suggestedLyrics} 
                jukebox={this.playSound} />);
        } else if (this.state.current === STATE_CATEGORIES) {
            content = (<Categories categories={this.state.payload} jukebox={this.playSound} />)
        }

        return (
            <>
                <audio src="/generique.mp3" ref={this.soundRefs.intro.ref} onEnded={() => this.playSound('introBed')}></audio>
                <audio src="/intro_bed.mp3" loop={true} ref={this.soundRefs.introBed.ref}></audio>
                <audio src="/waiting.mp3" loop={true} ref={this.soundRefs.bed.ref}></audio>
                <audio src="/win.mp3" ref={this.soundRefs.good.ref}></audio>
                <audio src="/win.mp3" ref={this.soundRefs.bad.ref}></audio>
                <audio src="/freeze.mp3" ref={this.soundRefs.freeze.ref}></audio>
                {background}
                <div>
                    {content}
                </div>
            </>
        )
    }
}
