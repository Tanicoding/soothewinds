document.addEventListener('DOMContentLoaded', () => {
  const calendarDays = document.getElementById('calendar');
  const monthYear = document.getElementById('monthYear');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');

  const monthFilter = document.getElementById('monthFilter');
  const yearFilter = document.getElementById('yearFilter');

  const modal = document.getElementById('moodModal');
  const closeBtn = document.querySelector('.modal .close');
  const selectedDateH3 = document.getElementById('selectedDate');
  const moodSelect = document.getElementById('moodSelect');
  const notesInput = document.getElementById('moodNotes');
  const saveBtn = document.getElementById('saveMood');

  let currentDate = new Date();
  let selectedFullDate = '';

  // Populate month & year filters
  const months = Array.from({length:12}, (_,i)=>new Date(0,i).toLocaleString('default',{month:'long'}));
  months.forEach((m,i)=> monthFilter.options.add(new Option(m,i)));

  const currentYear = currentDate.getFullYear();
  for(let y=currentYear-10;y<=currentYear+10;y++){
    yearFilter.options.add(new Option(y,y));
  }

  monthFilter.value = currentDate.getMonth();
  yearFilter.value = currentDate.getFullYear();

  function renderCalendar(date){
    calendarDays.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // empty divs for alignment
    for(let i=0;i<firstDay;i++) calendarDays.appendChild(document.createElement('div'));

    for(let d=1; d<=daysInMonth; d++){
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');
      dayDiv.textContent = d;
      calendarDays.appendChild(dayDiv);

      dayDiv.addEventListener('click', () => {
        selectedFullDate = `${year}-${month+1}-${d}`;
        selectedDateH3.textContent = `Date: ${selectedFullDate}`;
        modal.classList.add('show'); // slide-in modal
      });
    }
  }

  prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    monthFilter.value = currentDate.getMonth();
    yearFilter.value = currentDate.getFullYear();
    renderCalendar(currentDate);
  });

  nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    monthFilter.value = currentDate.getMonth();
    yearFilter.value = currentDate.getFullYear();
    renderCalendar(currentDate);
  });

  monthFilter.addEventListener('change', ()=>{
    currentDate.setMonth(monthFilter.value);
    renderCalendar(currentDate);
  });

  yearFilter.addEventListener('change', ()=>{
    currentDate.setFullYear(yearFilter.value);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);

  // Close modal
  closeBtn.onclick = () => modal.classList.remove('show');
  window.onclick = (e) => { if(e.target == modal) modal.classList.remove('show'); }

  // Save Mood
  saveBtn.addEventListener('click', () => {
    const mood = moodSelect.value;
    const notes = notesInput.value;

    if(!mood){
      alert('Select a mood!');
      return;
    }

    alert(`Saved mood for ${selectedFullDate}: ${mood}\nNotes: ${notes}`);
    moodSelect.value = '';
    notesInput.value = '';
    modal.classList.remove('show');
  });
});
