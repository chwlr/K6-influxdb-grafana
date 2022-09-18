# k6-influxdb-grafana
Perfomance test with K6, InfluxDB, and Grafana stacks

# TO RUN DOCKER
docker-compose up -d influxdb grafana

# TO RUN TEST
docker-compose run --rm k6 run /scripts/login.js 
