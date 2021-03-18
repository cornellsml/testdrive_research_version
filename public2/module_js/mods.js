$(window).on('load', async function(){
  const visibleModules = await $.get('/getVisibleModules');
});
