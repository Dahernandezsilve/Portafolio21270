import React from "react"
import {header, profileImage, textT, textDivider} from './Header.module.css'

const Header = () => {
    return (
      <div className={header}>
        <img src="/profile3.jpg" className={profileImage} alt="Profile"/>
        <p className={textT}>I am a student at the Universidad del Valle de Guatemala 🏛️, pursuing a degree in Computer Science Engineering 😉. I am dedicated to continuous learning and staying updated with emerging technologies 🔬. I am excited to contribute to innovative solutions that positively impact society🎯 and I am confident in my ability to succeed in the field of computer science ✅.</p>
        <p className={textDivider}>PROJECTS</p>
      </div>
    )
}

export default Header
