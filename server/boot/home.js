import { defaultProfileImage } from '../../common/utils/constantStrings.json';
import supportedLanguages from '../../common/utils/supported-languages';

const message =
  'Learn to Code and Help Nonprofits';

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/', addDefaultImage, index);
  app.use(
    '/:lang',
    (req, res, next) => {
      // add url language to request for all routers
      req._urlLang = req.params.lang;
      next();
    },
    router
  );

  app.use(router);

  function addDefaultImage(req, res, next) {
    if (!req.user || req.user.picture) {
      return next();
    }
    return req.user.update$({ picture: defaultProfileImage })
      .subscribe(
        () => next(),
        next
      );
  }

  function index(req, res, next) {
    if (!supportedLanguages[req._urlLang]) {
      return next();
    }

    if (req.user) {
      return res.redirect('/challenges/current-challenge');
    }

    return res.render('home', { title: message });
  }
};
