import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import TagList from "../models/taglist-model.js";
import { BoulderingChat } from "../models/chat-model.js";
import TagRoom from "../models/tagroom-model.js";
import schedule from "node-schedule";

dotenv.config({ path: "./.env" });
const router = express.Router();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(path.join(__dirname, "./http_ca.crt")),
    rejectUnauthorized: true,
  },
});

//schedule tag creation every 6am
const job = schedule.scheduleJob("0 6 * * *", function () {
  searchKeyword();
});

async function searchKeyword() {
  let notTaggedChats = await BoulderingChat.find({ tagSearched: false }).select(
    "content roomId tagSearched roomNumericId -_id "
  );
  await BoulderingChat.updateMany(
    { tagSearched: false },
    { $set: { tagSearched: true } }
  );
  let tagList = await TagList.find({}).select("tag usedCount -_id");

  const chatsByRoom = notTaggedChats.reduce((accumulator, currentValue) => {
    const { roomNumericId, content } = currentValue;
    if (!accumulator[roomNumericId]) {
      accumulator[roomNumericId] = [];
    }
    accumulator[roomNumericId].push(content);
    return accumulator;
  }, {});
  const chatsByRoomGroupContent = Object.entries(chatsByRoom).map(
    ([roomNumericId, contentArray]) => ({
      roomNumericId,
      content: contentArray.join(","),
    })
  );

  const tags = tagList.map((tag) => tag.tag);

  for (let i = 0; i < chatsByRoomGroupContent.length; i++) {
    let chats = chatsByRoomGroupContent[i];
    await addDocumentToIndex(
      client,
      { content: chats.content },
      chats.roomNumericId
    );

    let roomTag = {};
    const clientSearchs = tags;
    for (let i = 0; i < clientSearchs.length; i++) {
      await client.indices.refresh({ index: chats.roomNumericId }); //!!!
      const result = await searchKeyCn(
        client,
        chats.roomNumericId,
        clientSearchs[i]
      );

      const hitsTotalValue = result.hits.total.value;
      if (hitsTotalValue > 0) {
        roomTag[clientSearchs[i]] = hitsTotalValue;
      }
    }

    const roomTagKeys = Object.keys(roomTag);
    const roomTagValues = Object.values(roomTag);

    for (let i = 0; i < roomTagKeys.length; i++) {
      const conditions = {
        roomNumericId: chats.roomNumericId,
        tag: roomTagKeys[i],
      };

      let roomTagPair = await TagRoom.find(conditions);

      if (roomTagPair.length > 0) {
        const update = { $inc: { tagCount: 1 } };
        await TagRoom.findOneAndUpdate(conditions, update, { upsert: true });
      } else {
        const saveTag = new TagRoom({
          roomNumericId: chats.roomNumericId,
          tag: roomTagKeys[i],
          tagCount: roomTagValues[i],
        });
        await saveTag.save();
      }
    }
  }
}

async function getAllDocuments(client, indexName) {
  try {
    // Search for all documents in the specified index
    const body = await client.search({
      index: indexName,
      body: {
        query: {
          match_all: {}, // Match all documents
        },
      },
    });

    // Extract and log the documents
    console.log("All documents:", body.hits.hits);
    return body.hits.hits;
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

export async function searchKeyCn(client, index, searchWord) {
  const response = await client.search({
    index: index,
    _source: [],
    query: {
      match_phrase: {
        content: searchWord,
      },
    },
  });

  return response;
}

export async function createIndex(client, myindex) {
  await client.indices.create({
    index: myindex,
    mappings: {
      properties: {
        roomId: {
          type: "text",
          analyzer: "ik_max_word",
        },
        content: {
          type: "text",
          analyzer: "ik_max_word",
        },
      },
    },
  });
}

export async function addDocumentToIndex(client, documents, myindex) {
  try {
    const result = await client.index({
      index: myindex,
      body: documents,
    });

    console.log(`Document indexed successfully: ${result}`);
    console.log(result);
  } catch (error) {
    console.error("Error indexing document:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function createBulkCn(client, documents, myindex) {
  client.indices.create({
    index: myindex,
    mappings: {
      properties: {
        roomId: {
          type: "text",
          analyzer: "ik_max_word",
        },
        content: {
          type: "text",
          analyzer: "ik_max_word",
        },
      },
    },
  });
  const dataset = documents;
  console.log(dataset, myindex);
  console.log(typeof dataset);

  const operations = dataset.flatMap((doc) => [
    { index: { _index: myindex } },
    doc,
  ]);

  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: myindex });
  console.log(count);
}

export default router;
