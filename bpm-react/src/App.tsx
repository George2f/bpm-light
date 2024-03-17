import { useEffect, useState } from 'react';
import { cn } from './utils/cn';
import ColorSelector from './components/ColorSelector';
import Joyride from 'react-joyride';
import MainMenu from './components/MainMenu';
import Blinker from './components/Blinker';
import JOYRIDE_STEPS from './constants/joyrideSteps';
import { BLINKER_COLORS, BLINKER_COLORS_2 } from './constants/blinkerColors';

export default function App() {
    const [bpm, setBpm] = useState(140);
    const [beat, setBeat] = useState(true);
    const [canRunTutorial, setCanRunTutorial] = useState(false);
    const [offBeat, setOffBeat] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [colorIndex, setColorIndex] = useState([0, 0]);
    const [split, setSplit] = useState<number>(1);
    const [colorSelectorOpen, setColorSelectorOpen] = useState<
        boolean | number
    >(false);
    const [menuVisible, setMenuVisible] = useState(true);
    const [randomizeColors, setRandomizeColors] = useState(false);

    useEffect(() => {
        setCanRunTutorial(localStorage.getItem('visitedPreviously') !== 'true');
        setTimeout(
            () => localStorage.setItem('visitedPreviously', 'true'),
            10000
        );
    }, []);

    useEffect(() => {
        const interval = setInterval(
            () => {
                if (isBlinking) {
                    setColorIndex((old) => {
                        let index1 = old[0];
                        let index2 = old[1];

                        if (randomizeColors) {
                            const newIndex1 = Math.floor(
                                Math.random() * BLINKER_COLORS.length
                            );
                            let newIndex2 = Math.floor(
                                Math.random() * BLINKER_COLORS_2.length
                            );
                            if (
                                BLINKER_COLORS[newIndex1] ===
                                BLINKER_COLORS_2[newIndex2]
                            ) {
                                newIndex2 = newIndex2 - 1;
                            }
                            index1 = newIndex1;
                            index2 = newIndex2;
                        }
                        return [index1, index2];
                    });

                    setBeat(true);
                    setTimeout(
                        () => {
                            setBeat(false);
                        },
                        (60 / bpm) * 250
                    );

                    setTimeout(
                        () => {
                            setOffBeat(true);
                        },
                        (60 / bpm) * 500
                    );
                    setTimeout(
                        () => {
                            setOffBeat(false);
                        },
                        (60 / bpm) * 750
                    );
                }
            },
            (60 / bpm) * 1000
        );

        return () => clearInterval(interval);
    }, [bpm, isBlinking, randomizeColors]);

    return (
        <div
            className={cn('flex h-full w-full flex-col items-center')}
            style={{ backgroundColor: 'black' }}>
            <button
                onClick={() => setMenuVisible((v) => !v)}
                className={cn('grid h-full w-full grid-cols-1', {
                    'grid-cols-2': split === 2 || split === 4,
                })}
                id="button-main"
                tabIndex={-1}>
                <Blinker
                    isBlinking={isBlinking && !colorSelectorOpen}
                    beat={beat}
                    offBeat={offBeat}
                    split={split}
                    color1={BLINKER_COLORS[colorIndex[0]]}
                    color2={BLINKER_COLORS_2[colorIndex[1]]}
                />
            </button>
            {colorSelectorOpen ? (
                <div className="fixed left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center">
                    <button
                        onClick={() => setColorSelectorOpen(false)}
                        className="fixed left-0 top-0 -z-10 h-full w-full bg-black opacity-30"
                    />

                    <ColorSelector
                        colors={
                            colorSelectorOpen === 1
                                ? BLINKER_COLORS
                                : BLINKER_COLORS_2
                        }
                        onChange={(ci) => {
                            if (colorSelectorOpen === 1) {
                                setColorIndex([ci, colorIndex[1]]);
                            } else {
                                setColorIndex([colorIndex[0], ci]);
                            }
                            setColorSelectorOpen(false);
                        }}
                    />
                </div>
            ) : null}
            {menuVisible ? (
                <MainMenu
                    onColor1Click={() => {
                        setRandomizeColors(false);
                        setColorSelectorOpen(1);
                    }}
                    onColor2Click={() => {
                        setRandomizeColors(false);
                        setColorSelectorOpen(2);
                    }}
                    onRandomizeColorsClick={() => {
                        setRandomizeColors((v) => !v);
                    }}
                    onSplitColorsClick={() => {
                        setSplit((v) => (split === 4 ? 1 : v * 2));
                    }}
                    onBPMChange={(v) => setBpm(v)}
                    onTutorialClick={() => setCanRunTutorial(true)}
                    onBPMMinusClick={() => setBpm((v) => Math.max(1, v - 1))}
                    onPlayClick={() => setIsBlinking((v) => !v)}
                    onBPMPlusClick={() => setBpm((v) => Math.min(3600, v + 1))}
                    randomizeColors={randomizeColors}
                    split={split}
                    bpm={bpm}
                    isBlinking={isBlinking}
                    runTutorial={canRunTutorial}
                />
            ) : null}
            <Joyride
                run={canRunTutorial}
                continuous
                showProgress
                showSkipButton
                styles={{
                    options: {
                        zIndex: 200,
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                steps={JOYRIDE_STEPS}
            />
        </div>
    );
}
