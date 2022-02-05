const bg = document.querySelector('.background-image');
const bd = document.querySelector('body');

console.log(bg);

const windowWidth = window.innerWidth / 5;
const windowHeight = window.innerHeight / 5 ;

bd.addEventListener('mousemove', e => {
    const mouseX = e.clientX / windowWidth;
    const mouseY = e.clientY / windowHeight;
    console.log(`Mouse x: ${mouseX}`);

    bg.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
});