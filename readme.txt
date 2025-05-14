                                                                                                                                                                  
 > [vault 2/4] RUN apk add --no-cache curl jq:                                                                                                                                 
0.258 fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/main/x86_64/APKINDEX.tar.gz
0.503 140059035794248:error:1416F086:SSL routines:tls_process_server_certificate:certificate verify failed:ssl/statem/statem_clnt.c:1919:
0.506 fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/community/x86_64/APKINDEX.tar.gz
0.506 WARNING: Ignoring https://dl-cdn.alpinelinux.org/alpine/v3.15/main: Permission denied
0.573 140059035794248:error:1416F086:SSL routines:tls_process_server_certificate:certificate verify failed:ssl/statem/statem_clnt.c:1919:
0.576 WARNING: Ignoring https://dl-cdn.alpinelinux.org/alpine/v3.15/community: Permission denied
0.576 ERROR: unable to select packages:
0.577   curl (no such package):
0.577     required by: world[curl]
0.577   jq (no such package):
0.577     required by: world[jq]
------
failed to solve: process "/bin/sh -c apk add --no-cache curl jq" did not complete successfully: exit code: 2