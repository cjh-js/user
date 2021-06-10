export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteTitle = "zhqkfxm18 Users";
  res.locals.loggedInUser = req.session.user;
  next();
};
