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
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  // 각 구간에 대한 정보
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 스크롤 높이
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 300, //image갯수
        imageSequence: [0, 299], // image 순서
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 시작값, 끝값, {애니메이션이 재생되는 구간} 10%~20%구간
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }], // 30%~40%구간
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }], // 50%~60%구간
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }], // 70%~80%구간
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }], // 25%구간부터 사라지기 시작 ~ 30%구간 완전히 사라짐
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      }
    },
    {
      //1
      type: "normal",
      // heightNum: 5, // type normal에서는 필요 없음
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
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin')
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
        messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
        messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
      }
    },
    {
      // 3
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 스크롤 높이
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector('.canvas-caption'),
      },
      values: {

      }
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
    // console.log(sceneInfo[0].objs.videoImages);
  }
  setCanvasImages();


  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
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

    //원래 캔버스의 높이인 1080과 window.innerHeight값을 비교
    const heightRatio = window.innerHeight / 1080; // 캔버스 height 1080대비 윈도우창 높이의 비율 구하기
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  function calcValues(values, currentYOffset) { // sceneInfo[i].values, 현재 씬에서 얼마나 스크롤 됐는지
    let rv; // return해줄 values
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; //얼만큼 스크롤 됐는지 / 현재 씬의 스크롤 높이

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0]; // 전체 범위 + 초기값
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight; // 현재씬에서 얼만큼 스크롤 했는지 비율 
    const scrollHeight = sceneInfo[currentScene].scrollHeight; //현재 씬의 scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // 현재씬에서 얼만큼 스크롤 했는지 비율 / 현재 씬의 scrollHeight;

    // console.log(currentScene);
    // console.log(currentScene, currentYOffset); // 현재 씬이 몇번째 씬이고 몇픽셀 스크롤 됐는지
    switch (currentScene) {
      case 0:
        // console.log('0 play');
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.context.drawImage(objs.videoImages[sequence], 0, 0); //drawImage(그릴 이미지,x,y,w,h)
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
        // console.log(sequence);

        if (scrollRatio <= 0.22) {
          //in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
          //translate3d(x,y,z) 하드웨어 가속이 보장되기 때문에 translate3d를 사용한다.
        } else {
          //out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          //in
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
          //translate3d(x,y,z) 하드웨어 가속이 보장되기 때문에 translate3d를 사용한다.
        } else {
          //out
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          //in
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
          //translate3d(x,y,z) 하드웨어 가속이 보장되기 때문에 translate3d를 사용한다.
        } else {
          //out
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          //in
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
          //translate3d(x,y,z) 하드웨어 가속이 보장되기 때문에 translate3d를 사용한다.
        } else {
          //out
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
        }
        // console.log(messageA_opacity_in);
        break;

      case 2:
        // console.log('2 play');
        if (scrollRatio <= 0.25) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.57) {
          // in
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
          // objs.pinB.style.opacity = calcValues(values.pinB_opacity_in, currentYOffset);
        } else {
          // out
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;

        }

        if (scrollRatio <= 0.83) {
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
          // objs.pinC.style.opacity = calcValues(values.pinc_opacity_in, currentYOffset);
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        }

        break;
      case 3:
        // console.log('3 play');
        break;
    }
  }

  // 몇 번째 스크롤 섹션이 스크롤 중인지 판별하는 함수
  function scrollLoop() {
    enterNewScene = false; //스크롤을 할때 마다 기본으로 false
    prevScrollHeight = 0; // scrollHegith의 값이 누적되지 않도록 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    // console.log(prevScrollHeight);
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {// 현재 위치가 이전 섹션들의 높이값 + 현재 보고있는 씬 높이값 보다 크다면
      enterNewScene = true; // 씬이 바뀌는 순간에 true
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`); // 바뀔때만 id를 넣어줌
    }
    if (yOffset < prevScrollHeight) {// 현재 위치가 이전 섹션들의 높이값 보다 작다면
      enterNewScene = true; // 씬이 바뀌는 순간에 true
      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`); // 바뀔때만 id를 넣어줌
    }

    if (enterNewScene) return; // enterNewScene이 true면 씬이 바뀌는 순간일 때 함수를 종료(계산 오차 해결하기 위함)
    playAnimation();
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
  window.addEventListener('load', () => {
    setLayout();
    // 첫번째 이미지 그려줌
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  });
  window.addEventListener('resize', setLayout); // 브라우저 창 사이즈 변경될 때 scrollHeight값 재 설정

})();
