"use strict";

const { KafkaStreams } = require("kafka-streams");
const { nativeConfig: config } = require("../test-config");

const kafkaStreams = new KafkaStreams(config);

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

const stream = kafkaStreams.getKStream(null);
// creating a stream without topic is possible
// no consumer will be created during stream.start()
stream.to("my-output-topic");
// define a topic to stream messages to

// start the stream
// (wait for the kafka producer to be ready)
// and write a few messages to the topic
stream.start().then((_) => {
    stream.writeToStream("my message");
    stream.writeToStream("another message");
    stream.writeToStream(["even more", "messages"]);

    // wait a few ms and close all connections
    setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 5000);
});
