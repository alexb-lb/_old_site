'use strict';

/******** Gallery slider ********/
function Slider(elem) {
  this.gallery = document.querySelector(elem);
  this.slider = document.querySelector(".slider");
  if (this.gallery) this.init();
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

$(document).ajaxComplete(function () {
  var galSlider = new Slider(".gallery");
});


/************* PLAN GALLERY **************/
function FloorGallery(elem) {
  this.gallery = document.querySelector(elem);
  if (this.gallery) this.init();
};

FloorGallery.prototype = {

  init: function () {
    this.wrapper = this.gallery.querySelector(".floors-wrapper");
    this.floorImages = this.wrapper.children;
    this.thumbsWrapper = this.gallery.querySelector(".plan-box__thumbs");
    this.thumbs = this.thumbsWrapper.children;
    this._animationEnd = true;

    //проверка соответствия количества миниатюр с количеством изображений в галерее этажей
    this.checkImgCount();
    //обработка кликов по этажам
    this.clickHandler();
    //проверка окончания очередного этапа анимации
    this.isAnimationEnd();

    //проверка, открыто ли первое изображение при загрузке страницы
    if (!this.floorImages[0].classList.contains("floor--active")) {
      this.floorImages[0].classList.add("floor--active");
    }
  },

  //проверка соответствия количества миниатюр с количеством изображений в галерее этажей
  checkImgCount: function () {
    if (this.thumbs.length !== this.floorImages.length)
      alert("Внимание! Количество миниатюр не равно количеству изображений этажей, возможны ошибки в отображении");
  },

  //проверка, идет ли анимация
  isAnimationEnd: function () {
    var self = this;
    self.wrapper.addEventListener("transitionend", function () {
      self._animationEnd = true;
    });
  },

  //обработчик кликов
  clickHandler: function () {
    var self = this;

    self.thumbsWrapper.addEventListener("click", function (e) {
      e.preventDefault();

      //если анимация перехода завершена, начинает работать хендлер
      if (self._animationEnd) {
        var target = e.target;

        //вычисляет, клик сделан на миниатюре или просто во враппере со миниатюрами
        while (target !== this) {
          if (target.classList.contains("thumb")) { // *** логическое && приводит к багам, разобраться, почему
            if (!target.classList.contains("active")) self.changeImage(target);
            return;
          }
        }
      }
    });
  },

  // раздача классов для управления анимациями
  changeImage: function (target) {
    var self = this;
    var index = 0;
    self._animationEnd = false;

    //удаление предыдущих активных класса
    for (var i = 0; i < self.thumbs.length; i++) {
      self.thumbs[i].classList.remove("active");
    }
    ;
    for (var y = 0; y < self.floorImages.length; y++) {
      self.floorImages[y].classList.remove("floor--active");
      self.floorImages[y].style.transform = "";
    }
    ;

    // I первый этап анимации, центрирование слоев
    self.wrapper.style.transform = "translate(0, -190px)"; // можно подбирать высоту на основе border-box элементов

    // проверка, идет ли анимация в данный момент
    checkAnimationEnd();

    function checkAnimationEnd() {
      if (self._animationEnd) {
        magicBicycle(); //как только анимация закончена, старт второго этапа
      } else {
        setTimeout(function () {
          checkAnimationEnd();
        }, 50);
      }
    };

    // II этап анимации - вытеснение слоев активным изображением
    function magicBicycle() {
      // активный класс для миниатюр слоев и  активный класс по индексу соответственно индекса ссылки
      for (index; index < self.thumbs.length; index++) {
        if (target === self.thumbs[index]) {
          target.classList.add("active");
          self.floorImages[index].classList.add("floor--active");
          break;
        }
      }
      ;

      //создает эффект вытеснения слоев вверх активным изображением
      var pushUpperImg = 300;
      for (var i = index - 1; i >= 0; i--) {
        self.floorImages[i].style.transform = "translate(0, -" + pushUpperImg + "px)";
        pushUpperImg += 80;
      }

      //двигает по оси Y контейнер с изображениями, что бы активное изображение встало по центру контейнера
      var offsetTop = 80; // height + margin + padding слоев в свернутом состоянии (.floor)
      if (index === 0) {
        self.wrapper.style.transform = "translate(0, 0)";
      } else {
        offsetTop = offsetTop * index;
        self.wrapper.style.transform = "translate(0, -" + offsetTop + "px)";
      }
    }

  },
};

var planGallery = new FloorGallery(".plan-box");

$(document).ajaxComplete(function () {
  var planGallery = new FloorGallery(".plan-box");
});


/************* изменение контента по клику на пункт меню (без ajax) **********/
function changePageContent(wrapper) {
  var container = document.querySelector(wrapper);
  var contentNav = container.querySelector(".content-nav");
  var contentHeaders = contentNav.children;
  var contentBlocks = container.querySelectorAll("[data-content]");

  if (contentNav) clickHandler(); //если это вообще нужная страница открыта

  function clickHandler(){
    console.log("working");
    contentNav.addEventListener("click", function (e) {
      e.preventDefault();
      identifyTarget(e.target.parentNode);
    });
  }

  // передача нужных названий элементов в основную функцию в зависимости от того, на каком элементе был клик
  function identifyTarget(target){
    switch (target.getAttribute("data-content-header")){
      case "about":
        changeContent("about", target);
        break;
      case "gallery":
        changeContent("gallery", target);
        break;
      case "plan":
        changeContent("plan", target);
        break;
      case "map":
        changeContent("map", target);
        break;
      default :
        break;
    }
  }

  //основная функция подмены контента без перезагрузки страницы (как табы)
  function changeContent(content, target){
    //удаление активных классов с текущего пункта меню
    for(var i = 0; i < contentHeaders.length; i++){
      if(contentHeaders[i].classList.contains("active"))
      contentHeaders[i].classList.remove("active");
    }
    target.classList.add("active"); //добавление на новый пункт меню

    for(var y = 0; y < contentBlocks.length; y++){
      if(contentBlocks[y].getAttribute("data-content") === content){
        contentBlocks[y].classList.remove("hidden")
      } else {
        contentBlocks[y].classList.add("hidden");
      }
    }
  }
};

changePageContent(".page-content");

$(document).ajaxComplete(function () {
  changePageContent(".page-content");
});


/********* FancyBox ***********/
//запуск FancyGallery по клику на элемент
$(document).on("click", ".fancy-gal", function () {

  // сборка галереи
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


/********* AJAX requests **********/

$("body").on("click", ".page-next", function (e) {
  e.preventDefault();
  $.ajax({
    url: "html/page2.html",
    cache: false,
    success: function (html) {
      $("main").replaceWith(html);
    }
  })
});

$("body").on("click", ".page-prev", function (e) {
  e.preventDefault();

  $.ajax({
    url: "html/page1.html",
    cache: false,
    success: function (html) {
      $("main").replaceWith(html);
    }
  })
});
