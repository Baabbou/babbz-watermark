FROM alpine:3.20.3

WORKDIR /app

# Init
RUN apk update && \
    apk add --no-cache python3

# Setup application user
RUN addgroup -S application && adduser -D -S application -G application
USER application

# Setup application
COPY --chown=application:application ./src .

# Expose ports
EXPOSE 8080

# Start
ENTRYPOINT ["/bin/sh", "entrypoint.sh"]