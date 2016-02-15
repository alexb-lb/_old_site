'use strict';

/***************/
/*CALC FORM*/
/***************/
function calcutator(formId) {
  var form, profit, defaultValue;

  form = document.querySelector(formId);
  profit = form.elements.profit;

  //hunging up listener to the parent form
  if (form.addEventListener) {
    form.addEventListener("focus", function (e) {
      deleteDefault(e);
    }, true);

    form.addEventListener("blur", function (e) {
      validateForm(e);
    }, true);
  } else {
    //for IE8
    form.attachEvent("onfocusin", deleteDefault);
    form.attachEvent("onfocusout", validateForm);
  }

  //delete default (start) value, if user changed it
  function deleteDefault(e) {
    //checking if IE8
    var target = window.addEventListener ? e.target : event.srcElement;

    if (!target.hasAttribute("data-changedVal") && target.name !== "profit") {
      defaultValue = target.value;
      target.value = "";
    }
  }

  //main validate function
  function validateForm(e) {
    //checking if IE8
    var target = window.addEventListener ? e.target : event.srcElement;

    //starting check functions
    switch (target.name) {
      case  "select":
        checkSelect(target);
        break;
      case  "numeric":
        checkNumeric(target);
        break;
      case "text":
        checkText(target);
        break;
      /*...other cases...*/
    }

    var valueArr = form.querySelectorAll("* [numeric]");
    var correctFields = true;
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i].value === "") {
        correctFields = false;
      }
    }

    if (correctFields) {
      calcProfitValue();
    }
  }

  //output value - result of calculating all filled fields in form
  function calcProfitValue() {
    var result, crop, productivity, cost, square;

    /* some code that calculates profit for example: */
    crop = document.getElementById("crop").value;
    productivity = document.getElementById("productivity").value;
    cost = document.getElementById("cost").value;
    square = document.getElementById("square").value;

    result = ((cost * square) / productivity ) / 4;
    result = result.toFixed(0).toString();

    /*...other string transformations...*/
    profit.value = result;


  }

  // function checks that the field is not empty
  function checkSelect(target) {
  /*code if it needs*/
  }

  // function checks if entered value is a number
  function checkNumeric(target) {

    target.value = target.value.trim();
    //if user has not made any changes, returns the default value
    if (target.value === "") {
      target.value = defaultValue;
    } else {
      return checkNumericStr();
    }

    function checkNumericStr() {
      /*set attribute that reports, that default value *
       * has been changed by the user and should`n be removed */
      target.setAttribute("data-changedVal", "true");
      target.value = target.value.replace(",", ".");

      if (!isNaN(parseFloat(target.value)) && isFinite(target.value) && target.value > 0) {
        return target.value;
      } else {
        createErrorMsg(target, "js__error", "пожалуйста, введите число");
        target.focus();
        target.value = "";
        return false;
      }
    }
  }

  function checkText(target) {
    /*...some code...*/
  }

  //create error tag
  function createErrorMsg(target, className, msg) {
    var errorTag = document.createElement("div"); //making an error div
    form.appendChild(errorTag);
    errorTag.className = className;  //not classList!! Not working in ie8
    errorTag.innerHTML = msg;
    errorTag.style.top = target.offsetTop + "px";

    //remove error msg after a period of time
    setTimeout(function () {
      errorTag.parentNode.removeChild(errorTag);
    }, 2000);
  }
};

calcutator("#calc-form");


/***************/
/*SIMPLE SLIDER in prototype style*/
/***************/
function Slider(sliderId, imgWidth, animationTime) {
  this.slider = document.querySelector(sliderId);
  this.slideWidth = imgWidth;
  this.init();
  this._clearStyles();
  this.animationTime = animationTime;
}

