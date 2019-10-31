let clock = $('#clock');
let stations = [$('#ordzetc-time'), $('#macewan-time')];
let format = 'h:mm A';
let colon = true;

updateClock();
updateTable();

setInterval(updateClock, 500);
setInterval(updateTable, 30000);

function updateTable() {
	$('td').each(function (_index) {
		let cellTime = moment($(this).text(), format);
		oldBus($(this), cellTime);
		nextBus($(this), cellTime);
	});

	function oldBus(elem, cellTime) {
		if (cellTime.isBefore() || !cellTime.isValid()) elem.removeClass('next-bus').addClass('old-bus');
	}

	function nextBus(elem, cellTime) {
		let column = elem.hasClass('stop-1') ? 1 : elem.hasClass('stop-2') ? 2 : 3;
		let station = column != 3 ? stations[column - 1] : null;
		if (!station) return;

		// Assign the GREEN class
		if (cellTime.isAfter() && $(`.stop-${column}.next-bus`).length == 0) elem.addClass('next-bus');

		// Replace next bus text
		let current = station.text() !== '' ? moment(station.text().split('(')[1].replace(')', ''), format) : null;
		if (!current || (cellTime.isAfter() && elem.hasClass('next-bus'))) {
			station.html(`Departing ${station.attr('name')} <b>${cellTime.fromNow()}</b> <i>(${cellTime.format(format)})</i>`);
		}
	}
}

function updateClock() {
	let now = moment().format(format);
	colon = !colon;
	if (colon) {
		//now = now.replace(':','&nbsp;');
		//TODO: Fix colon spacing
	}
	clock.html(now);
}