
// Custom actions to be executed
function tabsAction(tabs) {
    var url = tabs[0].url;
    if (url.includes('https://mail.pku.edu.cn')
    && !url.includes('coremail/XT')) {
        connect("trigger", {"action": "pkumail"});
    }
}
