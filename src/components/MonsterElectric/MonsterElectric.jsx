/* eslint-disable no-unused-expressions */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-plusplus */
/* eslint-disable new-cap */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-multi-assign */
/* eslint-disable max-classes-per-file */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-unused-vars */
import React from 'react'
import './MonsterElectric.css'
import TitleP from '../TitleP/TitleP'
import Skills from '../Skills/Skills'
import Header from '../Header/Header'

const MonsterElectric = () => {
  window.requestAnimFrame = function () {
    return (
      window.requestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.oRequestAnimationFrame
          || window.msRequestAnimationFrame
          || function (callback) {
            window.setTimeout(callback)
          }
    )
  }

  function init(elemid) {
    const canvas = document.getElementById(elemid)
    const c = canvas.getContext('2d')
    const w = (canvas.width = window.innerWidth)
    const h = (canvas.height = window.innerHeight * 5.5)
    c.fillStyle = 'rgba(30,30,30,1)'
    c.fillRect(0, 0, w, h)
    return { c, canvas }
  }

  window.onload = function () {
    const { c } = init('canvas')
    const { canvas } = init('canvas')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight * 7)
    const mouse = { x: false, y: false }
    const lastMouse = {}

    function dist(p1x, p1y, p2x, p2y) {
      return Math.sqrt((p2x - p1x) ** 2 + (p2y - p1y) ** 2)
    }

    class segment {
      constructor(parent, l, a, first) {
        this.first = first
        if (first) {
          this.pos = {
            x: parent.x,
            y: parent.y,
          }
        } else {
          this.pos = {
            x: parent.nextPos.x,
            y: parent.nextPos.y,
          }
        }
        this.l = l
        this.ang = a
        this.nextPos = {
          x: this.pos.x + this.l * Math.cos(this.ang),
          y: this.pos.y + this.l * Math.sin(this.ang),
        }
      }

      update(t) {
        this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x)
        this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI)
        this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI)
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang)
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang)
      }

      fallback(t) {
        this.pos.x = t.x
        this.pos.y = t.y
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang)
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang)
      }

      show() {
        c.lineTo(this.nextPos.x, this.nextPos.y)
      }
    }

    class tentacle {
      constructor(x, y, l, n, a) {
        this.x = x
        this.y = y
        this.l = l
        this.n = n
        this.t = {}
        this.rand = Math.random()
        this.segments = [new segment(this, this.l / this.n, 0, true)]
        for (let i = 1; i < this.n; i++) {
          this.segments.push(
            new segment(this.segments[i - 1], this.l / this.n, 0, false),
          )
        }
      }

      move(lastTarget, target) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x)
        this.dt = dist(lastTarget.x, lastTarget.y, target.x, target.y) + 5
        this.t = {
          x: target.x - 0.8 * this.dt * Math.cos(this.angle),
          y: target.y - 0.8 * this.dt * Math.sin(this.angle),
        }
        if (this.t.x) {
          this.segments[this.n - 1].update(this.t)
        } else {
          this.segments[this.n - 1].update(target)
        }
        for (let i = this.n - 2; i >= 0; i--) {
          this.segments[i].update(this.segments[i + 1].pos)
        }
        if (
          dist(this.x, this.y, target.x, target.y)
              <= this.l + dist(lastTarget.x, lastTarget.y, target.x, target.y)
        ) {
          this.segments[0].fallback({ x: this.x, y: this.y })
          for (let i = 1; i < this.n; i++) {
            this.segments[i].fallback(this.segments[i - 1].nextPos)
          }
        }
      }

      show(target) {
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
          c.globalCompositeOperation = 'lighter'
          c.beginPath()
          c.lineTo(this.x, this.y)
          for (let i = 0; i < this.n; i++) {
            this.segments[i].show()
          }
          c.strokeStyle = `hsl(${
            this.rand * 60 + 180
          },100%,${
            this.rand * 60 + 25
          }%)`
          c.lineWidth = this.rand * 2
          c.lineCap = 'round'
          c.lineJoin = 'round'
          c.stroke()
          c.globalCompositeOperation = 'source-over'
        }
      }

      show2(target) {
        c.beginPath()
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
          c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI)
          c.fillStyle = 'white'
        } else {
          c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI)
          c.fillStyle = 'darkcyan'
        }
        c.fill()
      }
    }

    const maxl = 300
    const minl = 50
    const n = 30
    const numt = 500
    const tent = []
    let clicked = false
    const target = { x: 0, y: 0 }
    const lastTarget = {}
    let t = 0
    const q = 10

    for (let i = 0; i < numt; i++) {
      tent.push(
        new tentacle(
          Math.random() * w,
          Math.random() * h,
          Math.random() * (maxl - minl) + minl,
          n,
          Math.random() * 2 * Math.PI,
        ),
      )
    }
    function draw() {
      if (mouse.x) {
        target.errx = mouse.x - target.x
        target.erry = mouse.y - target.y
      } else {
        target.errx = w / 2
              + ((h / 2 - q) * Math.sqrt(2) * Math.cos(t))
                / (Math.sin(t) ** 2 + 1)
              - target.x
        target.erry = h / 2
              + ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t))
                / (Math.sin(t) ** 2 + 1)
              - target.y
      }

      target.x += target.errx / 10
      target.y += target.erry / 10

      t += 0.01

      c.beginPath()
      c.arc(
        target.x,
        target.y,
        dist(lastTarget.x, lastTarget.y, target.x, target.y) + 5,
        0,
        2 * Math.PI,
      )
      c.fillStyle = 'hsl(210,200%,80%)'
      c.fill()

      for (var i = 0; i < numt; i++) {
        tent[i].move(lastTarget, target)
        tent[i].show2(target)
      }
      for (let j = 0; j < numt; j++) {
        tent[j].show(target)
      }
      lastTarget.x = target.x
      lastTarget.y = target.y
    }

    canvas.addEventListener(
      'mousemove',
      function (e) {
        lastMouse.x = mouse.x
        lastMouse.y = mouse.y

        mouse.x = e.pageX - this.offsetLeft
        mouse.y = e.pageY - this.offsetTop
      },
      false,
    )

    canvas.addEventListener('mouseleave', (e) => {
      mouse.x = false
      mouse.y = false
    })

    canvas.addEventListener(
      'mousedown',
      (e) => {
        clicked = true
      },
      false,
    )

    canvas.addEventListener(
      'mouseup',
      (e) => {
        clicked = false
      },
      false,
    )

    function loop() {
      window.requestAnimFrame(loop)
      c.clearRect(0, 0, w, h)
      draw()
    }

    window.addEventListener('resize', () => {
      (w = canvas.width = window.innerWidth);
      (h = canvas.height = window.innerHeight)
      loop()
    })

    loop()
    setInterval(loop, 1000 / 60)
  }

  return (
    <div className="container" style={{ overflow: 'hidden' }}>
      <div className="canvas-container" style={{ overflow: 'hidden' }}>
        <canvas style={{ overflow: 'hidden' }} id="canvas" />
      </div>
      <div className="button-container" style={{ overflow: 'hidden' }}>
        <TitleP strings={[
          'HI',
          '....',
          "I'm Diego",
          '.....',
          '¿WHO AM I?',
          '.....',
          '¿WHERE AM I FROM?',
          '......',
          '¿WHAT CAN I DO?',
          '.....',
          'ALL HERE',
          '↓',
        ]}
        />
      </div>
      <div className="button-containerP" style={{ overflow: 'hidden' }}>
        <Header />
      </div>
      <div className="button-containerG">
        <a href="https://uvgenios.online/21270/Proyecto1STW/">
          <div className="card1">
            <h1>
              <small>Replicating a website</small>
              <br />
              Locomotive
            </h1>
            ´
            <video autoPlay loop muted className="homeVideoView">
              <source src="/videos/fondo.mp4" type="video/mp4" />
            </video>
          </div>
        </a>
      </div>
      <div className="button-containerG" style={{ top: '150vh', left: '150vh' }}>
        <a href="https://deft-haupia-34e13b.netlify.app/">
          <div className="card1">
            <h1>
              <small>¿A GAME?</small>
              <br />
              CUPHEAD`&apos;`S MAZE
            </h1>
            ´
            <video autoPlay loop muted className="homeVideoView" style={{ width: '40vw', height: 'auto' }}>
              <source src="/videos/inicio.mp4" />
            </video>
          </div>
        </a>
      </div>
      <div className="button-containerG" style={{ top: '205vh', left: '50vh', width: '45vw' }}>
        <a href="https://github.com/Dahernandezsilve/proyectomgafrontend.git">
          <div className="card1">
            <h1>
              <small>App</small>
              <br />
              Proyecto MGA
            </h1>
            <img src="/ElCeibillal.png" alt="Profile" />
          </div>
        </a>
      </div>
      <div className="button-containerG" style={{ top: '235vh', left: '150vh', width: '45vw' }}>
        <a href="https://github.com/Dahernandezsilve/Project_B-Line.git">
          <div className="card1">
            <h1>
              <small>Another App</small>
              <br />
              B-Line
            </h1>
            <img src="/Bline.png" alt="Profile" />
          </div>
        </a>
      </div>
      <div className="button-containerG" style={{ top: '280vh', left: '50vh', width: '45vw' }}>
        <a href="http://hexateam.lat/">
          <div className="card1">
            <h1>
              <small>DB Project</small>
              <br />
              Medical platform
            </h1>
            <img src="/medicos.png" alt="Profile" />
          </div>
        </a>
      </div>
      <div
        className="button-containerG"
        style={{
          top: '365vh', left: '100vh', width: '50wh', height: 0,
        }}
      >
        <p style={{ fontSize: 200, height: 0, marginBottom: '30vh' }}>SKILLS</p>
        <Skills skill="REACT" level="110" color="#00caef" />
        <Skills skill="JAVASCRIPT" level="100" color="#f7f701" />
        <Skills skill="REACT NATIVE" level="95" color="#009dcc" />
        <Skills skill="HTML" level="95" color="#d84924" />
        <Skills skill="POSTGRES" level="90" color="#2f5c8b" />
        <Skills skill="JAVA" level="80" color="#e11e23" />
        <Skills skill="PYTHON" level="80" color="#bbd93b" />
        <Skills skill="CSS" level="80" color="#2449d8" />
        <Skills skill="KOTLIN" level="60" color="#7666f2" />
        <Skills skill="ANDROID" level="60" color="#2fd37d" />
        <Skills skill="C++" level="60" color="#005494" />
        <Skills skill="UBUNTU" level="50" color="#db5424" />
      </div>
      <div
        className="button-containerG"
        style={{
          top: '480vh', left: '100vh', width: '50wh', height: 0,
        }}
      >
        <p style={{ fontSize: 100, height: 0, marginBottom: '30vh' }}>CONTACT WITH ME</p>
      </div>
      <div className="button-containerG" style={{ top: '520vh', left: '50vh', width: '45vw' }}>
        <a href="https://github.com/Dahernandezsilve">
          <div className="card2">
            <h1>
              <small>GITHUB</small>
              <br />
              DAHERNANDEZSILVE
            </h1>
            <img src="/Git.png" alt="Profile" className="imageContact" />
          </div>
        </a>
      </div>
      <div className="button-containerG" style={{ top: '520vh', left: '150vh', width: '45vw' }}>
        <a href="https://github.com/Dahernandezsilve">
          <div className="card2">
            <h1>
              <small>INSTAGRAM</small>
              <br />
              DAHERNANDEZLIVE
            </h1>
            <img src="/Instagram.png" alt="Profile" className="imageContact" />
          </div>
        </a>
      </div>
      <div className="button-containerG" style={{ top: '575vh', left: '100vh', width: '45vw' }}>
        <a href="https://github.com/Dahernandezsilve">
          <div className="card2">
            <h1>
              <small>TWITTER</small>
              <br />
              DAHERNANDEZ
            </h1>
            <img src="/twitter.png" alt="Profile" className="imageContact" />
          </div>
        </a>
      </div>
    </div>
  )
}

export default MonsterElectric
