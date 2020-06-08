ARG node_img
ARG base_img

FROM ${node_img} as nodebuilder
FROM ${base_img} as builder

WORKDIR /app/
RUN GOOS=linux go build -v -o bin/main

FROM frolvlad/alpine-glibc

RUN apk --no-cache add ca-certificates tzdata && update-ca-certificates

COPY --from=nodebuilder /app/dist /dist
COPY --from=builder /app/bin/main /
RUN ls
EXPOSE 9002
STOPSIGNAL SIGTERM
CMD ["./main"]
