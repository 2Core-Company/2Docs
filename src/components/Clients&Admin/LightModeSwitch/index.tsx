'use client'
import React, { useContext } from 'react';
import './switchStyle.css'
import * as Switch from '@radix-ui/react-switch';
import { themeContext } from "../../../hooks/useTheme"

function LightModeSwitch() {
    const { theme, setTheme } = useContext(themeContext);

    return(
        <form>            
                {theme == "light" ? (
                    //!Light Mode
                    <div className="absolute right-5 top-5 cursor-pointer" >
                        <label className="text-black" htmlFor="airplane-mode" style={{ paddingRight: 15 }} >
                            Dark Mode
                        </label>
                        <Switch.Root onClick={() => {setTheme("dark")}} className="SwitchRoot" id="airplane-mode" checked={false} >
                            <Switch.Thumb className="SwitchThumb" />
                        </Switch.Root>
                    </div>
                ) : (
                    //!Dark Mode
                    <div className="absolute right-5 top-5 cursor-pointer" >                        
                        <label className="text-white" htmlFor="airplane-mode" style={{ paddingRight: 15 }}>
                            Dark Mode
                        </label>
                        <Switch.Root onClick={() => {setTheme("light")}} className="SwitchRoot" style={{backgroundColor: '#fff'}} id="airplane-mode" checked={true} >
                            <Switch.Thumb className="SwitchThumb" style={{backgroundColor: '#000'}}/>
                        </Switch.Root>
                    </div>
                )}            
        </form>
    )
}

export default LightModeSwitch;