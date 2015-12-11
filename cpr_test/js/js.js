'use strict';

/******** Gallery slider ********/
function Slider(elem) {
  this.gallery = document.querySelector(elem);
  this.slider = document.querySelector(".slider");
  this.init();
}

Slider.prototype = {
  init: function () {
    this.wrapper = this.slider.querySelector(".slides-wrapper");
    this.slides = this.wrapper.children;
    this.index = 1;
    this._animationEnd = true;

    //раздача классов и атрибутов для управления слайдером
    this.controlData();
    //обработчики событий: по клику и по окончанию анимации
    this.clickHandler();
    this.cleanDOM();
  },

  //задаю контроль над слайдером
  controlData: function () {
    this.slides[this.index].classList.contains("active") ?
      true : this.slides[this.index].classList.add("active");

    var fullsizeHref = this.gallery.querySelector(".active").getAttribute("href");
    this.gallery.querySelector(".current-img").src = fullsizeHref;
    this.gallery.querySelector(".fancy-gal").href = fullsizeHref;

    this.slides[this.index].querySelector("img").setAttribute("data-slide", "current");
    this.slides[this.index - 1].querySelector("img").setAttribute("data-slide", "prev");
    this.gallery.querySelector(".slide-prev").setAttribute("data-slide", "prev");
    this.slides[this.index + 1].querySelector("img").setAttribute("data-slide", "next");
    this.gallery.querySelector(".slide-next").setAttribute("data-slide", "next");
  },

  //чистка DOM от лишних элементов по окончанию анимации
  cleanDOM: function () {
    var self = this;

    this.wrapper.addEventListener("transitionend", function () {
      for (var i = 0; i < self.slides.length; i++) {
        self.slides[i].classList.contains("active") ?
          self.slides[i].classList.remove("active") : true;
      }

      for (var y = 0; y < self.slides.length; y++) {
        self.slides[y].getAttribute("data-slide") === "delete" ?
          self.slides[y].parentNode.removeChild(self.slides[y]) : true;
      }
      self._animationEnd = true;
      self.controlData();
    });
  },

  //прослушка кликов
  clickHandler: function () {
    var self = this;
    //вешаю обработчик кликов навесь контейнер, отлов по всплытию
    this.gallery.addEventListener("click", function (e) {
      e.preventDefault();

      if (self._animationEnd) {
        switch (e.target.getAttribute("data-slide")) {
          case "prev":
            self.prev();
            break;
          case "next":
            self.next();
            break;
          default:
            break;
        }
      }
    })
  },

  //кнопка "назад"
  prev: function () {
    var lastElem = this.slides[this.slides.length - 1];
    var lastElemCopy = lastElem.cloneNode(true);

    lastElem.setAttribute("data-slide", "delete");
    lastElemCopy.style.marginLeft = "-186px";
    this.wrapper.insertBefore(lastElemCopy, this.wrapper.firstElementChild);

    setTimeout(function () {
      lastElemCopy.style.marginLeft = "";
    }, 40);

    this._animationEnd = false;
  },

  //кнопка "вперед"
  next: function () {
    var prevElem = this.slides[0];
    var prevElemCopy = prevElem.cloneNode(true);

    prevElem.setAttribute("data-slide", "delete");
    prevElem.style.marginLeft = "-186px";
    this.wrapper.appendChild(prevElemCopy);

    this._animationEnd = false;
  }
};

var galSlider = new Slider(".gallery");

$(document).ajaxComplete(function (){
  var galSlider = new Slider(".gallery");
});



/********* FancyBox ***********/
//запуск FancyGallery по клику на элемент
$(document).on("click", ".fancy-gal", function () {

  //динамически собираю галерею
  var fancyGallery = [];
  $(".slides-wrapper a").each(function () {
    var href = $(this).attr("href");
    var obj = {};
    obj.href = href;
    fancyGallery.push(obj);
  });

  $.fancybox(fancyGallery, {
    "loop": true,
    "autoPlay": true,
    "playSpeed": 4000,
    "nextSpeed": 500,
    "prevSpeed": 500,
    "openSpeed": 500,
    "speedOut": 500,
    "openEffect": "fade",
    "closeEffect": "fade",
    "nextEffect": "fade",
    "prevEffect": "fade",
    "index": 1,
    helpers: {
      buttons: {}
    }
  });
});

/********* AJAX request **********/
$("body").on("click", ".page-next", function (e){
  e.preventDefault();

  $.ajax({
    url: "html/page2.html",
    cache: false,
    success: function(html){
      $("main").replaceWith(html);
    }
  })
});

$("body").on("click", ".page-prev",  function (e){
  e.preventDefault();

  $.ajax({
    url: "html/page1.html",
    cache: false,
    success: function(html){
      $("main").replaceWith(html);
    }
  })
});
