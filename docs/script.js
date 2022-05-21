

// ----------------------------------------------------------------------------------------------------
// functions
// ----------------------------------------------------------------------------------------------------

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

// get all combinations for all letters
function getAllLetterCombos(letters) {
	// mapping used to select a representative variant for top/bottom of the letter
	var map = ["A", "B", "C", "D"]
	// possible combinations
	combos = [
		[[0, 0], [0, 0]],
		[[0, 1], [0, 1]],
		[[0, 1], [0, 2]],
		[[0, 1], [2, 3]], // not [0, 1] [1, 2] to avoid confounding variable
		[[0, 0], [1, 1]],
		[[0, 1], [2, 1]],
	]
	shuffle(letters)
	shuffle(combos)
	pairs = []
	letters.forEach(function (letter, index1, array1) {
		combos.forEach(function (combo_pair, index2, array2) {
			shuffle(map)
			pair = [
				letter + "_" + map[combo_pair[0][0]] + map[combo_pair[0][1]],
				letter + "_" + map[combo_pair[1][0]] + map[combo_pair[1][1]]
			]
			pairs.push(pair)
		})
	})
	return pairs
}

// evaluate if the top halfs of two samples are same
function evaluatePair(first_letter, second_letter) {
	return first_letter.slice(0, -1) == second_letter.slice(0, -1)
}

// convert array of values to cummulative values
function cummulative(x) {
	res = 0
	results = []
	x.forEach(function (v, index, array) {
		res += v
		results.push(res)
	})
	return results
}

// get AUC
function getAUC(x, y) {
    // make cummulative
	x = cummulative(x)
	y = cummulative(y)
    // normalize
    // x = [xi/max(x) for xi in x]
    // y = [yi/max(y) for yi in y]
    // auc = 0
    // x1, y1 = 0, 0
    // for x2, y2 in zip(x, y):
    //     auc += (x2 - x1) * (y1 + y2) / 2
    //     x1, y1 = x2, y2
    // return auc
}

// stupid javascript
function sum(x) {
	return x.reduce((a, b) => a + b, 0)
}

// mean
function mean(x) {
	if (x.length > 0) {
		return sum(x) / x.length
	} else {
		return 0
	}
}

// ----------------------------------------------------------------------------------------------------
// set up the trials
// ----------------------------------------------------------------------------------------------------

// samples for trials
practice_samples = shuffle(getAllLetterCombos(["e", "u", "n"]))
main_samples = shuffle(getAllLetterCombos(["a", "e", "h", "j", "n", "u"]))

// times for practice trials
practice_times = []
max_time = 800
min_time = 200
// calculate the step to allow for a nice staircase up and down
step = (max_time - min_time) / (practice_samples.length - 2) * 2
time = max_time
practice_samples.forEach(function (pair, index, array) {
	practice_times.push(Number(time.toFixed(0)))
	// decrease the time for the first half
	// increase the time for the second half
	// do nothing in the middle (assumes the total of practice samples will be even)
	if (index+1 < (array.length / 2)) {
		time -= step
	} else if (index+1 > (array.length / 2)) {
		time += step
	}
})

// sanity check
// console.log("Practice")
// console.log(practice_samples)
// console.log(main_samples)

var counter = 0
var total_trials = practice_samples.length + main_samples.length


// ----------------------------------------------------------------------------------------------------
// compose the forms
// ----------------------------------------------------------------------------------------------------

// settings: URLs and paths
const form_url = "https://getform.io/f/eb496034-9170-4c5f-a86a-703fb9005800"
const maskpath = "samples/SVGs/mask.svg"
const emptypath = "samples/SVGs/empty.svg"

