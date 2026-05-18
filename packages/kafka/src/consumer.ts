import type { Kafka, Consumer } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer: Consumer = kafka.consumer({ groupId });
    const handlers = new Map<string, (message: any) => Promise<void>>();
    let runTimeout: NodeJS.Timeout | null = null;
    let isRunning = false;

    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected: " + groupId);
    }

    const subscribe = async (topic: string, handler: (message: any) => Promise<void>) => {
        
        try {
            const admin = kafka.admin();
            await admin.connect();
            await admin.createTopics({
                topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
            });
            await admin.disconnect();
        } catch (error) {
           
        }

        handlers.set(topic, handler);

     
        await consumer.subscribe({
            topic: topic,
            fromBeginning: true,
        });

        
        if (runTimeout) {
            clearTimeout(runTimeout);
        }

       
        if (!isRunning) {
            runTimeout = setTimeout(async () => {
                try {
                    isRunning = true;
                    await consumer.run({
                        eachMessage: async ({ topic, partition, message }) => {
                            try {
                                const value = message.value?.toString();
                                if (value) {
                                    const handlerFn = handlers.get(topic);
                                    if (handlerFn) {
                                        await handlerFn(JSON.parse(value));
                                    }
                                }
                            } catch (error) {
                                console.log("Error processing message for topic " + topic, error);
                            }
                        }
                    });
                } catch (runError) {
                    console.error("Failed to start Kafka consumer run loop:", runError);
                    isRunning = false;
                }
            }, 100);
        }
    }

    const disconnect = async () => {
        if (runTimeout) {
            clearTimeout(runTimeout);
        }
        await consumer.disconnect();
    }

    return { connect, subscribe, disconnect };
}