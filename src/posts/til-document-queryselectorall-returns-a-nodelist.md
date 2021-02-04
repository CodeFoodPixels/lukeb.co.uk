---
title: 'TIL: document.querySelectorAll returns a NodeList'
date: 2018-02-06
tags:
 - TIL
 - tips
---
Modern browsers have the native selector engine `document.querySelectorAll` which is really useful for easily finding elements. I had assumed that it returned an Array but I've just found out that I was wrong and it returns a NodeList.

<!-- excerpt -->

A NodeList is still a collection, but it doesn't have the Array prototype methods such as `.filter` or `.map`. You can convert the NodeList to an array using `Array.from()` or you can use items from the Array prototype using `.call` like this:

``` javascript
var elements = document.querySelectorAll('.content__article');

elements = [].filter.call(elements, function(el) {
    // Your filter code goes here
});
```
