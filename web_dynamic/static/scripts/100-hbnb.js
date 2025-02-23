$(document).ready(function () {
    let selectedAmenities = {}; // Store selected amenities
    let selectedStates = {};
    let selectedCities = {};

    // Handle checkbox changes
    $("input[type='checkbox'].amenity").change(function () {
        const amenityId = $(this).attr("data-id");
        const amenityName = $(this).attr("data-name");

        if ($(this).is(":checked")) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }
    });

    $("input[type='checkbox'].state").change(function () {
        const stateId = $(this).attr("data-id");
	const stateName = $(this).attr("data-name");

	if($(this).is(":checked")) {
	    selectedStates[stateId] = stateName;
	} else {
	    delete selectedStates[stateId];
	}
	updateLocationText();
    });

    $("input[type='checkbox'].city").change(function () {
        const cityId = $(this).attr("data-id");
	const cityName = $(this).attr("data-name");

	if($(this).is(":checked")) {
	    selectedCities[cityId] = cityName;
	} else {
	    delete selectedCities[cityId];
	}
	updateLocationText();
    });

    // Update h4 tag inside div.locations
    function updateLocationText() {
        const locations = Object.values(selectedStates).concat(Object.values(selectedCities));
	$(".locations h4").text(locations.join(", ") || "Select filters");
    }
    // Check API status
    $.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
        if (data.status === "OK") {
            $("#api_status").addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });

    // Function to fetch and display places
    function fetchPlaces(states = {}, cities = {}, amenities = {}) {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                states: Object.keys(states),
		cities: Object.keys(cities),
                amenities: Object.keys(amenities)
	    }),
            success: function (places) {
                $(".places").empty(); // Clear previous places

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
    }

    // Fetch places when button is clicked
    $("button").click(function () {
        fetchPlaces(selectedStates, selectedCities, selectedAmenities);
    });

    // Initial fetch with no filters
    fetchPlaces();

});
