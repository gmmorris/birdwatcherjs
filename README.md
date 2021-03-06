Birdwatcher JS ![alt TravisCI Build](https://travis-ci.org/gmmorris/birdwatcherjs.svg?branch=master) [![Code Climate](https://codeclimate.com/github/gmmorris/birdwatcherjs/badges/gpa.svg)](https://codeclimate.com/github/gmmorris/birdwatcherjs) [![npm version](https://img.shields.io/npm/v/birdwatcher.svg?style=flat-square)](https://www.npmjs.com/package/birdwatcher)
=======

A small utility for implementing the NCZ JavaScript error handling pattern.
To understand the anti anti-pattern pattern: http://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/

## What do we need it for?
Birdwatcher allows you to completely decouple your error handling strategy from your component implementations.
It allows you to attach error handling to your objects without having to write try/catch throughout their implementations and at the same time, allows you to attach custom configurations for specific objects or groups of objects, while still maintaining a uniform strategy for dealing with their errors when they arise.

## In the Browser (as ES5)
To use birdwatcher, all you have to do is tell birdwatcher to spy on an object and set the callback you wish to have called when an error is raised.

As Birdwatcher is implemented in ES6 using the ES6 module system, you first need to build a version of the utility which can work in the browser.
I chose not to make any assumptions as to how Birdwatcher would be integrated into a project, so instead of providing a prebuilt version for the browsers, I simply recommend you use a module bundler that supports ES6.
Personally, I use [webpack](http://webpack.github.io/) along with [babel-loader](https://github.com/babel/babel-loader), but you can use whatever you find suitable.

Assuming you bundled the Birdwatcher utility into it's own file named *birdwatcher.min.js* you may continue thusly:

```html
    <script type="text/javascript" src="birdwatcher.min.js"></script>
```

## In Node
```js
  npm install --save birdwatcher
```

### Basic usage
```js
    window.theKing = {
        giveUpThrone: function(){
            throw Error("The king will never be over thrown!");
        }
    };

    birdwatcher(window.theKing,{
        onError:function(exception,name, id, method){
            if(method == "giveUpThrone") {
                assassin.killKing();
            } else {
                // some other error took place
            }
        }
    });

    // ...
    if(runOutOfBread && runOutOfCake){
      // will throw an error, which in turn will trigger the Assasin to kill the king
      window.theKing.giveUpThrone();  
    }
```


### Advanced usage

#### Specifying different default configurations and different configurations for a specific object

By calling the birdwatcher.configure() function you can create a new entry point to Birdwatcher with a new custom configuration which will override the built in one.
If you want to specify a non default configuration variable for a specific object you can override default values of the configuration specifically for the current object when calling the main birdwatcher method by using the second argument.

```js
    window.theKing = {
        giveUpThrone: function(){
            throw new Error("The king will never be over thrown!");
        }
    };

    window.theAssassin = {
        killTheKing: function(){
            this.injectPoison(window.theKing);
        },
        killThePrince: function(){
            throw new Error("No women and children!");
        }
    };

    var myGlobalBirdwatcher = birdwatcher.configure({
      // no error caught in an object watched by this custom Birdwatcher will be errorized (wraped in an Error object)
      errorize : false,
      // And they will all call this function to handle the onError events... unless they are overriden especially
      onError:function(srcObject, exception,name, method){
          // all other error which were raised

          if(name == "King" && method == "giveUpThrone") {
              //will be called when the king is challenged to give up the throne
          }
      }
    });

    myGlobalBirdwatcher(window.theKing,"King");
    myGlobalBirdwatcher(window.theAssassin,"Assassin",{
      // override the default onError and use this one... the other default configrations will be inherited
      onError:function(srcObject, exception,name, method){
          // notify the rebels that the assassin has failed
          // or rather when theAssassin.killThePrince() is called
          // presumably that wasn't prince Joffrey, because that was no child, that was a monster!
      }
    });
```

#### Watching a single function

If you wish to plug a specific method of an object or a function variable into the birdwatcher mechanism you can call the main birdwatcher function and pass the specific method/variable as the first argument, same as with an object.
Note though, that in order to call the function variable you will have to replace the reference you have to it manually.

```js
    var myErrorHandledFunction = function(){
		// ...
	};

    var myObject = {
		myErrorHandledMethod : function(){
			// ...
		}
	};

    myErrorHandledFunction = birdwatcher(myErrorHandledFunction);
    myObject.myErrorHandledMethod = birdwatcher(myObject.myErrorHandledMethod);
```

#### Preventing a rethrow

The default is to rethrow an error once it is caught, so that the normal error flow can be maintained even when an error
is caught for special usages (such as logging).
You cen prevent the rethrow from happening by setting the rethrow config to false.
This can be used globally or at a single object's level.

```js
    let myBirdwatcher = birdwatcher.configure({
        rethrow:false
    });
```


## In ES6 (Node.js + Babel <3 )
If you're using ES6 you can simply import Birdwatcher and the Configure function from the module system.

```
  npm install --save-dev birdwatcher
```
And then where you want to use it simply:

```js
  import birdwatcher, {configure, isBirdwatcherError} from 'birdwatcher';
```

This will provide you with the *birdwatcher* function, which is all you really need.
It will also provide you with the *configure* function you can use to create a new birdwatcher function with a custom configuration.

For example:
If you want a systemwide default onError handler, to send reports to your Frontend error aggregator, you can create one custom birdwatcher and use it throughout your system.
I've used this approach in multiple different websites and projects and have foudn it a great way to seperate my error tracking from my business components.

#### errorhandling.js
```js  
  import {configure} from 'birdwatcher';

  export default configure({
    onError : function(){
      ... // error tracking logic
    }
  })
```

#### The source code of any component I wish to track
If you're using ES6:
```js

  // other component file
  import errorhandling from 'errorhandling';

  const SomeComponent = errorhandling({
    ...
  }, 'SomeComponentName');

  // or

  const myComponent = {
    doThis : function(){},
    doThat : function(){}
  };

  export default errorhandling(myComponent,'myComponentName');
```

You can also attach birdwatching to the methods of a class definition by using the birdwatch method.
I would suggest though, if you're already using ES6 and Babel, then why not go ahead and turn on Stage 0 so you can enjoy the benefits of using decorators (take a look under the ES7 heading).

```js

  // other component file

  import birdwatch from 'birdwatcher';
  import errorhandling from 'errorhandling';

  class SomeComponent {
    ...
  }


  export default birdwatch(errorhandling)(myComponent,'myComponentName');
```


## In ES7
And if you're feeling experimental with ES7 decorators, you can also use birdwatcher by applying birdwatch decorator:

```js
  // other component file

  import birdwatch from 'birdwatcher';
  // your custom birdwatcher
  import errorhandling from 'errorhandling';

  @birdwatch(errorhandling,'SomeComponentName')
  class SomeComponent {
    ...
  }

  export default SomeComponent;
```

Or if you're not using a custom birdwatcher configuration (you *can* do this, but that doesn't mean you should. try and keep your error handling logic separate from your components, thats the whole point).

```js
  // other component file
  import birdwatch from 'birdwatcher';

  @birdwatch('SomeComponentName',{
    onError: function(){
      // ... some error handling
    }
  })
  class SomeComponent {
    ...
  }

  export default SomeComponent;
```
