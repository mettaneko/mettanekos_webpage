// Load saved volume state from localStorage
const savedMuted = localStorage.getItem("videoMuted") === "true";

document.addEventListener("DOMContentLoaded", function() {
    const volumeBtn = document.getElementById("volumeToggle");
    const video = document.getElementById("bgVideo");
    
    if (volumeBtn && video) {
        // Apply saved volume state
        video.muted = savedMuted;
        updateVolumeButton(volumeBtn, video.muted);
        
        volumeBtn.addEventListener("click", function() {
            video.muted = !video.muted;
            // Save volume state to localStorage
            localStorage.setItem("videoMuted", video.muted.toString());
            updateVolumeButton(volumeBtn, video.muted);
        });
    }
});

function updateVolumeButton(button, isMuted) {
    if (isMuted) {
        button.classList.add("is-muted");
    } else {
        button.classList.remove("is-muted");
    }
}