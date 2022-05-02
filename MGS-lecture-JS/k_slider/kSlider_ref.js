// **기존 구조**

// 1. 로드준비()
// 2. innerName() - 로드를 제외한 모든 프로세스
//   1. 노드준비
//   2. 옵션처리
//   3. 동작준비
//   4. 동작()

// **새로운 구조**

// 1. 로드준비()
// 2. 옵션준비()
// 3. 노드준비()
// 4. 동작준비()
// 5. 동작()

/* 로드 준비 */
function kSlider(name, option) {
  const toBeLoaded = document.querySelectorAll(`${name} img`);

  if (toBeLoaded.length === 0) {
    throw new Error(name + "라는 노드를 찾지 못했습니다.");
  }

  let loadedImages = 0;
  toBeLoaded.forEach((item) => {
    item.onload = () => {
      loadedImages += 1;
      if (loadedImages === toBeLoaded.length) {
        run(name, option);
      }
    };
  });
}

/* 준비시키기 */
function run(name, option) {
  const OPTION = setOption(option);
  setNode(name);
  setSliding(name, OPTION);
}

/* 옵션 준비*/
function setOption(option) {
  // 항목 점검
  let OPTION = {
    // 디폴트 값
    speed: 1000,
    direction: "horizontal",
  };

  for (prop in option) {
    // 옵션 값이 있으면
    if (prop in OPTION) {
      // 값 점검
      exception(prop, option[prop]);
      // 값 셋팅
      OPTION[prop] = option[prop];
    } else {
      throw new Error("사용할 수 없는 옵션입니다.");
    }
  }

  function exception(prop, value) {
    switch (prop) {
      case "speed":
        if (value > 0) break;
      case "direction":
        if (value === "horizontal" || value === "vertical") break;
      default:
        throw new Error("사용할 수 없는 값입니다.");
    }
  }
  return Object.freeze(OPTION); // 수정 못하게 프리즈 시키기!
}

/* 노드 준비 */
function setNode(name) {
  const slider = document.querySelector(name);
  slider.classList.add("k_list");
  const kindWrap = document.createElement("div");
  const kindSliser = document.createElement("div");
  kindWrap.className = "kind_wrap";
  kindSliser.className = "kind_slider";
  slider.parentNode.insertBefore(kindWrap, slider);
  kindWrap.appendChild(kindSliser);
  kindSliser.appendChild(slider);

  const slideItems = slider.children;
  for (let i = 0; i < slideItems.length; i++) {
    slideItems[i].className = "k_item";
  }
  // const moveBtn = kindWrap.querySelector(".arrow");
  const cloneA = slideItems[0].cloneNode(true);
  const cloneC = slideItems[slideItems.length - 1].cloneNode(true);
  // 두 번째 인자 앞에 첫 번째 인자를 넣어라
  slider.insertBefore(cloneC, slideItems[0]);
  slider.appendChild(cloneA);
  // 만들고 나서 다시 한번 li의 갯수를 세야함 => slideCloneItems
  // (이 밑으로 가져오면 슬라이더를 통해 차일드를 만들 수 없기 때문에)

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
}

/* 동작 준비*/
function setSliding(name, OPTION) {
  // 변수 준비
  let moveDist = 0;
  let currentNum = 1;

  // 클론 포함 셋팅
  const slider = document.querySelector(`${name}`); // 추가
  const slideCloneItems = slider.querySelectorAll(".k_item");
  const moveBtn = document.querySelector(".arrow"); // 추가

  // 클론 포함 넓이 셋팅
  const liWidth = slideCloneItems[0].clientWidth;
  const sliderWidth = liWidth * slideCloneItems.length;
  slider.style.width = `${sliderWidth}px`;

  // 처음 위치 잡기
  moveDist = -liWidth;
  slider.style.left = `${moveDist}px`;

  const POS = { moveDist, liWidth, currentNum }; // 키와 value 가 같아서 한번만 쓰기, POS에 담아서, Sliding 함수로 전달 => 다른 곳에선 접근 할 수 없게! 안전성 up!

  // 이벤트 리스너 걸기
  moveBtn.addEventListener("click", (e) => {
    sliding(e, OPTION, name, POS);
  });
}

// 동작
function sliding(e, OPTION, name, POS) {
  e.preventDefault(); // 이벤트 객체의 메서드
  // btn 에 이벤트 버블링을 통해서 e.target으로 컨트롤하기

  const slider = document.querySelector(name);
  const slideCloneItems = slider.querySelectorAll(".k_item");
  //   let { moveDist, liWidth, currentNum } = POS;
  const move = (n) => {
    POS.currentNum += -1 * n;
    POS.moveDist += POS.liWidth * n;
    slider.style.left = `${POS.moveDist}px`;
    slider.style.transition = `${OPTION.speed}ms ease`;
  };

  if (e.target.className === "next") {
    // 다음이 눌렸을 때
    move(-1);
    if (POS.currentNum === slideCloneItems.length - 1) {
      // 마지막이면
      setTimeout(() => {
        slider.style.transition = "none"; // 애니메이션 끄고
        POS.moveDist = -POS.liWidth; // 진짜 A 값으로 만들고
        slider.style.left = `${POS.moveDist}px`; // 진짜 A를 보여줌
        POS.currentNum = 1;
      }, OPTION.speed); // 여기 때문에 0.5 아닌 500 으로 설정해야함
    }
  } else {
    move(1);
    if (POS.currentNum === 0) {
      setTimeout(() => {
        slider.style.transition = "none";
        POS.moveDist = -POS.liWidth * (slideCloneItems.length - 2);
        slider.style.left = `${POS.moveDist}px`;
        POS.currentNum = slideCloneItems.length - 2;
      }, OPTION.speed);
    }
  }
}
