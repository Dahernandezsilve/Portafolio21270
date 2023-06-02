import React, { useEffect } from "react";
import "./TitleP.css";

const TitleP = ({ strings }) => {
  useEffect(() => {
    const resolver = {
      resolve: function resolve(options, callback) {
        const resolveString =
          options.resolveString ||
          options.element.getAttribute("data-target-resolver");
        const combinedOptions = Object.assign({}, options, {
          resolveString: resolveString,
        });

        function getRandomInteger(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomCharacter(characters) {
          return characters[getRandomInteger(0, characters.length - 1)];
        }

        function doRandomiserEffect(options, callback) {
          const characters = options.characters;
          const timeout = options.timeout;
          const element = options.element;
          const partialString = options.partialString;

          var iterations = options.iterations;

          setTimeout(() => {
            if (iterations >= 0) {
              const nextOptions = Object.assign({}, options, {
                iterations: iterations - 1,
              });

              if (iterations === 0) {
                element.textContent = partialString;
              } else {
                element.textContent =
                  partialString.substring(0, partialString.length - 1) +
                  randomCharacter(characters);
              }

              doRandomiserEffect(nextOptions, callback);
            } else if (typeof callback === "function") {
              callback();
            }
          }, options.timeout);
        }

        function doResolverEffect(options, callback) {
          const resolveString = options.resolveString;
          const characters = options.characters;
          const offset = options.offset;
          const partialString = resolveString.substring(0, offset);
          const combinedOptions = Object.assign({}, options, {
            partialString: partialString,
          });

          if (offset <= resolveString.length) {
            doRandomiserEffect(combinedOptions, () => {
              const nextOptions = Object.assign({}, options, {
                offset: offset + 1,
              });
              doResolverEffect(nextOptions, callback);
            });
          } else if (typeof callback === "function") {
            callback();
          }
        }

        doResolverEffect(combinedOptions, callback);
      },
    };

    var counter = 0;

    const options = {
      offset: 0,
      timeout: 5,
      iterations: 10,
      characters: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "x",
        "y",
        "x",
        "#",
        "%",
        "&",
        "-",
        "+",
        "_",
        "?",
        "/",
        "\\",
        "=",
      ],
      resolveString: strings[counter],
      element: null,
    };

    function callback() {
      setTimeout(() => {
        counter++;

        if (counter >= strings.length) {
          return; // Detener la animación cuando se hayan recorrido todos los strings
        }

        var nextOptions = Object.assign({}, options, {
          resolveString: strings[counter],
        });
        resolver.resolve(nextOptions, callback);
      }, 1000);
    }

    const getElement = () => {
      const element = document.querySelector('[data-target-resolver]');
      if (element) {
        options.element = element;
        resolver.resolve(options, callback);
      }
    };

    getElement();
  }, []);

  return (
    <div className="container">
      <h1 className="heading" data-target-resolver></h1>
    </div>
  );
};

export default TitleP;
