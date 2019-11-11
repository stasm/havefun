import * as React from "react";

export function Noise() {
    return (
        <form className="group">
            <h2>Noise</h2>
            <div className="row">
                <div className="group">
                    <label>Gain</label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="noise-gain-amount"
                                value="0"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Amnt
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>Gain Envelope</label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="noise-gain-attack"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Atck
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="noise-gain-sustain"
                                min="0"
                                max="15"
                                step="1"
                            />
                            Sust
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="noise-gain-release"
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
