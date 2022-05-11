import React from "react";
import socketIOClient from "socket.io-client";

import "./ClientComponent.css"

export default class ClientComponent extends React.Component {
    constructor(props) { 
        super(props);
        this.socket = null;
    }

    componentDidMount() {
        // Install communication
        if (this.socket === null) {
            console.log('Open connexion to', process.env.REACT_APP_WEBSOCKET_SERVER);
            this.socket = socketIOClient(process.env.REACT_APP_WEBSOCKET_SERVER);
        }
    }

    componentWillUnmount() {
        if (this.state.socket)
            this.state.socket.disconnect();
    }
}
