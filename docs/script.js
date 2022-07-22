// Function for dynamic background
const bg = document.querySelector('.background-image');
const bd = document.querySelector('body');

const windowWidth = window.innerWidth / 5;
const windowHeight = window.innerHeight / 5;

bd.addEventListener('mousemove', e => {
    const mouseX = e.clientX / windowWidth;
    const mouseY = e.clientY / windowHeight;

    bg.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
});

// Function for switching between dark and light mode
const apiLogo = document.querySelector('#api-logo');
const widgetDisplay = document.querySelector('#widget-pic');
const switchPoint = document.querySelector('.darkmode-switch');
const appFrame = document.querySelector('.app-frame')
const aboutContentFrame = document.querySelector('.about-frame');
const downloadContentFrame = document.querySelector('.download-frame');
let darkModeEnabled = true
let modeClass = "dark-mode"

function switchMode() {
    let textClr = document.querySelectorAll('.mode-switch');
    if (darkModeEnabled === true) {
        textClr.forEach(element => {
            element.classList.replace('dark-mode', 'light-mode');
        });
        bd.style.backgroundColor = 'rgb(255, 255, 255)';
        apiLogo.src = 'docs/api_logo_grey.png';
        widgetDisplay.src = 'docs/widgetLightmode.png';

        appFrame.style.backgroundColor = 'rgb(232, 232, 232)';
        aboutContentFrame.style.backgroundColor = 'rgb(232, 232, 232)';
        downloadContentFrame.style.backgroundColor = 'rgb(232, 232, 232)';


        switchPoint.style.left = '48px'
        darkModeEnabled = false;
        modeClass = "light-mode"
    } else {
        textClr.forEach(element => {
            element.classList.replace('light-mode', 'dark-mode');
        });
        bd.style.backgroundColor = 'rgb(29, 28, 33)';
        apiLogo.src = 'docs/api_logo_white.png'
        widgetDisplay.src = 'docs/widgetDarkmode.png'

        appFrame.style.backgroundColor = 'rgb(59, 58, 62)';
        aboutContentFrame.style.backgroundColor = 'rgb(59, 58, 62)';
        downloadContentFrame.style.backgroundColor = 'rgb(59, 58, 62)';

        switchPoint.style.left = '3px'
        darkModeEnabled = true;
        modeClass = "dark-mode"
    }
}

// Function for switching between site contents
const homeContent = document.querySelector('.Home');
const aboutContent = document.querySelector('.About');
const downloadContent = document.querySelector('.Download');
let lastActiveNavlink = 'Home'

function switchSite(element) {
    let homeNavlink = document.querySelector('#Home');
    let aboutNavlink = document.querySelector('#About');
    let downloadNavlink = document.querySelector('#Download');
    switch (element.id) {
        case 'Home':
            aboutContent.style.visibility = 'hidden';
            if (lastActiveNavlink === "About") {
                aboutNavlink.classList.remove('active');
                aboutNavlink.classList.add('mode-switch')
                aboutNavlink.classList.add(modeClass)
            }

            downloadContent.style.visibility = 'hidden';
            if (lastActiveNavlink === 'Download') {
                downloadNavlink.classList.remove('active');
                downloadNavlink.classList.add('mode-switch');
                downloadNavlink.classList.add(modeClass)
            }

            if (lastActiveNavlink !== "Home") {
                homeContent.style.visibility = 'visible';
                homeNavlink.classList.remove('mode-switch');
                homeNavlink.classList.remove(modeClass);
                homeNavlink.classList.add('active');
            }

            lastActiveNavlink = "Home"

            break
        case 'About':
            homeContent.style.visibility = 'hidden';
            if (lastActiveNavlink === "Home") {
                homeNavlink.classList.remove('active');
                homeNavlink.classList.add('mode-switch');
                homeNavlink.classList.add(modeClass);
            }

            downloadContent.style.visibility = 'hidden';
            if (lastActiveNavlink === 'Download') {
                downloadNavlink.classList.remove('active');
                downloadNavlink.classList.add('mode-switch');
                downloadNavlink.classList.add(modeClass);
            }

            if (lastActiveNavlink !== "About") {
                aboutContent.style.visibility = 'visible';
                aboutNavlink.classList.remove('mode-switch')
                aboutNavlink.classList.remove(modeClass)
                aboutNavlink.classList.add('active');
            }

            lastActiveNavlink = "About"
            break
        case 'Download':
            homeContent.style.visibility = 'hidden';
            if (lastActiveNavlink === "Home") {
                homeNavlink.classList.remove('active');
                homeNavlink.classList.add('mode-switch');
                homeNavlink.classList.add(modeClass);
            }

            aboutContent.style.visibility = 'hidden';
            if (lastActiveNavlink === "About") {
                aboutNavlink.classList.remove('active');
                aboutNavlink.classList.add('mode-switch')
                aboutNavlink.classList.add(modeClass)
            }

            if (lastActiveNavlink !== "Download") {
                downloadContent.style.visibility = 'visible';
                downloadNavlink.classList.remove('mode-switch')
                downloadNavlink.classList.remove(modeClass)
                downloadNavlink.classList.add('active');
            }

            lastActiveNavlink = "Download"
            break
    }
}