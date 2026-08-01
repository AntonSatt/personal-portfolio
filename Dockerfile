FROM nginx:alpine

ARG VCS_REF=unknown

LABEL org.opencontainers.image.source="https://github.com/AntonSatt/personal-portfolio" \
      org.opencontainers.image.description="Anton Satterkvist's personal portfolio" \
      org.opencontainers.image.revision="${VCS_REF}"

COPY *.html /usr/share/nginx/html/
COPY styles.css script.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
