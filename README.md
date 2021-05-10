jQuery Slideshow
================

What is Slideshow?
------------------

jQuery Plugin to display a ul or list of div's as an animated or static slideshow.

Slides can be animated in several ways:
- animate (left, right, up, down)
- fade
- slide-away
- slide-over (left, right, up , down)
- cross fade

Also supports slide indicators and jump links for switching between slides.

Animation speed and pause length are customisable. Use CSS to define the position and look of the jump links/indicators.

Requirements
------------

jQuery ... obviously.

Usage
-----

**Step 1: HTML Structure**

Example:
```html
<div class="myslideshow">
  <div class="slider">
    <ul class="slide-list">
      <li class="slide-item">Slide 1</li>
      <li class="slide-item">Slide 2</li>
      ....
    </ul>
  </div>
</div>
```
This is the basic structure of the slide show. The first div is used to house all the elements used for the slideshow including the slides, previous/next buttons, and jump links.
By default, the Plugin uses the CSS selectors of 'slider', 'slide-list' and 'slide-item', however these can be changed via the configuration options passed to the plugin on initialisation.
Alternatively, instead of using a 'ul' as the slide container, you can use a series of divs.

Example:
```html
  <div class="slider">
    <div class="slide-list">
      <div class="slide-item">Slide 1</div>
      <div class="slide-item">Slide 2</div>
      ...
    </div>
  </div>
```
To use the previous and next jump links, simply put two links inside the 'myslideshow' container.

Example
```html
<div class="myslideshow">
  <div class="slider">
    ...
  </div>
  <a href="#" class="prevslide">Prev</a>
  <a href="#" class="nextslide">Next</a>
</div>
```
How you structure the placement of the jump links is entirely up to you.
By default, the Plugin uses the CSS selectors of 'prevslide' and 'nextslide', but these can be changed via the configuration options.

You can also include slide indicators to show to the user what slide in the series they are currently viewing and to jump to a particular slide.

Example:
```html
<div class="myslideshow">
  <div class="slider">
    <div class="slide-list">
      <div class="slide-item">Slide 1</div>
      <div class="slide-item">Slide 2</div>
    </div>
  </div>
  <a href="#" class="iconcount">1</a>
  <a href="#" class="iconcount">2</a>
</div>
```
Simply provide a number of links that match the number of slides. I.E. if you have four slides, provide four indicators. In this example, there are two slides, so we have placed two indicators.
The Plugin will automatically associate each indicator with the appropriate slide based on their order in the DOM. So the first instance of a link with class 'iconcount' will be associated with the first instance of an element with the class of 'slide-item' relative to the main slideshow container.
How you structure the placement and look of the indicators is entirely up to you, so long as the order and number of the indicators match that of the slides.
By default, the Plugin uses the CSS selector of 'iconcount', but this can be changed via the configuration options.

To put them all together...

Example:
```html
<div class="myslideshow">
  <div class="slider">
    <ul class="slide-list">
      <li class="slide-item">Slide 1</li>
      <li class="slide-item">Slide 2</li>
    </ul>
  </div>
  <div class="controllers">
    <ul>
      <li class="first"><a href="#" class="prevslide">Prev</a></li>
      <li class=""><a href="#" class="iconcount">1</a></li>
      <li class=""><a href="#" class="iconcount">2</a></li>
      <li class="last"><a href="#" class="nextslide">Next</a></li>
    </ul>
  </div>
</div>
```

**Step 2: Javascript**

Basic call:
```javascript
$('.myslideshow').slideShow();
```
By default, this will set up a slide show 780 x 520 pixels in size that will use the fade transition between slides.

To alter the slideshow, provide an object of options to the call:
```javascript
$('.myslideshow').slideShow({ option: 'value', option: 'value'...});
```

