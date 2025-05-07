// action.js에 추가할 JavaScript 코드

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('slider');
  const pagination = document.getElementById('pagination');
  const cards = document.querySelectorAll('.card');
  
  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let currentIndex = 1; // 시작은 2번째 카드(인덱스 1)가 중앙에 오도록
  let animationID = 0;
  let autoSlideInterval;
  
  // 슬라이더 위치 설정
  function setSliderPosition(transition = true) {
    if (transition) {
      slider.style.transition = 'transform 0.3s ease';
    } else {
      slider.style.transition = 'none';
    }
    slider.style.transform = `translateX(${currentTranslate}px)`;
  }
  
  // 초기 슬라이더 위치 설정
  function initSlider() {
    // 카드 너비와 슬라이더 컨테이너 너비 계산
    const cardWidth = cards[0].offsetWidth;
    const containerWidth = slider.parentElement.offsetWidth;
    
    // 중앙으로 첫 번째 카드 위치 조정
    const offset = (containerWidth - cardWidth) / 2;
    currentTranslate = -(cardWidth + 80) * currentIndex + offset;
    prevTranslate = currentTranslate;
    
    setSliderPosition(false);
    updateActiveCard();
    createPaginationDots();
    
    // 자동 슬라이드 재시작
    resetAutoSlide();
  }
  
  // 페이지네이션 도트 생성
  function createPaginationDots() {
    // 기존 점들을 모두 제거
    pagination.innerHTML = '';
    
    // 페이지네이션 컨테이너에 스타일 적용
    pagination.style.display = 'flex';
    pagination.style.justifyContent = 'center';
    pagination.style.gap = '59px'; // 점들 사이 간격을 60px로 설정
    
    for (let i = 0; i < cards.length; i++) {
      // SVG 아이콘을 사용한 페이지네이션 생성
      const dot = document.createElement('div');
      dot.classList.add('dot');
      
      // dot의 배경 등을 제거하여 SVG만 보이게 함
      dot.style.backgroundColor = 'transparent';
      dot.style.border = 'none';
      
      // SVG 색상을 조건부로 설정
      const fillColor = i === currentIndex ? '#D1F800' : '#fff';
      
      // SVG 코드를 문자열로 넣기
      dot.innerHTML = `
        <svg width="48" height="18" viewBox="0 0 48 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28.9399 16.3713C40.732 16.0187 47.8984 12.6529 47.8984 8.55277C47.8984 4.44177 40.6933 1.07228 28.8665 0.734236C28.1471 0.0218081 27.9112 0.025443 27.5515 0.025443L6.00953 0.025442C5.08906 0.025442 3.1205 0.828741 2.75696 1.87921L1.66245 1.87921L1.66245 0.988673C1.66245 0.443448 1.29118 -2.03727e-06 0.830944 -2.05739e-06C0.370712 -2.0775e-06 -0.000568409 0.443448 -0.000568433 0.988673L-0.000569094 16.1096C-0.000569118 16.6548 0.370712 17.0983 0.830943 17.0983C1.29118 17.0983 1.66245 16.6548 1.66245 16.1096L1.66245 15.2627L2.76083 15.2627C3.13597 16.3059 5.0968 17.1055 6.00953 17.1055L27.5515 17.1055C27.8996 17.1055 28.151 17.1455 28.9399 16.3713ZM30.2781 14.8992L30.2781 1.99916C39.1269 1.99916 46.5448 5.44135 46.5448 8.54186C46.5448 11.9841 40.7436 14.6364 30.2781 14.8992ZM0.792266 15.0046L0.792267 2.1809C0.792267 2.04641 0.905277 1.87921 1.04837 1.87921C1.19147 1.87921 1.31051 2.04641 1.31051 2.1809L1.31051 15.0046C1.31051 15.1391 1.19449 15.2481 1.05139 15.2481C0.908294 15.2481 0.792266 15.1391 0.792266 15.0046ZM6.17583 15.5426C5.83936 15.5426 5.56477 15.2845 5.56477 14.9683L5.56477 2.1809C5.56477 1.86467 5.83936 1.63567 6.17583 1.63567L27.1029 1.63568C27.4394 1.63568 27.7139 1.86467 27.7139 2.1809L27.7139 14.9683C27.7139 15.2845 27.4394 15.5426 27.1029 15.5426L6.17583 15.5426Z" fill="${fillColor}"/>
        </svg>
      `;
      
      if (i === currentIndex) {
        dot.classList.add('active');
      }
      
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      
      pagination.appendChild(dot);
    }
  }
  
  // 특정 슬라이드로 이동
  function goToSlide(index, immediate = false) {
    const totalSlides = cards.length;
    
    // 무한 루프를 위한 처리
    if (index < 0) {
      // 처음 카드 이전으로 이동하려 할 때
      currentIndex = totalSlides - 1; // 맨 마지막 카드로 설정
    } else if (index >= totalSlides) {
      // 마지막 카드 이후로 이동하려 할 때
      currentIndex = 0; // 맨 처음 카드로 설정
    } else {
      currentIndex = index;
    }
    
    const cardWidth = cards[0].offsetWidth;
    const containerWidth = slider.parentElement.offsetWidth;
    const offset = (containerWidth - cardWidth) / 2;
    
    currentTranslate = -(cardWidth + 80) * currentIndex + offset;
    prevTranslate = currentTranslate;
    
    setSliderPosition(!immediate);
    updateActiveCard();
    updatePagination();
    
    // 자동 슬라이드 재설정
    resetAutoSlide();
  }
  
  // 활성화된 카드 업데이트
  function updateActiveCard() {
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('card-active');
        card.classList.remove('card-inactive');
      } else {
        card.classList.remove('card-active');
        card.classList.add('card-inactive');
      }
    });
  }
  
  // 페이지네이션 업데이트
  function updatePagination() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      // SVG 경로의 fill 속성 업데이트
      const path = dot.querySelector('path');
      if (path) {
        path.setAttribute('fill', index === currentIndex ? '#D1F800' : '#fff');
      }
      
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // 애니메이션 시작
  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }
  
  // 터치/마우스 위치 가져오기
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  // 드래그 시작 이벤트
  function touchStart(event) {
    isDragging = true;
    startPosition = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    slider.style.transition = 'none';
    
    // 드래그 시작시 자동 슬라이드 일시 중지
    clearInterval(autoSlideInterval);
  }
  
  // 드래그 중 이벤트
  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPosition;
    }
  }
  
  // 드래그 종료 이벤트
  function touchEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    const cardWidth = cards[0].offsetWidth + 80; // 카드 너비 + gap
    const movedBy = currentTranslate - prevTranslate;
    
    // 만약 드래그 거리가 충분히 크다면 다음/이전 카드로 이동
    if (movedBy < -100) {
      goToSlide(currentIndex + 1);
    } else if (movedBy > 100) {
      goToSlide(currentIndex - 1);
    } else {
      // 충분히 이동하지 않았으면 원래 위치로 돌아감
      goToSlide(currentIndex);
    }
    
    // 드래그 종료 후 자동 슬라이드 재시작
    resetAutoSlide();
  }
  
  // 자동 슬라이드 시작
  function startAutoSlide() {
    // 5초마다 다음 슬라이드로 이동
    return setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }
  
  // 자동 슬라이드 재설정
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = startAutoSlide();
  }
  
  // 이벤트 리스너 등록
  function addEventListeners() {
    // 터치 이벤트 (모바일)
    slider.addEventListener('touchstart', touchStart, { passive: true });
    slider.addEventListener('touchmove', touchMove, { passive: true });
    slider.addEventListener('touchend', touchEnd);
    
    // 마우스 이벤트 (데스크탑)
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', () => {
      if (isDragging) {
        touchEnd();
      }
    });
    
    // 화면 크기 변경 이벤트
    window.addEventListener('resize', initSlider);
    
    // 페이지가 백그라운드로 갔을 때 자동 슬라이드 중지, 포커스 돌아왔을 때 재시작
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(autoSlideInterval);
      } else {
        resetAutoSlide();
      }
    });
  }
  
  // 초기화 및 이벤트 리스너 등록
  addEventListeners();
  initSlider();
});













  $(document).ready(function() {
    function startSimpleSlider() {
      var container = $('.review_wrap');
      var slideWidth = $('.s3_rview_slide:first').outerWidth(true);
      var speed = 9500;
      
      function moveSlide() {
        container.animate({left: -slideWidth}, speed, 'linear', function() {
          $('.s3_rview_slide:first', container).appendTo(container);
          container.css('left', 0);
          moveSlide();
        });
      }

      var visibleCount = Math.ceil(container.parent().width() / slideWidth) + 1;
      for (var i = 0; i < visibleCount; i++) {
        $('.s3_rview_slide:eq(' + i + ')', container).clone().appendTo(container);
      }
      moveSlide();
    }
    
    startSimpleSlider();
  });




  // $('.gcard').on('click', function () {
  //   $(this).toggleClass('flipped');
  // });

  $('.gcard').on('click', function () {
    const card = $(this);
    window.requestAnimationFrame(function () {
      card.toggleClass('flipped');
    });
  });

  $(window).on('scroll', function() {
    $('.gcard').each(function() {
      var cardTop = $(this).offset().top;
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();
  
      if (scrollTop + windowHeight > cardTop + 200) {
        $(this).addClass('on');   // 화면에 보이면 on 추가
      } else {
        $(this).removeClass('on'); // 다시 화면 벗어나면 on 제거
      }
    });
  });
  

  
