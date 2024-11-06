document.addEventListener("DOMContentLoaded", function () {
    const photo = document.getElementById('photo');
    photo.addEventListener("mouseenter", () => {
        photo.style.width = "100px";
        photo.style.length = "100px";
        photo.style.backgroundColor = "red";
        photo.style.borderRadius = "50%";
        photo.style.top = "100px";
    });
    photo.addEventListener("mouseleave", () =>{
        photo.style.opacity = 1;
    });
});