Here is a list of configuration options you can use:
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Example</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td class="width: 150px">width</td>
    <td class="width: 150px">integer</td>
    <td class="width: 150px">500</td>
    <td class="width: 150px">780</td>
    <td>Specifies the width of each slide as well the 'slider' declared container. Anything over this width will not be visible</td>
  </tr>
  <tr>
    <td class="width: 150px">height</td>
    <td class="width: 150px">integer</td>
    <td class="width: 150px">500</td>
    <td class="width: 150px">520</td>
    <td>Specifies the height of each slide as well the 'slider' declared container. Anything over this width will not be visible</td>
  </tr>
  <tr>
    <td class="width: 150px">type</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'fade', 'xfade', 'slide'</td>
    <td class="width: 150px">'fade'</td>
    <td>Indicates what the transition style is between each slide.</td>
  </tr>
  <tr>
    <td class="width: 150px">direction</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'left', 'right'</td>
    <td class="width: 150px">'left'</td>
    <td>When the transition is slide, indicates what direction to animate the slides.</td>
  </tr>
  <tr>
    <td class="width: 150px">isstatic</td>
    <td class="width: 150px">boolean</td>
    <td class="width: 150px">true or false</td>
    <td class="width: 150px">false</td>
    <td>If set to true, the slideshow will not automatically change between slides and instead must be controller via the previous, next, or indicator buttons.</td>
  </tr>
  <tr>
    <td class="width: 150px">pauseLength</td>
    <td class="width: 150px">integer</td>
    <td class="width: 150px">2000</td>
    <td class="width: 150px">4000</td>
    <td>Indicates the length of time in milliseconds between each transition. 4000 = 4 seconds</td>
  </tr>
  <tr>
    <td class="width: 150px">fadelength</td>
    <td class="width: 150px">integer</td>
    <td class="width: 150px">50</td>
    <td class="width: 150px">50</td>
    <td>Indicates the pause between each animation step.</td>
  </tr>
  <tr>
    <td class="width: 150px">fadestep</td>
    <td class="width: 150px">integer</td>
    <td class="width: 150px">10</td>
    <td class="width: 150px">5</td>
    <td>When the transition is 'fade' or 'xfade', indicates the amount of opacity to change per animation cycle.</td>
  </tr>
  <tr>
    <td class="width: 150px">steplength</td>
    <td class="width: 150px">integer</td>
    <td class="width: 150px">10</td>
    <td class="width: 150px">5</td>
    <td>When the transition is 'slide', indicates the amount in pixels the slide should move per animation cycle.</td>
  </tr>
  <tr>
    <td class="width: 150px">onChange</td>
    <td class="width: 150px">function</td>
    <td class="width: 150px">function(form, options) { ... }</td>
    <td class="width: 150px">false</td>
    <td>At the end of each animation cycle, this will function will called.</td>
  </tr>
  <tr>
    <td class="width: 150px">onInit</td>
    <td class="width: 150px">function</td>
    <td class="width: 150px">function(form, options) { ... }</td>
    <td class="width: 150px">false</td>
    <td>At the end of the slideshow initialisation, this function will be called.</td>
  </tr>
  <tr>
    <td class="width: 150px">container</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'.mysliders'</td>
    <td class="width: 150px">'.sliders'</td>
    <td>Indicates what the CSS selector should be for the slide list container.</td>
  </tr>
  <tr>
    <td class="width: 150px">list</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'.mysliders-list'</td>
    <td class="width: 150px">'ul.slide-list'</td>
    <td>Indicates what the CSS selector should be for element containing each slide.</td>
  </tr>
  <tr>
    <td class="width: 150px">plate</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'.mysslide'</td>
    <td class="width: 150px">'li.slide-item'</td>
    <td>Indicates what the CSS selector should be for each slide element.</td>
  </tr>
  <tr>
    <td class="width: 150px">active</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'activeslide'</td>
    <td class="width: 150px">'active'</td>
    <td>Indicates what the CSS class name should be to specify the current slide.</td>
  </tr>
  <tr>
    <td class="width: 150px">icons</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'iconindicators'</td>
    <td class="width: 150px">'iconcount'</td>
    <td>Indicates what the CSS class name should be to select the indicator icons.</td>
  </tr>
  <tr>
    <td class="width: 150px">iconactive</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'activeindicator'</td>
    <td class="width: 150px">'active'</td>
    <td>Indicates what the CSS class name should be to specify the current indicator icon.</td>
  </tr>
  <tr>
    <td class="width: 150px">iconnext</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'mynextslide'</td>
    <td class="width: 150px">'nextslide'</td>
    <td>Indicates what the CSS class name should be to specify the next button jump link.</td>
  </tr>
  <tr>
    <td class="width: 150px">iconprev</td>
    <td class="width: 150px">string</td>
    <td class="width: 150px">'myprevslide'</td>
    <td class="width: 150px">'prevslide'</td>
    <td>Indicates what the CSS class name should be to specify the previous button jump link.</td>
  </tr>
  <tr>
    <td class="width: 150px">hideicons</td>
    <td class="width: 150px">boolean</td>
    <td class="width: 150px">true or false</td>
    <td class="width: 150px">false</td>
    <td>Hides the indicator icons if set to true.</td>
  </tr>
</table>


      