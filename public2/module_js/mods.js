{
  async function getGroupData(){
    const groupData = await $.getJSON('/json/groupData.json', function(data) {
      return data;
    });
    return groupData;
  }

  // returns array with ["month","date","year"]
  function parseDateInformation(dateString){
    const dateInfo = dateString.split("/");
    return dateInfo;
  }

  function showModulesInPhase(groupData){
    let currentPhase = "phase1";
    // show the appropriate modules
    let modName = groupData.groups[userGroup][currentPhase];
    $(`a.ui.card[data-modCard=${modName}]`).show();
    for (phaseInfo in groupData.startTimes){
      const dateInfo = parseDateInformation(groupData.startTimes[phaseInfo]);
      const month = dateInfo[0] - 1;
      const day = dateInfo[1];
      const year = dateInfo[2];
      const phaseStart = new Date(year, month, day, 0, 1, 0).getTime();
      const currentTime = new Date().getTime();
      if (currentTime >= phaseStart) {
        currentPhase = phaseInfo;
        // show the appropriate modules
        modName = groupData.groups[userGroup][currentPhase];
        $(`a.ui.card[data-modCard=${modName}]`).show();
      }
    }
  }

  function showModuleCards(cardList){
    for (const modName in cardList) {
      $(`a.ui.card[data-modCard=${cardList[modName]}]`).css("display","block");
    }
  }

  $(window).on("load", async function(){
    const groupData = await getGroupData();
    const currentPhase = showModulesInPhase(groupData);
  })
}
