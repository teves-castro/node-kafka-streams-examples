"use strict";

const { KafkaStreams } = require("kafka-streams");
const { nativeConfig: config } = require("../test-config");

const kafkaStreams = new KafkaStreams(config);

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

const consumeStream = kafkaStreams.getKStream("my-input-topic");

const windowPeriod = 30 * 1000; // 30 seconds
const from = Date.now();
const to = Date.now() + windowPeriod;

// window will collect messages that fall in the period range
// a message with a timestamp larger or equal to "to" will end the window
// and emit all collected messages on the returned stream
// eslint-disable-next-line no-unused-vars
const { stream, abort } = consumeStream.window(from, to);

stream
    .take(10) // take the first 10 messages from within the window and close the stream
    .forEach((windowMessage) => {
        console.log(windowMessage); // do something with the message that was within the window
    })
    .then((_) => {
        // done
        kafkaStreams.closeAll();
    });

// start the stream
consumeStream.start();

// setTimeout(() => { abort(); }, 5000); // -> abort the window collection after 5 seconds
