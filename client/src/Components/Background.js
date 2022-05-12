import React from "react";

import './Background.scss'

export default class  Background extends React.Component {
    constructor(props) {
        super(props);
        this.spots = [
            {x: '3%', d: '150ms', r: -20, o: 0.5, t: '4.5s'},
            {x: '20%', d: '300ms', r: 5, o: 1, t: '3.1s'},
            {x: '30%', d: '400ms', r: -0, o: 1, t: '3.6s'},
            {x: '47%', d: '600ms', r: -0, o: 1, t: '3.8s'},
            {x: '52%', d: '500ms', r: -20, o: 1, t: '4.2s'},
            {x: '67%', d: '300ms', r: -0, o: 1, t: '3.1s'},
            {x: '77%', d: '200ms', r: -5, o: 1, t: '4s'},
            {x: '92%', d: '150ms', r: 0, o: 0.5, t: '4s'}, 
        ]

        this.flakes = [];
        for (let i = 0; i < 40; ++i) {
            this.flakes.push({});
        }

        this.state = {
            effect: '',
        };
    }

    componentDidUpdate(prevProps) {
        console.log(' coucou');
        if (prevProps.effect !== this.props.effect) {
            // trigger effect
            const apply = ((c) => {
                console.log(' Applying', c)
                this.setState({
                    ...this.state,
                    effect: c,
                });
            });
           
            this.setState({
                ...this.state,
                effect: '',
            }, () => {apply(this.props.effect)});
        }
    }

    render() {
        if (this.props.perfMode) {
            return (
                <div className="background static-background">
                </div>
            )
        }
        return (
            <div className={`background ${this.state.effect}`}>
                { this.spots.map((s, i) => {
                    return (
                        <div key={`spot-${i}`} className="spotlight-container" style={{left: s.x,opacity: s.o ,transform: `rotate(${s.r}deg)`}}> 
                            <div  className="spotlight" src="spotlight.png" style={{animationDelay: s.d, animationDuration: s.t}}></div>
                        </div>
                    )
                }) }
    
                { this.flakes.map((f, i) => {
    
                    return (
                        <div className="snowflake" key={`flake-${i}`}></div>
                    )
                }) }
            </div>
        )
    }
}