// 지도 & 지점
  $(document).ready(function(){

    var itemsPerPage = 6; // 한 페이지에 6개씩
    var $storeItems = $('.store .store_btn');
    var totalItems = $storeItems.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage);
  
    function showPage(page) {
      $storeItems.hide();
      var start = (page - 1) * itemsPerPage;
      var end = start + itemsPerPage;
      $storeItems.slice(start, end).show();
  
      $('.num_btn').removeClass('on');
      $('.num_btn').eq(page-1).addClass('on');
    }
  
    function resetSearch() {
      $('.no-result').remove(); // "검색 결과 없음" 문구 제거
      $('.search-input').val(''); // 검색창 비우기
      $storeItems.show();
      showPage(1);
      $('.num').show();
    }
  
    showPage(1); // 처음엔 1페이지 보여주기
  
    $('.num_btn a').click(function(e){
      e.preventDefault();
      var page = $(this).parent().index() + 1;
      showPage(page);
    });
  
    // 띄어쓰기 무시하고 검색하기 위해 문자열 정리 함수
    function normalize(str) {
      return str.toLowerCase().replace(/\s+/g, '');
    }
  
    function doSearch() {
      var keyword = normalize($('.search-input').val().trim());
      $('.no-result').remove(); // 기존 no-result 문구 지우기
  
      if (keyword === '') {
        resetSearch();
        return;
      }
  
      $storeItems.hide();
      var matched = $storeItems.filter(function(){
        return normalize($(this).text()).indexOf(keyword) > -1;
      });
  
      if (matched.length > 0) {
        matched.show();
      } else {
        $('.store').append('<li class="no-result" style="margin-top:20px;">검색 결과가 없습니다.</li>');
      }
  
      $('.num').hide(); // 검색할 때 페이지 넘버 숨기기
    }
  
    $('.search-icon a').click(function(e){
      e.preventDefault();
      doSearch();
    });
  
    $('.search-input').keypress(function(e){
      if(e.which == 13) {
        doSearch();
      }
    });
  
    $('.search-input').on('input', function(){
      if($(this).val().trim() === '') {
        resetSearch();
      }
    });
  
  });