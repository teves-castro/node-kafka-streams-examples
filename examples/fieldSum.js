"use strict";

const { KafkaStreams } = require("kafka-streams");
const { nativeConfig: config } = require("../test-config");

const kafkaStreams = new KafkaStreams(config);
const stream = kafkaStreams.getKStream("my-input-topic");

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

stream
    .mapStringToKV(" ", 0, 1) // string to key-value object; args: delimiter, key-index, value-index
    .sumByKey("key", "value", "sum")
    .map((kv) => kv.key + " " + kv.sum)
    .tap((kv) => console.log(kv))
    .to("my-output-topic");

stream.start();

// consume for 5 seconds
setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 5000);
