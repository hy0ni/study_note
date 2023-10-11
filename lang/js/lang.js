const active = "is-active";
const $lang = $(".gnb-lang");
const $select = $lang.find(".selected");
const $list = $lang.find(".lang-list");
const $item = $list.find('.item');
let $beforeLng = 'ko';

$select.on('click', function (e) {
  $list.stop().slideToggle(300);
  $beforeLng = this.dataset.change;
})
$(document).click(function (e) {
  const notItem = $(e.target).is(".item"); //$("선택요소").is("비교할 요소 또는 표현식);
  const notSelected = $(e.target).is(".selected");

  if ($list.css("display") == "block" && !notItem && !notSelected) {
    $list.stop().slideToggle(300);
  }
});


$item.on('click', function () {
  $list.slideUp(300);
  langEvent($(this).data('change'), $select, $beforeLng);
  $item.removeClass(active);
  $(this).addClass(active);
});

function langEvent(lng, selector, beforeLng) {
  // .select의 다음 요소 .lang-list의 data-change를 가지고 있는 자식
  let $target = selector.next().children(`[data-change=${lng}]`);
  //.select.text를 data-change를 가지고 있는 .item의 text로 변경하고 data-change의 lng을 바꿔라
  selector.text($target.text()).attr('data-change', lng);
  $('html').attr('lang', lng); //html의 lang속성도 변경

  //언어변경에 따른 dropdown 클래스 세팅
  selector.next().children().removeClass(active);
  $target.addClass(active)

  getJson(lng, beforeLng);
}

/*************************************************
* Translate Langauge (다국어 처리)
*************************************************/
/* SET/GET Cookie */
// setCookie함수를 이용해 브라우저 쿠키에 저장
const setCookie = function (name, value, day) {
  let date = new Date();
  date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000); //1 day
  document.cookie = `${name} = ${value}; expires = ${date.toUTCString()}; path=/`;
}
// 페이지 로드시 쿠키유무 여부를 판단하여 케이스에 따라 세팅
const getCookie = function (name) {
  let value = `document.cookie.match('(^|;) ?${name}=([^;]*)(;|$)')`;
  return value ? value[2] : null;
};

/* updateContent : Content txt 다국어 처리 */
const updateContent = function (obj, lng) {
  setCookie('langauge', lng, 1);
  $('.gnb-lang').val(lng);

  const objs = $('[data-lang]');
  objs.each(function () {
    const $this = $(this);
    const value = getDataKey(obj, $(this).data('lang'))
    if ($this.is('[placeholder]')) {
      $this.attr('placeholder', value)
    } else if ($this.is('input[value]')) {
      $this.attr('value', value)
    } else if ($this.is('[content]')) {
      $this.attr('content', value)
    } else {
      $this.html(value)
    }
  });

  // body에 ko or en이라면? ko나 en만 붙여주고 : 그외의 언어라면 en을 같이 붙여줌
  lng === 'ko' || lng === 'en'
    ? $('body').attr("class", lng)
    : $('body').attr("class", lng + 'en');
}

/* getDataKey : data-lang값을 object key값으로 사용 */
const getDataKey = function (obj, key) {
  let arrKey = key.split('.');
  let objs = obj;
  let value;

  for (var i = 0; i < arrKey.length; i++) {
    let arr = objs[arrKey[i]];

    if (typeof arr == "object") {
      objs = arr;
    } else {
      value = arr;
    }

  }
  return value
}

/* getJson : import JSON. */
const getJson = function (lng, beforeLng) {
  $.ajax({
    url: `./js/locales/${lng}.json`,
    dataType: "json",
    async: false,
    success: function (data) {
      updateContent(data, lng, beforeLng)
    }
  })
}