(function(){
// don't do anything for mobile devices
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return;
}
// hoverable class names
let HOVERABLES = ['l2r_highlighted'];
let cur_r = 10;
let ring_r = 20;

let cur_r_min = 5;
let cur_r_max = 15;
let ring_r_max = 20;
let ring_r_min = 0;

let cursr = document.querySelector('.cursor');
let cursring = document.querySelector('.cursor_ring');
let clickring = document.querySelector('.clickring');
let timer = Date.now();


// initialize hoverable listeners
for (let i = 0; i < HOVERABLES.length; i++){
    let hoverable = document.querySelectorAll('.' + HOVERABLES[i]);
    for (let j = 0; j < hoverable.length; j++){
        hoverable[j].addEventListener('mouseover', handle_mouseover);
        hoverable[j].addEventListener('mouseout', handle_mouseout);
    }
}

document.addEventListener('mousemove', function(e){
    cursr.style.left = e.x - cur_r + 'px';
    cursr.style.top = e.y - cur_r + 'px';

    let timedelta = Date.now() - timer;

    // prevent layout thrashing, only update @ approx 60fps
    if (timedelta > 17){
        cursring.style.transform = `translate(${e.x - ring_r}px, ${e.y - ring_r}px)`;
        timer = Date.now();
    }
});
document.addEventListener('mousedown', function(e){
    clickring.style.display = 'flex';
    clickring.style.transform = `translate(${e.x-20}px, ${e.y-20}px) translate(-50%, -50%)`;
    clickring.style.width = 100 + 'px';
    clickring.style.height = 100 + 'px';
    clickring.style.opacity = 1;
    clickring.style.border = '0px solid white'
});

clickring.addEventListener('transitionend', function(e){
    clickring.style.width = 0 + 'px';
    clickring.style.height = 0 + 'px';
    clickring.style.border = '7px solid black'
    clickring.style.opacity = 0;
});

function handle_mouseover(e){
    cursr.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
    
    cursring.style.width = ring_r_min*2 + 'px';
    cursring.style.height = ring_r_min*2 + 'px';
    cursring.style.opacity = 0;
}

function handle_mouseout(e){
    cursr.style.clipPath = 'polygon(50% 25%, 75% 50%, 50% 75%, 25% 50%)';

    cursring.style.width = ring_r_max*2 + 'px';
    cursring.style.height = ring_r_max*2 + 'px';
    cursring.style.opacity = 1;
}

})();
