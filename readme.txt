FROM hashicorp/vault:1.14.0
RUN apk add --no-cache wget && \
    wget --no-check-certificate \
        https://dl-cdn.alpinelinux.org/alpine/v3.15/main/x86_64/curl-8.5.0-r0.apk \
        https://dl-cdn.alpinelinux.org/alpine/v3.15/community/x86_64/jq-1.6-r1.apk && \
    apk add --allow-untrusted curl-8.5.0-r0.apk jq-1.6-r1.apk && \
    rm curl-8.5.0-r0.apk jq-1.6-r1.apk
COPY vault-init.sh /vault-init.sh
RUN chmod +x /vault-init.sh
CMD ["/vault-init.sh"]
