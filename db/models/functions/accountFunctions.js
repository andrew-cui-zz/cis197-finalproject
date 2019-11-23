// check if a user can log in
var checkValidLogin = (req) => {
  // if user exists, then return false
  return !(req.session.user && (req.session.user.length > 0))
}

module.exports = {
  checkValidLogin: checkValidLogin
}