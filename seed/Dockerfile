FROM mongo

WORKDIR /testData/

COPY /import.sh ./import.sh
COPY /testData/*.json ./

CMD sh import.sh