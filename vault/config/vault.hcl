storage "file" {
  path = "/vault/file"
}
listener "tcp" {
  address = "0.0.0.0:8300"
  tls_disable = true
}
disable_mlock = true
