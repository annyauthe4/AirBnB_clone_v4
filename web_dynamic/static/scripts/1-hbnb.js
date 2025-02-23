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
