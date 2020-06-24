/// 메가박스 메인 페이지 JS - main.js ///
window.addEventListener("load", function () {
    console.log("load");
    var btn = document.querySelectorAll(".btn")
    var gallBox = document.querySelector(".gallbox")
    var bnProt = 0

    function gallMove(togg) {
        if (bnProt === 1) {
            console.log("wait")
            return 0
        }
        bnProt = 1
        var gallBoxImg = document.querySelectorAll(".gallbox img")
        if (togg === 1) {
            gallBox.appendChild(gallBoxImg[0])
        } else if (togg === 0) {
            gallBox.insertBefore(gallBoxImg[gallBoxImg.length - 1], gallBoxImg[0])
        }
        setTimeout(function () {
            bnProt = 0
        }, 400)
    }

    /* autoSlide */
    var autoInterval;
    var autoMove = function () {
        console.log("auto")
        autoInterval = setInterval(function () {
            gallMove(1);
        }, 2000)
    }
    var autoTimeout
    var stopMove = function () {
        clearInterval(autoInterval)
        clearTimeout(autoTimeout)
        autoTimeout = setTimeout(autoMove, 5000)
    }
    /* autoSlide */
    //autoMove();

    btn[1].onclick = function () {
        //stopMove()
        gallMove(1)
        /*
            var gallBox = document.querySelector(".gallbox")
            gallBox.appendChild(gallBoxImg[0])
        */
    }
    btn[0].onclick = function () {
        //stopMove()
        gallMove(0)
        /*
            var gallBox = document.querySelector(".gallbox")
            gallBox.insertBefore(gallBoxImg[gallBoxImg.length - 1], gallBoxImg[0])
        */
    }
})

