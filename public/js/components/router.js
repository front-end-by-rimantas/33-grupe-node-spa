const router = {};

router.routes = {};

router.notFoundRoute = null;

router.formatedURL = (link) => {
    let start = 0;
    let end = link.length;
    if (link[0] === '/') {
        start = 1;
    }
    if (link[end - 1] === '/') {
        end = -1;
    }
    return link.slice(start, end);
}

router.addRoute = (link, handler) => {
    const formatedLink = router.formatedURL(link);
    router.routes[formatedLink] = handler;
}

router.init = () => {
    console.log('inicijuojamas routeris...');
}

export { router }