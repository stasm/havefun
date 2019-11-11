import * as React from "react";
import {State} from "./state";

export function Master({instr, change}: {instr: State; change: (evt: React.ChangeEvent) => void}) {
    return (
        <form className="group">
            <h2>Master</h2>
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
                                value={instr.gain_amount}
                                onChange={change}
                            />
                            Amnt
                        </label>
                    </div>
                </div>
                <div className="group">
                    <label>
                        <input
                            type="checkbox"
                            name="filter-enabled"
                            checked={instr.filter_enabled}
                            onChange={change}
                        />{" "}
                        Filter
                    </label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="filter-freq"
                                min="0"
                                max="15"
                                step="1"
                                value={instr.filter_freq}
                                onChange={change}
                            />
                            Freq
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="filter-q"
                                min="0"
                                max="15"
                                step="1"
                                value={instr.filter_q}
                                onChange={change}
                            />
                            Q
                        </label>
                        <div>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="filter-type"
                                    value="lowpass"
                                    checked={instr.filter_type === "lowpass"}
                                    onChange={change}
                                />
                                Lowpass
                            </label>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="filter-type"
                                    value="highpass"
                                    checked={instr.filter_type === "highpass"}
                                    onChange={change}
                                />
                                Highpass
                            </label>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="filter-type"
                                    value="bandpass"
                                    checked={instr.filter_type === "bandpass"}
                                    onChange={change}
                                />
                                Bandpass
                            </label>
                            <label className="horizontal">
                                <input
                                    type="checkbox"
                                    name="filter-detune-lfo"
                                    checked={instr.filter_detune_lfo}
                                    onChange={change}
                                />
                                LFO
                            </label>
                        </div>
                    </div>
                </div>
                <div className="group">
                    <label>
                        <input
                            type="checkbox"
                            name="lfo-enabled"
                            checked={instr.lfo_enabled}
                            onChange={change}
                        />{" "}
                        LFO
                    </label>
                    <div className="row">
                        <label className="vertical">
                            <input
                                type="range"
                                name="lfo-amount"
                                min="0"
                                max="15"
                                value={instr.lfo_amount}
                                onChange={change}
                            />
                            Amnt
                        </label>
                        <label className="vertical">
                            <input
                                type="range"
                                name="lfo-freq"
                                min="0"
                                max="15"
                                value={instr.lfo_freq}
                                onChange={change}
                            />
                            Freq
                        </label>
                        <div>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="lfo-type"
                                    value="sine"
                                    checked={instr.lfo_type === "sine"}
                                    onChange={change}
                                />
                                Sine
                            </label>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="lfo-type"
                                    value="square"
                                    checked={instr.lfo_type === "square"}
                                    onChange={change}
                                />
                                Square
                            </label>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="lfo-type"
                                    value="sawtooth"
                                    checked={instr.lfo_type === "sawtooth"}
                                    onChange={change}
                                />
                                Sawtooth
                            </label>
                            <label className="horizontal">
                                <input
                                    type="radio"
                                    name="lfo-type"
                                    value="triangle"
                                    checked={instr.lfo_type === "triangle"}
                                    onChange={change}
                                />
                                Triangle
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
