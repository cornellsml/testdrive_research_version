let pathArray = window.location.pathname.split('/');
const subdirectory2 = pathArray[2]; // idenifies the current module
let actionArray = new Array(); // this array will be handed to Promise.all

function recordResponse(responseType,timestamp){
  // create new object with desired data to pass to the post request
  let cat = new Object();
  cat.modual = subdirectory2
  // prompt with any new line characters removed
  cat.prompt = $(this).text().replace(/\r?\n|\r/, '');
  cat.questionNumber = $(this).attr('data-questionNumber');
  cat.absoluteTimeContinued = timestamp;
  // adjust variables depending on the response type
  switch(responseType){
    case 'written':
      cat.type = 'written';
      cat.writtenResponse = $(this)
        .closest('.ui.label')
          .siblings('.ui.form')
            .find('textarea')
            .val();
      break;
    case 'checkboxes':
      cat.type = 'checkbox';
      // using bit shifting to record which boxes are checked
      // i.e. [][✓][][][✓][]  => 010010
      // records the base 10 number in DB, decode to binary string later
      let checkboxInputs = 0b0; // does not need to be binary, useful for testing
      let numberOfCheckboxes = 0; // record number of boxes to add any leading zeros when decoding
      $(this).closest('.ui.segment').find('.ui.checkbox input').each(function(){
        numberOfCheckboxes++;
        if ($(this).is(":checked")){
          checkboxInputs = checkboxInputs << 1;
          checkboxInputs++;
        } else {
          checkboxInputs = checkboxInputs << 1;
        }
      });
      cat.numberOfCheckboxes = numberOfCheckboxes;
      cat.checkboxResponse = checkboxInputs;
      break;
    case 'radio':
      cat.type = 'radio';
      let radioSelection = "";
      radioSelection = $(this)
        .closest('.ui.segment')
          .find('.radio.checkbox input:checked')
            .siblings('label')
            .text();
      cat.radioSelection = radioSelection;
      break;
    case 'habits_time_entry':
      cat.type = 'habitsUnique';
      cat.writtenResponse = $(this)
        .closest('.ui.label')
          .siblings('.ui.form')
            .find('input')
            .val();
      cat.checkedActualTime = $('.habitsReflectionCheckTime').is(":visible");
      break;
  }

  const jqxhr = $.post("/reflection", {
    action: cat,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  actionArray.push(jqxhr);
}

async function postNewCompletedBadge(modName){
  const completedTypeBadges = await $.getJSON('/json/testdriveBadges.json');
  const badgeId = `completed_${modName}`;
  const badgeTitle = completedTypeBadges[badgeId].title;
  const badgeImage = completedTypeBadges[badgeId].image;
  await $.post('/postUpdateNewBadge', {
    badgeId: badgeId,
    badgeTitle: badgeTitle,
    badgeImage: badgeImage,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
}

async function updateModuleProgressCompleted() {
  await $.post("/moduleProgress", {
    module: subdirectory2,
    status: 'completed',
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  await postNewCompletedBadge(subdirectory2);
}


function iterateOverPrompts() {
  let timestamp = Date.now();

  // Search for each prompt type.
  // The types are: written, checkboxes, radio**, and habits_time_entry**.
  // **Unusual prompt types that currently only occur once in the project.

  $('.reflectionPrompt').each( function() {
    return recordResponse.call($(this),'written',timestamp);
  });

  $('.reflectionCheckboxesPrompt').each( function() {
    return recordResponse.call($(this),'checkboxes',timestamp)
  });

  $('.reflectionRadioPrompt').each( function() {
    return recordResponse.call($(this),'radio',timestamp)
  });

  $('.reflectionHabitsTimeEntryPrompt').each( function() {
    return recordResponse.call($(this),'habits_time_entry',timestamp)
  });

  // wait to change pages until all post requests in actionArray return,
  // otherwise the post requests might get cancelled during the page change
  Promise.all(actionArray).then(async function() {
    await updateModuleProgressCompleted();
    const surveyParameters = await $.get('/surveyParameters');
    if (surveyParameters) {
      const qualtricsLinks = {
        "cyberbullying": "https://cornell.ca1.qualtrics.com/jfe/form/SV_6gvfzZ9lbnmeMoC",
        "esteem": "https://cornell.ca1.qualtrics.com/jfe/form/SV_cuVId7BzyIbD8km",
        "digital-literacy": "https://cornell.ca1.qualtrics.com/jfe/form/SV_cuMDJCaay8x3lKm",
        "digfoot": "https://cornell.ca1.qualtrics.com/jfe/form/SV_d43He1ilPd4QY7A",
        "phishing": "https://cornell.ca1.qualtrics.com/jfe/form/SV_ekXVMiHv0016UfA",
        "targeted": "https://cornell.ca1.qualtrics.com/jfe/form/SV_bjva9BUaZpLt930"
      };
      const qualtricsUrl = `${qualtricsLinks[subdirectory2]}?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`;
      /* Need to add a "visit" to the end page for various functionalities to work:
        + calculating the time spent on the reflection page
        + calculating the time spent completing the entire module
        Calculating 'time spent' uses the difference between adjacent pageLog entries,
        and now that the Qualtrics link is linked here, the 'end' page is no longer visited.
        Adding an artificial "visit" to that page will fix a multitude of issues.
      */
      await $.post("/pageLog", {
        subdirectory1: "end",
        subdirectory2: pathArray[2],
        artificialVisit: true,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
      window.location.href = qualtricsUrl;
    // surveyParameters will return false if the currently logged in user is not a
    // student.
    } else {
      window.location.href = `/end/${subdirectory2}`;
    }
  });
}

function checkAllPromptsOpened(){
  let status = true;
  $('.reflectionPromptSegment').each(function(){
    if($(this).is(':hidden')){
      status = false;
    }
  });
  return status;
}

function showWarning(warningID){
  if($(warningID).is(':visible')){
    $(warningID).transition('bounce');
  } else {
    $(warningID).transition('fade down');
  }
}

function hideWarning(warningID){
  if($(warningID).is(':visible')){
    $(warningID).transition('fade down');
  }
}

$(window).on("load", function(){
    Voiceovers.addVoiceovers();

    $('.selectablePosts .card').on('click', function(){
      $(this).transition('pulse');
      $(this).toggleClass('selectedCard');
    });

    $('.reflectionSegmentButton').on('click', function(){
      let segmentButton = $(this);
      segmentButton.hide();
      segmentButton.next('.reflectionPromptSegment').transition({
        animation: 'fade down',
        onComplete: function() {
          segmentButton.parents('.reflectionTopSegment')
            .next('.reflectionTopSegment')
            .transition('fade down');
        }
      });
      hideWarning('.startPromptsWarning');
      hideWarning('.openAllPromptsWarning');
      if(checkAllPromptsOpened() === true){
        $('.ui.big.labeled.icon.button').addClass('green');
        $('.ui.big.labeled.icon.button').transition('jiggle');
      }
    });

    $('.results_end').on('click', function () {
      $(".insertPrint").empty();
      if(checkAllPromptsOpened() === true){
        $(this).addClass('disabled loading')
        return iterateOverPrompts();
      } else {
        // slightly different messaging for start vs next buttons
        if($('.voiceover_reflection1').next('.reflectionPromptSegment').is(':hidden')){
          showWarning('.startPromptsWarning');
        } else {
          showWarning('.openAllPromptsWarning');
        }
      }
    });
})
