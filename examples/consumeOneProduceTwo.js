"use strict";

const { KafkaStreams } = require("kafka-streams");
const { nativeConfig: config } = require("../test-config");

const kafkaStreams = new KafkaStreams(config);
const stream = kafkaStreams.getKStream();

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

stream
    .from("input_topic")
    .mapJSONConvenience()
    .concatMap((msg) => {
        return stream.getNewMostFrom([
            Promise.resolve({ taskId: 1, type: 1, value: msg.value }),
            Promise.resolve({ taskId: 1, type: 2, value: "type_2" }),
        ]);
    })
    .awaitPromises()
    .map((message) => {
        return {
            payload: message,
            time: new Date().toISOString(),
            type: message.type,
            id: message.taskId,
        };
    })
    .to("out_topic", 30, "buffer");

stream.start();
