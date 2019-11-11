import * as React from "react";
import {NoiseSource} from "./state";

export function Noise({
    source,
    change,
}: {
    source: NoiseSource;
    change: (evt: React.ChangeEvent) => void;
}) {
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
                                name="gain-amount"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_amount}
                                onChange={change}
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
                                name="gain-attack"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_attack}
                                onChange={change}
                            />
                            Atck
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="gain-sustain"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_sustain}
                                onChange={change}
                            />
                            Sust
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="gain-release"
                                min="0"
                                max="15"
                                step="1"
                                value={source.gain_release}
                                onChange={change}
                            />
                            Rels
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}
