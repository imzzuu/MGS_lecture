function kSlider() {
  /* 노드 준비 */
  // const kindWrap = document.querySelector(".kind_wrap");

  const slider = document.querySelector(".slider");
  const kindWrap = document.createElement("div");
  const kindSliser = document.createElement("div");
  kindWrap.className = "kind_wrap";
  kindSliser.className = "kind_slider";
  slider.parentNode.insertBefore(kindWrap, slider);
  kindWrap.appendChild(kindSliser);
  kindSliser.appendChild(slider);

  //   querySelectorAll 은 배열을 반환(실제 배열은 아님)
  const slideLis = slider.querySelectorAll("li");
  // const moveBtn = kindWrap.querySelector(".arrow");
  const cloneA = slideLis[0].cloneNode(true);
  const cloneC = slideLis[slideLis.length - 1].cloneNode(true);
  // 두 번째 인자 앞에 첫 번째 인자를 넣어라
  slider.insertBefore(cloneC, slideLis[0]);
  slider.appendChild(cloneA);
  // 만들고 나서 다시 한번 li의 갯수를 세야함 => slideCloneLis
  // (이 밑으로 가져오면 슬라이더를 통해 차일드를 만들 수 없기 때문에)

  /* 버튼 만들기 */
  // // innerHTML
  // const moveBtn = document.createElement("div");
  // moveBtn.className = "arrow";
  // moveBtn.innerHTML = `
  // <a href="" class="prev">이전</a>
  // <a href="" class="next">다음</a>
  // `;
  // kindWrap.appendChild(moveBtn);

  // 하나씩 만들어 붙이기
  const moveBtn = document.createElement("div");
  moveBtn.className = "arrow";
  const prevA = document.createElement("a");
  const nextA = document.createElement("a");
  prevA.className = "prev";
  nextA.className = "next";
  prevA.href = "";
  nextA.href = "";
  prevA.textContent = "이전";
  nextA.textContent = "다음";
  moveBtn.appendChild(prevA);
  moveBtn.appendChild(nextA);
  kindWrap.appendChild(moveBtn);

  /* 주요 변수 초기화*/
  let moveDist = 0;
  let currentNum = 1;
  const speedTime = 500;

  /* ul의 넓이 계산 및 CSSOM 셋업 */
  const slideCloneLis = slider.querySelectorAll("li");
  const liWidth = slideLis[0].clientWidth;
  const sliderWidth = liWidth * slideCloneLis.length;
  slider.style.width = `${sliderWidth}px`;
  moveDist = -liWidth;
  slider.style.left = `${moveDist}px`;

  // function sample (){
  //     return moveDist = currentNum++
  // }
  // 이건 콜스텍 연결이 끊기면 사라집
  // 함수가 끝나는 시점에 외부 참조가 없어서 가비지컬렉션에 의해 수거대상이 되기 때문

  /* 이벤트 리스너 */
  // 외부 참조(객체 메모리 참조)를 하기 때문에 콜스텍이 없어져도 데이터가 사라지지 않음

  moveBtn.addEventListener("click", (e) => {
    // btn 아니고 a 태그라서 이벤트가 생기면 새로고침됨 그걸 막아주는 것
    e.preventDefault(); // 이벤트 객체의 메서드
    // btn 에 이벤트 버블링을 통해서 e.target으로 컨트롤하기

    const move = (n) => {
      currentNum += -1 * n;
      moveDist += liWidth * n;
      slider.style.left = `${moveDist}px`;
      slider.style.transition = `${speedTime}ms ease`;
    };

    if (e.target.className === "next") {
      // 다음이 눌렸을 때
      move(-1);
      if (currentNum === slideCloneLis.length - 1) {
        // 마지막이면
        setTimeout(() => {
          slider.style.transition = "none"; // 애니메이션 끄고
          moveDist = -liWidth; // 진짜 A 값으로 만들고
          slider.style.left = `${moveDist}px`; // 진짜 A를 보여줌
          currentNum = 1;
        }, speedTime); // 여기 때문에 0.5 아닌 500 으로 설정해야함
      }
    } else {
      move(1);
      if (currentNum === 0) {
        setTimeout(() => {
          slider.style.transition = "none";
          moveDist = -liWidth * (slideCloneLis.length - 2);
          slider.style.left = `${moveDist}px`;
          currentNum = slideCloneLis.length - 2;
        }, speedTime);
      }
    }

    //   // 페이크 전
    //   //   let moveDist = 0;
    //   //     let currentNum = 0;

    //   if (e.target.className === "next") {
    //     // 다음이 눌렸을 때
    //     if (currentNum === slideLis.length - 1) return;
    //     // 무한 루프
    //     //   currentNum = 0;
    //     //   moveDist = 0;
    //     //   slider.style.left = `${moveDist}px`;
    //     move(-1);
    //     // 코드 줄이기 전
    //     // currentNum++;
    //     // moveDist += -liWidth;
    //     // slider.style.left = `${moveDist}px`;

    //     console.log(currentNum, moveDist);
    //   } else {
    //     if (currentNum === 0) return;
    //     // 무한 루프
    //     // currentNum = slideLis.length - 1;
    //     // moveDist = -(liWidth * currentNum);
    //     // slider.style.left = `${moveDist}px`;
    //     move(1);
    //     //  코드 줄이기 전
    //     // currentNum--;
    //     // moveDist += liWidth;
    //     // slider.style.left = `${moveDist}px`;
    //     // console.log(currentNum, moveDist);
    //   }
  });
}
