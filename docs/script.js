

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
	// combinations of samples we use
	combos = [
		["AA", "AA"],
		["AB", "AB"],
		["AB", "AC"],
		["AA", "BB"],
		["AB", "CB"]
	]
	shuffle(combos)
	pairs = []
	letters.forEach(function (letter, index1, array1) {
		combos.forEach(function (combo_pair, index2, array2) {
			pair = [
				letter + "_" + combo_pair[0],
				letter + "_" + combo_pair[1]
			]
			pairs.push(pair)
		})
	})
	shuffle(pairs)
	return pairs
}

// evaluate if the top halves of two samples are same
function evaluatePair(first_letter, second_letter) {
	return first_letter.slice(0, -1) == second_letter.slice(0, -1)
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

// all available letters: a, b, c, d, e, f, h, i, j, l, n, p, q, r, t, u, y, z and o, v which are not ideal
// samples for trials
practice_samples = getAllLetterCombos(["i", "c", "u"])  // 3 x 6 = 18 trials
shuffle(practice_samples)
main_samples = getAllLetterCombos(["a", "b", "e", "f", "h", "j", "l", "n", "p", "r", "t", "z"])  // 3 x 6 = 18 trials
shuffle(main_samples)

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
const form_url = "https://getform.io/f/8be65ead-4649-400d-90ee-48eeac8df3fb"
const maskpath = "samples/SVGs/mask.svg"
const emptypath = "samples/SVGs/empty.svg"

// compose a sequence of trials
function trialsHTML(fieldset, samples, times, title) {
	samples.forEach(function (pair, index, array) {
		sample1 = pair[0]
		sample2 = pair[1]
		// set time
		time = 0
		sample_time = times[index]
		intro_time = 750
		mask_time = 500
		id = title.toLowerCase() + '_' + (index + 1)
		// create containing fieldset
		fieldset.after('<fieldset class="trial" id="fieldset_' + id + '"><h2>' + title + ': do the top halves of these look identical?</h2></fieldset>')
		fieldset = $("#fieldset_" + id)
		sample1_path = "samples/SVGs/" + sample1 + ".svg"
		sample2_path = "samples/SVGs/" + sample2 + ".svg"

		// console.log(pair)
		// sanity check
		// console.log(pair, time)

		time_ = 0
		trial  = '<div class="trialarea">'
		trial += '  <div class="sample">'
		trial += '    <img src="' +  emptypath    + '" class="initial">'
		if (index == 0) {
			trial += '    <div class="countdown" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">3</div>'
			time += intro_time
			trial += '    <div class="countdown" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">2</div>'
			time += intro_time
			trial += '    <div class="countdown" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">1</div>'
			time += intro_time
			trial += '    <div class="countdown" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;"></div>'
		}
		// first sample appears `intro_time` after initial
		time += intro_time
		trial +='    <img src="' +  sample1_path + '" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">'                         
		// mask appears `time` after first sample
		time += sample_time
		trial +='    <img src="' +  maskpath     + '" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">'               
		// second sample appears `mask_time` after mask
		time += mask_time
		trial +='    <img src="' +  sample2_path + '" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">'    
		// final empty sample appears `time` after second sample
		time += sample_time
		trial +='    <img src="' +  emptypath    + '" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;">'
		trial +='  </div>'
		trial +='  <div class="buttons">'
		trial +='    <span><input type="button" class="next button" value="Sure same" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;"></span>'
		trial +='    <span><input type="button" class="next button" value="Probably same" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;"></span>'
		trial +='    <span><input type="button" class="next button" value="Probably different" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;"></span>'
		trial +='    <span><input type="button" class="next button" value="Sure different" style="animation: animateDissolve 0s ' + time + 'ms forwards; visibility: hidden;"></span>'
		trial +='  </div>'
		trial +='</div>'
		
		fieldset.append(trial)
		// this record will contain: samples, response, miliseconds
		fieldset.append('<input type="hidden" name="' + id + '" id="' + id + '" value="' + sample1 + ',' + sample2 + ',' + evaluatePair(sample1, sample2) + '" class="hidden response">')
	
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
var total_correct = 0
function nextSection() {
	if (animating) return false
	form.validate()
	if(!form.valid()) return false
	animating = true

	current_fs = $(this).parent()
	// deal with nested buttons in trialarea
	if (current_fs.parent().attr("class") == "buttons") {
		current_fs = current_fs.parent().parent().parent()
	}
	next_fs = current_fs.next()
	current_time = Number(new Date().getTime())

	// record a trial response
	if (current_fs.attr("class") == "trial") {
		miliseconds = current_time - previous_time
		response = current_fs.children(".response").val()
		user_response = $(this).val()
		if (practice_in_progress) {
			tuple = current_fs.children(".response").val().split(",")
			response_id = current_fs.children(".response").attr("id").split("_")[1]  // get just the number
			response_id = Number(response_id) - 1 // make zero-based
			time = practice_times[response_id]
			// see if the response is correct
			same = tuple[2]
			if (same) {
				correct_response = "same"
			} else {
				correct_response = "different"
			}
			if (user_response.includes(correct_response)) {
				total_correct += 1
			}
		} else {
			time = main_times[0]
		}
		// update response
		response += ", " + user_response + ", " + time + ", " + miliseconds
		current_fs.children(".response").val(response)
	}
	previous_time = current_time

	// draw the main part after the practice has been finished
	if ((next_fs.attr("id") == "main") && (practice_in_progress == true)) {
		time = 0.7 * (sum(practice_times) / practice_times.length - min_time) * practice_times.length / total_correct + min_time
		// sanity check
		// console.log(sum(practice_times) / practice_times.length, practice_times.length, total_correct, time)
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
