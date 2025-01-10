(function(){

// don't do anything for mobile devices
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return;
}
// hoverable class names
let HOVERABLES = ['l2r_highlighted'];

let cur_r = 10;
let window = document.querySelector('.float_window');
let float_window_iframe = document.querySelector('.float_window_iframe');

// initialize hoverable listeners
for (let i = 0; i < HOVERABLES.length; i++){
    let hoverable = document.querySelectorAll('.' + HOVERABLES[i]);
    for (let j = 0; j < hoverable.length; j++){

        // mouseover event listener
        hoverable[j].addEventListener('mouseover', function handle_mouseover(e){
            window.style.display = 'block';

            // set title content
            let hovertitle = hoverable[j].getAttribute('data-hover-title');
            
            window.style.setProperty('--float-title-content', `"${hovertitle}"`);

            // set iframe src
            let src = hoverable[j].getAttribute('data-iframe-src');
            float_window_iframe.src = src;
            let iframe_dims = hoverable[j].getAttribute('data-xy');
            if (iframe_dims != null){
                resizeIFrameToFitContent(iframe_dims)
            }
            else{
                float_window_iframe.style.width = 100 + '%';
                float_window_iframe.style.height = 100 + 'px';
            }

        });
        hoverable[j].addEventListener('mouseout', function handle_mouseout(e){
            window.style.display = 'none';
        });
    }
}

document.addEventListener('mousemove', function(e){
    window.style.transform = `translate(calc(200px + ${e.x}px), calc(-40% + ${e.y}px))`;
});

function resizeIFrameToFitContent( data ) {
    // this is really dumb but it works
    let tup = data.split(',');
    let x = tup[0];
    let y = tup[1];
    float_window_iframe.style.width = x + 'px';
    float_window_iframe.style.height = y + 'px';
}
})();
