function addCompletedModuleCard(cdn,modName,cardInfo) {
  const htmlToAppend = `
    <div class="ui card inactiveCard">
      <div class="image">
      <div class="ui huge green ribbon label inactiveCardLabel">Completed!</div>
        <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
      </div>
      <div class="content">
        <div class="header">
          ${cardInfo.title}
        </div>
      </div>
    </div>
  `;
  return htmlToAppend;
}

function addActiveModuleCard(cdn,modName,cardInfo) {
  const htmlToAppend = `
    <a class="ui card" href="/intro/${modName}">
      <div class="image">
        <img src=${cdn}/${cardInfo.image}></img>
      </div>
      <div class="content">
        <div class="header">
          ${cardInfo.title}
        </div>
      </div>
    </a>
  `;
  return htmlToAppend;
}

function addUpcomingModuleCard(cdn,modName,cardInfo) {
  const htmlToAppend = `
    <a class="ui card inactiveCard" data-content="Come back again later to start this module." data-position="bottom left">
      <div class="image">
        <div class="ui huge blue ribbon label inactiveCardLabel">Available Soon</div>
        <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
      </div>
      <div class="content">
        <div class="header">
          ${cardInfo.title}
        </div>
      </div>
    </a>
  `;
  return htmlToAppend;
}

function addActiveStartedModuleCard(cdn,modName,cardInfo) {
  let htmlToAppend = "";
  htmlToAppend = `
   <a class="ui card" href="/intro/${modName}">
     <div class="image">
       <img src=${cdn}/${cardInfo.image}></img>
     </div>
     <div class="content">
       <div class="header">
         ${cardInfo.title}
       </div>
     </div>
   </a>
 `;
  return htmlToAppend;
}

function addInactiveStartedModuleCard(cdn,modName,cardInfo) {
  let htmlToAppend = "";
  htmlToAppend = `
    <a class="ui card inactiveCard">
      <div class="image">
        <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
      </div>
      <div class="content">
        <div class="header">
          ${cardInfo.title}
        </div>
      </div>
    </a>
  `;
  return htmlToAppend;
}

function showVisibleModules(visibleModules) {
  const cdn = "https://dhpd030vnpk29.cloudfront.net";
  // Module card dictionary
  const moduleCardDictionary = {
    "esteem": {
      "image": "esteem.png",
      "title": "The Ups and Downs of Social Media"
    },
    "targeted": {
      "image": "targetedads.png",
      "title": "Ads on Social Media"
    },
    "phishing": {
      "image": "phishing.png",
      "title": "Scams and Phishing"
    },
    "cyberbullying": {
      "image": "upstander.png",
      "title": "How to Be an Upstander"
    },
    "digfoot": {
      "image": "digfoot.png",
      "title": "Shaping Your Digital Footprint"
    },
    "digital-literacy": {
      "image": "news.png",
      "title": "News in Social Media"
    }
  };

  let activeModulesHtmlToAppend = "";
  let inactiveModulesHtmlToAppend = "";
  for(const mod of visibleModules) {
    const cardInfo = moduleCardDictionary[mod.name];
    switch(mod.status) {
      case "active": {
        activeModulesHtmlToAppend += addActiveModuleCard(cdn,mod.name,cardInfo)
        break;
      }
      case "completed": {
        inactiveModulesHtmlToAppend += addCompletedModuleCard(cdn,mod.name,cardInfo)
        break;
      }
      case "started": {
        if (mod.clickable) {
          activeModulesHtmlToAppend += addActiveStartedModuleCard(cdn,mod.name,cardInfo)
        } else {
          inactiveModulesHtmlToAppend += addInactiveStartedModuleCard(cdn,mod.name,cardInfo)
        }
        break;
      }
      case "upcoming": {
        activeModulesHtmlToAppend += addUpcomingModuleCard(cdn,mod.name,cardInfo);
        break;
      }
      default: {
        // do not show the module
      }
    }
  }
  $('.activeModules').append(activeModulesHtmlToAppend)
  $('.inactiveModules').append(inactiveModulesHtmlToAppend)
}

$(window).on('load', async function(){
  const visibleModules = await $.get('/getVisibleModules');
  showVisibleModules(visibleModules);
  $('.ui.card').popup();
  // Determine if the "next module" section should be hidden in favor of a
  // "no modules remaining" success message
  const pastModuleCardCount = $('.inactiveModulesSegment .card').length;
  if (pastModuleCardCount === 4) {
    $('.activeModuleSegment').addClass('setDisplayNone');
    $('.noModsRemainingMessage').removeClass('setDisplayNone');
  }
});
