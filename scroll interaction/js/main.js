/*
timeline----->
      0         1          2          3
|----------|----------|----------|----------|
0        3000        7000       9000
스크롤 높이에 따라 재생시간이 결정 됨
(()=>{})(); // 즉시 호출 함수 사용: 전역 변수 사용을 피하기 위함

window.pageYOffset 문서가 현재 수직축을 따라 스크롤되는 픽셀 수를 0.0값으로 리턴한다.
*/
(() => {

  let yOffset = 0; // window.pageYOffset 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

  // 각 구간에 대한 정보
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 스크롤 높이
      objs: {
        container: document.querySelector("#scroll-section-0"),
      },
    },
    {
      //1
      type: "normal",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 스크롤 높이
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 스크롤 높이
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 스크롤 높이
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) { // 현재 스크롤 위치보다 totalScrollHeight가 크거나 같으면 
        currentScene = i; // currentScene에 현재 보고있는 씬을 넣어주고
        break; // 루프를 빠져나옴
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }


  // 몇 번째 스크롤 섹션이 스크롤 중인지 판별하는 함수
  function scrollLoop() {
    prevScrollHeight = 0; // scrollHegith의 값이 누적되지 않도록 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    // console.log(prevScrollHeight);
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      // 현재 위치가 이전 섹션들의 높이값 + 현재 보고있는 씬 높이값 보다 크다면
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`); // 바뀔때만 id를 넣어줌
    }
    if (yOffset < prevScrollHeight) {
      // 현재 위치가 이전 섹션들의 높이값 보다 작다면
      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`); // 바뀔때만 id를 넣어줌
    }
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset; // 스크롤시 y값 갱신
    scrollLoop(); //스크롤시 실행되는 함수
  });

  /*
  load: 웹페이지의 모든 리소스들이 로드된 후 실행
  DOMContentLoaded: HTML DOM요소들이 로드 된 후 실행(이미지 등은 로드가 되지 않아도 실행 됨)
  */
  // window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener('load', setLayout);
  window.addEventListener('resize', setLayout); // 브라우저 창 사이즈 변경될 때 scrollHeight값 재 설정

})();
