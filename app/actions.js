
// Custom actions to be executed
function tabsAction(tabs) {
    try {
        var url = tabs[0].url;
        if (url.includes('https://mail.pku.edu.cn')
        && !url.includes('/coremail/')) {
            connect("trigger", {"action": "pkumail"});
        }
    } catch (e) {
        console.log('Error Fetching Tabs:', e)
    }

}
