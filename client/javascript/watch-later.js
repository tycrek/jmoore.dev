const REGEX = /(.*?)youtu(\.be|be\.com)/g;

$('#new-url-submit').on('click', (e) => {
    let url = $('#new-url').val();
    if (url.match(REGEX)) valid(url);
    else invalid();
});

function valid(url) {
    $('#new-url').val('');
    fetch(`/watch-later/add/${encodeURIComponent(url)}`)
        .then((response) => response.json())
        .then((json) => json.success ? window.location = '/watch-later' : alert(`Failed: ${json.msg}`));
}

function invalid() {
    $('#new-url').val('');
    alert('Invalid YouTube URL!');
}