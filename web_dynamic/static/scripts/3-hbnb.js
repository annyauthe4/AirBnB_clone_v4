$(document).ready(function() {
    let selectedAmenities = {};

    $('.amenities input[type="checkbox"]').on('change', function() {
        let amenityId = $(this).data('id');
        let amenityName = $(this).data('name');

	if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
	    delete selectedAmenities[amenityId];
        }

	$('.amenities h4').text(Object.values(selectedAmenities).join(', ') || '\u00A0');
    });
});


$(document).ready(function () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
	    $('#api_status').removeClass('available');
	}
    });

    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function (places) {
            $('.places').empty(); // Clear previous places
	
	    places.forEach(place => {
                const guestText = place.max_guest === 1 ? "Guest" : "Guests";
                const roomText = place.number_rooms === 1 ? "Bedroom" : "Bedrooms";
                const bathText = place.number_bathrooms === 1 ? "Bathroom" : "Bathrooms";
                const article = `
                    <article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} ${guestText}</div>
                            <div class="number_rooms">${place.number_rooms} ${roomText}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} ${bathText}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
                    </article>
                `;
                $(".places").append(article);
            });
        },
        error: function () {
            console.log("Error fetching places");
        }
    });
});
