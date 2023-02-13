const env = (name) => {
  const {
    ENVIRONMENT,
    DEV_PORT,
    PROD_PORT,
  } = process.env

  switch (name) {
    case "ENVIRONMENT":
      return ENVIRONMENT
    case "PORT":
      return ENVIRONMENT === "dev" ? DEV_PORT : PROD_PORT
    default:
      throw new Error("Variable de entorno no encontrada")
  }
}

module.exports = env
