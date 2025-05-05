storage "file" {
  path = "/vault/file"
}
listener "tcp" {
  address = "0.0.0.0:8300"
  tls_disable = true
}
api_addr = "http://0.0.0.0:8300"
disable_mlock = true
