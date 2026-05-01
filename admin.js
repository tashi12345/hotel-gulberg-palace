// Admin Logic

function getState() {
    return JSON.parse(localStorage.getItem('hotelPlatformState')) || {};
}

function saveState(state) {
    localStorage.setItem('hotelPlatformState', JSON.stringify(state));
    renderAdmin(); // Re-render locally
}

// Tab Switching
document.querySelectorAll('.sidebar-nav li').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-nav li').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
    });
});

// Populate Forms and Tables
function renderAdmin() {
    const state = getState();
    
    // General Info
    document.getElementById('admin-hotel-name').value = state.hotelInfo.name || '';
    document.getElementById('admin-tagline').value = state.hotelInfo.tagline || '';
    document.getElementById('admin-about').value = state.hotelInfo.about || '';
    document.getElementById('admin-phone').value = state.hotelInfo.phone || '';
    document.getElementById('admin-email').value = state.hotelInfo.email || '';

    // Rooms List
    const roomsList = document.getElementById('admin-rooms-list');
    roomsList.innerHTML = '';
    state.rooms.forEach(room => {
        const isAvail = room.available === 'true' || room.available === true;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${room.image}" alt="room"></td>
            <td><strong>${room.name}</strong></td>
            <td>PKR ${room.price}</td>
            <td><span class="status-badge" style="color: ${isAvail ? 'var(--success)' : '#f64e60'}">${isAvail ? 'Available' : 'Booked'}</span></td>
            <td>
                <button class="action-btn btn-edit" onclick="editRoom(${room.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteRoom(${room.id})">Del</button>
            </td>
        `;
        roomsList.appendChild(tr);
    });

    // Bookings List
    const bookingsList = document.getElementById('admin-bookings-list');
    bookingsList.innerHTML = '';
    state.bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${booking.guestName}</strong></td>
            <td>${booking.dates}</td>
            <td>${booking.roomName}</td>
            <td><span class="status-badge" style="background: #e1f0ff; color: #3699ff;">${booking.status}</span></td>
            <td>
                <button class="action-btn btn-delete" onclick="deleteBooking(${booking.id})">Clear</button>
            </td>
        `;
        bookingsList.appendChild(tr);
    });
}

// General Info Save
document.getElementById('general-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const state = getState();
    state.hotelInfo = {
        name: document.getElementById('admin-hotel-name').value,
        tagline: document.getElementById('admin-tagline').value,
        about: document.getElementById('admin-about').value,
        phone: document.getElementById('admin-phone').value,
        email: document.getElementById('admin-email').value
    };
    saveState(state);
    alert('Hotel Information Updated Live!');
});

// Modal Logic
const modal = document.getElementById('room-modal');
document.getElementById('add-room-btn').addEventListener('click', () => {
    document.getElementById('room-form').reset();
    document.getElementById('room-id').value = '';
    modal.classList.add('active');
});

document.querySelector('.close-btn').addEventListener('click', () => {
    modal.classList.remove('active');
});

// Room Form Save
document.getElementById('room-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const state = getState();
    const idField = document.getElementById('room-id').value;
    
    const roomData = {
        id: idField ? parseInt(idField) : Date.now(),
        name: document.getElementById('room-name').value,
        price: document.getElementById('room-price').value,
        image: document.getElementById('room-image').value,
        features: document.getElementById('room-features').value.split(',').map(f => f.trim()),
        available: document.getElementById('room-available').value === 'true'
    };

    if (idField) {
        // Edit
        const index = state.rooms.findIndex(r => r.id == idField);
        if(index !== -1) state.rooms[index] = roomData;
    } else {
        // Add
        state.rooms.push(roomData);
    }

    saveState(state);
    modal.classList.remove('active');
});

// Global functions for inline onclicks
window.editRoom = function(id) {
    const state = getState();
    const room = state.rooms.find(r => r.id === id);
    if (!room) return;
    
    document.getElementById('room-id').value = room.id;
    document.getElementById('room-name').value = room.name;
    document.getElementById('room-price').value = room.price;
    document.getElementById('room-image').value = room.image;
    document.getElementById('room-features').value = room.features.join(', ');
    document.getElementById('room-available').value = room.available;
    
    modal.classList.add('active');
};

window.deleteRoom = function(id) {
    if(confirm('Are you sure you want to delete this room?')) {
        const state = getState();
        state.rooms = state.rooms.filter(r => r.id !== id);
        saveState(state);
    }
};

window.deleteBooking = function(id) {
    if(confirm('Clear this booking?')) {
        const state = getState();
        state.bookings = state.bookings.filter(b => b.id !== id);
        saveState(state);
    }
};

// Initial Render
renderAdmin();

// Listen for updates from other tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'hotelPlatformState') {
        renderAdmin();
    }
});
