// functions
// shuffle an array in place
// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
	// while there remain elements to shuffle
	while (currentIndex != 0) {
		// pick a remaining element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

// get a list of random, unique indexes
function getIndexes(count, total) {
	var i = 0
	var result = []
	while (i < count) {
		x = Math.floor((Math.random() * total) + 1)
		if (result.indexOf(x) == -1) {
			result.push(x)
			i++
		}
	}
	return result
}


// settings
// - URL

// available letters: aehijlnuv
// available combinations: AA, AB, BA, BB
letters = ["a", "e", "h", "j", "n", "u"]
combos = [
	[[1, 1], [1, 1]],
	[[1, 2], [1, 2]],
	[[1, 2], [1, 3]],
	[[1, 2], [3, 4]], // not [1, 2] [2, 3] to avoid confounding variable
	[[1, 1], [2, 2]],
	[[1, 2], [3, 2]],
]
shuffle(combos)
form_url = "https://getform.io/f/eb496034-9170-4c5f-a86a-703fb9005800"
maskpath = "samples/SVGs/mask.svg"
emptypath = "samples/SVGs/empty.svg"

// for each combo, one letter
// needs combos shuffled, so the association with letters is random
practice_samples = []
map = "ABCD"  // used to select a representative variant for top/bottom of the letter
combos.forEach(function (pair, index, array) {
	shuffle(map)
	letter = letters[index % letters.length]  // prevent overflow
	sample_pair = [letter + "_" + map[pair[0][0]] + map[pair[0][1]], letter + "_" + map[pair[1][0]] + map[pair[1][1]]]
	practice_samples.push(sample_pair)
})

// all combos for each letter
main_samples = []
letters.forEach(function (letter, index1, array1) {
	combos.forEach(function (pair, index2, array2) {
		shuffle(map)
		sample_pair = [letter + "_" + map[pair[0][0]] + map[pair[0][1]], letter + "_" + map[pair[1][0]] + map[pair[1][1]]]
		main_samples.push(sample_pair)
	})
})

console.log(map)
console.log(practice_samples)
console.log(main_samples)

var counter = 0
var total_trials = practice_samples.length + main_samples.length

// compile the forms

// set url of the form to submit to
var form = $("form")
form.attr("action", form_url)

// shuffle the samples to mix words and non-words
shuffle(practice_samples)
shuffle(main_samples)

// add a series of trials for the practice
fs = $("#practice")
practice_samples.forEach(function (tuple, index, array) {
	shuffle(tuple)
	sample1 = tuple[0]
	sample2 = tuple[1]
	trialID =  "practice_" + (index + 1)
	// create fieldset for a word
	fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>Practice: do the top halfs of these look identical?</h2></fieldset>')
	fs = $("#fs_" + trialID)
	samplepath1 = "samples/SVGs/" + sample1 + ".svg"
	samplepath2 = "samples/SVGs/" + sample2 + ".svg"
	fs.append('<div class="trialarea">' +
				'<div class="sample">' +
				'  <img src="' +  samplepath1 + '" class="first">' +
				'  <img src="' + maskpath + '" class="second">' +
				'  <img src="' +  samplepath2 + '" class="third">' +
				'  <img src="' +  emptypath + '" class="last last">' +
				'</div>' +
				'<input type="button" class="next button last" value="Sure same">' +
				'<input type="button" class="next button last" value="Probably same">' +
				'<input type="button" class="next button last" value="Probably different">' +
				'<input type="button" class="next button last right" value="Sure different">' +
				'</div>')

	// this record will contain: typeface, sample, response, miliseconds
	fs.append('<input type="hidden" name="' + trialID + '" id="' + trialID + '" value="' + sample1 + ',' + sample2 + '" class="hidden response">')

	// progress bar
	fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(counter / total_trials * 100) + '%"></div></div>')
	counter += 1
})

// add a series of trials for the main part
fs = $("#main")
main_samples.forEach(function (tuple, index, array) {
	shuffle(tuple)
	sample1 = tuple[0]
	sample2 = tuple[1]
	trialID =  "main_" + (index + 1)
	// create fieldset for a word
	fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>Main: do the top halfs of these look identical?</h2></fieldset>')
	fs = $("#fs_" + trialID)
	samplepath1 = "samples/SVGs/" + sample1 + ".svg"
	samplepath2 = "samples/SVGs/" + sample2 + ".svg"
	fs.append('<div class="trialarea">' +
				'<div class="sample">' +
				'  <img src="' +  samplepath1 + '" class="first">' +
				'  <img src="' + maskpath + '" class="second">' +
				'  <img src="' +  samplepath2 + '" class="third">' +
				'  <img src="' +  emptypath + '" class="last last">' +
				'</div>' +
				'<input type="button" class="next button last" value="Sure same">' +
				'<input type="button" class="next button last" value="Probably same">' +
				'<input type="button" class="next button last" value="Probably different">' +
				'<input type="button" class="next button last right" value="Sure different">' +
				'</div>')

	// this record will contain: typeface, sample, response, miliseconds
	fs.append('<input type="hidden" name="' + trialID + '" id="' + trialID + '" value="' + sample1 + ',' + sample2 + '" class="hidden response">')

	// progress bar
	fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(counter / total_trials * 100) + '%"></div></div>')
	counter += 1
})

// passing through the fieldsets
var current_fs, next_fs  // fieldsets
var opacity  // fieldset property which we will animate
var animating  // flag to prevent quick multi-click glitches
var previous_time  // last time when participant clicked any button
var current_time
function nextSection() {
	if (animating) return false
	form.validate()
	if(!form.valid()) return false
	animating = true

	current_fs = $(this).parent()
	if (current_fs.attr("class") == "trialarea") {
		current_fs = current_fs.parent()
	}
	next_fs = current_fs.next()
	current_time = Number(new Date().getTime())

	// record a trial response
	if (current_fs.attr("class") == "trial") {
		miliseconds = current_time - previous_time
		response = current_fs.children(".response").val()
		response += ", " + $(this).val() + ", " + miliseconds
		current_fs.children(".response").val(response)
	}
	previous_time = current_time

	if (next_fs.attr("id") == "final") {
		// submit when clicking on a button in the penultimate group
		$("form").submit()
	} else {
		//show the next fieldset
		next_fs.show()
		//hide the current fieldset with style
		current_fs.animate({
			opacity: 0
			}, {
			step: function(now, mx) {
				opacity = 1 - now;
				current_fs.css("position", "absolute");
				next_fs.css("opacity", opacity);
			},
			duration: 300,
			complete: function() {
				current_fs.hide();
				animating = false;
			},
		})
		return false
	}
}

jQuery.validator.setDefaults({
	errorPlacement: function(error, element) {
		element.before(error)
	}
})

jQuery.extend(jQuery.validator.messages, {
	required: "Please select one of the options.",
	remote: "Please fix this field.",
	email: "Please enter a valid email address.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	number: "Please enter a valid number.",
	digits: "Please enter only digits.",
	creditcard: "Please enter a valid credit card number.",
	equalTo: "Please enter the same value again.",
	accept: "Please enter a value with a valid extension.",
	maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
	minlength: jQuery.validator.format("Please enter at least {0} characters."),
	rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
	range: jQuery.validator.format("Please enter a value between {0} and {1}."),
	max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
	min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
})

$(".next").click(nextSection)

// sliders updates
$('input[type="range"]').change(function () {
	$(this).siblings(".slider_value").text("Value: " + $(this).val())
})
