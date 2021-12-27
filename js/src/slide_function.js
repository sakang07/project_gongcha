// slide_function.js

// ==============================================
// 1. data 불러오기
// 2. 불러온 data의 길이만큼 슬라이드와 인디케이터 생성
// 3-1. 슬라이드 좌우 버튼 동작
// 3-2. 슬라이드 좌우 버튼에 따른 인디케이터 동작
// 4. 인디케이터 클릭하면 해당 슬라이드로 이동
// 5. 일정 시간마다 다음 슬라이드로 이동
// * setTimeout 고치기
// ==============================================

(()=>{
// ==============================================

// 변수-------------------------------------
const elViewBox = document.querySelector('#viewBox');

// pc_view_arrow
const elViewBtn = elViewBox.querySelector('.view_btn');
const elViewBtnNext = elViewBtn.querySelector('.next > a');
const elViewBtnPrev = elViewBtn.querySelector('.prev > a');

// pc_view_indicator
const elViewIndi = elViewBox.querySelector('.view_indicator');
const elIndiCircle = elViewIndi.querySelector('.indi_circle');

// mob_view_indicator
const elIndiNum = elViewIndi.querySelector('.indi_number');
const elIndiNumNow = elIndiNum.querySelector('.now');
const elIndiNumTotal = elIndiNum.querySelector('.total');

// view_content
const elViewCont = elViewBox.querySelector('.view_content');

const sildeLen = BANNER_DATA.length; // 슬라이드 개수
const slideW = 100 / (sildeLen + 1); // 복제 슬라이드 포함 슬라이드 전체 너비
const TIME_ANI = 500; // 슬라이드 애니메이션 시간
const TIME_MOVE = 3000; // 슬라이드 자동으로 이동하는 시간
let SLIDE_COUNT = 0;
let slideGo;


const CK_ACTIVE = 'on';
let PERMISSION = true;


// 기능-------------------------------------

// slide 
// view_content > ul 생성해서 집어넣기
const mkViewContUl = document.createElement('ul');
elViewCont.append(mkViewContUl);
const elViewContUl = elViewCont.querySelector('ul');

// data의 길이만큼 li.view_content_inner 요소 생성
for (let i = 0; i < sildeLen; i++) {
  const _mkViewContLi = document.createElement('li');
  let _dataSelect = BANNER_DATA[i];

  const _DATA_CODE = `<div class="view_text">
    <dl><dt>${_dataSelect.titleText}</dt><dd>${_dataSelect.contentText}</dd><dd class="btn_small full_wrap"><a href="${_dataSelect.url}">바로가기</a></dd></dl>
  </div><div class="view_img"></div>`;

  _mkViewContLi.innerHTML = _DATA_CODE;
  elViewContUl.append(_mkViewContLi);
  _mkViewContLi.setAttribute('class', 'view_content_inner');

  // 순번에 맞는 이미지 배경 삽입
  const _imgPath = '../multi/img/'
  const _elViewImg = elViewCont.querySelectorAll('.view_img');
  _elViewImg[i].style.backgroundImage = `url(${_imgPath}${_dataSelect.img})`;
}

// data의 길이만큼 슬라이드 너비(ul width) 설정
elViewContUl.style.width = `calc(100% * ${sildeLen + 1})`;

// 맨 앞 슬라이드 복제해서 맨 뒤에 붙이기
const elViewContLi = elViewContUl.querySelectorAll('li');
const elViewContLiArr = [...elViewContLi];
const elViewContLiFirst = elViewContLiArr.at(0); // 첫 번째 슬라이드 요소 선택
const cloneSlide = elViewContLiFirst.cloneNode(true); // 요소 내부까지 복제
elViewContUl.append(cloneSlide); // 복제한 요소 맨 앞으로 삽입

// indicator 
// data의 길이만큼 mobile .view_indicator 숫자 변경
elIndiNumTotal.innerText = sildeLen;

// data의 길이만큼 pc .view_indicator 생성
for (let i = 0; i < sildeLen; i++) {
  let _dataSelect = BANNER_DATA[i];

  const _mkViewIndiLi = document.createElement('li');
  const _DATA_CODE = `<a href="#"><span>${_dataSelect.titleText}</span></a>`;
  _mkViewIndiLi.innerHTML = _DATA_CODE;
  elIndiCircle.append(_mkViewIndiLi);
  const _elIndiCircleLi = elIndiCircle.querySelectorAll('li');
  _elIndiCircleLi[0].classList.add(CK_ACTIVE);
}

const elIndiCircleLi = elIndiCircle.querySelectorAll('li');
const elIndiCircleLiA = elIndiCircle.querySelectorAll('li > a');



// 함수-------------------------------------

// 해당 슬라이드로 이동하는 함수
fnMoveSlide = (el, idx) => {
  el.style.transform = `translateX(-${idx * slideW}%)`;
  el.style.transition = `all ${TIME_ANI}ms ease`;
};

// 다음 인디케이터로 이동하는 함수
fnNextIndiCir = (el, idx) => {
  el.forEach((d, i) => {
    i === idx ? el[i].classList.add(CK_ACTIVE) : el[i].classList.remove(CK_ACTIVE);
  })
};

// 전체 배열 중 선택한 순번을 제외한 나머지 형제 선택하는 함수
const fnSiblings = (select, idx) => {
  const otherArr = [];
  select.forEach((d,i) => {
    if(idx !== i) {
      otherArr.push(d);
    }
  });
  return otherArr;
};

// 다음 슬라이드로 이동하는 함수
fnNextSlide = e => {
  e.preventDefault();

  if(PERMISSION) {
    PERMISSION = false;

    if (SLIDE_COUNT < sildeLen - 1) { 
      SLIDE_COUNT++;
      fnMoveSlide(elViewContUl, SLIDE_COUNT);
      fnNextIndiCir(elIndiCircleLi, SLIDE_COUNT);
      PERMISSION = true;
    } else {
      // 마지막 슬라이드에서 첫 슬라이드로 넘어갈 때 무한루프 처리
      SLIDE_COUNT++;
      fnMoveSlide(elViewContUl, SLIDE_COUNT);
      fnNextIndiCir(elIndiCircleLi, 0);
      // 넘어간 후 복제 슬라이드에서 첫 번째 슬라이드로 이동
      setTimeout(e => {
        elViewContUl.style.transform = null;
        elViewContUl.style.transition = null;
        SLIDE_COUNT = 0;
        PERMISSION = true;
      }, TIME_ANI);
    }
  }
};

// 이전 슬라이드로 이동하는 함수
fnPrevSlide = e => {
  e.preventDefault();

  if(PERMISSION) {
    PERMISSION = false;

    if (0 < SLIDE_COUNT && SLIDE_COUNT <= sildeLen - 1) { 
      SLIDE_COUNT--;
      fnMoveSlide(elViewContUl, SLIDE_COUNT);
      fnNextIndiCir(elIndiCircleLi, SLIDE_COUNT);
      PERMISSION = true;
    } else {
      // 첫 슬라이드에서 마지막 슬라이드로 넘어갈 때 무한루프 처리
      // 첫 번째 슬라이드가 복제된 마지막 슬라이드로 이동
      elViewContUl.style.transition = null;
      elViewContUl.style.transform = `translateX(-${sildeLen * slideW}%)`;
      SLIDE_COUNT = sildeLen - 1;
      fnNextIndiCir(elIndiCircleLi, sildeLen - 1);
      
      // 복제된 마지막 슬라이드에서 이전 슬라이드로 이동
      setTimeout(e => {
        fnMoveSlide(elViewContUl, SLIDE_COUNT);
        PERMISSION = true;
      }, 1);
    }
  }
};

// 자동으로 슬라이드가 넘어가는 함수
const fnIntervalSlide = () => {
  slideGo = setInterval(() => {
    if (SLIDE_COUNT < sildeLen - 1) { 
      SLIDE_COUNT++;
      fnMoveSlide(elViewContUl, SLIDE_COUNT);
      fnNextIndiCir(elIndiCircleLi, SLIDE_COUNT);
    } else {
      // 마지막 슬라이드에서 첫 슬라이드로 넘어갈 때 무한루프 처리
      SLIDE_COUNT++;
      fnMoveSlide(elViewContUl, SLIDE_COUNT);
      fnNextIndiCir(elIndiCircleLi, 0);
      // 넘어간 후 복제 슬라이드에서 첫 번째 슬라이드로 이동
      setTimeout(e => {
        elViewContUl.style.transform = null;
        elViewContUl.style.transition = null;
        SLIDE_COUNT = 0;
      }, TIME_ANI);
    }
  }, TIME_MOVE);
};

const fnPauseSlide = () => {
  clearInterval(slideGo);
};

// 기본 함수 수행-----------------------------
fnIntervalSlide();


// 이벤트-------------------------------------

// pc: 오른쪽 버튼 누르면 오른쪽으로 슬라이드 이동
elViewBtnNext.addEventListener('click', fnNextSlide);

// pc: 왼쪽 버튼 누르면 왼쪽으로 슬라이드 이동
elViewBtnPrev.addEventListener('click', fnPrevSlide);

// pc: 인디케이터 누르면 해당 슬라이드 이동
elIndiCircleLiA.forEach((d, i) => {
  d.addEventListener('click', e => {
    e.preventDefault();
    // 클릭한 요소의 순서 파악
    SLIDE_COUNT = i;
    
    // .on 포함한 클래스 파악
    const ckContains = d.parentNode.classList.contains(CK_ACTIVE);

    // 전체 요소 중에 누른 요소를 제외한 요소에 .on 제거    
    fnSiblings(elIndiCircleLi, i).forEach(d => {
      d.classList.remove(CK_ACTIVE);
    })

    // 클릭한 요소에 .on이 없으면 추가
    if(!ckContains){
      d.parentNode.classList.add(CK_ACTIVE);
    }

    // 클릭한 요소의 순번으로 슬라이드 이동
    fnMoveSlide(elViewContUl, SLIDE_COUNT);
  });
});

// 광고 영역에 마우스 올리면 슬라이드 일시정지
elViewBox.addEventListener('mouseenter', fnPauseSlide);

// 광고영역에서 마우스 벗어나면 광고 슬라이드 다시 재생
elViewBox.addEventListener('mouseleave', fnIntervalSlide);



})();