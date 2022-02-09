const bg = document.querySelector('.background-image');
const bd = document.querySelector('body');

const windowWidth = window.innerWidth / 5;
const windowHeight = window.innerHeight / 5 ;

bd.addEventListener('mousemove', e => {
    const mouseX = e.clientX / windowWidth;
    const mouseY = e.clientY / windowHeight;

    bg.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
});

const textClr = document.querySelectorAll('.mode-switch');
const apiLogo = document.querySelector('#api-logo');
const switchPoint = document.querySelector('.darkmode-switch');
const modeSwitch = document.querySelector('.darkmode-switch-frame');
let darkModeEnabled = true

modeSwitch.addEventListener('click', event => {
    if(darkModeEnabled === true) {
        textClr.forEach(element => {
            element.style.color = 'rgb(59, 58, 62)';
            });
        bd.style.backgroundColor = 'rgb(255, 255, 255)';
        apiLogo.src = 'api_logo_grey.png'
        switchPoint.style.left = '48px'
        darkModeEnabled = false;
    } else {
        textClr.forEach(element => {
            element.style.color = 'rgb(255, 255, 255)';
        });
        bd.style.backgroundColor = 'rgb(29, 28, 33)';
        apiLogo.src = 'api_logo_white.png'
        switchPoint.style.left = '3px'
        darkModeEnabled = true;
    }
});