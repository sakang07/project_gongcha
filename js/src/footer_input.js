// footer_input.js

// 1. html template 삽입

{

  // 변수
  const elBody = document.querySelector('body');
  const elWrap = elBody.querySelector('#wrap');
  const elFootBox = elWrap.querySelector('#footBox');

  const dataUrl = './temp/base/footer.html';

  // 기능 ------------------------------------------
  // data 불러오기
  fetch(dataUrl)
    .then(response => response.text())
    .then(data => {elFootBox.innerHTML = data});

}