// Default initial state
const defaultState = {
    hotelInfo: {
        name: "Hotel Gulberg Palace",
        tagline: "Experience Unmatched Luxury in the Heart of Lahore",
        about: "Hotel Gulberg Palace is an oasis of luxury located in the vibrant Gulberg district. Our palatial architecture combined with modern amenities ensures an unforgettable stay. Whether you are traveling for business or leisure, we provide the perfect blend of traditional hospitality and contemporary comfort.",
        phone: "+92 42 111 222 333",
        email: "reservations@gulbergpalace.com"
    },
    rooms: [
        {
            id: 1,
            name: "Deluxe Queen Room",
            price: 15000,
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000&auto=format&fit=crop",
            features: ["Free High-Speed WiFi", "Queen Size Bed", "City View"],
            available: true
        },
        {
            id: 2,
            name: "Premium Luxury Suite",
            price: 35000,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
            features: ["King Size Bed", "Living Area", "Panoramic View", "Mini Bar"],
            available: true
        },
        {
            id: 3,
            name: "Royal Palace Suite",
            price: 60000,
            image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
            features: ["Master Bedroom", "Private Jacuzzi", "Butler Service", "Lounge Access"],
            available: false
        }
    ],
    bookings: []
};

// Initialize localStorage if empty
if (!localStorage.getItem('hotelPlatformState')) {
    localStorage.setItem('hotelPlatformState', JSON.stringify(defaultState));
}

// Global functions for main site
function getState() {
    return JSON.parse(localStorage.getItem('hotelPlatformState'));
}

function updateUI() {
    const state = getState();
    const info = state.hotelInfo;

    // Update Text Elements
    document.getElementById('brand-name').innerText = info.name;
    document.getElementById('footer-brand-name').innerText = info.name;
    document.title = `${info.name} | Luxury Redefined`;
    document.getElementById('hero-tagline').innerText = info.tagline;
    document.getElementById('about-text').innerText = info.about;
    document.getElementById('footer-phone').innerText = info.phone;
    document.getElementById('footer-email').innerText = info.email;

    // Update Rooms Grid
    const roomsContainer = document.getElementById('rooms-container');
    const roomSelect = document.getElementById('room-type-select');
    roomsContainer.innerHTML = '';
    roomSelect.innerHTML = '<option value="">Select a Room</option>';

    state.rooms.forEach(room => {
        // Build card
        const card = document.createElement('div');
        card.className = 'room-card';
        
        const statusClass = room.available === 'true' || room.available === true ? 'status-available' : 'status-booked';
        const statusText = room.available === 'true' || room.available === true ? 'Available Now' : 'Currently Booked';

        const featuresHtml = room.features.map(f => `<li>${f.trim()}</li>`).join('');

        card.innerHTML = `
            <div class="room-img">
                <img src="${room.image}" alt="${room.name}">
            </div>
            <div class="room-details">
                <h4>${room.name}</h4>
                <div class="room-price">PKR ${room.price.toLocaleString()} / night</div>
                <ul class="room-features">
                    ${featuresHtml}
                </ul>
            </div>
            <div class="room-status ${statusClass}">${statusText}</div>
        `;
        roomsContainer.appendChild(card);

        // Add to select if available
        if (room.available === 'true' || room.available === true) {
            const opt = document.createElement('option');
            opt.value = room.name;
            opt.innerText = `${room.name} (PKR ${room.price})`;
            roomSelect.appendChild(opt);
        }
    });
}

// Handle Form Submission
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('room-type-select').value;
    
    if(!roomType) {
        alert("Please select an available room.");
        return;
    }

    const state = getState();
    const newBooking = {
        id: Date.now(),
        guestName: "Guest User", // For demo purposes
        dates: `${checkin} to ${checkout}`,
        roomName: roomType,
        status: "Pending"
    };

    state.bookings.unshift(newBooking);
    localStorage.setItem('hotelPlatformState', JSON.stringify(state));
    alert("Booking request submitted! (Check Admin Dashboard)");
    this.reset();
});

// Listen for cross-tab storage changes (Real-time updates)
window.addEventListener('storage', function(e) {
    if (e.key === 'hotelPlatformState') {
        updateUI();
    }
});

// Initial Render
updateUI();
