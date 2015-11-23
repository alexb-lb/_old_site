'use strict';

/*AUTOSUBMIT CALC FORM*/
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
      return checkStr();
    }

    function checkStr() {
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

  function createErrorMsg(target, className, msg) {
    var errorTag = document.createElement("div"); //making an error div
    form.appendChild(errorTag);
    errorTag.className = className;
    errorTag.innerHTML = msg;
    errorTag.style.top = target.offsetTop + "px";

    //remove error msg after a period of time
    setTimeout(function () {
      errorTag.parentNode.removeChild(errorTag);
    }, 2000);
  }
};

calcutator("#calc-form");



