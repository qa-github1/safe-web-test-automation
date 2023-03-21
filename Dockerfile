FROM cypress/browsers:node16.17.0-chrome106

WORKDIR /

RUN apt update && apt-get install git
