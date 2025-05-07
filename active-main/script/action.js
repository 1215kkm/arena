$(document).ready(function () {









  ///sec3 뒤에 sec4이 오도록 하기
  // var sec3_top = $('.sec3').offset().top; // sec3의 top
  // var sec3_height = $('.sec3').outerHeight(true); // sec3의 전체 높이 (margin 포함)

  // var sec3_bottom = sec3_top + sec3_height; // sec3의 top + height = bottom

  // $('.sec4').css({
  //   'position': 'absolute',
  //   'top': sec3_bottom + 'px'
  // });











  //카드토글
  $('.card').click(function () {
    $(this).toggleClass('is-flipped');
  });









  ///sec4 뒤에 sec5이 오도록 하기
  // function positionSec5() {
  //   var contBoxBottom = $('.sec4 .cont_box').offset().top + $('.sec4 .cont_box').outerHeight();

  //   $('.sec5').css({
  //     'position': 'absolute',
  //     'top': contBoxBottom + 'px',
  //     'left': '0',
  //     'width': '100%'
  //   });
  // }










  // 처음 로딩할 때 위치 잡기
  // positionSec5();

  // 창 크기 바뀔 때마다 다시 위치 잡기
  // $(window).resize(function () {
  //   positionSec5();
  // });










///리뷰 슬라이드
  const $track = $('.review-track');
  const $reviews = $track.children().clone(); // review1~6 복제
  $track.append($reviews); // 복제해서 뒤에 추가








// ///sec5 뒤에 sec6이 오도록 하기
//   function positionSec6() {
//     var sec5Bottom = $('.sec5').offset().top + $('.sec5').outerHeight(true);

//     $('.sec6').css({
//       'position': 'absolute',
//       'top': sec5Bottom + 'px',
//       'left': 0,
//       'width': '100%'
//     });
//   }

//   // 처음 로드할 때 위치 잡기
//   positionSec6();

//   // 창 크기 변할 때마다 다시 위치 잡기
//   $(window).resize(function () {
//     positionSec6();
//   });



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
});




