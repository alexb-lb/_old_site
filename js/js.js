'use strict';

/*CLOSE/OPEN script for top nav*/
/*vars*/
var button = document.getElementById("navbar__toggle-button");
button.addEventListener("click", menuOpen);
var menu = document.querySelector(".top-nav");
var open = false;

/*"if" block for closing menu in different user actions*/
window.addEventListener('resize', menuClose);
window.addEventListener('scroll', menuClose);
window.addEventListener('click', function (e) {
    if (e.target !== button) menuClose();
});

function menuClose() {
    menu.style.maxHeight = '';
    open = false;
}

/*main close/open func*/
function menuOpen() {

    if (!open) {
        menu.style.maxHeight = "400px";
        open = true;
        menu.addEventListener("transitionend", menuHeight);
    } else {
        menu.style.maxHeight = '';
        open = false;
    }

    function menuHeight() {
        menu.style.maxHeight = menu.offsetHeight + 'px';
    }
}


/*TABS SCRIPT*/
window.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.profile-tabs__nav')) tabsScript();
});

function tabsScript() {
    var iconsContainer = document.querySelector('.profile-tabs__nav'); //вписать класс для контейнера иконок
    var tabs = document.querySelectorAll('.tab'); //задать класс, который присваивается каждой вкладке
    var icons = iconsContainer.children;

    /*сообщение об ошибке для облегечения использования в дальнейшем*/
    if (icons.length !== tabs.length) alert("Ошибка: количество иконок и вкладок не равны друг другу. Переключение вкладок будет работать неправильно");

    /*при загрузке страницы первая вкладка активная по умолчанию*/
    icons[0].classList.add('tab__icon--active');
    toggleTabsClasses();

    /*Повесил прослушку кликов на каждом элементе навигации (иконку)
     Прослушка на каждом элементе предпочтительнее прослушки на родителе тем, что
     не возникает проблем со вложенностью. Каждую иконку можно обернуть во сколько угодно тегов - и будет работать*/
    for (var i = 0; i < icons.length; i++) {
        icons[i].addEventListener('click', function (e) {
            switchTabs(e);
        });
    }

    /*Фукнция навешивает классы по умолчанию и задает класс для иконки, по которой кликнули*/
    function switchTabs(e) {
        for (var y = 0; y < icons.length; y++) {
            icons[y].classList.remove('tab__icon--active');
            tabs[y].classList.remove('tab--active');  //для плавного появления
            tabs[y].classList.add('tab--invisible');
        }
        e.currentTarget.classList.add('tab__icon--active');
        toggleTabsClasses();
    }

    /*Функция делает невидимыми все вкладки (табы) кроме той, у которой номер совпадает с активной иконкой*/
    function toggleTabsClasses() {

        for (var r = 0; r < tabs.length; r++) {

            if (!icons[r].classList.contains('tab__icon--active')) {
                tabs[r].classList.add('tab--invisible');
                tabs[r].classList.remove('tab--active');  //для плавного появления
                tabs[r].classList.remove('tab--opacity-1');  //для плавного появления
            } else {
                tabs[r].classList.remove('tab--invisible');
                tabs[r].classList.add('tab--active')
            }
        }

        /*только для плавного изменения opacity*/
        var activeTab = document.querySelector('.tab--active');
        setTimeout(function () {
            activeTab.classList.add('tab--opacity-1');
        }, 0);
    }

    /*анимация на активной иконке*/
    for (var x = 0; x < icons.length; x++) {
        icons[x].addEventListener('click', animateIcon)
    }

    function animateIcon(e) {
        e.currentTarget.classList.remove('icoZoom');
        var target = e.currentTarget;

        setTimeout(function (){
            target.classList.add('icoZoom');
        }, 20)
    }

}

/*SPRITE GALLERY resize*/
window.addEventListener('DOMContentLoaded', function () {
    /*название основного класса галереи*/
    if (document.querySelector('.gallery')) gallery();
});

function gallery() {
    /*Класс родителя(!) тега со спрайтом внутри*/
    var galleryContainers = document.querySelectorAll('.gallery-item__hover-block');

    /*Класс обертки, в которых спрайт фоном*/
    var gallerySprites = document.querySelectorAll('.gallery-item__img');

    var imgWidth = 700;  //задать ширину картинки в спрайте
    var imgHeight = 640; //задать высоту картинки в спрайте
    var difference = (imgHeight / imgWidth ).toFixed(2);

    calcBgPosition();
    resizeHeight();
    window.addEventListener('resize', resizeHeight);

    function calcBgPosition() {
        var bgPosition = 0; //для автоматической раздачи background-position, старт с 0
        var itemsAmount = galleryContainers.length - 1;
        for (var i = 0; i < galleryContainers.length; i++) {
            /*количество элементов в галерее должно соответствовать количеству изображений в спрайте.
             * Верхний элемент галереи = верхнему изображению в спрайте*/
            gallerySprites[i].style.backgroundPosition = '50% ' + (bgPosition + '%');
            bgPosition = bgPosition + (100 / itemsAmount);
        }
    }

    function resizeHeight() {
        /*вычисление высоты элементов галереи, пропорционально их ширине*/
        for (var i = 0; i < galleryContainers.length; i++) {
            var itemWidth = galleryContainers[i].offsetWidth;
            var itemHeight = Math.round(itemWidth * difference);
            galleryContainers[i].style.height = itemHeight + 'px';
        }
    }
}


/*change href, to delete anchor links*/
//window.addEventListener('DOMContentLoaded', changeHref);
//
//function changeHref() {
//    var loc = location.href;
//
//    if (loc.indexOf("#") !== -1) {
//        var newHrefEnds;
//
//        /*дополнительный слеш перед хэшем пришлось добавить, что бы IE правильно отображал переходы*/
//        if(loc.indexOf("/#") !== -1){
//            newHrefEnds = loc.indexOf("/#");
//        } else {
//            newHrefEnds = loc.indexOf("#")
//        }
//
//        var newHref = loc.slice(0, newHrefEnds);
//        setTimeout(function () {
//            history.replaceState(null, null, newHref);
//        }, 0);
//
//        /*for IE10-IE11*/
//        var anchor = document.getElementById('article-anchor');
//        var anchorTop = anchor.getBoundingClientRect().top;
//        if(anchorTop > 20){
//            window.scrollBy(0, anchorTop);
//        }
//    }
//}


/* ****animations**** */
/*сравнивая анимации, понял, что для отображения в главное меню - очень долго*/
//menu.addEventListener('animationend', function (e) {
//  setTimeout(shake(e), 150);
//});
//
//function shake(e) {
//  if (e.target !== menu.lastElementChild) {
//    menu.classList.toggle('shakeRight');
//  }
//}

