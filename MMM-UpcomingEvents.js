'use strict';

Module.register('MMM-UpcomingEvents', {
    defaults: {
        googleCalendarURL: '', // Google Calendar iCal URL
        maxEvents: 5, // Maximum number of events to show
        updateInterval: 60000, // Update every 60 seconds
        dateFormat: 'MMMM D, h:mm A', // Moment.js date format
    },

    start: function () {
        this.events = [];
        this.getEvents();
        setInterval(() => {
            this.getEvents();
            this.updateDom();
        }, this.config.updateInterval);
    },

    getStyles: function () {
        return ['MMM-UpcomingEvents.css'];
    },

    getDom: function () {
        let wrapper = document.createElement('div');
        
        if (this.events.length === 0) {
            wrapper.innerHTML = 'No upcoming events';
            return wrapper;
        }

        this.events.forEach(event => {
            let eventDiv = document.createElement('div');
            eventDiv.className = 'event-item';
            
            let title = document.createElement('div');
            title.className = 'event-title';
            title.innerHTML = event.title;
            eventDiv.appendChild(title);
            
            let time = document.createElement('div');
            time.className = 'event-time';
            time.innerHTML = event.date;
            eventDiv.appendChild(time);
            
            wrapper.appendChild(eventDiv);
        });

        return wrapper;
    },

    getEvents: function () {
        if (!this.config.googleCalendarURL) return;

        let self = this;
        let url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.config.googleCalendarURL)}/events?maxResults=${this.config.maxEvents}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}&key=YOUR_GOOGLE_API_KEY`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                self.events = data.items.map(event => ({
                    title: event.summary,
                    date: moment(event.start.dateTime || event.start.date).format(self.config.dateFormat)
                }));
                self.updateDom();
            })
            .catch(error => console.error('MMM-UpcomingEvents: Fetch error', error));
    }
});

/* Installation Guide:

1. Clone the repository into your MagicMirror/modules directory:
   cd ~/MagicMirror/modules
   git clone https://github.com/your-repo/MMM-UpcomingEvents.git

2. Navigate into the module directory:
   cd MMM-UpcomingEvents

3. Install dependencies:
   npm install

4. Configure the module in MagicMirror/config/config.js:

   {
       module: 'MMM-UpcomingEvents',
       position: 'top_right',
       config: {
           googleCalendarURL: 'YOUR_GOOGLE_CALENDAR_ICAL_URL',
           maxEvents: 5,
           updateInterval: 60000,
           dateFormat: 'MMMM D, h:mm A'
       }
   }

5. Restart MagicMirror:
   pm2 restart mm  (or use your preferred restart method)

*/
