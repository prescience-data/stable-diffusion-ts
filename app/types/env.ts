export interface Env {
  APP_NAME: string
  NODE_ENV: "development" | "test" | "production"
  LOG_LEVEL: "debug" | "info" | "warn" | "error" | "fatal"
  SWINIR_VERSION: string
}
