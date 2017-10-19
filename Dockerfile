FROM rust:1.20-jessie
RUN cargo install diesel_cli --no-default-features --features "postgres"
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ jessie-pgdg main' >> /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update && apt-get install postgresql-client-9.6 python-pip python-dev -y
RUN pip install pyresttest

WORKDIR /usr/app
COPY . .

RUN mkdir -p ./specs/logs
RUN cp -rf ./specs/postgrest/settings.config.sample ./specs/postgrest/settings.config
RUN wget https://github.com/begriffs/postgrest/releases/download/v0.4.3.0/postgrest-v0.4.3.0-ubuntu.tar.xz -O ./specs/postgrest/postgrest-0.4.3.0-linux.tar.xz
RUN cd ./specs/postgrest && tar -xvf postgrest-0.4.3.0-linux.tar.xz
RUN cd ./specs/postgrest && mv postgrest postgrest-0.4.3.0-linux
