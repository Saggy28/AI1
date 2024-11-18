// Initialize map
const map = L.map('map').setView([53.430127, 14.564802], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);
const marker = L.marker([53.430127, 14.564802]).addTo(map);

// Request notification permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Show location and request permission
document.getElementById("showLocation").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 15);
            marker.setLatLng([lat, lon]);
            marker.bindPopup(`<strong>Twoja lokalizacja</strong><br>Lat: ${lat}, Lon: ${lon}`).openPopup();

            // Display location in an alert
            alert(`Twoja lokalizacja to: Lat: ${lat}, Lon: ${lon}`);
        }, error => {
            alert("Nie można uzyskać dostępu do lokalizacji.");
        });
    } else {
        alert("Geolokalizacja nie jest obsługiwana przez tę przeglądarkę.");
    }
});

// Create puzzle function
document.getElementById("createPuzzle").addEventListener("click", function() {
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error("Error generating image:", err);
            return;
        }

        const pieceSize = 100;
        const piecesContainer = document.getElementById("piecesContainer");
        piecesContainer.innerHTML = "";

        // Generate puzzle pieces
        const pieces = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const pieceCanvas = document.createElement("canvas");
                pieceCanvas.width = pieceSize;
                pieceCanvas.height = pieceSize;
                const context = pieceCanvas.getContext("2d");
                context.drawImage(canvas, col * pieceSize, row * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
                pieceCanvas.classList.add("puzzle-piece");
                pieceCanvas.draggable = true;
                pieceCanvas.id = `piece-${row * 4 + col}`;
                pieceCanvas.dataset.slot = `${row * 4 + col}`;

                pieceCanvas.addEventListener("dragstart", (e) => e.dataTransfer.setData("text", e.target.id));
                pieces.push(pieceCanvas);
            }
        }

        shuffleArray(pieces);
        pieces.forEach(piece => piecesContainer.appendChild(piece));
    });
});

// Check if puzzle is completed
function checkPuzzleCompletion() {
    const slots = document.querySelectorAll(".puzzle-slot");
    let isCompleted = true;
    slots.forEach(slot => {
        const piece = slot.querySelector(".puzzle-piece");
        if (!piece || piece.dataset.slot !== slot.id.split('-')[1]) {
            isCompleted = false;
        }
    });

    if (isCompleted) {
        alert("Ułożyłeś puzzle!");
        if (Notification.permission === "granted") {
            new Notification("Gratulacje!", { body: "Udało ci się ułożyć puzzle!" });
        }
    }
}

// Drag-and-drop functionality
const puzzleSlots = document.querySelectorAll(".puzzle-slot");
puzzleSlots.forEach(slot => {
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", function(event) {
        event.preventDefault();
        const pieceId = event.dataTransfer.getData("text");
        const piece = document.getElementById(pieceId);
        if (piece && this.children.length === 0) {
            this.appendChild(piece);
            checkPuzzleCompletion();
        }
    });
});

// Shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
