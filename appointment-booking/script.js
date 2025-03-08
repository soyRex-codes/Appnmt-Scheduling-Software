document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing FullCalendar...');
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        dateClick: function(info) {
            console.log('Date clicked:', info.dateStr);
            const selectedDate = info.dateStr;
            updateSelectedDateTime(selectedDate);
            fetchTimeSlots(selectedDate);
        },
        validRange: {
            start: '2025-01-01',
            end: '2025-12-31'
        }
    });
    calendar.render();
    console.log('Calendar rendered.');

    const timeZoneSelect = document.createElement('select');
    timeZoneSelect.id = 'timezone-select';
    ['America/Chicago', 'America/New_York', 'America/Los_Angeles'].forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = moment.tz(tz).format('z (UTCZ)');
        if (tz === 'America/Chicago') option.selected = true;
        timeZoneSelect.appendChild(option);
    });
    document.querySelector('.booking-section').prepend(timeZoneSelect);

    timeZoneSelect.addEventListener('change', function() {
        updateSelectedDateTime(document.getElementById('selected-date-time').textContent.split(' - ')[0] || document.getElementById('selected-date-time').textContent);
    });

    function updateSelectedDateTime(dateStr) {
        const tz = timeZoneSelect.value;
        let localTime = dateStr;
        if (dateStr.includes(' - ')) {
            const [date, time] = dateStr.split(' - ');
            localTime = moment.tz(`${date} ${time.replace('am', ' AM').replace('pm', ' PM')}`, 'YYYY-MM-DD h:mma', tz).format('YYYY-MM-DD HH:mm z');
        } else {
            localTime = moment.tz(dateStr, tz).format('YYYY-MM-DD HH:mm z');
        }
        document.getElementById('selected-date-time').textContent = localTime;
        document.getElementById('selected-timezone').textContent = tz;
    }

    function fetchTimeSlots(date) {
        fetch(`http://localhost:3000/api/availability/${date}`)
            .then(response => response.json())
            .then(slots => {
                const timeSlotsDiv = document.getElementById('time-slots');
                timeSlotsDiv.innerHTML = '';
                slots.forEach(slot => {
                    const slotElement = document.createElement('div');
                    slotElement.className = 'time-slot';
                    slotElement.textContent = slot;
                    slotElement.addEventListener('click', function() {
                        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                        this.classList.add('selected');
                        const tz = timeZoneSelect.value;
                        const localTime = moment.tz(`${date} ${slot.replace('am', ' AM').replace('pm', ' PM')}`, 'YYYY-MM-DD h:mma', tz).format('YYYY-MM-DD HH:mm z');
                        document.getElementById('selected-date-time').textContent = localTime;
                        document.getElementById('selected-date').value = date;
                        document.getElementById('selected-time').value = slot;
                        document.getElementById('booking-form').style.display = 'block';
                    });
                    timeSlotsDiv.appendChild(slotElement);
                });
            })
            .catch(error => console.error('Error fetching time slots:', error));
    }

    const bookingForm = document.getElementById('booking-form');
    const hiddenDate = document.createElement('input');
    hiddenDate.type = 'hidden';
    hiddenDate.id = 'selected-date';
    const hiddenTime = document.createElement('input');
    hiddenTime.type = 'hidden';
    hiddenTime.id = 'selected-time';
    bookingForm.appendChild(hiddenDate);
    bookingForm.appendChild(hiddenTime);

    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('selected-date').value;
        const time = document.getElementById('selected-time').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        const tz = document.getElementById('timezone-select').value;

        console.log('Sending booking request:', { date, time, name, email, timezone: tz });

        fetch('http://localhost:3000/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, time, name, email, timezone: tz })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Appointment booked successfully!');
                this.reset();
                this.style.display = 'none';
                fetchTimeSlots(moment.tz(date, tz).format('YYYY-MM-DD'));
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error booking appointment:', error));
    });

    // Delete form handler
    document.getElementById('delete-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('delete-date').value;
        const time = document.getElementById('delete-time').value;
        console.log('Sending delete request from frontend:', { date, time });

        fetch('http://localhost:3000/api/delete-booking', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, time })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Booking deleted successfully!');
                this.reset();
                fetchTimeSlots(date);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error deleting booking:', error));
    });
});