Slider.prototype = {

  init: function () {
    this.slider.style.position = "relative"; //definitely positioned
    this.slides = this.slider.children;
    this.index = 0;
    this.total = this.slides.length;
    this.slideVisible = "js__slider-image--visible";
    this.currentSlide = "js__slider-image--current";

    //adding classes
    for (var i = 0; i < this.total; i++) {
      this.slides[i].className += " js__slider-image";
    }
    this.slides[0].className += " " + this.currentSlide; //not classList!! Not working in ie8
  },


  next: function () {
    var self = this;
    self.index = 0;

    if (document.body.classList) { //IE9- check ("document.body.classList")

      while (!self.slides[self.index].classList.contains(self.currentSlide)) {
        self.index++;
      }

      /*animation through transformation to not overload the processor*/
      if (self.index < self.total - 1) {
        self.slides[self.index + 1].classList.add(self.slideVisible);
        self.slides[self.index + 1].style.transform = "translate(" + self.slideWidth + ", 0)";

        setTimeout(function () {
          self.slides[self.index].style.transform = "translate(-" + self.slideWidth + ", 0)";
          self.slides[self.index + 1].style.transform = "translate(0, 0)";
        }, 100);
      } else {
        self.slides[0].classList.add(self.slideVisible);
        self.slides[0].style.transform = "translate(" + self.slideWidth + ", 0)";

        setTimeout(function () {
          self.slides[self.index].style.transform = "translate(-" + self.slideWidth + ", 0)";
          self.slides[0].style.transform = "translate(0, 0)";
        }, 100);
      }

    } else { //code for IE9-
      while (self.slides[self.index].className.indexOf(self.currentSlide) === -1) {
        self.index++;
      }

      if (self.index < self.total - 1) {
        self._slideIe(self.slides[self.index], self.slides[self.index + 1]);
      } else {
        self._slideIe(self.slides[self.index], self.slides[0]);
      }
    }
  },

  //previous button for loop
  previous: function () {
    var self = this;
    self.index = 0;

    if (document.body.classList) {

      while (!self.slides[self.index].classList.contains(self.currentSlide)) {
        self.index++;
      }

      if (self.index === 0) {
        self.slides[self.total - 1].classList.add(self.slideVisible);
        self.slides[self.total - 1].style.transform = "translate(-" + self.slideWidth + ", 0)";

        setTimeout(function () {
          self.slides[self.index].style.transform = "translate(" + self.slideWidth + ", 0)";
          self.slides[self.total - 1].style.transform = "translate(0, 0)";
        }, 100);
      } else {
        self.slides[self.index - 1].classList.add(self.slideVisible);
        self.slides[self.index - 1].style.transform = "translate(-" + self.slideWidth + ", 0)";

        setTimeout(function () {
          self.slides[self.index].style.transform = "translate(" + self.slideWidth + ", 0)";
          self.slides[self.index - 1].style.transform = "translate(0, 0)";
        }, 100);
      }

    } else { //code for IE9-
      //the same func as "next"
    }
  },


  //function for drawing slider animation in IE9-
  _slideIe: function (current, nextPrev) {
    var self = this;
    //function for drawing slider animation in IE9-
    var start = Date.now();

    //define "next image block" in slider
    nextPrev.className += " " + self.slideVisible;
    nextPrev.setAttribute("style", "left:" + self.slideWidth + "px");

    var timer = setInterval(function () {

      var timePassed = Date.now() - start;

      if (timePassed >= self.animationTime) { //easy to make animation time like input parameter
        clearInterval(timer); //ends after 2 sec

        setTimeout(function (){
          nextPrev.style.left = "";

          setTimeout(function (){
            current.className = current.className.replace(" " + self.currentSlide, "");
            current.style.left = "";

            setTimeout(function (){
              nextPrev.className = nextPrev.className.replace(self.slideVisible, self.currentSlide);
            },0);
          }, 0);
        }, 0);
      }
      // draw animation by passed time
      draw(timePassed, current, nextPrev);
    }, 20);

    //while timePassed goes from 0 to 2000 images slides
    function draw(timePassed, current, nextPrev) {
      var step = parseInt(self.slideWidth) / self.animationTime;
      var counter = timePassed * step;
      current.style.left = "-" + counter + 'px';
      nextPrev.style.left = (parseInt(self.slideWidth) - counter) + "px";
    }
  },


  //deletes styles after animation ends
  _clearStyles: function () {
    var self = this;
    if (document.body.classList) {
      this.slider.addEventListener("transitionend", clearSlides);
    }

    function clearSlides() {
      var prevElem = self.slider.getElementsByClassName(self.currentSlide)[0];
      var current = self.slider.getElementsByClassName(self.slideVisible)[0];

      if (prevElem && current) {
        setTimeout(function () {
          current.classList.add(self.currentSlide);
          current.style.transform = "";

          setTimeout(function () {
            prevElem.classList.remove(self.currentSlide);
            current.classList.remove(self.slideVisible);
            prevElem.style.transform = "";
          }, 0);
        }, 0);
      }
    }
  }
};

var mainSlider = new Slider("#main-slider", "1200px", "2000");

var timerId = setTimeout(function tick() {
  mainSlider.next();
  timerId = setTimeout(tick, 6000);
}, 6000);