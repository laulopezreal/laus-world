import { useEffect, useState } from 'react';
import { useTheme } from '../lib/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();
    // We use a local state to delay the animation application on first render
    // to prevent it from animating on page load
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="toggle-container opacity-0"> </div>
        );
    }

    return (
        <div className='toggle-container'>
            <div className={`box ${isDark ? 'boxedin' : 'boxedout'}`}>
                <label className={`switch ${isDark ? 'switchedin' : 'switchedout'}`} onClick={toggleTheme}>
                    <div className={`yoke ${isDark ? 'yoked' : 'unyoked'}`}></div>
                </label>
            </div>
        </div>
    );
}