// compose a sequence of trials
function trialsHTML(fieldset, samples, times, title) {
	samples.forEach(function (pair, index, array) {
		sample1 = pair[0]
		sample2 = pair[1]
		// set time
		time = times[index]
		pause_time = 750
		id = title.toLowerCase() + '_' + (index + 1)
		// create containing fieldset
		fieldset.after('<fieldset class="trial" id="fieldset_' + id + '"><h2>' + title + ': do the top halfs of these look identical?</h2></fieldset>')
		fieldset = $("#fieldset_" + id)
		sample1_path = "samples/SVGs/" + sample1 + ".svg"
		sample2_path = "samples/SVGs/" + sample2 + ".svg"

		// console.log(pair)
		// sanity check
		// console.log(pair, time)

		fieldset.append('<div class="trialarea">' +
						'  <div class="sample">' +
						'    <img src="' +  emptypath    + '" class="initial">' +
						'    <img src="' +  sample1_path + '" style="animation: cssAnimation 0s ' + pause_time + 'ms forwards; visibility: hidden;">' +                   // first sample appears `pause_time` after initial
						'    <img src="' +  maskpath     + '" style="animation: cssAnimation 0s ' + (pause_time + time) + 'ms forwards; visibility: hidden;">' +          // mask appears `time` after first sample
						'    <img src="' +  sample2_path + '" style="animation: cssAnimation 0s ' + (2 * pause_time + time) + 'ms forwards; visibility: hidden;">' +      // second sample appears `pause_time` after mask
						'    <img src="' +  emptypath    + '" style="animation: cssAnimation 0s ' + (2 * pause_time + 2 * time) + 'ms forwards; visibility: hidden;">' +  // final empty sample appears `time` after second sample
						'  </div>' +
						'  <div class="buttons">' +
						'    <input type="button" class="next button last" value="Sure same">' +
						'    <input type="button" class="next button last" value="Probably same">' +
						'    <input type="button" class="next button last" value="Probably different">' +
						'    <input type="button" class="next button last right" value="Sure different">' +
						'  </div>' +
						'</div>')
	
		// this record will contain: samples, response, miliseconds
		fieldset.append('<input type="hidden" name="' + id + '" id="' + id + '" value="' + sample1 + ',' + sample2 + '" class="hidden response">')
	
		// progress bar
		fieldset.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(counter / total_trials * 100) + '%"></div></div>')
		counter += 1
	})
}

// set url of the form to submit to
var form = $("form")
form.attr("action", form_url)

// add a series of trials for the practice
fieldset = $("#practice")
trialsHTML(fieldset, practice_samples, practice_times, "Practice")


// ----------------------------------------------------------------------------------------------------
// passing through the fieldsets
// ----------------------------------------------------------------------------------------------------

// passing through the fieldsets
var current_fs, next_fs  // fieldsets
var opacity  // fieldset property which we will animate
var animating  // flag to prevent quick multi-click glitches
var previous_time  // last time when participant clicked any button
var current_time
var practice_in_progress = true
var correct_results = []
function nextSection() {
	if (animating) return false
	form.validate()
	if(!form.valid()) return false
	animating = true

	current_fs = $(this).parent()
	if (current_fs.attr("class") == "buttons") {
		current_fs = current_fs.parent().parent()
	}
	next_fs = current_fs.next()
	current_time = Number(new Date().getTime())

	// record a trial response
	if (current_fs.attr("class") == "trial") {
		miliseconds = current_time - previous_time
		response = current_fs.children(".response").val()
		user_response = $(this).val()
		response += ", " + user_response + ", " + miliseconds
		current_fs.children(".response").val(response)
		if (practice_in_progress) {
			pair = current_fs.children(".response").val().split(",")
			response_id = current_fs.children(".response").attr("id").split("_")[1]  // get just the number
			response_id = Number(response_id) - 1 // make zero-based
			time = practice_times[response_id]
			// see if the response is correct
			same = evaluatePair(pair[0], pair[1])
			if (same) {
				correct_response = "same"
			} else {
				correct_response = "different"
			}
			if (user_response.includes(correct_response)) {
				correct_results.push(time)
			}
		}
	}
	previous_time = current_time

	// draw the main part after the practice has been finished
	if ((next_fs.attr("id") == "main") && (practice_in_progress == true)) {
		// calculate the time based on the mean of the correct responses
		if(correct_results) {
			mean_correct = sum(correct_results) / correct_results.length
		} else {
			mean_correct = max_time
		}
		time = (sum(practice_times) / practice_times.length - min_time) / correct_results.length * 0.75 * practice_times.length + min_time
		// sanity check
		// console.log(correct_results)
		// console.log(sum(practice_times) / practice_times.length, practice_times.length, correct_results.length, time)
		// set the times
		main_times = []
		main_samples.forEach(function (pair, index, array) {
			main_times.push(time)
		})
		// add a series of trials for the main part
		fieldset = $("#main")
		trialsHTML(fieldset, main_samples, main_times, "Main")
		$(".next").click(nextSection)
		practice_in_progress = false
	}
	if (next_fs.attr("id") == "final") {
		// submit when clicking on a button in the penultimate group
		$("form").submit()
	} else {
		//show the next fieldset
		next_fs.show()
		current_fs.hide();
		animating = false;
		return false
	}
}
$(".next").click(nextSection)

// ----------------------------------------------------------------------------------------------------
// form validation
// ----------------------------------------------------------------------------------------------------

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
