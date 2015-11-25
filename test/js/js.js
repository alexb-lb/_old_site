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

    var valueArr = form.querySelectorAll("* [name]");
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
    if (target.value !== "") {
      return target.value;
    } else {
      createErrorMsg(target, "js__error", "пожалуйста, выберите значение");
      target.focus();
      return false;
    }
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
/*SIMPLE SLIDER*/
/***************/
function Slider(sliderId) {
  var slider, slides, currentSlide, nextSlide, prevSlide, slideWidth, slideVisible;

  /*сlasses can be defined by the arguments*/
  slider = document.querySelector(sliderId);
  slider.style.position = "relative"; //definitely positioned
  slides = slider.children;
  slideWidth = "1200px";
  slideVisible = "js__slider-image--visible";
  currentSlide = "js__slider-image--current";
  nextSlide = "js__slider-image--next";
  prevSlide = "js__slider-image--prev";

  //adding classes
  for (var i = 0; i < slides.length; i++) {
    slides[i].className += " js__slider-image";
  }
  slides[0].className += " " + currentSlide; //not classList!! Not working in ie8


  //next button for loop
  function next() {
    var index;
    index = 0;

    if (document.body.classList) { //IE9- check ("document.body.classList")

      while (!slides[index].classList.contains(currentSlide)) {
        index++;
      }

      /*animation through transformation to not overload the processor*/
      if (index < slides.length - 1) {
        slides[index + 1].classList.add(slideVisible);
        slides[index + 1].style.transform = "translate(" + slideWidth + ", 0)";

        setTimeout(function () {
          slides[index].style.transform = "translate(-" + slideWidth + ", 0)";
          slides[index + 1].style.transform = "translate(0, 0)";
        }, 100);
      } else {
        slides[0].classList.add(slideVisible);
        slides[0].style.transform = "translate(" + slideWidth + ", 0)";

        setTimeout(function () {
          slides[index].style.transform = "translate(-" + slideWidth + ", 0)";
          slides[0].style.transform = "translate(0, 0)";
        }, 100);
      }

    } else { //code for IE9-
      while (slides[index].className.indexOf(currentSlide) === -1) {
        index++;
      }

      if (index < slides.length - 1) {
        slideIe(slides[index], slides[index + 1]);
      } else {
        slideIe(slides[index], slides[0]);
      }
    }
  }

  //function for drawing slider animation in IE9-
  function slideIe(current, nextPrev) {
    var start = Date.now();

    //define "next image block" in slider
    nextPrev.className += " " + slideVisible;
    nextPrev.setAttribute("style", "left:" + slideWidth + "px");

    var timer = setInterval(function () {

      var timePassed = Date.now() - start;

      if (timePassed >= 2000) { //easy to make animation time like input parameter
        clearInterval(timer); //ends after 2 sec

        setTimeout(function (){
          nextPrev.style.left = "";

          setTimeout(function (){
            current.className = current.className.replace(" " + currentSlide, "");
            current.style.left = "";

            setTimeout(function (){
              nextPrev.className = nextPrev.className.replace(slideVisible, currentSlide);
            },0);
          }, 0);
        }, 0);
      }

      // draw animation by passed time
      draw(timePassed, current, nextPrev);

    }, 20);

    //while timePassed goes from 0 to 2000 images slides
    function draw(timePassed, current, nextPrev) {
      var step = parseInt(slideWidth) / 2000;
      var counter = timePassed * step;
      current.style.left = "-" + counter + 'px';
      nextPrev.style.left = (parseInt(slideWidth) - counter) + "px";
    }
  }


  //previous button for loop
  function previous() {
    var index = 0;

    if (document.body.classList) {

      while (!slides[index].classList.contains(currentSlide)) {
        index++;
      }

      if (index === 0) {
        slides[slides.length - 1].classList.add(slideVisible);
        slides[slides.length - 1].style.transform = "translate(-" + slideWidth + ", 0)";

        setTimeout(function () {
          slides[index].style.transform = "translate(" + slideWidth + ", 0)";
          slides[slides.length - 1].style.transform = "translate(0, 0)";
        }, 100);
      } else {
        slides[index - 1].classList.add(slideVisible);
        slides[index - 1].style.transform = "translate(-" + slideWidth + ", 0)";

        setTimeout(function () {
          slides[index].style.transform = "translate(" + slideWidth + ", 0)";
          slides[index - 1].style.transform = "translate(0, 0)";
        }, 100);
      }

    } else { //code for IE9-
      //the same func as "next"
    }
  }


  function clearSlides() {
    var prevElem = slider.getElementsByClassName(currentSlide)[0];
    var current = slider.getElementsByClassName(slideVisible)[0];

    if (prevElem && current) {
      setTimeout(function () {
        current.classList.add(currentSlide);
        current.style.transform = "";

        setTimeout(function () {
          prevElem.classList.remove(currentSlide);
          current.classList.remove(slideVisible);
          prevElem.style.transform = "";
        }, 0);
      }, 0);
    }
  }

  if (document.body.classList) {
    slider.addEventListener("transitionend", clearSlides);
  }

  //loop for slider
  var timerId = setTimeout(function tick() {
    next();
    timerId = setTimeout(tick, 6000);
  }, 6000);
}

var mainSlider = new Slider("#main-slider");