$(function () {
    /*jQuery Load*/
    var $gallbox = $('.gallbox'),
        $screen = $('.screen'),
        $btns = $('.btn'),
        $control = $('.control'),
        $playBtn = $('.play'),
        $muteBtn = $('.mute'),
        screen_state = 0

    $gallbox.find('img').click(function () {
        var posterSeq = $(this).index()
        if (posterSeq === 1) $('.left').trigger('click');
        else if (posterSeq === 3) $('.right').trigger('click');
        else if (posterSeq === 0 || posterSeq === 4) return false;

        $gallbox.css({
            top: '80%',
            transform: 'translate(-50%,-50%) scale(.4)',
            transition: '.6s ease-in-out'
        })
        var mv = $(this).data('vc');
        $screen.find('.screen-video').attr('src', "mv/" + mv + ".mp4").fadeIn("300")
        $screen.find('.screen-video').on('canplaythrough', function () {
            $screen.find('.screen-video').get(0).play()
        })
        screen_state = 1
    })

    $btns.click(function () {
        if (screen_state === 0) {
            return false
        }

        if ($(this).hasClass('left')) {
            var mv = $gallbox.find('img').eq(1).data('vc');
            $screen.find('.screen-video').attr('src', "mv/" + mv + ".mp4").fadeIn("300")
            $screen.find('.screen-video').on('canplaythrough', function () {
                $screen.find('.screen-video').get(0).play()
            })
        } else if ($(this).hasClass('right')) {
            var mv = $gallbox.find('img').eq(3).data('vc');
            $screen.find('.screen-video').attr('src', "mv/" + mv + ".mp4").fadeIn("300")
            $screen.find('.screen-video').on('canplaythrough', function () {
                $screen.find('.screen-video').get(0).play()
            })
        }
    })

    $screen.hover(function () {
        $control.stop().fadeIn(200)
    }, function () {
        $control.stop().fadeOut(200)
    })

    $playBtn.find('img').hover(function () {
        var fineSrc = $(this).attr('src').replace('.png', '-1.png')
        $(this).attr('src', fineSrc)
    }, function () {
        var fineSrc = $(this).attr('src').replace('-1.png', '.png')
        $(this).attr('src', fineSrc)
    })

    $playBtn.click(function () {
        var paused_state = $screen.find('.screen-video').get(0).paused
        console.log(paused_state);

        if (paused_state) {
            $screen.find('.screen-video').get(0).play()
            $(this).find('img').attr('src', 'images/vbt1.png')
        } else {
            $screen.find('.screen-video').get(0).pause()
            $(this).find('img').attr('src', 'images/vbt2.png')
        }
    })

    $muteBtn.click(function () {
        var muted_state = $screen.find('.screen-video').get(0).muted
        console.log(muted_state);

        $screen.find('.screen-video').get(0).muted = !muted_state

        if (muted_state) {
            $(this).find('img').attr('src', 'images/speaker_blue.png')
        } else {
            $(this).find('img').attr('src', 'images/speaker-mute_blue.png')
        }
    })

    var $video = $screen.find('.screen-video'),
        TLDrag = false,
        $trackBar = $('.track-bar'),
        $playBar = $('.play-bar')
    $video.on("timeupdate", function () {
        var time_state = $video[0].currentTime,
            time_full = $video[0].duration,
            time_per

        if (!isNaN(time_full)) {
            time_per = time_state / time_full * 100
        }
        /*console.log(time_per);*/

        $trackBar.css({
            width: time_per + '%'
        })

        if (time_per === 100) {
            $playBtn.find('img').attr('src', 'images/vbt2.png')
        }
    })

    var videoTimeLine = function (x) {
        //console.log(x);
        var MaxTime = $video[0].duration,
            percrnt = x / $playBar.width() * 100
        //console.log(percrnt); 

        $trackBar.css({
            width: percrnt + "%"
        })

        $video[0].currentTime = percrnt * MaxTime / 100

        $playBtn.find('img').attr('src', 'images/vbt1.png')
    }

    $playBar.mousedown(function (e) {
        TLDrag = true
        videoTimeLine(e.offsetX)
    }).mouseup(function (e) {
        TLDrag = false
        videoTimeLine(e.offsetX)
    }).mousemove(function (e) {
        if (TLDrag) {
            videoTimeLine(e.offsetX)
        }
    }).mouseleave(function (e) {
        TLDrag = false
    })

    $video.on("timeupdate", function () {

        // 비디오의 기본정보가 모두 로딩되면 전체시간을 찍어준다!
        var cTime = $video[0].currentTime;

        // 소수점 아래 처리(버림)
        cTime = Math.floor(cTime);

        // 시분초변환 함수를 호출하여 변환
        cTime = changeTime(cTime);

        // 화면에 출력!
        $(".current").text(cTime);

    });


    //////// 화면확대 버튼 클릭시 가로폭 키우기 /////
    var expsts = 0; //확대여부(0-확대전,1-확대)
    $(".expand").click(function () {
        // 1. 확대하기
        if (expsts === 0) {
            // 화면변경하기
            $screen.css({
                width: "70%",
                zIndex: 1,
                transition: "all 1s ease-in-out"
            }); /// css /////

            // 버튼모양바꾸기
            $("a", this).text("▦")
                // 버튼 타이틀(툴팁설명) 바꾸기
                .attr("title", "화면축소하기");

            expsts = 1; //상태변경
        } ///// if문 ///////
        // 2. 원상복귀
        else {
            $screen.css({
                width: "32%",
                zIndex: 0
            }); /// css /////

            // 버튼모양바꾸기
            $("a", this).text("▣")
                // 버튼 타이틀(툴팁설명) 바꾸기
                .attr("title", "화면확대하기");


            expsts = 0; //상태변경
        } //// else문 ///////////

    });


    /*
    스크롤바 드래그 설정하여 움직이기
    */
    $("#bar").draggable({
        axis: "x", //x축고정
        containment: "parent" //작동범위부모고정
    });

    // 바를 드래이 이동시 볼륨변경하기 ////
    $("#bar").on("drag", function () {
        // 현재바의 이동값
        var barpos = $(this).position().left;
        //console.log("barpos:" + barpos);

        // 최소값 0, 최대값 54
        // 비를 계산(최대값으로 나눔)
        var val = barpos / 54;
        //console.log("비:"+val);

        // 비디오 볼륨에 적용하기
        // volume 속성에 0~1 사이값을 적용한다!
        $video[0].volume = val;


    });

    var swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
        },
    })
    
    $("#gallery").photobox();
    
    

}); /*jQuery Load*/


function changeTime(sec) { //sec 초단위값
    "use strict";
    var pad = function (x) {
        // 한자리 숫자는 앞에 0을 붙여준다!
        return (x < 10) ? "0" + x : x;
    };
    var res; //결과값
    if (sec < 3600) { // 한시간이 넘지 않으면 분,초만 필요함
        res = pad(parseInt(sec / 60 % 60)) + ":" + pad(sec % 60);
    } else { // 한시간이 넘으면 시,분,초가 모두 필요함
        res = pad(parseInt(sec / (60 * 60))) + ":" + pad(parseInt(sec / 60 % 60)) + ":" + pad(sec % 60);
    }
    return res;
}
