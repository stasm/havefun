import * as React from "react";

export function Oscillator() {
    return (
        <form className="group">
            <h2>Oscillator 1</h2>
            <div className="row">
                <div className="group">
                    <label>Type</label>
                    <div>
                        <label className="horizontal">
                            <input type="radio" name="osc1-type" value="sine" checked />
                            Sine
                        </label>
                        <label className="horizontal">
                            <input type="radio" name="osc1-type" value="square" />
                            Square
                        </label>
                        <label className="horizontal">
                            <input type="radio" name="osc1-type" value="sawtooth" />
                            Sawtooth
                        </label>
                        <label className="horizontal">
                            <input type="radio" name="osc1-type" value="triangle" />
                            Triangle
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Gain</label>
                    <div className="row">
                        <label className="vertical">
                            <input type="range" name="osc1-gain-amount" min="0" max="15" step="1" />
                            Amnt
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Gain Envelope</label>
                    <div className="row">
                        <label className="vertical">
                            <input type="range" name="osc1-gain-attack" min="0" max="15" step="1" />
                            Atck
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="osc1-gain-sustain"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Sust
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="osc1-gain-release"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Rels
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Detune</label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="osc1-detune-amount"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Cents
                        </label>
                        <div>
                            <label className="horizontal">
                                <input type="checkbox" name="osc1-detune-lfo" />
                                LFO
                            </label>
                        </div>
                    </div>
                </div>
                <div className="group">
                    <label>
                        <input type="checkbox" name="osc1-freq-env" /> Frequency Envelope
                    </label>
                    <div className="row">
                        <label className="vertical">
                            <input type="range" name="osc1-freq-attack" min="0" max="15" step="1" />
                            Atck
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="osc1-freq-sustain"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Sust
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="osc1-freq-release"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Rels
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}
