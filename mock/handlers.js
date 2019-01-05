module.exports = (req, res, next) => {
  if (req.url === '/feature-toggles') {
    return res.status(200).send({ auth: true, onlineUsersCounter: true })
  } else if (req.url === '/user/profile') {
    return res.status(200).send({ name: 'Arawn Park', profilePictureUrl: '/assets/img/profile-picture.png' })
  } else if (req.url === '/user/profile-picture') {
    return res.status(200).send({ name: 'Arawn Park', profilePictureUrl: '/assets/img/profile-picture.png' })
  } else if (req.url === '/stream/online-users-counter') {
    return res.status(200)
  }
  next()
}