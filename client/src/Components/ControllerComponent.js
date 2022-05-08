import React from "react";

import ClientComponent from "./ClientComponent";

export default class ControllerComponent extends ClientComponent {
    constructor(props) { 
        super(props);
        this.state = {
            playlist: {},
            pickedSongs: [],
            pickedCategories: [],
            proposedLyrics: '',
        };

        this.handleToIntro = this.handleToIntro.bind(this);
        this.handleToSongList = this.handleToSongList.bind(this);
        this.handleToSong = this.handleToSong.bind(this);
        this.handleToCategories = this.handleToCategories.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleProposeLyrics = this.handleProposeLyrics.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleLyricsFreeze = this.handleLyricsFreeze.bind(this);
        this.handleLyricsValidate = this.handleLyricsValidate.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        // load playlist
        const playlistCb = this.setPlaylist.bind(this);
        fetch('/playlist.json')
            .then(response => response.json())
            .then((data) => {
                playlistCb(data);
            });
    }

    setPlaylist(data) {
        this.setState({
            ...this.state,
            playlist: data
        });
    }

    handleReset() {
        console.log('Reseting');
        this.setState({
            ...this.state,
            pickedSongs: [],
            pickedCategories: [],
        });
    }

    handleToIntro() {
        this.socket.emit('show-intro');
    }

    handleToCategories() {
        const categories = this.state.playlist.categories.map(c => c.name).sort();
        console.log(categories);
        this.socket.emit('show-categories', categories);
    }

    handleToSongList(categoryId) {
        console.log(categoryId);
        if (categoryId) {
            this.setState({
                ...this.state,
                pickedCategories: [...this.state.pickedCategories, categoryId]
            });
        }
        console.log(this.state)
        const songs = this.state.playlist.songs.filter(s => {
            return categoryId === undefined | s.category === categoryId;
        }).map(s => {
            console.log(s.id, this.state.pickedSongs, s.id in this.state.pickedSongs)
            return {
                picked: this.state.pickedSongs.indexOf(s.id) !== -1,
                title: s.title,
                artist: s.artist,
                year: s.year,
            }
        }).sort();
        console.log(songs)
        const categoryName = categoryId === undefined ? 'Toutes' : this.state.playlist.categories.find(c => c.id === categoryId).name;
        console.log(categoryId, categoryName)
        this.socket.emit('show-song-list', {
            name: categoryName,
            songs: songs
        });
    }

    handleToSong(id) {
            this.setState({
                ...this.state,
                pickedSongs: [...this.state.pickedSongs, id]
            });
        console.log(this.state);
        const song = this.state.playlist.songs.find(song => song.id === id);
        console.log('goto song', song);
        this.socket.emit('goto-song', song);
    }

    handleProposeLyrics() {
        const lyrics = this.state.proposedLyrics;
        console.log(' propose Lyrics', lyrics);
        this.socket.emit('propose-lyrics', lyrics);
    }
    
    handleInput(evt) {
        this.setState({
            ...this.state,
            proposedLyrics: evt.target.value,
        });
    }
    
    handleLyricsFreeze() {
        this.proposedLyricsRef.value = '';
        this.socket.emit('freeze-lyrics');
    }

    handleLyricsValidate() { 
        this.socket.emit('validate-lyrics');
    }

    render() {
        const songList = this.state.playlist.songs || [];
        const songsElements = songList.map(song => {
            return (<button key={song.id} onClick={() => this.handleToSong(song.id)}>Go to "{song.title}"</button>)
        }); 

        const categories = this.state.playlist.categories || [];
        const categoriesElements = categories.map(cat => {
            return (<button key={cat.id} onClick={() => this.handleToSongList(cat.id)}>Go to "{cat.name}"</button>);
        })

        return (
            <>
                <button onClick={this.handleToIntro}>To intro</button>
                <button onClick={() => this.handleToSongList()}>To Song list</button>
                <button onClick={this.handleToCategories}>To Categories</button>
                {categoriesElements}
                {songsElements}

                <div>
                    <input  placeholder="Propose lyrics" 
                            ref={el => this.proposedLyricsRef = el} 
                            onChange={this.handleInput} />
                    <button onClick={this.handleProposeLyrics}>Propose Lyrics</button>
                    <button onClick={this.handleLyricsFreeze}>Freeze</button>
                    <button onClick={this.handleLyricsValidate}>Validate</button>
                </div>


                <button onClick={this.handleReset}>!!!! RESET !!!!</button>
            </>
        )
    }
}
