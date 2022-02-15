# 3D picture wall based on html canvas

## What's this?

I did some modification on @ge1doot's artwork, to fit the touch screen of a mobile device:

+ Add a click event on image being clicked.
+ Drag, zoom has a better experience.
+ Add a text displaying 'control'.
+ Add loading font asyncly ability.

But

+ Only support for touch screen. 

### Demo

Clone this repository and open `index.html`, or [visit my server](http://static.shichenxi.icu/3dpicwall_demo.html) if it is still alive.

### More about the code...

Thanks to @ge1doot, but this code is an old artwork. You can find the origin code in https://github.com/npm-team/Ge1dootjs

It is easy to understand the theory. Just calculate the painting position by projection ratio. Since the view is always look ahead, no need to consider rotation. Notice that, the camera axis and the canvas axis are different.

Target position of the camera is in the `pointer` object. The instantaneous position is in `camera` object. @ge1doot did it, I don't want to change his code, adding my work.


## License

+ I cannot find the author, @ge1doot's origin repository of in the Internet, but there are many clones in github and other websites. I found MIT declaration in the comment of library`ge1doot.js`.
+ My Code is under the **MIT License**, use them freely.
+ Resouces(images, fonts) are from the Internet, I don't own any rights of them. 
