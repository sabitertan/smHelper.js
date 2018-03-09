# smHelper.js
A JavaScript Module includes some small helper functions.
This is just a collection of simple functionalities can be used on browsers.
## Functions
### smHelper.toggler(element,value)
Switches elements display style between given value and 'none'.
### smHelper.grabber(list,filter[,invert])
Returns elements from given list match filter rules, 
invert argument will make function to return unmatched elements.
### smHelper.contentObserve(targetId,mutationList)
creates Mutation Observer for given element for multiple mutations.
Example: 
```javascript
var mutationList = [];
mutationList.push({mutationId:'contentTop', callback:contentBottomCallback});
mutationList.push({mutationId:'contentMiddle', callback:contentMiddleCallback});
mutationList.push({mutationId:'contentBottom', callback:contentBottomCallback});
smHelper.contentObserve('content', mutationList);
```
