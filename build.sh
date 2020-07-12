tag="${1:?Missing tag}"
docker buildx build --push -t davidsoederberg/avanza-portfolio-tracker:$tag --platform=linux/amd64,linux/arm/v7 .
