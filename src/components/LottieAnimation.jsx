import React from 'react'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import dot from "../assets/qz603DQ5hn.json"
const LottieAnimation = () => {
    return (
        <div>
            <Player
                autoplay
                loop
                src={dot}
                style={{ height: '80px', width: '80px',  }}
            >
                {/* <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} /> */}
            </Player>
        </div>
    )
}

export default LottieAnimation