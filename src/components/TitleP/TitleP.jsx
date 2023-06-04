/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import './TitleP.css'

const TitleP = ({ strings }) => {
  useEffect(() => {
    const resolver = {
      resolve: function resolve(options, callback) {
        const resolveString = options.resolveString
          || options.element.getAttribute('data-target-resolver')
        const combinedOptions = { ...options, resolveString }

        function getRandomInteger(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min
        }

        function randomCharacter(characters) {
          return characters[getRandomInteger(0, characters.length - 1)]
        }

        function doRandomiserEffect(options, callback) {
          const { characters } = options
          const { element } = options
          const { partialString } = options

          const { iterations } = options

          setTimeout(() => {
            if (iterations >= 0) {
              const nextOptions = { ...options, iterations: iterations - 1 }

              if (iterations === 0) {
                element.textContent = partialString
              } else {
                element.textContent = partialString.substring(0, partialString.length - 1)
                  + randomCharacter(characters)
              }

              doRandomiserEffect(nextOptions, callback)
            } else if (typeof callback === 'function') {
              callback()
            }
          }, options.timeout)
        }

        function doResolverEffect(options, callback) {
          const { resolveString } = options
          const { offset } = options
          const partialString = resolveString.substring(0, offset)
          const combinedOptions = { ...options, partialString }

          if (offset <= resolveString.length) {
            doRandomiserEffect(combinedOptions, () => {
              const nextOptions = { ...options, offset: offset + 1 }
              doResolverEffect(nextOptions, callback)
            })
          } else if (typeof callback === 'function') {
            callback()
          }
        }

        doResolverEffect(combinedOptions, callback)
      },
    }

    let counter = 0

    const options = {
      offset: 0,
      timeout: 5,
      iterations: 10,
      characters: [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'x',
        'y',
        'x',
        '#',
        '%',
        '&',
        '-',
        '+',
        '_',
        '?',
        '/',
        '\\',
        '=',
      ],
      resolveString: strings[counter],
      element: null,
    }

    function callback() {
      setTimeout(() => {
        counter++

        if (counter >= strings.length) {
          return // Detener la animación cuando se hayan recorrido todos los strings
        }

        const nextOptions = { ...options, resolveString: strings[counter] }
        resolver.resolve(nextOptions, callback)
      }, 1000)
    }

    const getElement = () => {
      const element = document.querySelector('[data-target-resolver]')
      if (element) {
        options.element = element
        resolver.resolve(options, callback)
      }
    }

    getElement()
  }, [])

  return (
    <div className="container" style={{ overflow: 'hidden' }}>
      <h1 className="heading" style={{ overflow: 'hidden' }} data-target-resolver />
    </div>
  )
}

TitleP.propTypes = {
  strings: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default TitleP
