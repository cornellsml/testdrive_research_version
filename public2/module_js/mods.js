{
  function showModuleCards(cardList){
    for (const modName in cardList) {
      $(`a.ui.card[data-modCard=${cardList[modName]}]`).css("display","block");
    }
  }

  $(window).on("load", function(){
    const groupAssignments = {
      "A": {
        "phase1": ["esteem","targeted"],
        "phase2": ["cyberbullying","phishing"]
      },
      "B": {
        "phase1": ["digital-literacy","digfoot"],
        "phase2": ["esteem"]
      }
    }
    const phase2Start = new Date(2020, 8, 29, 20, 0, 0).getTime();
    const finalPhaseStart = new Date(2020, 8, 29, 20, 23, 0).getTime();
    const cardList1 = groupAssignments[userGroup]["phase1"];
    showModuleCards(cardList1);
    const currentTime = new Date().getTime();
    if(currentTime >= phase2Start){
      const cardList2 = groupAssignments[userGroup]["phase2"];
      showModuleCards(cardList2);
    }
    if(currentTime >= finalPhaseStart){
      showModuleCards(["eval"]);
    }
  })
}
