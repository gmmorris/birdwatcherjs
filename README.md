birdwatcherjs
=======

A small utility for implementing the NCZ JavaScript error handling anti-pattern.
To understand the anti-pattern: http://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/

### Basic usage

To use birdwatcher, all you have to do is tell birdwatcher to spy on an object and set the callback you wish to have called when an error is raised.

```html
    <script type="text/javascript" src="birdwatcher.js"></script>
```

```js
    window.theKing = {
        giveUpThrone: function(){
            throw new Error("The king will never be over thrown!");
        }
    };

    birdwatcher(window.theKing);

    birdwatcher.configuration({
        onError:function(exception,method){
            if(method == "giveUpThrone") {
                assassin.killKing();
            } else {
                // some other error took place
            }
        }
    });
```


### Advanced usage

#### Specifying different callbacks for a specific object

If the global Underscore variable isn't available (if you're using it in noConflict mode) then you can extend it manually by using the global '_pp' variable that is added by the script.


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

    birdwatcher(window.theKing);
    birdwatcher(window.theAssassin,{
        onError:function(exception,method){
            // notify the rebels that the assassin has failed
            // or rather when theAssassin.killThePrince() is called
            // presumably that wasn't prince Joffrey, because that was no child, that was a monster!
        }
    });

    birdwatcher.configuration({
        onError:function(exception,method){
            // all other error which were raised

            if(method == "giveUpThrone") {
                //will be called when the king is challenged to give up the throne
            }
        }
    });
```

#### Preventing a rethrow

The default is to rethrow an error once it is caught, so that the normal error flow can be maintained even when an error
is caught for special usages (such as logging).
You cen prevent the rethrow from happening by setting the rethrow config to false.
This can be used globally or at a single object's level.

```js
    birdwatcher.configuration({
        rethrow:false
    });
```

