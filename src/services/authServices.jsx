const login = ({ user, pass }) => {

  if (user === "admin" && pass === "admin") {

    localStorage.setItem("auth", "true")

    return true

  }

  return false

}

export default { login }